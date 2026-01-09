import { useState } from 'react';
import { Edit, Trash2, ChevronRight, BarChart3, List, Plus, X } from 'lucide-react';

interface AssessmentCategory {
  id: number;
  name: string;
  description: string;
  questionCount: number;
  completions: number;
  averageScore: number;
  status: 'Active' | 'Draft';
  createdDate: string;
}

interface Question {
  id: number;
  question: string;
  type: 'Multiple Choice' | 'Open-ended' | 'Scale (1-10)' | 'Yes/No';
  options: string[];
  categoryId: number;
}

const mockCategories: AssessmentCategory[] = [
  {
    id: 1,
    name: 'Communication and Conflict Resolution',
    description: 'Assess how effectively you and your partner communicate and resolve disagreements',
    questionCount: 25,
    completions: 845,
    averageScore: 78,
    status: 'Active',
    createdDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Finances and Money Management',
    description: 'Explore financial compatibility and money management approaches',
    questionCount: 20,
    completions: 723,
    averageScore: 72,
    status: 'Active',
    createdDate: '2024-01-20',
  },
  {
    id: 3,
    name: 'Children and Parenting Philosophy',
    description: 'Understand alignment on family planning and parenting approaches',
    questionCount: 22,
    completions: 654,
    averageScore: 85,
    status: 'Active',
    createdDate: '2024-02-01',
  },
  {
    id: 4,
    name: 'Family Dynamics and In-Laws',
    description: 'Discuss expectations around extended family relationships',
    questionCount: 18,
    completions: 612,
    averageScore: 81,
    status: 'Active',
    createdDate: '2024-02-10',
  },
  {
    id: 5,
    name: 'Career and Life Goals',
    description: 'Evaluate career aspirations and life objectives alignment',
    questionCount: 20,
    completions: 589,
    averageScore: 76,
    status: 'Active',
    createdDate: '2024-02-15',
  },
  {
    id: 6,
    name: 'Intimacy and Affection',
    description: 'Explore expectations around physical and emotional intimacy',
    questionCount: 15,
    completions: 501,
    averageScore: 88,
    status: 'Active',
    createdDate: '2024-03-01',
  },
  {
    id: 7,
    name: 'Faith, Spirituality, and Core Values',
    description: 'Assess alignment in faith, spiritual practices, and core values',
    questionCount: 16,
    completions: 478,
    averageScore: 82,
    status: 'Active',
    createdDate: '2024-03-10',
  },
  {
    id: 8,
    name: 'Household Roles and Responsibilities',
    description: 'Discuss expectations for daily household management',
    questionCount: 19,
    completions: 445,
    averageScore: 74,
    status: 'Active',
    createdDate: '2024-03-20',
  },
  {
    id: 9,
    name: 'Health and Well-being',
    description: 'Explore health priorities, lifestyle choices, and wellness goals',
    questionCount: 17,
    completions: 432,
    averageScore: 79,
    status: 'Active',
    createdDate: '2024-03-25',
  },
  {
    id: 10,
    name: 'Social Life, Hobbies, and Personal Space',
    description: 'Assess compatibility in social preferences and personal boundaries',
    questionCount: 16,
    completions: 398,
    averageScore: 77,
    status: 'Active',
    createdDate: '2024-04-01',
  },
];

// Sample questions - in real app, these would be fetched per category
const initialQuestions: Question[] = [
  {
    id: 1,
    question: 'How do you prefer to communicate when you\'re upset?',
    type: 'Multiple Choice',
    options: ['Direct conversation immediately', 'Need time alone to process first', 'Written message or text', 'Through actions rather than words'],
    categoryId: 1,
  },
  {
    id: 2,
    question: 'Describe your ideal way of resolving conflicts in your relationship.',
    type: 'Open-ended',
    options: [],
    categoryId: 1,
  },
  {
    id: 3,
    question: 'How important is it to you that your partner shares your communication style?',
    type: 'Scale (1-10)',
    options: [],
    categoryId: 1,
  },
  {
    id: 4,
    question: 'Do you believe in joint bank accounts for married couples?',
    type: 'Yes/No',
    options: [],
    categoryId: 2,
  },
];

