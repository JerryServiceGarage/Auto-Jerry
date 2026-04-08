import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/auth/google/url?t=' + Date.now());
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Failed to initiate Google Calendar connection.');
    }
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Google Calendar Integration
            </CardTitle>
            <CardDescription>
              Connect your Google Calendar to automatically sync new booking requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center space-y-6">
            {isConnected ? (
              <div className="flex flex-col items-center text-green-600 space-y-4">
                <CheckCircle2 className="h-16 w-16" />
                <h3 className="text-2xl font-bold">Calendar Connected!</h3>
                <p className="text-center text-muted-foreground">
                  New bookings will now automatically appear in your Google Calendar.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-muted-foreground max-w-md">
                  Click the button below to authorize Jerry's Garage to add events to your Google Calendar.
                </p>
                <Button onClick={handleConnect} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                  Connect Google Calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
