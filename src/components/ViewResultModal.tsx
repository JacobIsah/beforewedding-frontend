import { X, CheckCircle, AlertTriangle, TrendingUp, User, Users, Loader2, BookOpen } from 'lucide-react';

// API Response type for couple results
interface CoupleResultResponse {
  result: {
    id: number;
    couple: number;
    category: string;
    score: number;
    compatibility_score: number;
    emotional_score: number;
    attempt_count: number;
    is_complete: boolean;
    insights: {
      strengths: string[];
      areas_to_improve: string[];
      recommendations: string[];
    };
    created_at: string;
    updated_at: string;
  };
  status: string;
  attempt: number;
  can_retake: boolean;
  escalation_available: boolean;
  recommended_resources: {
    id: number;
    title: string;
    type: string;
    category: string;
    url: string;
  }[];
}

interface AssessmentCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  attempts: number;
  score: number | null;
  userCompleted: boolean;
  partnerCompleted: boolean;
  lastTaken: string | null;
}

interface ViewResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AssessmentCategory;
  result?: CoupleResultResponse | null;
  loading?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'from-green-500 to-green-600';
  if (score >= 60) return 'from-blue-500 to-blue-600';
  if (score >= 40) return 'from-amber-500 to-amber-600';
  return 'from-red-500 to-red-600';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Needs Discussion';
  return 'Significant Differences';
};

export function ViewResultModal({
  isOpen,
  onClose,
  category,
  result,
  loading = false
}: ViewResultModalProps) {
  if (!isOpen) return null;

  // Use API result data or fallback values
  const score = result?.result?.compatibility_score ?? category.score ?? 0;
  const emotionalScore = result?.result?.emotional_score ?? 0;
  const overallScore = result?.result?.score ?? score;
  const insights = result?.result?.insights;
  const recommendedResources = result?.recommended_resources ?? [];
  const canRetake = result?.can_retake ?? true;
  const attemptCount = result?.attempt ?? category.attempts;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">{category.name}</h2>
            <p className="text-gray-600">Compatibility Assessment Results • Attempt #{attemptCount}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading results...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Score Overview */}
            <div className={`bg-gradient-to-br ${getScoreBgColor(score)} rounded-xl p-8 text-white text-center`}>
              <div className="text-sm mb-2">Compatibility Score</div>
              <div className="flex items-end justify-center gap-2 mb-2">
                <div className="text-6xl">{Math.round(score)}</div>
                <div className="text-3xl mb-3">%</div>
              </div>
              <div className="text-lg">{getScoreLabel(score)}</div>
              
              {/* Additional Scores */}
              {result?.result && (
                <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-white/30">
                  <div>
                    <div className="text-2xl font-semibold">{Math.round(overallScore)}%</div>
                    <div className="text-sm opacity-80">Overall Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">{Math.round(emotionalScore)}%</div>
                    <div className="text-sm opacity-80">Emotional Score</div>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {insights?.strengths && insights.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl text-gray-900">Strengths</h3>
                </div>
                <div className="space-y-3">
                  {insights.strengths.map((strength, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Areas to Improve */}
            {insights?.areas_to_improve && insights.areas_to_improve.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl text-gray-900">Areas to Improve</h3>
                </div>
                <div className="space-y-3">
                  {insights.areas_to_improve.map((area, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insights?.recommendations && insights.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl text-gray-900">Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Resources */}
            {recommendedResources.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl text-gray-900">Recommended Resources</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {recommendedResources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{resource.title}</p>
                          <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* No Data Fallback */}
            {!insights && !loading && (
              <div className="text-center py-8 text-gray-500">
                <p>Detailed insights are not available for this assessment.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {canRetake && (
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Retake Assessment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}