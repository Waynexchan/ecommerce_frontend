import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function HelpCenter() {
  return (
    <div className="container mt-5">
      <h3 className="mb-4">Help Center</h3>
      <section className="faq-section card p-4 mb-4">
        <h4 className="section-title">Frequently Asked Questions (FAQ)</h4>
        <div className="faq-item">
          <h4 className="faq-question">1. How do I track my order?</h4>
          <p className="faq-answer">You can track your order by logging into your account and viewing the order status in the "My Orders" section.</p>
        </div>
        <div className="faq-item">
          <h4 className="faq-question">2. How do I return an item?</h4>
          <p className="faq-answer">To return an item, please visit our Return Policy page and follow the instructions provided.</p>
        </div>
        <div className="faq-item">
          <h4 className="faq-question">3. How do I contact customer service?</h4>
          <p className="faq-answer">You can contact our customer service by emailing us at cs@swluxury9195.com</p>
        </div>
        <div className="faq-item">
          <h4 className="faq-question">4. How can I change my account details?</h4>
          <p className="faq-answer">You can update your account details by logging into your account and going to the "Account Settings" section.</p>
        </div>
      </section>
      <section className="support-section card p-4 mb-4">
        <h2 className="section-title">Support Options</h2>
        <p>We offer various support options to assist you:</p>
        <ul>
          <li>Email Support: cs@swluxury9195.com</li>
        </ul>
      </section>
      <section className="contact-section card p-4 mb-4">
        <h2 className="section-title">Contact Us</h2>
        <p>If you have any other questions or need further assistance, please don't hesitate to contact us:</p>
        <p>Email: cs@swluxury9195.com</p>
        <p>Phone: +852 60614857</p>
      </section>
    </div>
  );
}

export default HelpCenter;
