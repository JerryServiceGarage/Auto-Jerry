import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function Verify() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  useEffect(() => {
    // If we just arrived from the booking page, we show the "Check your email" message,
    // but since this is a demo, we'll provide a button to simulate clicking the email link.
    if (id && token && !searchParams.get('action')) {
      setStatus('pending');
    } else if (id && token && searchParams.get('action') === 'confirm') {
      verifyBooking(id, token);
    } else {
      setStatus('error');
      setErrorMessage('Invalid verification link.');
    }
  }, [id, token, searchParams]);

  const verifyBooking = async (bookingId: string, verificationToken: string) => {
    setStatus('loading');
    try {
      const docRef = doc(db, 'bookingRequests', bookingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setStatus('error');
        setErrorMessage('Booking not found.');
        return;
      }

      const data = docSnap.data();

      if (data.status === 'confirmed') {
        setStatus('success');
        return;
      }

      if (data.verificationToken !== verificationToken) {
        setStatus('error');
        setErrorMessage('Invalid verification token.');
        return;
      }

      // Check expiration
      if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
        setStatus('error');
        setErrorMessage('Verification link has expired. Please book again.');
        // In a real app, we would also release the held slot here.
        return;
      }

      // Update status to confirmed
      await updateDoc(docRef, {
        status: 'confirmed',
        verifiedAt: new Date()
      });

      setStatus('success');
    } catch (error) {
      console.error("Error verifying booking:", error);
      setStatus('error');
      setErrorMessage('An error occurred during verification. Please try again or contact us.');
    }
  };

  return (
    <div className="py-20 bg-background min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <Card className="bg-card border-border shadow-lg text-center">
          <CardContent className="p-8">
            
            {status === 'pending' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold">{t('book.success.title')}</h2>
                <p className="text-muted-foreground">
                  {t('book.success.message')}
                </p>
                
                {/* DEMO ONLY: Button to simulate clicking the email link */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Demo Mode</p>
                  <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
                    <Link to={`/verify?id=${id}&token=${token}&action=confirm`}>
                      Simulate Email Click
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-6 py-8">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <h2 className="text-xl font-serif font-bold">Verifying your appointment...</h2>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-serif font-bold">{t('book.verified.title')}</h2>
                <p className="text-muted-foreground">
                  {t('book.verified.message')}
                </p>
                <Button asChild className="w-full mt-6 bg-primary hover:bg-primary/90">
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-serif font-bold">Verification Failed</h2>
                <p className="text-muted-foreground">
                  {errorMessage}
                </p>
                <Button asChild className="w-full mt-6" variant="outline">
                  <Link to="/book">Book Again</Link>
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
