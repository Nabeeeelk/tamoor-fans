import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Privacy Policy</h1>
        
        <p className="text-slate-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
          <p className="text-slate-600 leading-relaxed">
            Welcome to Taimoor Fans. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. The Data We Collect</h2>
          <p className="text-slate-600 leading-relaxed">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc ml-6 mt-4 text-slate-600 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data:</strong> includes bank account and payment card details (processed securely by our payment partners).</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Data</h2>
          <p className="text-slate-600 leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc ml-6 mt-4 text-slate-600 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering your order).</li>
            <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
          <p className="text-slate-600 leading-relaxed">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="mt-4 font-bold text-slate-900">
            Email: privacy@taimoorfans.com<br />
            Phone: +92 300 1234567<br />
            Address: S.I.E, Gujrat, Pakistan
          </p>
        </section>
      </div>
    </div>
  );
}
