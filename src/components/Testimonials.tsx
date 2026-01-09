import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah & Michael",
    location: "New York, NY",
    text: "DuringCourtship helped us have conversations we never would have had on our own. The AI insights were spot-on and gave us the confidence to move forward.",
    rating: 5
  },
  {
    name: "Jessica & David",
    location: "Austin, TX",
    text: "We thought we knew everything about each other, but the assessments revealed areas we hadn't fully explored. The counselor marketplace was a game-changer when we needed extra support.",
    rating: 5
  },
  {
    name: "Amanda & Chris",
    location: "Seattle, WA",
    text: "The platform made tough conversations feel approachable and even fun. We loved tracking our progress and seeing our compatibility scores improve over time.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl text-gray-900 mb-4">
            Loved by Couples Everywhere
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of couples who have strengthened their relationships with DuringCourtship.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-purple-200" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <div className="text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
