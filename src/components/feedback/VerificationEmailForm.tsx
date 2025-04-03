'use client';

import { useState } from 'react';
import { Check, X, Send, Mail } from 'lucide-react';

interface VerificationEmailFormProps {
  gymId: string;
  gymName: string;
  gymEmail?: string;
  onSubmit: (data: VerificationEmailData) => void;
  onCancel: () => void;
}

interface VerificationEmailData {
  gymId: string;
  recipientEmail: string;
  message: string;
}

export default function VerificationEmailForm({
  gymId,
  gymName,
  gymEmail = '',
  onSubmit,
  onCancel
}: VerificationEmailFormProps) {
  const [recipientEmail, setRecipientEmail] = useState(gymEmail);
  const [message, setMessage] = useState(
    `Hello,\n\nWe're reaching out from GymFinder to verify some information about ${gymName}. We'd like to ensure our users have accurate information about your facility.\n\nPlease click the link below to confirm your gym's details or make any necessary corrections:\n\n[Verification Link]\n\nThank you for helping us maintain accurate information!\n\nBest regards,\nThe GymFinder Team`
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientEmail.trim()) {
      alert('Please enter a valid email address');
      return;
    }
    
    const emailData: VerificationEmailData = {
      gymId,
      recipientEmail: recipientEmail.trim(),
      message: message.trim()
    };
    
    onSubmit(emailData);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Send Verification Email to {gymName}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Recipient Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Recipient Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="gym@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the gym's contact email address
          </p>
        </div>
        
        {/* Email Message */}
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium mb-2">Email Message</label>
          <textarea
            id="message"
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            Customize the verification email message if needed
          </p>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Verification Email
          </button>
        </div>
      </form>
    </div>
  );
}
