import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for AI Playground - Learn about how we use cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/">← Back to Home</Link>
          </Button>

          <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device when you visit our website.
                They help us provide you with a better experience by remembering your preferences
                and enabling essential functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Essential Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are necessary for the website to function properly:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Authentication:</strong> Keep you logged in to your account</li>
                  <li>• <strong>Security:</strong> Protect against cross-site request forgery</li>
                  <li>• <strong>Session Management:</strong> Maintain your session state</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Functional Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies enhance your experience:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Theme Preference:</strong> Remember your light/dark mode choice</li>
                  <li>• <strong>API Keys:</strong> Securely store your encrypted API keys locally</li>
                  <li>• <strong>User Preferences:</strong> Remember your model selections and settings</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Analytics Cookies (Optional)</h3>
                <p className="text-muted-foreground mb-2">
                  With your consent, we use analytics cookies to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Understand how visitors use our site</li>
                  <li>• Improve our platform based on usage patterns</li>
                  <li>• Monitor performance and identify issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may use third-party services that set their own cookies:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Vercel Analytics:</strong> For website performance monitoring</li>
                <li>• <strong>Authentication Provider:</strong> For secure user authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                You have several options to manage cookies:
              </p>

              <div>
                <h3 className="font-semibold mb-2">Browser Settings</h3>
                <p className="text-muted-foreground">
                  Most browsers allow you to control cookies through their settings. You can usually
                  find these options in the "Settings" or "Preferences" menu.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookie Banner</h3>
                <p className="text-muted-foreground">
                  You can manage your cookie preferences using our cookie banner. Click "Your Privacy Choices"
                  in the footer to update your preferences at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Different cookies have different retention periods:
              </p>
              <ul className="space-y-2 text-muted-foreground mt-4">
                <li>• <strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li>• <strong>Persistent Cookies:</strong> Stored for up to 1 year or until you delete them</li>
                <li>• <strong>Authentication Cookies:</strong> Expire when you log out or after 30 days</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies, please contact us at{' '}
                <a href="mailto:privacy@ai-playground.dev" className="text-primary underline">
                  privacy@ai-playground.dev
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
