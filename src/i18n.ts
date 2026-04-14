import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.book": "Book",
      "nav.about": "About",
      "nav.contact": "Contact",
      "hero.headline": "Jerry Service Garage",
      "hero.subtext": "Reliable service for brakes, oil changes, diagnostics, tires, and general maintenance.",
      "cta.call": "Call Now",
      "cta.book": "Book Online",
      "cta.directions": "Get Directions",

      // Home page — info bar
      "home.location": "Location",
      "home.callUs": "Call Us",
      "home.hoursValue": "Mon-Fri: 8am - 6pm",
      // Home page — about preview section
      "home.about.title1": "About Our",
      "home.about.title2": "Garage",
      "home.about.description": "At Jerry Service Garage, we believe in honest service, fair pricing, and dependable work. Most of our customers come to us through word of mouth and local trust, and we truly value the relationships we build with every visit.",
      "home.about.cta": "Read Our Story",

      // Services page
      "services.title": "Our Services",
      "services.subtitle": "We offer comprehensive auto repair services for all makes and models. Our experienced technicians use quality parts to get you back on the road safely.",
      "services.book": "Book Now",
      "services.call": "Call to Book",
      "services.startingAt": "Starting at",
      "services.readyToBook": "Ready to Book?",
      "services.readyToBookDesc": "Schedule your next service online or give us a call. We're here to help keep your vehicle running smoothly.",
      "services.bookAppointment": "Book Appointment",
      // Service names & descriptions
      "services.oilChange": "Oil Change",
      "services.oilChange.desc": "Full synthetic, synthetic blend, or conventional oil change including filter replacement and fluid top-off.",
      "services.brakeRepair": "Brake Repair",
      "services.brakeRepair.desc": "Complete brake inspection, pad replacement, rotor resurfacing or replacement, and brake fluid flush.",
      "services.tireChange": "Tire Change & Balance",
      "services.tireChange.desc": "Seasonal tire swaps, mounting, balancing, and flat repairs.",
      "services.diagnostics": "Diagnostics",
      "services.diagnostics.desc": "Check engine light scanning and comprehensive system diagnostics to identify issues accurately.",
      "services.battery": "Battery Replacement",
      "services.battery.desc": "Battery testing, terminal cleaning, and replacement with high-quality batteries.",
      "services.acHeating": "AC / Heating Service",
      "services.acHeating.desc": "A/C recharge, leak detection, and heating system repairs for year-round comfort.",
      "services.suspension": "Suspension / Steering",
      "services.suspension.desc": "Shocks, struts, tie rods, and wheel alignments to ensure a smooth and safe ride.",
      "services.generalMaintenance": "General Maintenance",
      "services.generalMaintenance.desc": "Factory scheduled maintenance, tune-ups, belts, hoses, and filter replacements.",
      "services.exhaust": "Exhaust & Muffler",
      "services.exhaust.desc": "Exhaust system inspection, muffler replacement, catalytic converter repair, and pipe welding.",

      // About page
      "about.title": "About Us",
      "about.heading1": "About Our",
      "about.heading2": "Garage",
      "about.description": "At Jerry Service Garage, we believe in honest service, fair pricing, and dependable work. Most of our customers come to us through word of mouth and local trust, and we truly value the relationships we build with every visit.",
      "about.story": "Jerry Service Garage has been serving the Île-Perrot community for over 20 years. As a family-run business, we pride ourselves on honest, reliable, and high-quality auto repair.",
      "about.values.honesty": "Honesty",
      "about.values.honestyDesc": "We only recommend the services your vehicle truly needs. No hidden fees, no unnecessary upsells.",
      "about.values.quality": "Quality",
      "about.values.qualityDesc": "We use premium parts and employ certified technicians to ensure every repair meets our high standards.",
      "about.values.community": "Community",
      "about.values.communityDesc": "Proudly serving Île-Perrot and surrounding areas. We're your neighbors, and we treat you like family.",

      // Reviews
      "reviews.title": "What Our Customers Say",
      "reviews.alainB": "Jerry and his team are incredibly honest and efficient. They found the issue quickly and charged a very fair price. Best mechanic in L'Île-Perrot.",
      "reviews.sylvieM": "Excellent service! I've been going to Jerry's for years. You can completely trust them with your vehicle. Highly recommend.",
      "reviews.michelG": "Very professional and friendly. They don't try to sell you repairs you don't need. Fast, reliable, and reasonably priced.",
      "reviews.lindaT": "Saved me when my car broke down on the highway. They fit me in right away and had me back on the road the same day. Great family business.",
      "reviews.pierreC": "Honest, fast, and reliable. Jerry always explains what needs to be done without any pressure. The only garage I trust my car with.",

      // Contact page
      "contact.title": "Contact Us",
      "contact.address": "Address",
      "contact.phone": "Phone",
      "contact.hours": "Hours",
      "contact.hours.weekdays": "Monday - Friday: 8:00 AM - 6:00 PM",
      "contact.hours.weekends": "Saturday - Sunday: Closed",
      "contact.sendMessage": "Send us a message",
      "contact.success.title": "Message Sent!",
      "contact.success.body": "We'll get back to you as soon as possible.",
      "contact.success.again": "Send another message",
      "contact.error.recaptcha": "Please complete the reCAPTCHA verification.",
      "contact.error.send": "There was an error sending your message. Please try calling us instead.",
      "contact.sending": "Sending...",
      "contact.form.name": "Name",
      "contact.form.email": "Email or Phone",
      "contact.form.message": "Message",
      "contact.form.submit": "Send Message",

      // Book page
      "book.title": "Book an Appointment",
      "book.sections.personal": "Personal Information",
      "book.sections.vehicle": "Vehicle Information",
      "book.sections.appointment": "Appointment Details",
      "book.form.name": "Full Name",
      "book.form.phone": "Phone Number",
      "book.form.email": "Email",
      "book.form.vehicleYear": "Vehicle Year",
      "book.form.vehicleMake": "Vehicle Make",
      "book.form.vehicleModel": "Vehicle Model",
      "book.form.service": "Service Selection",
      "book.form.selectService": "Select a service",
      "book.form.date": "Appointment Date",
      "book.form.pickDate": "Pick a date",
      "book.form.selectDateFirst": "Select date first",
      "book.form.noSlots": "No slots available",
      "book.form.time": "Appointment Time",
      "book.form.selectTime": "Select time",
      "book.form.notes": "Notes",
      "book.form.notesPlaceholder": "Any specific issues or details we should know about?",
      "book.form.submit": "Request Appointment",
      "book.form.recaptchaError": "Please complete the reCAPTCHA verification.",
      "book.form.submitError": "There was an error submitting your booking. Please try again or call us.",
      "book.form.processing": "Processing...",
      "book.form.termsPrefix": "By booking, you agree to our",
      "book.form.testingMode": "Testing Mode: Appointments are automatically confirmed.",
      "book.success.title": "Check your email",
      "book.success.message": "Please check your email to verify your appointment. Your selected time is being held for a limited time.",
      "book.verified.title": "Appointment Confirmed",
      "book.verified.message": "Your appointment is confirmed. We've also sent you a reminder by email, and we'll send appointment reminders before your scheduled time.",

      // Verify page
      "verify.loading": "Verifying your appointment...",
      "verify.demoMode": "Demo Mode",
      "verify.simulateEmail": "Simulate Email Click",
      "verify.failed": "Verification Failed",
      "verify.returnHome": "Return to Home",
      "verify.bookAgain": "Book Again",
      "verify.error.invalidLink": "Invalid verification link.",
      "verify.error.notFound": "Booking not found.",
      "verify.error.invalidToken": "Invalid verification token.",
      "verify.error.expired": "Verification link has expired. Please book again.",
      "verify.error.generic": "An error occurred during verification. Please try again or contact us.",

      // Footer
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Booking Terms",
      "footer.hoursWeekdays": "Mon - Fri: 8:00 AM - 6:00 PM",
      "footer.hoursWeekends": "Sat - Sun: Closed",
      "footer.copyright": "Jerry Service Garage. All rights reserved.",

      // Cookie consent
      "cookie.title": "We use cookies",
      "cookie.description": "This site uses cookies and third-party services (Google Maps, reCAPTCHA) that may collect data. See our",
      "cookie.accept": "Accept",
      "cookie.decline": "Decline",

      // Book form — privacy consent
      "book.form.privacyConsent": "I have read and agree to the",
      "book.form.privacyConsentAnd": "and the",
      "book.form.privacyConsentRequired": "You must accept the privacy policy to continue.",

      // Privacy & Terms pages
      "privacy.title": "Privacy Policy",
      "terms.title": "Booking Terms"
    }
  },
  fr: {
    translation: {
      "nav.home": "Accueil",
      "nav.services": "Services",
      "nav.book": "Réserver",
      "nav.about": "À propos",
      "nav.contact": "Contact",
      "hero.headline": "Jerry Service Garage",
      "hero.subtext": "Service fiable pour freins, changements d'huile, diagnostics, pneus et entretien général.",
      "cta.call": "Appeler",
      "cta.book": "Réserver en ligne",
      "cta.directions": "Itinéraire",

      // Home page — info bar
      "home.location": "Emplacement",
      "home.callUs": "Appelez-nous",
      "home.hoursValue": "Lun-Ven : 8h - 18h",
      // Home page — about preview section
      "home.about.title1": "Notre",
      "home.about.title2": "Garage",
      "home.about.description": "Chez Jerry Service Garage, nous croyons en un service honnête, des prix équitables et un travail fiable. La plupart de nos clients viennent à nous par le bouche-à-oreille et la confiance locale, et nous valorisons vraiment les relations que nous tissons à chaque visite.",
      "home.about.cta": "Notre histoire",

      // Services page
      "services.title": "Nos Services",
      "services.subtitle": "Nous offrons des services complets de réparation automobile pour toutes les marques et tous les modèles. Nos techniciens expérimentés utilisent des pièces de qualité pour vous remettre sur la route en toute sécurité.",
      "services.book": "Réserver",
      "services.call": "Appeler pour réserver",
      "services.startingAt": "À partir de",
      "services.readyToBook": "Prêt à réserver ?",
      "services.readyToBookDesc": "Planifiez votre prochain entretien en ligne ou appelez-nous. Nous sommes là pour garder votre véhicule en bon état.",
      "services.bookAppointment": "Prendre rendez-vous",
      // Service names & descriptions
      "services.oilChange": "Vidange d'huile",
      "services.oilChange.desc": "Vidange synthétique, hybride ou conventionnelle avec remplacement du filtre et appoint des fluides.",
      "services.brakeRepair": "Réparation des freins",
      "services.brakeRepair.desc": "Inspection des freins, remplacement des plaquettes, rectification des disques et vidange du liquide de frein.",
      "services.tireChange": "Changement et équilibrage des pneus",
      "services.tireChange.desc": "Changements saisonniers, montage, équilibrage et réparation de crevaisons.",
      "services.diagnostics": "Diagnostics",
      "services.diagnostics.desc": "Lecture du voyant moteur et diagnostics du système pour identifier les problèmes avec précision.",
      "services.battery": "Remplacement de batterie",
      "services.battery.desc": "Test de batterie, nettoyage des bornes et remplacement par des batteries de qualité.",
      "services.acHeating": "Climatisation / Chauffage",
      "services.acHeating.desc": "Recharge de climatisation, détection de fuites et réparations du chauffage pour toute saison.",
      "services.suspension": "Suspension / Direction",
      "services.suspension.desc": "Amortisseurs, jambes de force, biellettes et alignement des roues pour une conduite sécuritaire.",
      "services.generalMaintenance": "Entretien général",
      "services.generalMaintenance.desc": "Entretien du fabricant, mise au point, remplacement des courroies, durites et filtres.",
      "services.exhaust": "Échappement & Silencieux",
      "services.exhaust.desc": "Inspection du système d'échappement, remplacement du silencieux, réparation du catalyseur et soudure.",

      // About page
      "about.title": "À propos de nous",
      "about.heading1": "Notre",
      "about.heading2": "Garage",
      "about.description": "Chez Jerry Service Garage, nous croyons en un service honnête, des prix équitables et un travail fiable. La plupart de nos clients viennent à nous par le bouche-à-oreille et la confiance locale, et nous valorisons vraiment les relations que nous tissons à chaque visite.",
      "about.story": "Le Garage Jerry Service sert la communauté de l'Île-Perrot depuis plus de 20 ans. En tant qu'entreprise familiale, nous sommes fiers d'offrir des réparations automobiles honnêtes, fiables et de haute qualité.",
      "about.values.honesty": "Honnêteté",
      "about.values.honestyDesc": "Nous ne recommandons que les services dont votre véhicule a vraiment besoin. Pas de frais cachés, pas de vente abusive.",
      "about.values.quality": "Qualité",
      "about.values.qualityDesc": "Nous utilisons des pièces de qualité supérieure et des techniciens certifiés pour garantir que chaque réparation respecte nos normes élevées.",
      "about.values.community": "Communauté",
      "about.values.communityDesc": "Fiers de servir L'Île-Perrot et les environs. Nous sommes vos voisins et nous vous traitons comme de la famille.",

      // Reviews
      "reviews.title": "Ce que disent nos clients",
      "reviews.alainB": "Jerry et son équipe sont incroyablement honnêtes et efficaces. Ils ont trouvé le problème rapidement et ont facturé un prix très juste. Le meilleur mécanicien de L'Île-Perrot.",
      "reviews.sylvieM": "Excellent service ! Je vais chez Jerry depuis des années. On peut leur faire entièrement confiance avec son véhicule. Je recommande vivement.",
      "reviews.michelG": "Très professionnel et sympathique. Ils n'essaient pas de vous vendre des réparations dont vous n'avez pas besoin. Rapide, fiable et raisonnablement tarifé.",
      "reviews.lindaT": "Ils m'ont sauvée lorsque ma voiture est tombée en panne sur l'autoroute. Ils m'ont prise en charge immédiatement et j'étais de retour sur la route le même jour. Excellent commerce familial.",
      "reviews.pierreC": "Honnête, rapide et fiable. Jerry explique toujours ce qui doit être fait sans aucune pression. Le seul garage à qui je confie ma voiture.",

      // Contact page
      "contact.title": "Nous Joindre",
      "contact.address": "Adresse",
      "contact.phone": "Téléphone",
      "contact.hours": "Heures",
      "contact.hours.weekdays": "Lundi - Vendredi : 8 h 00 - 18 h 00",
      "contact.hours.weekends": "Samedi - Dimanche : Fermé",
      "contact.sendMessage": "Envoyez-nous un message",
      "contact.success.title": "Message envoyé !",
      "contact.success.body": "Nous vous répondrons dès que possible.",
      "contact.success.again": "Envoyer un autre message",
      "contact.error.recaptcha": "Veuillez compléter la vérification reCAPTCHA.",
      "contact.error.send": "Une erreur s'est produite lors de l'envoi de votre message. Veuillez nous appeler.",
      "contact.sending": "Envoi en cours...",
      "contact.form.name": "Nom",
      "contact.form.email": "Courriel ou Téléphone",
      "contact.form.message": "Message",
      "contact.form.submit": "Envoyer le message",

      // Book page
      "book.title": "Prendre un rendez-vous",
      "book.sections.personal": "Informations personnelles",
      "book.sections.vehicle": "Informations sur le véhicule",
      "book.sections.appointment": "Détails du rendez-vous",
      "book.form.name": "Nom complet",
      "book.form.phone": "Numéro de téléphone",
      "book.form.email": "Courriel",
      "book.form.vehicleYear": "Année du véhicule",
      "book.form.vehicleMake": "Marque du véhicule",
      "book.form.vehicleModel": "Modèle du véhicule",
      "book.form.service": "Sélection du service",
      "book.form.selectService": "Sélectionnez un service",
      "book.form.date": "Date du rendez-vous",
      "book.form.pickDate": "Choisissez une date",
      "book.form.selectDateFirst": "Sélectionnez d'abord une date",
      "book.form.noSlots": "Aucun créneau disponible",
      "book.form.time": "Heure du rendez-vous",
      "book.form.selectTime": "Sélectionnez l'heure",
      "book.form.notes": "Notes",
      "book.form.notesPlaceholder": "Des problèmes spécifiques ou des détails à nous faire savoir ?",
      "book.form.submit": "Demander un rendez-vous",
      "book.form.recaptchaError": "Veuillez compléter la vérification reCAPTCHA.",
      "book.form.submitError": "Une erreur s'est produite lors de la soumission. Veuillez réessayer ou nous appeler.",
      "book.form.processing": "Traitement en cours...",
      "book.form.termsPrefix": "En réservant, vous acceptez nos",
      "book.form.testingMode": "Mode test : Les rendez-vous sont automatiquement confirmés.",
      "book.success.title": "Vérifiez votre courriel",
      "book.success.message": "Veuillez vérifier votre courriel pour confirmer votre rendez-vous. L'heure sélectionnée est réservée pour une durée limitée.",
      "book.verified.title": "Rendez-vous confirmé",
      "book.verified.message": "Votre rendez-vous est confirmé. Nous vous avons également envoyé un rappel par courriel, et nous vous enverrons des rappels avant l'heure prévue.",

      // Verify page
      "verify.loading": "Vérification de votre rendez-vous...",
      "verify.demoMode": "Mode démo",
      "verify.simulateEmail": "Simuler le clic sur le courriel",
      "verify.failed": "Échec de la vérification",
      "verify.returnHome": "Retourner à l'accueil",
      "verify.bookAgain": "Réserver à nouveau",
      "verify.error.invalidLink": "Lien de vérification invalide.",
      "verify.error.notFound": "Réservation introuvable.",
      "verify.error.invalidToken": "Jeton de vérification invalide.",
      "verify.error.expired": "Le lien de vérification a expiré. Veuillez réserver à nouveau.",
      "verify.error.generic": "Une erreur s'est produite lors de la vérification. Veuillez réessayer ou nous contacter.",

      // Footer
      "footer.privacy": "Politique de confidentialité",
      "footer.terms": "Conditions de réservation",
      "footer.hoursWeekdays": "Lun - Ven : 8 h - 18 h",
      "footer.hoursWeekends": "Sam - Dim : Fermé",
      "footer.copyright": "Jerry Service Garage. Tous droits réservés.",

      // Cookie consent
      "cookie.title": "Nous utilisons des cookies",
      "cookie.description": "Ce site utilise des cookies et des services tiers (Google Maps, reCAPTCHA) susceptibles de collecter des données. Voir notre",
      "cookie.accept": "Accepter",
      "cookie.decline": "Refuser",

      // Book form — privacy consent
      "book.form.privacyConsent": "J'ai lu et j'accepte la",
      "book.form.privacyConsentAnd": "et les",
      "book.form.privacyConsentRequired": "Vous devez accepter la politique de confidentialité pour continuer.",

      // Privacy & Terms pages
      "privacy.title": "Politique de confidentialité",
      "terms.title": "Conditions de réservation"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr", // default language — French required for Quebec (Bill 96)
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
