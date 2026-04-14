import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function Privacy() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            {isFr ? 'Dernière mise à jour : 14 avril 2026' : 'Last updated: April 14, 2026'}
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          {/* Third-party disclosure banner */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm">
            {isFr ? (
              <p>Ce site utilise des services tiers qui peuvent collecter des données personnelles : Google Maps, Google reCAPTCHA, Google Calendar (pour la synchronisation des rendez-vous), et Resend (pour l'envoi de courriels de confirmation). Voir la section « Tiers » ci-dessous pour plus de détails.</p>
            ) : (
              <p>This site uses third-party services that may collect personal data: Google Maps, Google reCAPTCHA, Google Calendar (for appointment sync), and Resend (for confirmation emails). See the "Third Parties" section below for details.</p>
            )}
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '1. Responsable du traitement' : '1. Data Controller'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr ? (
                <>Jerry Service Garage, 382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2<br />
                Téléphone : (514) 453-8805<br />
                Courriel pour les demandes relatives à la vie privée : <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a></>
              ) : (
                <>Jerry Service Garage, 382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2<br />
                Phone: (514) 453-8805<br />
                Privacy inquiries email: <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a></>
              )}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '2. Renseignements personnels collectés' : '2. Personal Information Collected'}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {isFr
                ? 'Nous collectons uniquement les renseignements nécessaires à la prestation de nos services :'
                : 'We collect only the information necessary to provide our services:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {isFr ? (
                <>
                  <li><strong>Formulaire de réservation :</strong> nom complet, numéro de téléphone, adresse courriel, année/marque/modèle du véhicule, service demandé, date et heure du rendez-vous, notes supplémentaires.</li>
                  <li><strong>Formulaire de contact (lorsqu'activé) :</strong> nom, courriel ou numéro de téléphone, message.</li>
                  <li><strong>Données techniques :</strong> adresse IP (collectée par les services tiers, voir section 5).</li>
                </>
              ) : (
                <>
                  <li><strong>Booking form:</strong> full name, phone number, email address, vehicle year/make/model, requested service, appointment date and time, additional notes.</li>
                  <li><strong>Contact form (when enabled):</strong> name, email or phone number, message.</li>
                  <li><strong>Technical data:</strong> IP address (collected by third-party services, see section 5).</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '3. Finalités du traitement' : '3. Purposes of Processing'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {isFr ? (
                <>
                  <li>Confirmer et gérer votre rendez-vous de service automobile.</li>
                  <li>Vous envoyer des rappels de rendez-vous par courriel.</li>
                  <li>Répondre à vos demandes de renseignements.</li>
                  <li>Prévenir la fraude et les soumissions automatisées (via reCAPTCHA).</li>
                </>
              ) : (
                <>
                  <li>Confirming and managing your automotive service appointment.</li>
                  <li>Sending appointment reminder emails.</li>
                  <li>Responding to your inquiries.</li>
                  <li>Preventing fraud and automated submissions (via reCAPTCHA).</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '4. Conservation des données' : '4. Data Retention'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Les renseignements de réservation sont conservés pour la durée de la relation de service et supprimés sur demande. Les messages de contact sont supprimés après traitement de la demande. Vous pouvez demander la suppression de vos données à tout moment (voir section 7).'
                : 'Booking information is retained for the duration of the service relationship and deleted upon request. Contact messages are deleted after the inquiry is handled. You may request deletion of your data at any time (see section 7).'}
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '5. Services tiers et partage de données' : '5. Third-Party Services and Data Sharing'}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {isFr
                ? 'Vos renseignements personnels peuvent être transmis aux tiers suivants dans le cadre de la prestation de nos services :'
                : 'Your personal information may be shared with the following third parties in connection with our services:'}
            </p>
            <div className="space-y-4">
              {[
                {
                  name: 'Google LLC (Google Calendar)',
                  fr: 'Les détails de votre rendez-vous (nom, téléphone, courriel, véhicule, service) sont synchronisés avec Google Calendar pour la gestion interne des rendez-vous.',
                  en: 'Your appointment details (name, phone, email, vehicle, service) are synced to Google Calendar for internal appointment management.',
                  policy: 'https://policies.google.com/privacy',
                },
                {
                  name: 'Google LLC (Google Maps)',
                  fr: 'Une carte Google Maps est intégrée à notre page de contact. Google peut collecter votre adresse IP et d\'autres données de navigation.',
                  en: 'A Google Maps embed is present on our contact page. Google may collect your IP address and browsing data.',
                  policy: 'https://policies.google.com/privacy',
                },
                {
                  name: 'Google LLC (reCAPTCHA)',
                  fr: 'Nous utilisons reCAPTCHA v2 pour protéger nos formulaires contre les robots. Google collecte des données comportementales à cette fin.',
                  en: 'We use reCAPTCHA v2 to protect our forms from bots. Google collects behavioral data for this purpose.',
                  policy: 'https://policies.google.com/privacy',
                },
                {
                  name: 'Resend Inc.',
                  fr: 'Nous utilisons Resend pour l\'envoi de courriels de confirmation et de rappels de rendez-vous. Votre adresse courriel et les détails du rendez-vous sont transmis à Resend.',
                  en: 'We use Resend for sending booking confirmation and reminder emails. Your email address and appointment details are transmitted to Resend.',
                  policy: 'https://resend.com/legal/privacy-policy',
                },
                {
                  name: 'Google Firebase / Firestore',
                  fr: 'Les données de réservation sont stockées dans Google Firebase Firestore, une base de données sécurisée dans le nuage.',
                  en: 'Booking data is stored in Google Firebase Firestore, a secure cloud database.',
                  policy: 'https://firebase.google.com/support/privacy',
                },
              ].map((tp) => (
                <div key={tp.name} className="border border-border rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-1">{tp.name}</p>
                  <p className="text-muted-foreground text-sm mb-2">{isFr ? tp.fr : tp.en}</p>
                  <a href={tp.policy} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
                    {isFr ? 'Politique de confidentialité du tiers →' : 'Third-party privacy policy →'}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '6. Cookies' : '6. Cookies'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Ce site utilise des cookies essentiels au fonctionnement (préférence de langue, consentement aux cookies) ainsi que des cookies de tiers déposés par Google Maps et reCAPTCHA. Vous pouvez refuser les cookies non essentiels via la bannière de consentement affichée lors de votre première visite.'
                : 'This site uses cookies essential to its operation (language preference, cookie consent) and third-party cookies set by Google Maps and reCAPTCHA. You may decline non-essential cookies via the consent banner displayed on your first visit.'}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '7. Vos droits (Loi 25 / Loi sur la protection des renseignements personnels)' : '7. Your Rights (Quebec Law 25 / Act Respecting the Protection of Personal Information)'}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {isFr
                ? 'Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25), vous avez les droits suivants :'
                : 'Under Quebec\'s Act Respecting the Protection of Personal Information in the Private Sector (Law 25), you have the following rights:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {isFr ? (
                <>
                  <li><strong>Accès :</strong> obtenir confirmation que nous détenons des renseignements vous concernant et en recevoir une copie.</li>
                  <li><strong>Rectification :</strong> demander la correction de renseignements inexacts ou incomplets.</li>
                  <li><strong>Suppression :</strong> demander la suppression de vos renseignements personnels.</li>
                  <li><strong>Retrait du consentement :</strong> retirer votre consentement au traitement de vos données.</li>
                  <li><strong>Portabilité :</strong> recevoir vos renseignements dans un format structuré et lisible par machine.</li>
                </>
              ) : (
                <>
                  <li><strong>Access:</strong> obtain confirmation that we hold information about you and receive a copy.</li>
                  <li><strong>Correction:</strong> request correction of inaccurate or incomplete information.</li>
                  <li><strong>Deletion:</strong> request deletion of your personal information.</li>
                  <li><strong>Withdrawal of consent:</strong> withdraw your consent to data processing.</li>
                  <li><strong>Portability:</strong> receive your information in a structured, machine-readable format.</li>
                </>
              )}
            </ul>
            <div className="mt-4 bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-1">
                {isFr ? 'Pour exercer vos droits :' : 'To exercise your rights:'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? <>Envoyez un courriel à <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a> en indiquant votre nom, votre courriel utilisé lors de la réservation et la nature de votre demande. Nous répondrons dans un délai de 30 jours.</>
                  : <>Send an email to <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a> including your name, the email used when booking, and the nature of your request. We will respond within 30 days.</>}
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '8. Sécurité' : '8. Security'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger vos renseignements personnels contre tout accès non autorisé, divulgation, modification ou destruction. Les données sont stockées dans Google Firebase Firestore avec des règles d\'accès strictes.'
                : 'We implement reasonable security measures to protect your personal information against unauthorized access, disclosure, modification, or destruction. Data is stored in Google Firebase Firestore with strict access rules.'}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '9. Loi applicable' : '9. Governing Law'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'La présente politique est régie par les lois de la province de Québec, Canada, notamment la Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25) et la Charte de la langue française (Loi 96).'
                : 'This policy is governed by the laws of the province of Quebec, Canada, including the Act Respecting the Protection of Personal Information in the Private Sector (Law 25) and the Charter of the French Language (Bill 96).'}
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-3">
              {isFr ? '10. Contact — Responsable de la protection des renseignements personnels' : '10. Contact — Privacy Officer'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr ? (
                <>Pour toute question relative à cette politique ou à l'exercice de vos droits :<br /><br />
                <strong>Jerry Service Garage</strong><br />
                382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2<br />
                Téléphone : (514) 453-8805<br />
                Courriel : <a href="mailto:jerryservicegarage@gmail.com" className="underline text-primary">jerryservicegarage@gmail.com</a></>
              ) : (
                <>For any questions about this policy or to exercise your rights:<br /><br />
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
