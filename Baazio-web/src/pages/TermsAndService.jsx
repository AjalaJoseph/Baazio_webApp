import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function TermsOfService() {
  // Enforce scrolling straight to the top header on viewport navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background font-inter text-on-surface py-16 px-4 md:px-8 animate-fade-in-up">
      <div className="w-full max-w-212.5 mx-auto bg-surface-lowest border border-outline-variant p-6 md:p-12 rounded-md shadow-md text-left">
        
        {/* Back Navigation Action Anchor */}
        <Link 
          to="/" 
          className="text-sm font-semibold text-primary hover:text-secondary transition-colors mb-8 inline-flex items-center gap-2 cursor-pointer select-none"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Marketing Site</span>
        </Link>
        
        {/* Document Metadata Banner Header */}
        <div className="border-b border-outline-variant pb-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Last Updated: August 28, 2026
          </p>
        </div>

        {/* Core Terms Matrix */}
        <div className="flex flex-col gap-8 text-body-md text-on-surface-variant leading-relaxed">
          
          <p>
            Welcome to BaaZio. By initializing a central business workspace profile account, connecting retail store terminals, or accessing our retail management service platform, you agree to comply with and be bound by the following Terms of Service. Please read these parameters carefully before deploying our platform.
          </p>

          {/* Section 1 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              1. Account Creation and Workspace Eligibility
            </h2>
            <p>
              To register a live administrative workspace environment, you must provide a valid owner full name, an active business email address, a registered business name, and create a secure password string. 
            </p>
            <p>
              BaaZio does not demand separate secondary business license authentication uploads or document validation processes to activate terminal features. However, you maintain absolute responsibility for ensuring your retail operational activities comply cleanly with local regional business laws.
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              2. Staff Registry and Access Multi-Tenancy
            </h2>
            <p>
              As the account owner, you are granted administrative control keys over your digital store infrastructure. You are solely responsible for:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm">
              <li>Registering staff profiles manually using their valid full name and dedicated email metadata fields.</li>
              <li>Assigning system permission scopes (e.g., <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">"ADMIN"</code> or <code className="bg-surface-low px-1.5 py-0.5 rounded text-xs font-mono">"STAFF"</code> roles).</li>
              <li>Monitoring terminal access logs. You are fully liable for all data actions, sales operations, and cash tracking inputs executed under your registered staff credentials.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              3. Financial Gateway and Subscription Processing
            </h2>
            <p>
              All billing transactions, premium operational plans, and trial activations are processed exclusively through **Paystack’s** secure payment infrastructure [2026-08-27]. 
            </p>
            <p>
              By subscribing to premium tiers, you authorize our tokenized payload handlers to route payment initialization metadata to Paystack. If a transaction fails due to local network latencies or parameter configuration blocks, you must ensure your system payment preferences are enabled inside your Paystack dashboard. All billing inquiries and refund options are bound directly to Paystack's transaction processing terms.
            </p>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              4. System Availability and Telemetry Tracking
            </h2>
            <p>
              We strive to maintain continuous 24/7 server uptime via our cloud infrastructure partners. To troubleshoot runtime bugs, payment failures, or connection anomalies, our systems automatically transmit runtime metrics to **Grafana Cloud**. 
            </p>
            <p>
              We do not guarantee uninterrupted system uptime if underlying third-party global web infrastructure experiences network downtime. We reserve the right to deploy background patch cycles to update security tokens, encryption scripts, or system metrics without prior notification.
            </p>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              5. Account Revocation and Termination Rules
            </h2>
            <p>
              We reserve the right to temporarily freeze or permanently terminate access to your workspace terminals without notice if we detect fraudulent checkout transactions, security token reuse attacks inside our Redis architecture loop, or illegal retail operations. 
            </p>
            <p>
              You can close your account and request the permanent destruction of your business profiles and staff records at any time by messaging our network administrator queue.
            </p>
          </div>

          {/* Section 6 */}
          <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              6. Terms Revision and Contact
            </h2>
            <p>
              We may update these Terms of Service occasionally to match changes in our retail terminal architecture. Continued deployment of your BaaZio terminal after modifications constitutes full acceptance of the updated terms. For compliance queries, reach our legal desk at:
            </p>
            <div className="bg-surface-low p-4 rounded-md border border-outline-variant text-sm flex flex-col gap-1.5">
              <p><span className="font-semibold text-on-surface">Legal Operations Desk:</span> <a href="mailto:ajalaoluwafikayomi27@gmail.com" className="text-primary hover:underline">ajalaoluwafikayomi27@gmail.com</a></p>
              <p><span className="font-semibold text-on-surface">Enterprise System Base:</span> BaaZio Enterprise Cloud Systems</p>
            </div>
          </div>

        </div> {/* Close Flex Layout */}
      </div> {/* Close Card Base */}
    </div> /* Close Viewport Wrapper */
  );
}
