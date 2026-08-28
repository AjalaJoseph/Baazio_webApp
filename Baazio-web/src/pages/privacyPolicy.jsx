import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  // Ensure the user starts at the top of the policy page when they navigate here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background font-inter text-on-surface py-16 px-4 md:px-8 animate-fade-in-up">
      <div className="w-full max-w-212.5 mx-auto bg-surface-lowest border border-outline-variant p-6 md:p-12 rounded-md shadow-md text-left">
        
        {/* Back Navigation Anchor */}
        <Link 
          to="/" 
          className="text-sm font-semibold text-primary hover:text-secondary transition-colors mb-8 inline-flex items-center gap-2 cursor-pointer select-none"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Marketing Site</span>
        </Link>
        
        {/* Document Header Panel */}
        <div className="border-b border-outline-variant pb-6 mb-8">
          <h1 className="text-headline-md  font-sans tracking-tight text-on-surface mb-2">
            Privacy Policy
          </h1>
          <p className="text-body-md text-on-surface-variant font-medium">
            Last Updated: August 28, 2026
          </p>
        </div>

        {/* Policy Body Layout Matrix */}
        <div className="flex flex-col gap-8 text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Welcome to <span className="font-bold text-primary">BaaZio</span> . We are committed to protecting the privacy and security of your business and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you deploy our cloud-based retail management terminals and use our services.
          </p>

          {/* Section 1 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              1. Information We Collect
            </h2>
            <p className="text-body-md">
              To provide a secure, operational transactional ecosystem, we collect data across the following distinct profiles:
            </p>
            
            <div className="pl-4 border-l-2 border-primary/30 flex flex-col gap-4 mt-2">
              <div>
                <h3 className="font-semibold text-on-surface text-sm uppercase tracking-wider mb-1">A. Account Registration</h3>
                <p className="text-sm">We collect only the essential credentials required to establish and secure your business workspace profile: Owner Full Name, Business Name, Email Address, and Password (securely encrypted and hashed on our servers using modern cryptographic standards). No additional business verification documents are required to initialize your workspace profile.</p>
              </div>
              <div>
                <h3 className="font-semibold text-on-surface text-sm uppercase tracking-wider mb-1">B. Staff and Terminal Operational Metadata</h3>
                <p className="text-sm">As an administrator, you can add team profiles to your central administrative anchor parameters. We collect the Full Name and Email Address for each registered staff member, along with system access roles (e.g., <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">"ADMIN"</code>, <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">"STAFF"</code>) linked to your workspace identifier.</p>
              </div>
              <div>
                <h3 className="font-semibold text-on-surface text-sm uppercase tracking-wider mb-1">C. Financial and Payment Records</h3>
                <p className="text-sm">We collect transaction metadata including gross sales totals, cash vs. card distribution metrics, checkout duration logs, and unique order reference IDs. We use <span className="font-semibold text-on-surface">Paystack</span> as our third-party billing gateway. We do not store raw credit/debit card numbers directly on our servers; your transaction data is processed via secure tokenized switches governed by Paystack’s PCI-DSS compliant infrastructure.</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              2. Technical Data Tracking & Third-Party Integrations
            </h2>
            <p>
              To maintain the runtime stability and performance of our live systems, we securely transmit specific operational telemetry metrics to our specialized monitoring and utility partners:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
              <li><span className="font-semibold text-on-surface">Telemetry Log Processing (Grafana Cloud & Prometheus):</span> Our live Render infrastructure automatically pushes technical backend performance statistics (such as request latency metrics and transactional HTTP status codes) to Grafana Cloud. This telemetry layer captures anonymous browser user-agent profiles and truncated IP addresses for network routing and performance optimization only.</li>
              <li><span className="font-semibold text-on-surface">Transactional Email Communication (Brevo):</span> Account onboarding, registration confirmation dispatches, and account alerts are managed via Brevo. We synchronize verified sender domain mappings to prevent communication interception or phishing anomalies.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              3. Cookies and Persistent Storage Framework
            </h2>
            <p>
              Our application relies strictly on secure data storage mechanisms to maintain session integrity across devices. We issue an encrypted <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono text-primary font-semibold">refreshToken</code> cookie stored in your local browser environment.
            </p>
            <p>
              In production environments (<code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">https://vercel.app</code>), this validation cookie is configured with <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">httpOnly: true</code>, <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">secure: true</code>, and <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">sameSite: "none"</code> protections. This isolates token verification flags from browser JavaScript engines, preventing malicious cross-site scripting (XSS) and token hijacking attempts.
            </p>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              4. Data Sharing and Protection Framework
            </h2>
            <p>
              We do not sell, rent, or trade your business data to advertising networks or external data aggregators. Your information is only shared under the following conditions:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
              <li>To enforce operational integrity by sharing telemetry data packets directly with cloud hosts (Render) and diagnostic systems (Grafana) to troubleshoot payment failures or system slowness.</li>
              <li>To comply with legal and regulatory directives if required by active law enforcement or national financial regulatory bodies.</li>
              <li>All internal endpoints are protected behind global network firewall filters, robust token rotation service blocks (Redis atomic state scripts), and encryption engines.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              5. Your Rights and Data Control Choices
            </h2>
            <p>
              As a registered business merchant, you retain complete authority over your store database parameters:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
              <li><span className="font-semibold text-on-surface">Staff Management:</span> Administrators can instantly revoke access or delete staff profiles from their dashboard terminal space at any time.</li>
              <li><span className="font-semibold text-on-surface">Data Rectification:</span> You can update your business name, account owner details, and system parameters directly inside your configuration settings hub.</li>
              <li><span className="font-semibold text-on-surface">Account Termination:</span> You can request the permanent destruction of your workspace database tenancy from our cloud cluster at any time by contacting our system administrator queue.</li>
            </ul>
          </div>

          {/* Section 6 */}
         
          <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              6. Contact and Administration Support
            </h2>
            <p>
              If you have any questions, compliance queries, or security issue feedback regarding this privacy policy or our server environment data handling practices, reach out to our team at:
            </p>
            <div className="bg-surface-low p-4 rounded-md border border-outline-variant text-sm flex flex-col gap-1.5">
              <p><span className="font-semibold text-on-surface">Support Queue Contact Email:</span> <a href="mailto:ajalaoluwafikayomi27@gmail.com" className="text-primary hover:underline">ajalaoluwafikayomi27@gmail.com</a></p>
              <p><span className="font-semibold text-on-surface">Administrative Routing Base:</span> BaaZio Enterprise Cloud Systems</p>
            </div>
          </div>

        </div> 
      </div> 
    </div> 
   
    
  );
}
