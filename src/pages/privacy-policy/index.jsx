import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">FoodBridge</span>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">Back to App</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: October 4, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Privacy Policy Summary</h2>
            <p className="text-muted-foreground">
              We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use FoodBridge.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Organization details and registration information</li>
                  <li>Profile photos and food images</li>
                  <li>Location data for matching and pickup coordination</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Food posting and donation activities</li>
                  <li>Platform usage analytics</li>
                  <li>Communication logs for safety and quality purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Facilitate food donations and connections between donors and recipients</li>
                  <li>Ensure food safety and quality through verification processes</li>
                  <li>Provide customer support and resolve issues</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Send important notifications about your donations and matches</li>
                  <li>Comply with legal requirements and prevent misuse</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground mb-4">We share your information only when necessary:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>With matched donors/recipients to coordinate food transfers</li>
                  <li>With verified volunteers for pickup and delivery coordination</li>
                  <li>With service providers who help us operate the platform</li>
                  <li>When required by law or to protect safety</li>
                </ul>
                <p className="text-primary mt-4 font-medium">We never sell your personal information to third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>End-to-end encryption for sensitive communications</li>
                  <li>Secure servers with regular security audits</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Regular data backups and disaster recovery procedures</li>
                  <li>Compliance with industry-standard security practices</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Privacy Rights</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access and review your personal information</li>
                  <li>Correct or update your data</li>
                  <li>Delete your account and associated data</li>
                  <li>Control your privacy and notification settings</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies and Tracking</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground mb-4">We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Remember your login preferences</li>
                  <li>Analyze platform usage and improve performance</li>
                  <li>Provide personalized food matching recommendations</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
                <p className="text-muted-foreground mt-4">You can control cookie settings through your browser preferences.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Children's Privacy</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground">
                  FoodBridge is intended for use by organizations and adults (18+). We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child, we will delete it immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. International Data Transfers</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground">
                  Your information may be processed and stored in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to This Policy</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of any material changes by email or through the platform. Continued use of FoodBridge after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground mb-4">
                  If you have questions about this privacy policy or want to exercise your privacy rights, contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> privacy@foodbridge.com</p>
                  <p><strong>Address:</strong> 123 Mission Street, San Francisco, CA 94105</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;