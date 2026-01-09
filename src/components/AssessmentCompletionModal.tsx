import { CheckCircle, Clock } from 'lucide-react';

interface AssessmentCompletionModalProps {
  categoryName: string;
  partnerCompleted: boolean;
  onNavigateToDashboard: () => void;
  onNavigateToCompatibilityTest: () => void;
}

export function AssessmentCompletionModal({ 
  categoryName, 
  partnerCompleted,
  onNavigateToDashboard,
  onNavigateToCompatibilityTest
}: AssessmentCompletionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          {partnerCompleted ? (
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl text-center text-gray-900 mb-4">
          Assessment Completed!
        </h2>

        {/* Category Name */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-1">Category</p>
          <p className="text-lg text-blue-600">{categoryName}</p>
        </div>

        {/* Message based on partner status */}
        <div className={`${partnerCompleted ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border rounded-xl p-6 mb-8`}>
          {partnerCompleted ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-green-900">Ready for Analysis</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Your results will be calculated and compared with your partner&apos;s answers.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-amber-900">Waiting for Partner</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Your results are pending until your partner completes his/her own assessment to be calculated and compared with your partner&apos;s answers.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
          <button
            onClick={onNavigateToCompatibilityTest}
            className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All Assessments
          </button>
        </div>
      </div>
    </div>
  );
}