export function AssessmentsManagement() {
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory | null>(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssessmentCategory | null>(null);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  
  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'Multiple Choice' as Question['type'],
    options: ['', '', '', ''],
  });

  const handleAddQuestion = () => {
    if (!editingCategory) return;
    
    const newQuestion: Question = {
      id: Math.max(...questions.map(q => q.id), 0) + 1,
      question: questionForm.question,
      type: questionForm.type,
      options: questionForm.type === 'Multiple Choice' ? questionForm.options.filter(o => o.trim() !== '') : [],
      categoryId: editingCategory.id,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionForm({
      question: '',
      type: 'Multiple Choice',
      options: ['', '', '', ''],
    });
    setShowAddQuestionModal(false);
    console.log('Added question:', newQuestion);
  };

  const handleEditQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = questions.map(q =>
      q.id === editingQuestion.id
        ? {
            ...q,
            question: questionForm.question,
            type: questionForm.type,
            options: questionForm.type === 'Multiple Choice' ? questionForm.options.filter(o => o.trim() !== '') : [],
          }
        : q
    );

    setQuestions(updatedQuestions);
    setShowEditQuestionModal(false);
    setEditingQuestion(null);
    console.log('Updated question:', editingQuestion.id);
  };

  const handleDeleteQuestion = () => {
    if (!questionToDelete) return;

    setQuestions(questions.filter(q => q.id !== questionToDelete.id));
    setShowDeleteQuestionModal(false);
    setQuestionToDelete(null);
    console.log('Deleted question:', questionToDelete.id);
  };

  const openEditQuestionModal = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      type: question.type,
      options: question.type === 'Multiple Choice' ? [...question.options, '', '', '', ''].slice(0, 4) : ['', '', '', ''],
    });
    setShowEditQuestionModal(true);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const categoryQuestions = editingCategory 
    ? questions.filter(q => q.categoryId === editingCategory.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Assessment Categories</h1>
          <p className="text-gray-600">Manage assessment topics and questions for couples.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Categories</p>
          <p className="text-2xl text-gray-900 mt-1">{mockCategories.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Questions</p>
          <p className="text-2xl text-gray-900 mt-1">{questions.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Completions</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockCategories.reduce((sum, cat) => sum + cat.completions, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Avg. Platform Score</p>
          <p className="text-2xl text-gray-900 mt-1">
            {Math.round(mockCategories.reduce((sum, cat) => sum + cat.averageScore, 0) / mockCategories.length)}%
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {mockCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1 break-words">{category.name}</h3>
                  <p className="text-sm text-gray-600 break-words">{category.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="text-lg text-gray-900">
                    {questions.filter(q => q.categoryId === category.id).length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completions</p>
                  <p className="text-lg text-gray-900">{category.completions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg. Score</p>
                  <p className={`text-lg ${
                    category.averageScore >= 80 ? 'text-green-600' :
                    category.averageScore >= 60 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {category.averageScore}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  category.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {category.status}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category);
                      setShowQuestionsModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Manage Questions"
                  >
                    <List className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Viewing analytics for:', category.name);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Questions Management Modal */}
      {showQuestionsModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-gray-900">Manage Questions</h3>
                <p className="text-gray-600 mt-1">{editingCategory.name} Assessment</p>
              </div>
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <button 
                onClick={() => {
                  setQuestionForm({
                    question: '',
                    type: 'Multiple Choice',
                    options: ['', '', '', ''],
                  });
                  setShowAddQuestionModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add New Question
              </button>
            </div>

            <div className="space-y-4">
              {categoryQuestions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">No questions yet. Click "Add New Question" to get started.</p>
                </div>
              ) : (
                categoryQuestions.map((q, index) => (
                  <div key={q.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-white text-gray-600 rounded text-sm">
                            Q{index + 1}
                          </span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                            {q.type}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2 break-words">{q.question}</p>
                        {q.options.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-600 ml-4 space-y-1">
                            {q.options.map((opt, i) => (
                              <li key={i} className="break-words">{opt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => openEditQuestionModal(q)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Edit Question"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => {
                            setQuestionToDelete(q);
                            setShowDeleteQuestionModal(true);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl text-gray-900 mb-6">Add New Question</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Question Type</label>
                <select
                  value={questionForm.type}
                  onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value as Question['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Open-ended">Open-ended</option>
                  <option value="Scale (1-10)">Scale (1-10)</option>
                  <option value="Yes/No">Yes/No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Question Text</label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24"
                  placeholder="Enter your question here..."
                />
              </div>

              {questionForm.type === 'Multiple Choice' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                        {questionForm.options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addOption}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={handleAddQuestion}
                disabled={!questionForm.question.trim()}
                className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="w-full sm:flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditQuestionModal && editingQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl text-gray-900 mb-6">Edit Question</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Question Type</label>
                <select
                  value={questionForm.type}
                  onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value as Question['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Open-ended">Open-ended</option>
                  <option value="Scale (1-10)">Scale (1-10)</option>
                  <option value="Yes/No">Yes/No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Question Text</label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24"
                  placeholder="Enter your question here..."
                />
              </div>

              {questionForm.type === 'Multiple Choice' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                        {questionForm.options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addOption}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={handleEditQuestion}
                disabled={!questionForm.question.trim()}
                className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Question
              </button>
              <button
                onClick={() => {
                  setShowEditQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="w-full sm:flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Question Confirmation Modal */}
      {showDeleteQuestionModal && questionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Delete Question</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-900 break-words">{questionToDelete.question}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteQuestion}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteQuestionModal(false);
                  setQuestionToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
