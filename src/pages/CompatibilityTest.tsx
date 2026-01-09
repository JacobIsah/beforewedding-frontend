import { FileText, Library, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ViewResultModal } from '../components/ViewResultModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.107.197.17/api';

interface CompatibilityTestProps {
  currentPage: string;
  onNavigateToDashboard: () => void;
  onNavigateToMaterials: (category?: string) => void;
  onNavigateToCompatibilityTest: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToAccount: () => void;
  onNavigateToHelp: () => void;
  onLogout: () => void;
  onNavigateToAssessment: (categoryId: string, category: string, color: string, partnerCompleted: boolean) => void;
}

// API Response Types
interface CategoryApiResponse {
  id: string;
  name: string;
  description: string;
  progress: number;
  is_complete: boolean;
}

interface PartnerStatusResponse {
  category: string;
  user_status: {
    started: boolean;
    is_complete: boolean;
    progress: number;
  };
  partner_status: {
    started: boolean;
    is_complete: boolean;
  };
  both_complete: boolean;
  can_view_results: boolean;
}

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

// Internal category type used by the component
interface AssessmentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  attempts: number;
  score: number | null;
  userCompleted: boolean;
  partnerCompleted: boolean;
  lastTaken: string | null;
}

// Color mapping for categories
const categoryColorMap: Record<string, string> = {
  'communication': 'bg-blue-500',
  'finances': 'bg-green-500',
  'children': 'bg-amber-500',
  'intimacy': 'bg-pink-500',
  'values': 'bg-purple-500',
  'family': 'bg-indigo-500',
  'career': 'bg-teal-500',
  'household': 'bg-orange-500',
  'health': 'bg-rose-500',
  'social': 'bg-cyan-500',
};

export function CompatibilityTest({ currentPage, onNavigateToDashboard, onNavigateToMaterials, onNavigateToCompatibilityTest, onNavigateToNotifications, onNavigateToAccount, onNavigateToHelp, onLogout, onNavigateToAssessment }: CompatibilityTestProps) {
  const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory | null>(null);
  const [selectedCategoryResult, setSelectedCategoryResult] = useState<CoupleResultResponse | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access_token') || '';
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/assessments/categories/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data: CategoryApiResponse[] = await response.json();
      
      // Fetch partner status for each category to get complete data
      const categoriesWithStatus = await Promise.all(
        data.map(async (cat) => {
          const partnerStatus = await fetchPartnerStatus(cat.id);
          
          // Check if both partners have completed - use both_complete OR check both is_complete flags
          const bothComplete = partnerStatus?.both_complete || 
            (partnerStatus?.user_status?.is_complete && partnerStatus?.partner_status?.is_complete);
          
          const coupleResult = bothComplete 
            ? await fetchCoupleResult(cat.id) 
            : null;
          
          return {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: categoryColorMap[cat.id] || 'bg-gray-500',
            attempts: coupleResult?.attempt || (cat.progress > 0 ? 1 : 0),
            // Use compatibility_score if available, fall back to score
            score: bothComplete ? (coupleResult?.result?.compatibility_score ?? coupleResult?.result?.score ?? null) : null,
            userCompleted: partnerStatus?.user_status?.is_complete ?? cat.is_complete,
            partnerCompleted: partnerStatus?.partner_status?.is_complete ?? false,
            lastTaken: coupleResult?.result?.updated_at 
              ? new Date(coupleResult.result.updated_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })
              : null,
          };
        })
      );

      setAssessmentCategories(categoriesWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerStatus = async (categoryId: string): Promise<PartnerStatusResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/partner-status/${categoryId}/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.error(`Error fetching partner status for ${categoryId}:`, err);
      return null;
    }
  };

  const fetchCoupleResult = async (categoryId: string): Promise<CoupleResultResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assessments/couple-results/${categoryId}/`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.error(`Error fetching couple result for ${categoryId}:`, err);
      return null;
    }
  };

  const totalAttempts = assessmentCategories.reduce((sum, cat) => sum + cat.attempts, 0);
  const completedTopics = assessmentCategories.filter(c => c.score !== null).length;

  const handleTakeAssessment = (categoryId: string, categoryName: string, categoryColor: string, partnerCompleted: boolean) => {
    onNavigateToAssessment(categoryId, categoryName, categoryColor, partnerCompleted);
  };

  const handleViewMaterials = (categoryName: string) => {
    onNavigateToMaterials(categoryName);
  };

  const handleViewResult = async (category: AssessmentCategory) => {
    setSelectedCategory(category);
    setLoadingResult(true);
    setShowResultModal(true);

    try {
      const result = await fetchCoupleResult(category.id);
      setSelectedCategoryResult(result);
    } catch (err) {
      console.error('Error fetching result:', err);
    } finally {
      setLoadingResult(false);
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    setSelectedCategory(null);
    setSelectedCategoryResult(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assessments</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onNavigateToDashboard}
            className="text-blue-100 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl mb-2">Compatibility Assessments</h1>
          <p className="text-blue-100">
            Track your progress across all relationship dimensions
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">{totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">{completedTopics}</div>
                <div className="text-sm text-gray-600">Completed Topics</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">{assessmentCategories.length - completedTopics}</div>
                <div className="text-sm text-gray-600">Pending Topics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Categories */}
        <div className="space-y-4">
          <h2 className="text-2xl text-gray-900 mb-4">Assessment Categories</h2>
          
          {assessmentCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Category Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <h3 className="text-xl text-gray-900">{category.name}</h3>
                    {category.score === null && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Attempts */}
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Attempts</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl text-gray-900">{category.attempts}</span>
                        <span className="text-sm text-gray-500">times</span>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Compatibility</div>
                      {category.score !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl text-green-600">{category.score}</span>
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm">
                            {!category.userCompleted && !category.partnerCompleted && 'Both pending'}
                            {!category.userCompleted && category.partnerCompleted && 'You pending'}
                            {category.userCompleted && !category.partnerCompleted && 'Partner pending'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Last Taken */}
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Last Taken</div>
                      <div className="text-sm text-gray-900">
                        {category.lastTaken || 'Not taken'}
                      </div>
                    </div>
                  </div>

                  {/* Status indicator for pending */}
                  {category.score === null && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900">
                          {!category.userCompleted && !category.partnerCompleted && 
                            'Both you and your partner need to complete this assessment'
                          }
                          {!category.userCompleted && category.partnerCompleted && 
                            'Complete your assessment to see compatibility results'
                          }
                          {category.userCompleted && !category.partnerCompleted && 
                            'Waiting for your partner to complete their assessment'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex lg:flex-col gap-3 lg:w-48">
                  <button
                    onClick={() => handleTakeAssessment(category.id, category.name, category.color, category.partnerCompleted)}
                    className="flex-1 lg:flex-none px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    {category.score !== null ? 'Retake' : 'Take Test'}
                  </button>
                  <button
                    onClick={() => handleViewMaterials(category.name)}
                    className="flex-1 lg:flex-none px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Library className="w-4 h-4" />
                    Materials
                  </button>
                  {category.score !== null && (
                    <button
                      onClick={() => handleViewResult(category)}
                      className="flex-1 lg:flex-none px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      View Result
                    </button>
                  )}
                </div>
              </div>

              {/* Progress visualization for completed */}
              {category.score !== null && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Score Progress</span>
                    <span className="text-gray-900">{category.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${category.color} h-2 rounded-full transition-all`}
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View Result Modal */}
      {showResultModal && selectedCategory && (
        <ViewResultModal
          isOpen={showResultModal}
          category={selectedCategory}
          result={selectedCategoryResult}
          loading={loadingResult}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}