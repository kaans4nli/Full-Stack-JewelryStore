import React from 'react';
import { Button } from '../../common/Button/Button';
import './HeroSection.css';

/**
 * HeroSection Component
 * Ana sayfanın üst kısmında tam ekran hero bölümü
 * 
 * @param {string} title - Ana başlık
 * @param {string} subtitle - Alt başlık
 * @param {string} description - Açıklama metni
 * @param {string} backgroundImage - Arka plan görseli URL
 * @param {string} ctaText - Ana CTA buton metni
 * @param {string} ctaLink - Ana CTA buton linki
 * @param {string} secondaryCtaText - İkincil CTA buton metni
 * @param {string} secondaryCtaLink - İkincil CTA buton linki
 * @param {string} overlay - Overlay tipi: 'dark' | 'light' | 'gradient'
 */
export const HeroSection = ({
  title = "Zamansız Zarafet",
  subtitle = "Koleksiyonumuz",
  description = "Her anınıza değer katan, özenle seçilmiş takı koleksiyonumuzu keşfedin.",
  backgroundImage = "/images/hero-background.jpg",
  ctaText = "Koleksiyonu Keşfet",
  ctaLink = "/products",
  secondaryCtaText = "Yeni Gelenler",
  secondaryCtaLink = "/products?filter=new",
  overlay = "gradient",
  height = "full" // 'full' | 'large' | 'medium'
}) => {
  const overlayClass = `hero-overlay hero-overlay-${overlay}`;
  const heightClass = `hero-${height}`;

  return (
    <section className={`hero-section ${heightClass}`}>
      {/* Background Image */}
      <div 
        className="hero-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="img"
        aria-label="Hero background"
      />

      {/* Overlay */}
      <div className={overlayClass} />

      {/* Content */}
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            {subtitle && (
              <span className="hero-subtitle animate-fadeInUp">
                {subtitle}
              </span>
            )}
            
            <h1 className="hero-title animate-fadeInUp">
              {title}
            </h1>
            
            {description && (
              <p className="hero-description animate-fadeInUp">
                {description}
              </p>
            )}
            
            <div className="hero-cta animate-fadeInUp">
              {ctaText && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.href = ctaLink}
                >
                  {ctaText}
                </Button>
              )}
              
              {secondaryCtaText && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = secondaryCtaLink}
                >
                  {secondaryCtaText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <div className="scroll-icon">
          <div className="scroll-wheel"></div>
        </div>
        <span className="scroll-text">Aşağı Kaydır</span>
      </div>
    </section>
  );
};

export default HeroSection;
