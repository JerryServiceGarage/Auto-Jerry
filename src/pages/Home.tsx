import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Phone, MapPin, CheckCircle2, Star } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const reviews = [
    { name: "Alain B.", textKey: "reviews.alainB", rating: 5 },
    { name: "Sylvie M.", textKey: "reviews.sylvieM", rating: 5 },
    { name: "Michel G.", textKey: "reviews.michelG", rating: 5 }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative text-foreground py-20 md:py-32 overflow-hidden border-b-2 border-foreground">
        <img
          src="/background.png"
          alt=""
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center', zIndex: 0,
            filter: 'brightness(1.1) contrast(0.9) saturate(0.7)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(243, 232, 213, 0.80)', zIndex: 1 }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left" style={{ position: 'relative', zIndex: 2 }}>
          <div className="max-w-3xl mx-auto md:mx-0">
            <p className="text-2xl md:text-3xl mb-4 text-foreground/80">
              {t('hero.subtext')}
            </p>
            <h1 className="text-6xl md:text-8xl font-bold leading-none mb-8 text-foreground">
              {t('hero.headline')}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-10 py-6 rounded-full">
                <a href="tel:5144538805" className="flex items-center"><Phone className="mr-2 h-6 w-6" /> {t('cta.call')}</a>
              </Button>
              {/* BOOKING DISABLED:
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background text-xl px-10 py-6 rounded-full">
                <Link to="/book" className="flex items-center">{t('cta.book')}</Link>
              </Button>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-secondary text-secondary-foreground border-b-2 border-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <MapPin className="h-8 w-8 mb-2" />
              <span className="font-bold text-xl uppercase tracking-widest">{t('home.location')}</span>
              <span className="text-lg">382 Grand Blvd, L'Île-Perrot, QC</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 border-y-2 md:border-y-0 md:border-x-2 border-foreground/20 py-4 md:py-0">
              <Phone className="h-8 w-8 mb-2" />
              <span className="font-bold text-xl uppercase tracking-widest">{t('home.callUs')}</span>
              <span className="text-lg">(514) 453-8805</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <CheckCircle2 className="h-8 w-8 mb-2" />
              <span className="font-bold text-xl uppercase tracking-widest">{t('contact.hours')}</span>
              <span className="text-lg">{t('home.hoursValue')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / About Preview */}
      <section className="py-24 bg-foreground text-background border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-background">
                {t('home.about.title1')}<br/>{t('home.about.title2')}
              </h2>
              <p className="text-xl md:text-2xl mb-10 leading-relaxed text-background/90">
                {t('home.about.description')}
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-10 py-6 rounded-full border-2 border-background">
                <Link to="/about">{t('home.about.cta')}</Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-secondary rounded-3xl transform translate-x-4 translate-y-4 border-2 border-background"></div>
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800"
                alt="Jerry Service Garage Team"
                className="relative rounded-3xl shadow-xl object-cover aspect-square border-2 border-background grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">{t('reviews.title')}</h2>
            <div className="w-32 h-2 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-card border-2 border-foreground hover:shadow-[8px_8px_0px_0px_rgba(23,33,41,1)] transition-shadow duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6 text-[#EAB308]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xl mb-8 text-foreground/90 leading-relaxed">"{t(review.textKey)}"</p>
                  <p className="font-bold text-foreground text-lg uppercase tracking-wider">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
