import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function Terms() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {isFr ? 'Conditions de réservation' : 'Booking Terms'}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            {isFr ? 'Dernière mise à jour : 14 avril 2026' : 'Last updated: April 14, 2026'}
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '1. Acceptation des conditions' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'En utilisant le formulaire de réservation en ligne de Jerry Service Garage, vous acceptez les présentes conditions de réservation dans leur intégralité. Si vous n\'acceptez pas ces conditions, veuillez nous contacter directement par téléphone au (514) 453-8805.'
                : 'By using the Jerry Service Garage online booking form, you agree to these booking terms in their entirety. If you do not accept these terms, please contact us directly by phone at (514) 453-8805.'}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '2. Nature de la réservation en ligne' : '2. Nature of Online Booking'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'La soumission d\'un formulaire de réservation constitue une demande de rendez-vous. Jerry Service Garage se réserve le droit de confirmer, modifier ou refuser toute demande selon la disponibilité et la nature du service requis. Un courriel de confirmation vous sera envoyé une fois votre rendez-vous accepté.'
                : 'Submitting a booking form constitutes a request for an appointment. Jerry Service Garage reserves the right to confirm, modify, or decline any request based on availability and the nature of the service required. A confirmation email will be sent once your appointment is accepted.'}
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '3. Annulation et modification' : '3. Cancellation and Modification'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Pour annuler ou modifier un rendez-vous, veuillez nous contacter au moins 24 heures à l\'avance par téléphone au (514) 453-8805 ou par courriel à jerryservicegarage@gmail.com. Les rendez-vous non annulés peuvent entraîner des restrictions sur les réservations futures.'
                : 'To cancel or modify an appointment, please contact us at least 24 hours in advance by phone at (514) 453-8805 or by email at jerryservicegarage@gmail.com. Appointments not cancelled may result in restrictions on future bookings.'}
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '4. Exactitude des renseignements' : '4. Accuracy of Information'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Vous êtes responsable de l\'exactitude des renseignements fournis lors de la réservation (coordonnées, informations sur le véhicule, service demandé). Jerry Service Garage ne pourra être tenu responsable des retards ou malentendus découlant de renseignements inexacts.'
                : 'You are responsible for the accuracy of the information provided when booking (contact details, vehicle information, requested service). Jerry Service Garage cannot be held responsible for delays or misunderstandings arising from inaccurate information.'}
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '5. Services et tarification' : '5. Services and Pricing'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Les prix affichés sur le site sont indicatifs et peuvent varier selon l\'état réel du véhicule, les pièces requises et la complexité du travail. Un estimé définitif sera fourni lors de l\'inspection du véhicule. Aucun travail supplémentaire ne sera effectué sans votre approbation préalable.'
                : 'Prices shown on the website are indicative and may vary based on the actual condition of the vehicle, parts required, and complexity of the work. A final estimate will be provided upon vehicle inspection. No additional work will be performed without your prior approval.'}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '6. Responsabilité' : '6. Liability'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Jerry Service Garage est responsable de la qualité des travaux effectués conformément aux normes de l\'industrie automobile. Notre responsabilité est limitée au coût des réparations effectuées. Nous ne sommes pas responsables des dommages indirects ou consécutifs. Tous les travaux sont garantis conformément à la législation applicable au Québec.'
                : 'Jerry Service Garage is responsible for the quality of work performed in accordance with automotive industry standards. Our liability is limited to the cost of repairs performed. We are not responsible for indirect or consequential damages. All work is warranted in accordance with applicable Quebec legislation.'}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '7. Protection des renseignements personnels' : '7. Personal Information'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? <>Les renseignements personnels collectés lors de la réservation sont traités conformément à notre <Link to="/privacy" className="underline text-primary">Politique de confidentialité</Link> et à la Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25).</>
                : <>Personal information collected during booking is handled in accordance with our <Link to="/privacy" className="underline text-primary">Privacy Policy</Link> and Quebec's Act Respecting the Protection of Personal Information in the Private Sector (Law 25).</>}
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '8. Langue' : '8. Language'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Conformément à la Charte de la langue française (Loi 96), les présentes conditions sont rédigées en français. Une version anglaise est également disponible à titre informatif; en cas de divergence, la version française prévaut.'
                : 'In accordance with the Charter of the French Language (Bill 96), these terms are written in French. An English version is available for reference; in case of discrepancy, the French version prevails.'}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '9. Droit applicable' : '9. Governing Law'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Les présentes conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables. Tout litige sera soumis à la juridiction exclusive des tribunaux du Québec.'
                : 'These terms are governed by the laws of the province of Quebec and applicable federal laws of Canada. Any dispute shall be subject to the exclusive jurisdiction of the courts of Quebec.'}
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '10. Nous contacter' : '10. Contact Us'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr ? (
                <>Pour toute question concernant ces conditions :<br /><br />
                <strong>Jerry Service Garage</strong><br />
                382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2<br />
                Téléphone : (514) 453-8805<br />
                Courriel : <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a></>
              ) : (
                <>For any questions about these terms:<br /><br />
                <strong>Jerry Service Garage</strong><br />
                382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2<br />
                Phone: (514) 453-8805<br />
                Email: <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a></>
              )}
            </p>
          </section>

          <div className="border-t border-border pt-6 text-center">
            <Link to="/" className="text-primary underline text-sm">
              {isFr ? '← Retour à l\'accueil' : '← Back to home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
