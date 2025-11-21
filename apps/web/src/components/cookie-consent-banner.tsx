'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { X, Settings } from 'lucide-react';

export function CookieConsentBanner() {
  const {
    consent,
    showBanner,
    isLoaded,
    updateConsent,
    acceptAll,
    acceptEssential,
  } = useCookieConsent();

  const [showCustomize, setShowCustomize] = useState(false);
  const [tempConsent, setTempConsent] = useState(consent);

  // Update tempConsent when consent changes or banner is shown
  useEffect(() => {
    if (showBanner) {
      setTempConsent(consent);
    }
  }, [showBanner, consent]);

  if (!isLoaded || !showBanner) {
    return null;
  }

  const handleCustomize = () => {
    setTempConsent(consent);
    setShowCustomize(true);
  };

  const handleSaveCustom = () => {
    updateConsent(tempConsent);
    setShowCustomize(false);
  };

  if (showCustomize) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cookie Preferences</CardTitle>
              <CardDescription>
                Choose which cookies you&apos;re comfortable with us using.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCustomize(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Essential Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Required for basic functionality. Cannot be disabled.
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Functional Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Remember your preferences and settings for a better experience.
                  </p>
                </div>
                <Switch
                  checked={tempConsent.functional}
                  onCheckedChange={(checked) =>
                    setTempConsent({ ...tempConsent, functional: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Analytics Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how you use our site to improve performance.
                  </p>
                </div>
                <Switch
                  checked={tempConsent.analytics}
                  onCheckedChange={(checked) =>
                    setTempConsent({ ...tempConsent, analytics: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Marketing Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Used to deliver relevant content and advertisements.
                  </p>
                </div>
                <Switch
                  checked={tempConsent.marketing}
                  onCheckedChange={(checked) =>
                    setTempConsent({ ...tempConsent, marketing: checked })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSaveCustom} className="flex-1">
                Save Preferences
              </Button>
              <Button variant="outline" onClick={acceptAll} className="flex-1">
                Accept All
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Learn more in our{' '}
                <a href="/privacy-policy" className="underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/cookie-policy" className="underline">
                  Cookie Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t shadow-lg">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">We value your privacy</h3>
            <p className="text-xs text-muted-foreground">
              We use cookies to enhance your experience, analyze site traffic, and provide personalized content.
              By continuing to browse, you consent to our use of cookies.{' '}
              <a href="/cookie-policy" className="underline">
                Learn more
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomize}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Customize
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssential}
              className="text-xs"
            >
              Essential Only
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="text-xs"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
