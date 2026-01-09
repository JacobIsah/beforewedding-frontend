import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import { AssessmentCompletionModal } from '../components/AssessmentCompletionModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://3.107.197.17/api';

interface AssessmentProps {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  partnerCompleted: boolean;
  onNavigateBack: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToCompatibilityTest: () => void;
}

interface Question {
  id: string;
  category: string;
  type: string;
  question_text: string;
  options?: string[];
  order: number;
  part: string;
  // Scale question fields
  min_value?: number;
  max_value?: number;
  min_label?: string;
  max_label?: string;
}

interface QuestionResponse {
  question: Question;
  current_index: number;
  total_questions: number;
  previous_answer: string | null;
}

export function Assessment({ 
  categoryId,
  categoryName, 
  categoryColor, 
  partnerCompleted, 
  onNavigateBack, 
  onNavigateToDashboard, 
  onNavigateToCompatibilityTest 
}: AssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [previousAnswer, setPreviousAnswer] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token
  const getAuthToken = () => localStorage.getItem('access_token');

  // Convert option index to letter (0=A, 1=B, 2=C, 3=D)
  const indexToLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
  };

  // Convert letter to index (A=0, B=1, C=2, D=3)
  const letterToIndex = (letter: string): number => {
    return letter.charCodeAt(0) - 65;
  };

  // Start assessment session
  const startAssessment = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/assessments/start/${categoryId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start assessment');
      }

      // After starting, fetch the first question
      await fetchCurrentQuestion();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start assessment');
      setLoading(false);
    }
  };

  // Fetch current question
  const fetchCurrentQuestion = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/assessments/question/${categoryId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch question');
      }

      const data: QuestionResponse = await response.json();
      
      setCurrentQuestion(data.question);
      setCurrentIndex(data.current_index);
      setTotalQuestions(data.total_questions);
      setPreviousAnswer(data.previous_answer);
      
      // If there's a previous answer, pre-select it based on question type
      if (data.previous_answer) {
        if (data.question.type === 'open_text') {
          setTextAnswer(data.previous_answer);
          setSelectedAnswer(null);
        } else if (data.question.type === 'scale') {
          setSelectedAnswer(parseInt(data.previous_answer, 10));
          setTextAnswer('');
        } else {
          setSelectedAnswer(letterToIndex(data.previous_answer));
          setTextAnswer('');
        }
      } else {
        setSelectedAnswer(null);
        setTextAnswer('');
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch question');
      setLoading(false);
    }
  };

  // Submit answer
  const submitAnswer = async (): Promise<boolean> => {
    // Validate based on question type
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'open_text') {
      if (!textAnswer.trim()) return false;
    } else {
      if (selectedAnswer === null) return false;
    }

    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated. Please log in.');
      return false;
    }

    setSubmitting(true);

    try {
      // Build answer payload based on question type
      let answerPayload;
      if (currentQuestion.type === 'open_text') {
        answerPayload = {
          question_id: currentQuestion.id,
          answer_text: textAnswer.trim(),
          answer_choice: '',
        };
      } else if (currentQuestion.type === 'scale') {
        answerPayload = {
          question_id: currentQuestion.id,
          answer_text: String(selectedAnswer),
          answer_choice: String(selectedAnswer),
        };
      } else {
        answerPayload = {
          question_id: currentQuestion.id,
          answer_text: currentQuestion.options?.[selectedAnswer!] || '',
          answer_choice: indexToLetter(selectedAnswer!),
        };
      }

      const response = await fetch(`${API_BASE_URL}/assessments/respond/${categoryId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerPayload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit answer');
      }

      const data = await response.json();
      
      setSubmitting(false);
      
      // Check if assessment is complete
      if (data.is_complete) {
        await completeAssessment();
        return true;
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
      setSubmitting(false);
      return false;
    }
  };

  // Complete assessment
  const completeAssessment = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/assessments/complete/${categoryId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setShowCompletionModal(true);
    } catch (err) {
      console.error('Failed to complete assessment:', err);
      // Still show completion modal even if API call fails
      setShowCompletionModal(true);
    }
  };

  // Initialize assessment on mount
  useEffect(() => {
    startAssessment();
  }, [categoryId]);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowWarning(false);
  };

  const handleNext = async () => {
    // Validate based on question type
    if (currentQuestion?.type === 'open_text') {
      if (!textAnswer.trim()) {
        setShowWarning(true);
        return;
      }
    } else if (selectedAnswer === null) {
      setShowWarning(true);
      return;
    }

    const success = await submitAnswer();
    if (success) {
      // Fetch next question
      setLoading(true);
      await fetchCurrentQuestion();
    }
  };

  const handlePrevious = async () => {
    // For now, just go back - the API should handle returning the previous question
    // This might need adjustment based on how the API handles navigation
    if (currentIndex > 0) {
      setLoading(true);
      await fetchCurrentQuestion();
    }
  };

  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 text-lg mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onNavigateBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Go Back
            </button>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                startAssessment();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">No questions available for this category.</p>
          <button 
            onClick={onNavigateBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onNavigateBack}
            className="text-blue-100 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl mb-2">{categoryName}</h1>
          <p className="text-blue-100">Question {currentIndex + 1} of {totalQuestions}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 lg:p-12">
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 ${categoryColor} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                  {currentIndex + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl text-gray-900">
                    {currentQuestion.question_text}
                  </h2>
                  {currentQuestion.part && (
                    <p className="text-sm text-gray-500 mt-1">Part {currentQuestion.part}</p>
                  )}
                </div>
              </div>

              {showWarning && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-amber-900">Please select an answer</div>
                    <div className="text-sm text-amber-700">You must choose an option before continuing.</div>
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === 'open_text' ? (
                  // Open text question UI
                  <div>
                    <textarea
                      value={textAnswer}
                      onChange={(e) => {
                        setTextAnswer(e.target.value);
                        setShowWarning(false);
                      }}
                      disabled={submitting}
                      placeholder="Type your answer here..."
                      rows={6}
                      className={`w-full p-4 rounded-xl border-2 transition-all resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        textAnswer.trim()
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <div className="flex justify-end mt-2 text-sm text-gray-500">
                      {textAnswer.length} characters
                    </div>
                  </div>
                ) : currentQuestion.type === 'scale' ? (
                  // Scale question UI
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>{currentQuestion.min_label}</span>
                      <span>{currentQuestion.max_label}</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {Array.from(
                        { length: (currentQuestion.max_value || 5) - (currentQuestion.min_value || 1) + 1 },
                        (_, i) => (currentQuestion.min_value || 1) + i
                      ).map((value) => {
                        const isSelected = selectedAnswer === value;
                        return (
                          <button
                            key={value}
                            onClick={() => handleAnswerSelect(value)}
                            disabled={submitting}
                            className={`w-14 h-14 rounded-xl border-2 font-semibold text-lg transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                            } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{currentQuestion.min_value}</span>
                      <span>{currentQuestion.max_value}</span>
                    </div>
                  </div>
                ) : (
                  // Multiple choice question UI
                  currentQuestion.options?.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const optionLetter = indexToLetter(index);
                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={submitting}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-medium ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 text-gray-500'
                            }`}
                          >
                            {optionLetter}
                          </div>
                          <span className={`${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                onClick={onNavigateBack}
                disabled={submitting}
                className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors text-blue-600 hover:bg-blue-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Exit
              </button>

              <div className="text-sm text-gray-600">
                Question {currentIndex + 1} of {totalQuestions}
              </div>

              <button
                onClick={handleNext}
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : isLastQuestion ? (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Assessment
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <AssessmentCompletionModal 
          categoryName={categoryName}
          partnerCompleted={partnerCompleted}
          onNavigateToDashboard={onNavigateToDashboard}
          onNavigateToCompatibilityTest={onNavigateToCompatibilityTest}
        />
      )}
    </div>
  );
}
