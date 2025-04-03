'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import VerificationEmailForm from '@/components/feedback/VerificationEmailForm';
import useFeedbackService from '@/components/feedback/useFeedbackService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymId: string;
  gymName: string;
  gymEmail?: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  gymId,
  gymName,
  gymEmail
}: FeedbackModalProps) {
  const [activeTab, setActiveTab] = useState('feedback');
  
  const { 
    submitFeedback, 
    sendVerificationEmail, 
    isSubmitting, 
    StatusMessage, 
    LoadingIndicator 
  } = useFeedbackService({
    onSubmitFeedback: async (data) => {
      // In a real app, this would send data to your backend
      console.log('Submitting feedback:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSendVerificationEmail: async (data) => {
      // In a real app, this would send the verification email
      console.log('Sending verification email:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });
  
  if (!isOpen) return null;
  
  const handleFeedbackSubmit = async (feedbackData: any) => {
    const success = await submitFeedback({
      ...feedbackData,
      submittedAt: new Date().toISOString()
    });
    
    if (success) {
      setTimeout(onClose, 2000);
    }
  };
  
  const handleEmailSubmit = async (emailData: any) => {
    const success = await sendVerificationEmail({
      ...emailData,
      sentAt: new Date().toISOString()
    });
    
    if (success) {
      setTimeout(onClose, 2000);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="feedback">Leave Feedback</TabsTrigger>
                <TabsTrigger value="verify">Verify Gym Info</TabsTrigger>
              </TabsList>
              
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <TabsContent value="feedback">
              <FeedbackForm
                gymId={gymId}
                gymName={gymName}
                onSubmit={handleFeedbackSubmit}
                onCancel={onClose}
              />
            </TabsContent>
            
            <TabsContent value="verify">
              <VerificationEmailForm
                gymId={gymId}
                gymName={gymName}
                gymEmail={gymEmail}
                onSubmit={handleEmailSubmit}
                onCancel={onClose}
              />
            </TabsContent>
          </Tabs>
          
          <StatusMessage />
        </div>
      </div>
      
      <LoadingIndicator />
    </div>
  );
}
