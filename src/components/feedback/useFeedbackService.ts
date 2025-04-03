'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FeedbackServiceProps {
  onSubmitFeedback: (data: any) => Promise<void>;
  onSendVerificationEmail: (data: any) => Promise<void>;
}

export default function useFeedbackService({
  onSubmitFeedback,
  onSendVerificationEmail
}: FeedbackServiceProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Submit user feedback
  const submitFeedback = async (feedbackData: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      await onSubmitFeedback(feedbackData);
      
      setSubmitStatus('success');
      setStatusMessage('Thank you for your feedback! Your input helps us maintain accurate information.');
      
      return true;
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(`Error submitting feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Send verification email to gym
  const sendVerificationEmail = async (emailData: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      await onSendVerificationEmail(emailData);
      
      setSubmitStatus('success');
      setStatusMessage('Verification email sent successfully! The gym owner will be able to verify their information.');
      
      return true;
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(`Error sending verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Status component to display feedback submission status
  const StatusMessage = () => {
    if (submitStatus === 'idle') return null;
    
    return (
      <div className={`p-4 rounded-md mt-4 ${
        submitStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}>
        <div className="flex items-center">
          {submitStatus === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span>{statusMessage}</span>
        </div>
      </div>
    );
  };
  
  // Loading indicator
  const LoadingIndicator = () => {
    if (!isSubmitting) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-3 text-primary" />
          <span>Processing...</span>
        </div>
      </div>
    );
  };
  
  return {
    submitFeedback,
    sendVerificationEmail,
    isSubmitting,
    submitStatus,
    statusMessage,
    StatusMessage,
    LoadingIndicator
  };
}
