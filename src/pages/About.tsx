import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Star } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const reviews = [
    { name: "Alain B.", text: "Jerry and his team are incredibly honest and efficient. They found the issue quickly and charged a very fair price. Best mechanic in L'Île-Perrot.", rating: 5 },
    { name: "Sylvie M.", text: "Excellent service! I've been going to Jerry's for years. You can completely trust them with your vehicle. Highly recommend.", rating: 5 },
    { name: "Michel G.", text: "Very professional and friendly. They don't try to sell you repairs you don't need. Fast, reliable, and reasonably priced.", rating: 5 },
    { name: "Linda T.", text: "Saved me when my car broke down on the highway. They fit me in right away and had me back on the road the same day. Great family business.", rating: 5 },
    { name: "Pierre C.", text: "Honest, fast, and reliable. Jerry always explains what needs to be done without any pressure. The only garage I trust my car with.", rating: 5 }
  ];

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8">About Our<br/><span className="text-primary">Garage</span></h1>
            <div className="w-32 h-2 bg-primary mb-10 rounded-full"></div>
            
            <div className="space-y-6 text-xl text-foreground/90 leading-relaxed">
              <p>
                At Jerry Service Garage, we believe in honest service, fair pricing, and dependable work. Most of our customers come to us through word of mouth and local trust, and we truly value the relationships we build with every visit.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-secondary rounded-3xl transform translate-x-4 translate-y-4 border-2 border-foreground"></div>
            <img 
              src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&q=80&w=800" 
              alt="Jerry Service Garage Team" 
              className="relative rounded-3xl shadow-xl object-cover w-full h-auto border-2 border-foreground grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-secondary text-secondary-foreground rounded-3xl p-10 md:p-16 mb-24 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(23,33,41,1)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">Honesty</h3>
              <p className="text-foreground/90 text-lg">We only recommend the services your vehicle truly needs. No hidden fees, no unnecessary upsells.</p>
            </div>
            <div className="border-y-2 md:border-y-0 md:border-x-2 border-foreground/20 py-8 md:py-0">
              <h3 className="text-3xl font-bold mb-4 text-foreground">Quality</h3>
              <p className="text-foreground/90 text-lg">We use premium parts and employ certified technicians to ensure every repair meets our high standards.</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">Community</h3>
              <p className="text-foreground/90 text-lg">Proudly serving Île-Perrot and surrounding areas. We're your neighbors, and we treat you like family.</p>
            </div>
          </div>
        </div>

        {/* More Reviews */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">{t('reviews.title')}</h2>
            <div className="w-32 h-2 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-card border-2 border-foreground hover:shadow-[8px_8px_0px_0px_rgba(23,33,41,1)] transition-shadow duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6 text-[#EAB308]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xl mb-8 text-foreground/90 leading-relaxed">"{review.text}"</p>
                  <p className="font-bold text-foreground text-lg uppercase tracking-wider">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
