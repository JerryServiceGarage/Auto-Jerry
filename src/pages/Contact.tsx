import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, MapPin, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { db, handleFirestoreError, OperationType } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  emailOrPhone: z.string().min(5, { message: "Please enter your email or phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emailOrPhone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Send email via backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Still save a backup to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        ...values,
        createdAt: serverTimestamp(),
      }).catch(error => {
        console.error("Backup to Firestore failed:", error);
      });
      
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("There was an error sending your message. Please try calling us instead.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{t('contact.title')}</h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl mb-1">{t('contact.phone')}</h3>
                    <p className="text-lg text-muted-foreground">(514) 453-8805</p>
                    <Button asChild variant="link" className="p-0 h-auto text-primary mt-2">
                      <a href="tel:5144538805">Call Now</a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl mb-1">{t('contact.address')}</h3>
                    <p className="text-lg text-muted-foreground">382 Grand Boulevard<br/>L'Île-Perrot, QC J7V 4X2</p>
                    <Button asChild variant="link" className="p-0 h-auto text-primary mt-2">
                      <a href="https://maps.google.com/?q=382+Grand+Boulevard,+L'Île-Perrot,+QC+J7V+4X2" target="_blank" rel="noopener noreferrer">
                        {t('cta.directions')}
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl mb-1">{t('contact.hours')}</h3>
                    <ul className="text-lg text-muted-foreground space-y-1">
                      <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                      <li>Saturday - Sunday: Closed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Embedded Map */}
            <div className="rounded-lg overflow-hidden border-2 border-foreground h-64 bg-muted">
              <iframe 
                src="https://maps.google.com/maps?q=Jerry%20Service%20Garage,%20382%20Grand%20Boulevard,%20L'%C3%8Ele-Perrot,%20QC&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps location of Jerry Service Garage"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-card border-border shadow-lg h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Send us a message</h2>
                
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold">Message Sent!</h3>
                    <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')} *</Label>
                      <Input id="name" {...form.register("name")} className="bg-background" />
                      {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailOrPhone">{t('contact.form.email')} *</Label>
                      <Input id="emailOrPhone" {...form.register("emailOrPhone")} className="bg-background" />
                      {form.formState.errors.emailOrPhone && <p className="text-destructive text-sm">{form.formState.errors.emailOrPhone.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')} *</Label>
                      <Textarea 
                        id="message" 
                        {...form.register("message")} 
                        className="bg-background min-h-[150px]" 
                      />
                      {form.formState.errors.message && <p className="text-destructive text-sm">{form.formState.errors.message.message}</p>}
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                      ) : (
                        t('contact.form.submit')
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
