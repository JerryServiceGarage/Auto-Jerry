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
      "services.title": "Our Services",
      "services.book": "Book Now",
      "services.call": "Call to Book",
      "services.startingAt": "Starting at",
      "about.title": "About Us",
      "about.story": "Jerry Service Garage has been serving the Île-Perrot community for over 20 years. As a family-run business, we pride ourselves on honest, reliable, and high-quality auto repair.",
      "contact.title": "Contact Us",
      "contact.address": "Address",
      "contact.phone": "Phone",
      "contact.hours": "Hours",
      "contact.form.name": "Name",
      "contact.form.email": "Email or Phone",
      "contact.form.message": "Message",
      "contact.form.submit": "Send Message",
      "book.title": "Book an Appointment",
      "book.form.name": "Full Name",
      "book.form.phone": "Phone Number",
      "book.form.email": "Email",
      "book.form.vehicleYear": "Vehicle Year",
      "book.form.vehicleMake": "Vehicle Make",
      "book.form.vehicleModel": "Vehicle Model",
      "book.form.service": "Service Selection",
      "book.form.date": "Appointment Date",
      "book.form.time": "Appointment Time",
      "book.form.notes": "Notes",
      "book.form.submit": "Request Appointment",
      "book.success.title": "Check your email",
      "book.success.message": "Please check your email to verify your appointment. Your selected time is being held for a limited time.",
      "book.verified.title": "Appointment Confirmed",
      "book.verified.message": "Your appointment is confirmed. We've also sent you a reminder by email, and we'll send appointment reminders before your scheduled time.",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Booking Terms",
      "reviews.title": "What Our Customers Say"
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
      "services.title": "Nos Services",
      "services.book": "Réserver",
      "services.call": "Appeler pour réserver",
      "services.startingAt": "À partir de",
      "about.title": "À propos de nous",
      "about.story": "Le Garage Jerry Service sert la communauté de l'Île-Perrot depuis plus de 20 ans. En tant qu'entreprise familiale, nous sommes fiers d'offrir des réparations automobiles honnêtes, fiables et de haute qualité.",
      "contact.title": "Nous Joindre",
      "contact.address": "Adresse",
      "contact.phone": "Téléphone",
      "contact.hours": "Heures",
      "contact.form.name": "Nom",
      "contact.form.email": "Courriel ou Téléphone",
      "contact.form.message": "Message",
      "contact.form.submit": "Envoyer le message",
      "book.title": "Prendre un rendez-vous",
      "book.form.name": "Nom complet",
      "book.form.phone": "Numéro de téléphone",
      "book.form.email": "Courriel",
      "book.form.vehicleYear": "Année du véhicule",
      "book.form.vehicleMake": "Marque du véhicule",
      "book.form.vehicleModel": "Modèle du véhicule",
      "book.form.service": "Sélection du service",
      "book.form.date": "Date du rendez-vous",
      "book.form.time": "Heure du rendez-vous",
      "book.form.notes": "Notes",
      "book.form.submit": "Demander un rendez-vous",
      "book.success.title": "Vérifiez votre courriel",
      "book.success.message": "Veuillez vérifier votre courriel pour confirmer votre rendez-vous. L'heure sélectionnée est réservée pour une durée limitée.",
      "book.verified.title": "Rendez-vous confirmé",
      "book.verified.message": "Votre rendez-vous est confirmé. Nous vous avons également envoyé un rappel par courriel, et nous vous enverrons des rappels avant l'heure prévue.",
      "footer.privacy": "Politique de confidentialité",
      "footer.terms": "Conditions de réservation",
      "reviews.title": "Ce que disent nos clients"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
