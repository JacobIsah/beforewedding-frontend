import { Brain, BarChart3, BookOpen, Shield, MessageCircle, Calendar } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced sentiment and thematic analysis of your responses to provide deeper understanding of your relationship dynamics."
  },
  {
    icon: BarChart3,
    title: "Compatibility Scoring",
    description: "Get clear, measurable compatibility scores for each assessment category to track your relationship strengths."
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description: "Access tailored books, articles, and materials specific to your relationship challenges and growth areas."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security. Your relationship insights remain completely confidential."
  },
  {
    icon: MessageCircle,
    title: "Discussion Starters",
    description: "Receive thoughtful conversation prompts based on your assessment results to facilitate meaningful dialogue."
  },
  {
    icon: Calendar,
    title: "Expert Counselors",
    description: "Book sessions with vetted marriage counselors directly through the platform when you need professional guidance."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl text-gray-900 mb-4">
            Everything You Need for a Strong Foundation
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive tools and support to guide you through courtship with confidence and clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}