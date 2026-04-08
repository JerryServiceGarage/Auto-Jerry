import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

import { db, handleFirestoreError, OperationType } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { cn } from '../lib/utils';

const servicesList = [
  "Oil Change",
  "Brake Repair",
  "Tire Change & Balance",
  "Diagnostics",
  "Battery Replacement",
  "AC / Heating Service",
  "Suspension / Steering",
  "General Maintenance"
];

// Generate some mock slots for the next 14 days
const generateMockSlots = () => {
  const slots = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = addDays(today, i);
    // Skip Sundays
    if (date.getDay() === 0) continue;
    
    // Saturday half day
    const hours = date.getDay() === 6 ? [9, 10, 11, 12] : [8, 9, 10, 11, 13, 14, 15, 16];
    
    hours.forEach(hour => {
      // Randomly make some slots unavailable
      if (Math.random() > 0.3) {
        slots.push({
          date: format(date, 'yyyy-MM-dd'),
          time: `${hour.toString().padStart(2, '0')}:00`,
          isAvailable: true
        });
      }
    });
  }
  return slots;
};

const mockAvailableSlots = generateMockSlots();

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  vehicleYear: z.string().min(4, { message: "Please enter a valid year." }),
  vehicleMake: z.string().min(1, { message: "Please enter the vehicle make." }),
  vehicleModel: z.string().min(1, { message: "Please enter the vehicle model." }),
  serviceName: z.string().min(1, { message: "Please select a service." }),
  appointmentDate: z.date({ message: "Please select a date." }),
  appointmentTime: z.string().min(1, { message: "Please select a time." }),
  notes: z.string().optional(),
});

export default function Book() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  const initialService = searchParams.get('service') || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      serviceName: initialService || "",
      appointmentTime: "",
      notes: "",
    },
  });

  const selectedDate = form.watch("appointmentDate");

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const times = mockAvailableSlots
        .filter(slot => slot.date === dateStr && slot.isAvailable)
        .map(slot => slot.time)
        .sort();
        
      setAvailableTimes(times);
      form.setValue("appointmentTime", ""); // Reset time when date changes
    }
  }, [selectedDate, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Create a verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const bookingData = {
        ...values,
        appointmentDate: format(values.appointmentDate, 'yyyy-MM-dd'),
        language: i18n.language || 'en',
        status: 'confirmed', // Set to confirmed immediately
        verificationToken,
      };

      // Send to backend API which handles Firestore and Google Calendar
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const result = await response.json();
      
      // Redirect directly to the success state of the verify page
      navigate(`/verify?id=${result.id}&token=${verificationToken}&action=confirm`);
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      const message = error instanceof Error ? error.message : "There was an error submitting your booking. Please try again or call us.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t('book.title')}</h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('book.form.name')} *</Label>
                    <Input id="fullName" {...form.register("fullName")} className="bg-background" />
                    {form.formState.errors.fullName && <p className="text-destructive text-sm">{form.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('book.form.phone')} *</Label>
                    <Input id="phone" type="tel" {...form.register("phone")} className="bg-background" />
                    {form.formState.errors.phone && <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">{t('book.form.email')} *</Label>
                    <Input id="email" type="email" {...form.register("email")} className="bg-background" />
                    {form.formState.errors.email && <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border pb-2">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">{t('book.form.vehicleYear')} *</Label>
                    <Input id="vehicleYear" {...form.register("vehicleYear")} className="bg-background" />
                    {form.formState.errors.vehicleYear && <p className="text-destructive text-sm">{form.formState.errors.vehicleYear.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">{t('book.form.vehicleMake')} *</Label>
                    <Input id="vehicleMake" {...form.register("vehicleMake")} className="bg-background" />
                    {form.formState.errors.vehicleMake && <p className="text-destructive text-sm">{form.formState.errors.vehicleMake.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">{t('book.form.vehicleModel')} *</Label>
                    <Input id="vehicleModel" {...form.register("vehicleModel")} className="bg-background" />
                    {form.formState.errors.vehicleModel && <p className="text-destructive text-sm">{form.formState.errors.vehicleModel.message}</p>}
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-border pb-2">Appointment Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceName">{t('book.form.service')} *</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("serviceName", value)} 
                    value={form.watch("serviceName") || ""}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesList.map((service) => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.serviceName && <p className="text-destructive text-sm">{form.formState.errors.serviceName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <Label>{t('book.form.date')} *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => form.setValue("appointmentDate", date as Date)}
                          disabled={(date) => {
                            // Disable past dates and Sundays
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || date.getDay() === 0;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.appointmentDate && <p className="text-destructive text-sm">{form.formState.errors.appointmentDate.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>{t('book.form.time')} *</Label>
                    <Select 
                      disabled={!selectedDate || availableTimes.length === 0}
                      onValueChange={(value) => form.setValue("appointmentTime", value)}
                      value={form.watch("appointmentTime") || ""}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={!selectedDate ? "Select date first" : availableTimes.length === 0 ? "No slots available" : "Select time"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.appointmentTime && <p className="text-destructive text-sm">{form.formState.errors.appointmentTime.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('book.form.notes')}</Label>
                  <Textarea 
                    id="notes" 
                    {...form.register("notes")} 
                    className="bg-background min-h-[100px]" 
                    placeholder="Any specific issues or details we should know about?"
                  />
                </div>
              </div>

              <div className="pt-4">
                {submitError && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
                    {submitError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    t('book.form.submit')
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  By booking, you agree to our <Link to="/terms" className="underline">Booking Terms</Link>.
                  <br />
                  <span className="text-primary font-medium">Testing Mode: Appointments are automatically confirmed.</span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
