import React from "react";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      <div className="container py-5">
        <div className="policy-card p-4 rounded shadow-sm">
          <h1 className="mb-4 text-center">Privacy Policy</h1>
          <p>
            At <strong>Room Dekho.com</strong>, your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
          </p>

          <section className="mt-4">
            <h2>1. Information We Collect</h2>
            <p>
              We may collect personal details such as your name, email, phone number, and payment information to provide a smooth and secure experience.
            </p>
          </section>

          <section className="mt-4">
            <h2>2. How We Use Your Information</h2>
            <p>
              Your information is used to process payments, communicate with you, improve our services, and ensure a personalized experience.
            </p>
          </section>

          <section className="mt-4">
            <h2>3. Sharing of Information</h2>
            <p>
              We do not sell your personal information. We may share information only with trusted partners to provide our services or comply with legal requirements.
            </p>
          </section>

          <section className="mt-4">
            <h2>4. Security</h2>
            <p>
              We implement advanced security measures to protect your information from unauthorized access, disclosure, or misuse.
            </p>
          </section>

          <section className="mt-4">
            <h2>5. Cookies</h2>
            <p>
              Cookies are used to enhance your browsing experience. You can disable cookies in your browser, though some features may not function correctly.
            </p>
          </section>

          <section className="mt-4">
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. All changes will be posted here with the revised date.
            </p>
          </section>

          <section className="mt-4">
            <h2>Contact Us</h2>
            <p>
              For any questions regarding this policy, please contact us at: 
              <a href="mailto:support@example.com" className="text-orange"> support@example.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}