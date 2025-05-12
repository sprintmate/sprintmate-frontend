import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sendMessage } from '../../api/notificationService';
import { authUtils } from '../../utils/authUtils';
import { isSuccessStatus } from '../../utils/applicationUtils';

const FeedbackForm = () => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            const body = {
                loggedInEmail: authUtils.getUserProfile()?.email,
                message: message
            }

            await sendMessage(body);
            setSuccess(true);
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full text-sm bg-gray-50 border-gray-100 hover:border-gray-200 focus:border-blue-200 rounded-lg resize-none transition-colors"
                rows={3}
                required
            />
            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            {success && <p className="text-green-600 text-sm">Message sent successfully!</p>}
        </form>
    );
};

export default FeedbackForm;
