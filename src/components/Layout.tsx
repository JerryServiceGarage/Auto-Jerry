import { Outlet, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, MapPin, Wrench, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    // BOOKING DISABLED: { name: t('nav.book'), path: '/book' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Main Header */}
      <header className="bg-background border-b-2 border-foreground sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-foreground overflow-hidden flex-shrink-0 bg-primary">
                {/* Placeholder for the uploaded image of Jerry on the phone */}
                <img 
                  src="https://raw.githubusercontent.com/jdrizzzzz/Skincare-FrontEnd/refs/heads/main/src/assets/Jerry1.jpg" 
                  alt="Jerry's Garage" 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-2xl tracking-tight text-foreground">
                Auto Jerry
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button onClick={toggleLanguage} className="font-medium text-muted-foreground hover:text-primary transition-colors">
                {i18n.language === 'en' ? 'FR' : 'EN'}
              </button>
              {/* BOOKING DISABLED:
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/book">{t('cta.book')}</Link>
              </Button>
              */}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <button onClick={toggleLanguage} className="font-medium text-muted-foreground">
                {i18n.language === 'en' ? 'FR' : 'EN'}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* BOOKING DISABLED:
              <div className="mt-4 px-3">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to="/book" onClick={() => setIsMenuOpen(false)}>{t('cta.book')}</Link>
                </Button>
              </div>
              */}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 border-t-2 border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-background overflow-hidden flex-shrink-0 bg-primary">
                {/* Placeholder for the uploaded image of Jerry on the phone */}
                <img 
                  src="https://raw.githubusercontent.com/jdrizzzzz/Skincare-FrontEnd/refs/heads/main/src/assets/Jerry1.jpg"
                  alt="Jerry's Garage" 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-2xl tracking-tight">Auto Jerry</span>
            </div>
            <p className="text-background/80 text-lg mb-4">
              {t('hero.subtext')}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-6 text-background/50 uppercase tracking-widest">{t('contact.title')}</h3>
            <ul className="space-y-4 text-background/90 text-lg">
              <li className="flex items-center gap-3"><MapPin size={20} className="text-secondary" /> 382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2</li>
              <li className="flex items-center gap-3"><Phone size={20} className="text-secondary" /> (514) 453-8805</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-6 text-background/50 uppercase tracking-widest">{t('contact.hours')}</h3>
            <ul className="space-y-2 text-background/90 text-lg">
              <li>{t('footer.hoursWeekdays')}</li>
              <li>{t('footer.hoursWeekends')}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t-2 border-background/20 flex flex-col md:flex-row justify-center items-center text-lg text-background/60">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </footer>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex gap-2 z-50">
        <Button asChild variant="outline" className="flex-1 border-primary text-primary">
          <a href="tel:5144538805"><Phone size={16} className="mr-2" /> {t('cta.call')}</a>
        </Button>
        {/* BOOKING DISABLED:
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
          <Link to="/book">{t('cta.book')}</Link>
        </Button>
        */}
      </div>
    </div>
  );
}
