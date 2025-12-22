import { useSearchParams } from "react-router-dom";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold">Ödeme Başarılı!</h1>
      <p className="mt-2">Sipariş #{orderId} hazırlanıyor 🧡</p>
    </div>
  );
}
