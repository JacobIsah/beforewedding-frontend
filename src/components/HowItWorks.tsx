import { UserPlus, ClipboardList, TrendingUp, Users, Check } from 'lucide-react';

const phases = [
  {
    phase: "Phase 1",
    title: "Joining and Connecting",
    icon: UserPlus,
    description: "Create your account, invite your partner, and become a couple on the platform.",
    steps: [
      "One user creates a secure account",
      "Send a unique invitation link to your partner",
      "Both accounts link into a single 'couple' entity",
      "Access your shared Main Dashboard to track progress"
    ],
    color: "purple"
  },
  {
    phase: "Phase 2",
    title: "Compatibility Assessments",
    icon: ClipboardList,
    description: "Take fun, insightful assessments to understand your relationship's strengths and areas for growth.",
    steps: [
      "Choose from various assessment categories (Communication, Finances, Family Values, etc.)",
      "Both partners answer independently with multiple-choice and open-ended questions",
      "Receive a compatibility score (0-100%) for each category",
      "Get AI-powered insights highlighting where you're in sync and great discussion topics"
    ],
    color: "blue"
  },
  {
    phase: "Phase 3",
    title: "What to Do Next",
    icon: TrendingUp,
    description: "Get personalized recommendations based on your assessment results.",
    steps: [
      "Below 100% (1st attempt): Receive curated resources (books, articles) specific to your challenges",
      "Retake assessments after reviewing resources",
      "Below 100% (2nd attempt): Access professional counseling recommendations",
      "Track your improvement over time on your dashboard"
    ],
    color: "amber"
  },
  {
    phase: "Phase 4",
    title: "Professional Support",
    icon: Users,
    description: "Connect with vetted marriage counselors when you need expert guidance.",
    steps: [
      "Browse a directory of vetted marriage counselors",
      "Filter by specialty, availability, and price",
      "Review detailed profiles, qualifications, and calendars",
      "Book and pay securely for online consultations"
    ],
    color: "green"
  }
];

const colorMap = {
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    checkIcon: "text-purple-600"
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    checkIcon: "text-blue-600"
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    checkIcon: "text-amber-600"
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    badge: "bg-green-100 text-green-700",
    checkIcon: "text-green-600"
  }
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl text-gray-900 mb-4">
            How DuringCourtship Works
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive, step-by-step journey designed to strengthen your relationship 
            and prepare you for a successful marriage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const colors = colorMap[phase.color as keyof typeof colorMap];
            
            return (
              <div 
                key={index}
                className={`${colors.bg} rounded-2xl p-8 lg:p-10`}
              >
                {/* Header with Icon and Title side by side */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`flex-shrink-0 w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 ${colors.badge} rounded-full text-sm mb-2`}>
                      {phase.phase}
                    </div>
                    <h3 className="text-2xl text-gray-900 mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-gray-600">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Steps with check icons */}
                <div className="space-y-3 mt-6">
                  {phase.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-3">
                      <Check className={`flex-shrink-0 w-5 h-5 mt-0.5 ${colors.checkIcon}`} />
                      <p className="text-gray-700 flex-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}