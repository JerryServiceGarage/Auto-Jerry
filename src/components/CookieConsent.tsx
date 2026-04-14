import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from './ui/button';

const CONSENT_KEY = 'jsg_cookie_consent';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[60] bg-card border-t-2 border-foreground shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{t('cookie.title')}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('cookie.description')}{' '}
            <Link to="/privacy" className="underline text-primary hover:text-primary/80">
              {t('footer.privacy')}
            </Link>.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline} className="border-foreground">
            {t('cookie.decline')}
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAccept}>
            {t('cookie.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
