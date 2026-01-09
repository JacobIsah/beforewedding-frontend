import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, X } from 'lucide-react';

const questions = [
  {
    id: 1,
    category: "Communication",
    question: "How often do you prefer to have deep, meaningful conversations?",
    options: ["Daily", "Few times a week", "Weekly", "Occasionally"]
  },
  {
    id: 2,
    category: "Communication",
    question: "When conflicts arise, what's your preferred approach?",
    options: ["Discuss immediately", "Take time to cool off first", "Write out thoughts", "Seek third-party help"]
  },
  {
    id: 3,
    category: "Communication",
    question: "How do you prefer to express affection?",
    options: ["Words of affirmation", "Quality time", "Physical touch", "Acts of service"]
  }
];

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'partner1' | 'partner2' | 'results'>('intro');
  const [partner1Answers, setPartner1Answers] = useState<number[]>([]);
  const [partner2Answers, setPartner2Answers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Reset demo when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep('intro');
        setPartner1Answers([]);
        setPartner2Answers([]);
        setCurrentQuestion(0);
        setShowScore(false);
      }, 300);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAnswer = (answerIndex: number) => {
    if (currentStep === 'partner1') {
      const newAnswers = [...partner1Answers, answerIndex];
      setPartner1Answers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
      } else {
        setTimeout(() => {
          setCurrentStep('partner2');
          setCurrentQuestion(0);
        }, 500);
      }
    } else if (currentStep === 'partner2') {
      const newAnswers = [...partner2Answers, answerIndex];
      setPartner2Answers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
      } else {
        setTimeout(() => {
          setCurrentStep('results');
          setTimeout(() => setShowScore(true), 500);
        }, 500);
      }
    }
  };

  const calculateScore = () => {
    let matches = 0;
    for (let i = 0; i < questions.length; i++) {
      if (partner1Answers[i] === partner2Answers[i]) {
        matches++;
      }
    }
    return Math.round((matches / questions.length) * 100);
  };

  const resetDemo = () => {
    setCurrentStep('intro');
    setPartner1Answers([]);
    setPartner2Answers([]);
    setCurrentQuestion(0);
    setShowScore(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[slideUp_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Intro Screen */}
        {currentStep === 'intro' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-4">Communication Assessment Demo</h3>
            <p className="text-gray-600 mb-8">
              You'll answer 3 sample questions as Partner 1, then as Partner 2. 
              At the end, see how your answers compare and receive a compatibility score.
            </p>
            <button
              onClick={() => setCurrentStep('partner1')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Partner 1 & 2 Questions */}
        {(currentStep === 'partner1' || currentStep === 'partner2') && (
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {currentStep === 'partner1' ? 'Partner 1' : 'Partner 2'}
                </span>
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h4 className="text-xl lg:text-2xl text-gray-900 mb-2">
                {questions[currentQuestion].question}
              </h4>
              <p className="text-sm text-gray-500">
                Category: {questions[currentQuestion].category}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Circle className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Screen */}
        {currentStep === 'results' && (
          <div className="p-12">
            <div className="text-center mb-8">
              {showScore && (
                <div className="animate-[fadeIn_0.5s_ease-in]">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-6">
                    <span className="text-5xl text-white">
                      {calculateScore()}%
                    </span>
                  </div>
                  <h3 className="text-3xl text-gray-900 mb-3">
                    Your Compatibility Score
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Great start! You matched on {partner1Answers.filter((ans, i) => ans === partner2Answers[i]).length} out of {questions.length} questions.
                  </p>
                </div>
              )}
            </div>

            {/* AI Insights Preview */}
            {showScore && (
              <div className="space-y-4 mb-8 animate-[fadeIn_0.5s_ease-in_0.3s_both]">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-green-900 mb-1">Where You&apos;re in Sync</h4>
                      <p className="text-sm text-green-700">
                        You both value regular, meaningful communication and share similar approaches to expressing affection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-amber-900 mb-1">Great Discussion Starter</h4>
                      <p className="text-sm text-amber-700">
                        You have different conflict resolution styles. This is a perfect topic to explore together to understand each other better.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={resetDemo}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Demo Note */}
        <p className="text-center text-sm text-gray-500 pb-6 px-6">
          This is a simplified demo. The full assessment includes many more questions across multiple categories.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
