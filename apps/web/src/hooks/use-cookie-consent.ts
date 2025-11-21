'use client';

import { useState, useEffect } from 'react';

export interface CookieConsent {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const COOKIE_CONSENT_KEY = 'ai-playground-cookie-consent';

const defaultConsent: CookieConsent = {
  essential: true, // Always true - required for functionality
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load consent from localStorage
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsedConsent = JSON.parse(stored);
        setConsent(parsedConsent);
        setShowBanner(false);
      } catch (error) {
        console.error('Failed to parse cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
    setIsLoaded(true);
  }, []);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent: CookieConsent = {
      ...consent,
      ...newConsent,
      essential: true, // Always keep essential cookies enabled
      timestamp: Date.now(),
    };

    setConsent(updatedConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updatedConsent));
    setShowBanner(false);
  };

  const acceptAll = () => {
    updateConsent({
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptEssential = () => {
    updateConsent({
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const openConsentBanner = () => {
    setShowBanner(true);
  };

  const hasConsent = (type: keyof CookieConsent) => {
    return consent[type] === true;
  };

  return {
    consent,
    showBanner,
    isLoaded,
    updateConsent,
    acceptAll,
    acceptEssential,
    openConsentBanner,
    hasConsent,
  };
}
