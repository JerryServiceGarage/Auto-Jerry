# Privacy Breach Response Plan — Jerry Service Garage
# Plan de réponse aux incidents de confidentialité — Jerry Service Garage

**Business / Entreprise:** Jerry Service Garage  
**Address / Adresse:** 382 Grand Boulevard, L'Île-Perrot, QC J7V 4X2  
**Phone / Téléphone:** (514) 453-8805  
**Privacy Contact / Responsable de la confidentialité:** jerryservicegarage@gmail.com  
**Document created / Document créé:** April 14, 2026  
**Last reviewed / Dernière révision:** April 14, 2026  

---

## What Personal Information We Hold
## Quels renseignements personnels nous détenons

When the online booking form is active, we collect and store:
- Customer full name, phone number, and email address
- Vehicle year, make, and model
- Requested service, appointment date and time
- Notes provided by the customer

This data is stored in Google Firebase Firestore and shared with Google Calendar and Resend (for confirmation emails).

When the contact form is active, we also collect:
- Name and email or phone number
- Message content

---

## Step 1 — Recognize a Breach
## Étape 1 — Reconnaître un incident

A privacy breach has likely occurred if any of the following happen:

- You receive an alert from Google or Firebase about suspicious activity on your account
- A customer contacts you saying they received emails or calls they didn't expect, referencing their booking
- You notice booking records in Firebase that you don't recognize
- Someone tells you they saw personal customer data posted online or sent somewhere it shouldn't be
- Your Gmail, Google, or Firebase account shows a login from an unknown location or device
- The website behaves strangely (forms submitting on their own, data appearing or disappearing)

**When in doubt, treat it as a breach and follow these steps.**

---

## Step 2 — Contain the Breach Immediately (Within 24 Hours)
## Étape 2 — Contenir l'incident immédiatement (dans les 24 heures)

Do these things as fast as possible:

1. **Change all passwords** for:
   - Google account (gmail.com) — this covers Firebase, Google Calendar, and Gmail
   - Any other account connected to the website

2. **Enable two-factor authentication (2FA)** on your Google account if not already on:
   - Go to myaccount.google.com → Security → 2-Step Verification

3. **Contact your developer** and ask them to temporarily disable the booking and contact forms on the website

4. **Do not delete anything.** Keep all logs, emails, and records as-is — you may need them later

5. **Write down:**
   - The date and time you discovered the breach
   - What you noticed (what looked wrong)
   - What accounts or systems you think were affected

---

## Step 3 — Assess the Severity
## Étape 3 — Évaluer la gravité

Answer these questions honestly:

| Question | Yes | No |
|---|---|---|
| Were customer names, emails, or phone numbers exposed? | | |
| Could the exposed data be used to harm or scam a customer? | | |
| Was financial information (credit card, banking) involved? | | |
| Were more than 10 customers affected? | | |
| Were more than 100 customers affected? | | |

- If you answered **Yes to anything in the table:** proceed to Step 4 immediately
- If you answered **No to everything:** document the incident (Step 5) but formal reporting may not be required — confirm with the CAI if unsure

---

## Step 4 — Notify Affected People and Authorities
## Étape 4 — Aviser les personnes touchées et les autorités

### Notify the Commission d'accès à l'information (CAI)

Quebec law requires you to report a breach to the CAI if it presents a **serious risk of injury** to individuals.

**CAI Contact:**
- Website: [cai.gouv.qc.ca](https://www.cai.gouv.qc.ca)
- Phone: 1-888-528-7741
- Online incident report form: available on the CAI website under "Signaler un incident"

**When to report:**
- As soon as possible, and **no later than 72 hours** after confirming the breach

**What to include in the report:**
- Your business name and contact info
- Description of what happened
- What personal information was involved
- Approximately how many people were affected
- What steps you have taken to contain it

---

### Notify Affected Customers

Send an email (or call, if email was compromised) to every affected customer. Keep the message simple and honest:

---

**Sample notification email (English):**

> Subject: Important Notice Regarding Your Personal Information
>
> Dear [Customer Name],
>
> We are writing to inform you that Jerry Service Garage recently experienced a privacy incident that may have involved your personal information.
>
> **What happened:** [Briefly describe — e.g., "Unauthorized access to our booking system was detected on [date]."]
>
> **What information was involved:** [e.g., "Your name, phone number, and email address that you provided when booking an appointment."]
>
> **What we have done:** We have secured our systems, changed all account passwords, and are reviewing how this occurred.
>
> **What you should do:** Be cautious of unexpected emails or calls. If you receive anything suspicious mentioning your vehicle or appointment, do not respond to it and let us know.
>
> We sincerely apologize for this. If you have any questions, please contact us at (514) 453-8805 or jerryservicegarage@gmail.com.
>
> Sincerely,  
> Jerry Service Garage

---

**Sample notification email (French):**

> Objet : Avis important concernant vos renseignements personnels
>
> Madame, Monsieur [Nom du client],
>
> Nous vous écrivons pour vous informer que Jerry Service Garage a récemment subi un incident de confidentialité qui pourrait avoir touché vos renseignements personnels.
>
> **Ce qui s'est passé :** [Description brève — ex. : « Un accès non autorisé à notre système de réservation a été détecté le [date]. »]
>
> **Renseignements concernés :** [ex. : « Votre nom, numéro de téléphone et adresse courriel fournis lors de votre réservation. »]
>
> **Ce que nous avons fait :** Nous avons sécurisé nos systèmes, modifié tous les mots de passe et examinons la cause de l'incident.
>
> **Ce que vous devriez faire :** Soyez prudent(e) face aux courriels ou appels inattendus. Si vous recevez quelque chose de suspect mentionnant votre véhicule ou votre rendez-vous, ne répondez pas et communiquez avec nous.
>
> Nous vous présentons nos sincères excuses. Pour toute question, contactez-nous au (514) 453-8805 ou à jerryservicegarage@gmail.com.
>
> Cordialement,  
> Jerry Service Garage

---

## Step 5 — Document the Incident
## Étape 5 — Documenter l'incident

Fill this out and keep it on file (print it or save it to Google Drive):

```
Date breach discovered:         ___________________________
Time breach discovered:         ___________________________
How it was discovered:          ___________________________
Systems or accounts affected:   ___________________________
Type of data involved:          ___________________________
Estimated number of people:     ___________________________
Date CAI was notified:          ___________________________
Date customers were notified:   ___________________________
Steps taken to contain breach:  ___________________________
Steps taken to prevent recurrence: ________________________
Person handling the incident:   ___________________________
```

Keep this record for a **minimum of 5 years.**

---

## Step 6 — After the Incident
## Étape 6 — Après l'incident

Once the immediate situation is handled:

1. Review how it happened and fix the root cause
2. Consider hiring a professional to review your website security
3. Update passwords on all accounts and make sure 2FA is on everywhere
4. Review this document and update it if anything needs to change
5. Update the "Last reviewed" date at the top of this document

---

## Quick Reference Card
## Carte de référence rapide

| Action | Contact / Link |
|---|---|
| Report to CAI | cai.gouv.qc.ca / 1-888-528-7741 |
| Google account security | myaccount.google.com/security |
| Firebase console | console.firebase.google.com |
| Developer contact | *(add your developer's contact here)* |
| Privacy email | jerryservicegarage@gmail.com |
| Business phone | (514) 453-8805 |

---

*This document is for internal use only and should not be published publicly.*  
*Ce document est à usage interne uniquement et ne doit pas être publié publiquement.*
