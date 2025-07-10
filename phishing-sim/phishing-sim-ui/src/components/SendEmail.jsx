import React, { useState } from "react";

const templates = [
  { label: "Microsoft Login", value: "login.html" },
  { label: "Instagram Login", value: "instagram.html" },
  { label: "Amazon Login", value: "amazon.html" },
  { label: "iPhone Giveaway", value: "giveaway.html" },
];

const SendEmail = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].value);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          recipient,
          subject,
          message,
          template: selectedTemplate,
        }),
      });
      if (res.ok) {
        setStatus("Email sent successfully!");
      } else {
        setStatus("Failed to send email.");
      }
    } catch (err) {
      setStatus("Network error.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Send Phishing Simulation Email</h2>
      <form onSubmit={handleSend}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Recipient Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Subject</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Message</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Phishing Template</label>
          <select
            className="w-full border rounded px-3 py-2 bg-gray-50"
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.target.value)}
          >
            {templates.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Email
        </button>
        {status && <div className="mt-4 text-center font-semibold">{status}</div>}
      </form>
    </div>
  );
};

export default SendEmail;
