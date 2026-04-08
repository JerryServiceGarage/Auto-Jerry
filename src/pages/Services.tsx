import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Wrench } from 'lucide-react';

export default function Services() {
  const { t } = useTranslation();

  const servicesList = [
    { name: t('services.oilChange'), description: t('services.oilChange.desc') },
    { name: t('services.brakeRepair'), description: t('services.brakeRepair.desc') },
    { name: t('services.tireChange'), description: t('services.tireChange.desc') },
    { name: t('services.diagnostics'), description: t('services.diagnostics.desc') },
    { name: t('services.battery'), description: t('services.battery.desc') },
    { name: t('services.acHeating'), description: t('services.acHeating.desc') },
    { name: t('services.suspension'), description: t('services.suspension.desc') },
    { name: t('services.generalMaintenance'), description: t('services.generalMaintenance.desc') },
    { name: t('services.exhaust'), description: t('services.exhaust.desc') },
  ];

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t('services.title')}</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <Card key={index} className="bg-card border-2 border-foreground hover:shadow-[8px_8px_0px_0px_rgba(23,33,41,1)] transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold flex items-center gap-4 text-foreground">
                  <div className="bg-secondary p-3 rounded-full border-2 border-foreground shrink-0">
                    <Wrench className="text-secondary-foreground h-6 w-6" />
                  </div>
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/80 text-lg leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24 bg-secondary text-secondary-foreground rounded-3xl p-10 md:p-16 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(23,33,41,1)] text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('services.readyToBook')}</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-secondary-foreground/90">
            {t('services.readyToBookDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-10 py-6 rounded-full border-2 border-foreground">
              <Link to="/book">{t('services.bookAppointment')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background text-xl px-10 py-6 rounded-full">
              <a href="tel:5144538805">{t('cta.call')} (514) 453-8805</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
