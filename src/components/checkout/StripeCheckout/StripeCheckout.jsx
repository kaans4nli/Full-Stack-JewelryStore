import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import './StripeCheckout.css';

// Stripe'ı yükle (publishable key'inizi buraya koyun)
const stripePromise = loadStripe('pk_test_51SboFVQ59brFpmIrLoPRkyMWzGM7uNVlvcZhDQ6o9719OCeURACwJKEMdCspvgxGDfcdFgGbb5D5pOdQN4AA7EPD00DvcT5nvX');

/**
 * CheckoutForm Component
 * Stripe ile ödeme formu
 */
const CheckoutForm = ({ orderTotal, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Backend'den PaymentIntent oluştur
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderTotal * 100, // Stripe kuruş cinsinden bekler
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError);
      }

      // 2. Ödemeyi tamamla
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // 3. Başarılı ödeme
      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1a1a1a',
        fontFamily: 'Inter, sans-serif',
        '::placeholder': {
          color: '#999999',
        },
        iconColor: '#d4af37',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <div className="form-section">
        <h3 className="form-section-title">Kart Bilgileri</h3>
        
        <div className="card-element-container">
          <CardElement
            options={cardElementOptions}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>

        {error && (
          <div className="payment-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Security Badges */}
      <div className="security-badges">
        <div className="security-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>256-bit SSL Şifreleme</span>
        </div>
        <div className="security-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          <span>PCI DSS Uyumlu</span>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg payment-submit-btn"
        disabled={!stripe || loading || !cardComplete}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            <span>İşleniyor...</span>
          </>
        ) : (
          <>
            <span>₺{orderTotal.toLocaleString('tr-TR')} Öde</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>

      <p className="payment-disclaimer">
        Ödemeniz güvenli bir şekilde işlenir. Kart bilgileriniz saklanmaz.
      </p>
    </form>
  );
};

/**
 * StripeCheckout Component
 * Ana checkout wrapper komponenti
 */
export const StripeCheckout = ({
  orderTotal,
  onSuccess,
  onError,
  orderSummary
}) => {
  return (
    <div className="stripe-checkout-container">
      {/* Order Summary */}
      <div className="checkout-summary">
        <h2 className="checkout-title">Sipariş Özeti</h2>
        
        {orderSummary?.items && (
          <div className="summary-items">
            {orderSummary.items.map((item) => (
              <div key={item.id} className="summary-item">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="summary-item-image"
                />
                <div className="summary-item-details">
                  <h4>{item.name}</h4>
                  <p>Adet: {item.quantity}</p>
                </div>
                <div className="summary-item-price">
                  ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="summary-totals">
          <div className="summary-row">
            <span>Ara Toplam</span>
            <span>₺{orderSummary?.subtotal?.toLocaleString('tr-TR')}</span>
          </div>
          
          {orderSummary?.discount > 0 && (
            <div className="summary-row discount">
              <span>İndirim</span>
              <span>-₺{orderSummary.discount.toLocaleString('tr-TR')}</span>
            </div>
          )}
          
          <div className="summary-row">
            <span>Kargo</span>
            <span>
              {orderSummary?.shipping === 0 
                ? 'Ücretsiz' 
                : `₺${orderSummary?.shipping?.toLocaleString('tr-TR')}`
              }
            </span>
          </div>
          
          <div className="summary-row total">
            <span>Toplam</span>
            <span>₺{orderTotal.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="checkout-payment">
        <h2 className="checkout-title">Ödeme Bilgileri</h2>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm
            orderTotal={orderTotal}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default StripeCheckout;
