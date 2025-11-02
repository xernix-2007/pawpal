import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { PetServices, Appointments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface BookingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  petName: string;
  serviceType: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export default function BookingPage() {
  const [services, setServices] = useState<PetServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingForm>();

  const selectedServiceType = watch('serviceType');
  const selectedServiceName = watch('serviceName');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { items } = await BaseCrudService.getAll<PetServices>('petservices');
        setServices(items);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Check for URL parameters to pre-select service
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const typeParam = urlParams.get('type');
    
    if (serviceParam) setValue('serviceName', serviceParam);
    if (typeParam) setValue('serviceType', typeParam);
  }, [setValue]);

  const filteredServices = services.filter(service => 
    !selectedServiceType || service.serviceType === selectedServiceType
  );

  const serviceTypes = [...new Set(services.map(service => service.serviceType))].filter(Boolean);

  const onSubmit = async (data: BookingForm) => {
    setSubmitting(true);
    try {
      const appointmentData: Appointments = {
        _id: crypto.randomUUID(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        petName: data.petName,
        serviceType: data.serviceType,
        serviceName: data.serviceName,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes,
        status: 'pending'
      };

      await BaseCrudService.create('appointments', appointmentData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('There was an error booking your appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="w-full max-w-[120rem] mx-auto px-6 py-6 flex justify-between items-center bg-primary">
          <div className="font-heading text-2xl text-primary-foreground">
            PawPal
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground hover:text-soft-accent transition-colors">
              Home
            </Link>
            <Link to="/services" className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground hover:text-soft-accent transition-colors">
              Services
            </Link>
            <Link to="/testimonials" className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground hover:text-soft-accent transition-colors">
              Reviews
            </Link>
          </div>
        </nav>

        {/* Success Message */}
        <section className="w-full max-w-[100rem] mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-paragraph text-4xl font-bold uppercase tracking-wider text-primary mb-4">
              Booking Confirmed!
            </h1>
            <p className="font-paragraph text-lg text-secondary-foreground mb-8">
              Thank you for choosing PawPal! We've received your appointment request and will contact you shortly to confirm the details.
            </p>
            <div className="bg-card-background rounded-lg p-8 mb-8">
              <h2 className="font-paragraph text-xl font-bold text-primary mb-4">What's Next?</h2>
              <ul className="font-paragraph text-secondary-foreground space-y-2 text-left">
                <li>• You'll receive a confirmation email within 24 hours</li>
                <li>• Our team will contact you to finalize appointment details</li>
                <li>• Prepare any questions you'd like to ask during your visit</li>
                <li>• We'll send you a reminder before your appointment</li>
              </ul>
            </div>
            <div className="space-x-4">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/">Return Home</Link>
              </Button>
              <Button asChild variant="outline" className="border-button-border text-primary hover:bg-button-border">
                <Link to="/services">Browse More Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-paragraph text-primary">Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="w-full max-w-[120rem] mx-auto px-6 py-6 flex justify-between items-center bg-primary">
        <div className="font-heading text-2xl text-primary-foreground">
          PawPal
        </div>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground hover:text-soft-accent transition-colors">
            Home
          </Link>
          <Link to="/services" className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground hover:text-soft-accent transition-colors">
            Services
          </Link>
          <Link to="/testimonials" className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground hover:text-soft-accent transition-colors">
            Reviews
          </Link>
          <Link to="/booking" className="font-paragraph text-sm uppercase tracking-wider text-soft-accent">
            Book Now
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="w-full bg-primary py-16">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex items-center mb-8">
            <Button asChild variant="ghost" className="text-primary-foreground hover:text-soft-accent mr-4">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="font-paragraph text-5xl md:text-6xl font-bold uppercase tracking-wider text-primary-foreground mb-4">
              Book a Service
            </h1>
            <p className="font-paragraph text-lg text-soft-accent max-w-2xl mx-auto">
              Schedule professional care for your beloved pet. Fill out the form below and we'll contact you to confirm your appointment.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="w-full max-w-[100rem] mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <Card className="bg-card-background border-shape-stroke/20">
                <CardHeader>
                  <CardTitle className="font-paragraph text-xl font-bold text-primary flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Your Information
                  </CardTitle>
                  <CardDescription className="font-paragraph text-secondary-foreground">
                    Tell us about yourself so we can contact you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="font-paragraph text-primary">Full Name *</Label>
                    <Input 
                      id="customerName"
                      {...register('customerName', { required: 'Name is required' })}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customerEmail" className="font-paragraph text-primary">Email Address *</Label>
                    <Input 
                      id="customerEmail"
                      type="email"
                      {...register('customerEmail', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="mt-1"
                      placeholder="Enter your email"
                    />
                    {errors.customerEmail && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customerPhone" className="font-paragraph text-primary">Phone Number *</Label>
                    <Input 
                      id="customerPhone"
                      type="tel"
                      {...register('customerPhone', { required: 'Phone number is required' })}
                      className="mt-1"
                      placeholder="Enter your phone number"
                    />
                    {errors.customerPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="petName" className="font-paragraph text-primary">Pet's Name *</Label>
                    <Input 
                      id="petName"
                      {...register('petName', { required: 'Pet name is required' })}
                      className="mt-1"
                      placeholder="Enter your pet's name"
                    />
                    {errors.petName && (
                      <p className="text-sm text-red-500 mt-1">{errors.petName.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Selection */}
              <Card className="bg-card-background border-shape-stroke/20">
                <CardHeader>
                  <CardTitle className="font-paragraph text-xl font-bold text-primary flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Service Details
                  </CardTitle>
                  <CardDescription className="font-paragraph text-secondary-foreground">
                    Choose the service your pet needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="serviceType" className="font-paragraph text-primary">Service Type *</Label>
                    <Select onValueChange={(value) => setValue('serviceType', value)} value={selectedServiceType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type!}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceType && (
                      <p className="text-sm text-red-500 mt-1">{errors.serviceType.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="serviceName" className="font-paragraph text-primary">Specific Service *</Label>
                    <Select 
                      onValueChange={(value) => setValue('serviceName', value)} 
                      value={selectedServiceName}
                      disabled={!selectedServiceType}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select specific service" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredServices.map((service) => (
                          <SelectItem key={service._id} value={service.serviceName!}>
                            {service.serviceName} {service.price && `- $${service.price}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceName && (
                      <p className="text-sm text-red-500 mt-1">{errors.serviceName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="appointmentDate" className="font-paragraph text-primary">Preferred Date *</Label>
                    <Input 
                      id="appointmentDate"
                      type="date"
                      {...register('appointmentDate', { required: 'Date is required' })}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.appointmentDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.appointmentDate.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="appointmentTime" className="font-paragraph text-primary">Preferred Time *</Label>
                    <Select onValueChange={(value) => setValue('appointmentTime', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.appointmentTime && (
                      <p className="text-sm text-red-500 mt-1">{errors.appointmentTime.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Notes */}
            <Card className="bg-card-background border-shape-stroke/20">
              <CardHeader>
                <CardTitle className="font-paragraph text-xl font-bold text-primary">Additional Information</CardTitle>
                <CardDescription className="font-paragraph text-secondary-foreground">
                  Any special requests or information about your pet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  {...register('notes')}
                  placeholder="Tell us anything special about your pet or any specific requests..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                disabled={submitting}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-xl px-12 py-6"
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </Button>
              <p className="font-paragraph text-sm text-secondary-foreground mt-4">
                We'll contact you within 24 hours to confirm your appointment details.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-primary py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading text-2xl text-primary-foreground mb-4">PawPal</h3>
              <p className="font-paragraph text-soft-accent">
                Connecting loving pet owners with trusted care professionals.
              </p>
            </div>
            <div>
              <h4 className="font-paragraph font-semibold text-primary-foreground mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/services" className="font-paragraph text-soft-accent hover:text-primary-foreground transition-colors">Veterinary Care</Link></li>
                <li><Link to="/services" className="font-paragraph text-soft-accent hover:text-primary-foreground transition-colors">Pet Grooming</Link></li>
                <li><Link to="/services" className="font-paragraph text-soft-accent hover:text-primary-foreground transition-colors">Pet Sitting</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-paragraph font-semibold text-primary-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/testimonials" className="font-paragraph text-soft-accent hover:text-primary-foreground transition-colors">Testimonials</Link></li>
                <li><Link to="/booking" className="font-paragraph text-soft-accent hover:text-primary-foreground transition-colors">Book Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-paragraph font-semibold text-primary-foreground mb-4">Contact</h4>
              <p className="font-paragraph text-soft-accent">
                Ready to give your pet the care they deserve?
              </p>
              <Button asChild className="mt-4 bg-transparent border border-button-border text-primary-foreground hover:bg-button-border hover:text-primary">
                <Link to="/booking">Get Started</Link>
              </Button>
            </div>
          </div>
          <div className="border-t border-soft-accent/20 mt-8 pt-8 text-center">
            <p className="font-paragraph text-soft-accent">
              © 2024 PawPal. Caring for pets with love and expertise.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
