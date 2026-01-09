import { useState } from 'react';
import { Plus, Edit, Trash2, Search, BookOpen, FileText, X } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  type: 'book' | 'article';
  category: string;
  author: string;
  description: string;
  link?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  questionCount: number;
}

export function ContentManagement() {
  const [view, setView] = useState<'resources' | 'categories'>('resources');
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: 'The Anxiety Toolkit', type: 'book', category: 'Anxiety & Stress', author: 'Alice Boyes', description: 'Practical strategies for managing anxiety' },
    { id: 2, title: 'Understanding Depression', type: 'article', category: 'Depression', author: 'Dr. John Smith', description: 'A comprehensive guide to depression', link: 'https://example.com' },
    { id: 3, title: 'Career Success Handbook', type: 'book', category: 'Career Development', author: 'Sarah Johnson', description: 'Navigate your career path with confidence' },
    { id: 4, title: 'Building Healthy Relationships', type: 'article', category: 'Relationships', author: 'Dr. Emily Davis', description: 'Tips for maintaining strong relationships', link: 'https://example.com' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Anxiety & Stress', description: 'Questions related to anxiety and stress management', questionCount: 15 },
    { id: 2, name: 'Depression', description: 'Assessment questions for depression symptoms', questionCount: 12 },
    { id: 3, name: 'Career Development', description: 'Career counseling and development questions', questionCount: 10 },
    { id: 4, name: 'Relationships', description: 'Relationship and interpersonal questions', questionCount: 8 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Resource | Category | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'book' as 'book' | 'article',
    category: '',
    author: '',
    description: '',
    link: '',
    name: '',
    questionCount: 0,
  });

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResource = () => {
    const newResource: Resource = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      category: formData.category,
      author: formData.author,
      description: formData.description,
      link: formData.link,
    };
    setResources([...resources, newResource]);
    resetForm();
  };

  const handleUpdateResource = () => {
    if (!editingItem) return;
    setResources(resources.map(r =>
      r.id === editingItem.id
        ? { ...r, ...formData, id: editingItem.id }
        : r
    ));
    resetForm();
  };

  const handleDeleteResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      questionCount: formData.questionCount,
    };
    setCategories([...categories, newCategory]);
    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!editingItem) return;
    setCategories(categories.map(c =>
      c.id === editingItem.id
        ? { ...c, name: formData.name, description: formData.description, questionCount: formData.questionCount }
        : c
    ));
    resetForm();
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'book',
      category: '',
      author: '',
      description: '',
      link: '',
      name: '',
      questionCount: 0,
    });
    setShowAddModal(false);
    setEditingItem(null);
  };

  const openEditModal = (item: Resource | Category) => {
    setEditingItem(item);
    if ('title' in item) {
      setFormData({
        title: item.title,
        type: item.type,
        category: item.category,
        author: item.author,
        description: item.description,
        link: item.link || '',
        name: '',
        questionCount: 0,
      });
    } else {
      setFormData({
        title: '',
        type: 'book',
        category: '',
        author: '',
        description: item.description,
        link: '',
        name: item.name,
        questionCount: item.questionCount,
      });
    }
    setShowAddModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Content Management</h2>
        <p className="text-gray-600">Manage resources and assessment categories</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView('resources')}
          className={`px-4 py-2 rounded-lg ${
            view === 'resources'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Resources ({resources.length})
        </button>
        <button
          onClick={() => setView('categories')}
          className={`px-4 py-2 rounded-lg ${
            view === 'categories'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Assessment Categories ({categories.length})
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={view === 'resources' ? 'Search resources...' : 'Search categories...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add {view === 'resources' ? 'Resource' : 'Category'}
            </button>
          </div>
        </div>

        {view === 'resources' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {resource.type === 'book' ? (
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-green-600" />
                        )}
                        <div>
                          <p className="text-sm">{resource.title}</p>
                          <p className="text-xs text-gray-500">{resource.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        resource.type === 'book' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.author}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(resource)}
                          className="p-1 hover:bg-blue-100 rounded text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <p className="text-sm text-gray-500">{category.questionCount} questions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 hover:bg-blue-100 rounded text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl">
                {editingItem ? 'Edit' : 'Add'} {view === 'resources' ? 'Resource' : 'Category'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {view === 'resources' ? (
                <>
                  <div>
                    <label className="block text-sm mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'book' | 'article' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="book">Book</option>
                        <option value="article">Article</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {formData.type === 'article' && (
                    <div>
                      <label className="block text-sm mb-2">Link (optional)</label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm mb-2">Category Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Number of Questions</label>
                    <input
                      type="number"
                      value={formData.questionCount}
                      onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem 
                    ? (view === 'resources' ? handleUpdateResource : handleUpdateCategory)
                    : (view === 'resources' ? handleAddResource : handleAddCategory)
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Add'} {view === 'resources' ? 'Resource' : 'Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
