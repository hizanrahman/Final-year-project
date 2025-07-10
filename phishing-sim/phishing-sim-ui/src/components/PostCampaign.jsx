import React from "react";

const PostCampaign = () => (
  <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
    <h1 className="text-2xl font-bold mb-4 text-blue-700">How to Recognize and Prevent Phishing Attacks</h1>
    <article className="prose prose-blue">
      <p>
        <strong>Phishing</strong> is a type of cyber attack where attackers impersonate legitimate organizations or people to trick you into revealing sensitive information, such as passwords or credit card numbers. These attacks often come in the form of emails, fake websites, or messages that look real but are designed to steal your data.
      </p>
      <h2>How to Spot a Phishing Attempt</h2>
      <ul>
        <li>Check the sender's email address carefully for misspellings or suspicious domains.</li>
        <li>Look for urgent or threatening language that pressures you to act quickly.</li>
        <li>Hover over links to see the actual URL before clicking. Be wary of mismatched or strange links.</li>
        <li>Watch for poor grammar, spelling mistakes, or unusual formatting.</li>
        <li>Be cautious with unexpected attachments or requests for personal information.</li>
      </ul>
      <h2>How to Protect Yourself</h2>
      <ul>
        <li>Never share your passwords or sensitive information via email.</li>
        <li>Enable two-factor authentication (2FA) wherever possible.</li>
        <li>Keep your software and antivirus up to date.</li>
        <li>Report suspicious emails to your IT or security team.</li>
        <li>When in doubt, contact the sender through a trusted method before responding.</li>
      </ul>
      <h2>Watch and Learn</h2>
      <div className="my-4">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/UzvPP6_LRHc" title="How to Recognize a Phishing Email" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <div className="my-4">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/9TjtfAJEh8I" title="How to Prevent Phishing Attacks" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p className="mt-6 text-green-700 font-semibold">Stay alert, stay safe!</p>
    </article>
  </div>
);

export default PostCampaign;
