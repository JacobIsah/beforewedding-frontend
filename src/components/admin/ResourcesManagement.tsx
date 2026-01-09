import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, BookOpen, FileText, ExternalLink, Upload } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  type: 'Book' | 'Article' | 'Video' | 'Podcast';
  primaryCategory: string;
  secondaryCategories: string[];
  author: string;
  description: string;
  url?: string;
  addedDate: string;
  views: number;
  status: 'Active' | 'Draft';
  accessLevel: 'Public' | 'Registered Users Only';
}

const resourceCategories = [
  'Communication and Conflict Resolution',
  'Finances and Money Management',
  'Children and Parenting Philosophy',
  'Family Dynamics and In-Laws',
  'Career and Life Goals',
  'Intimacy and Affection',
  'Faith, Spirituality, and Core Values',
  'Household Roles and Responsibilities',
  'Health and Well-being',
  'Social Life, Hobbies, and Personal Space',
];

const mockResources: Resource[] = [
  {
    id: 1,
    title: 'The Seven Principles for Making Marriage Work',
    type: 'Book',
    primaryCategory: 'Communication and Conflict Resolution',
    secondaryCategories: ['Intimacy and Affection'],
    author: 'John Gottman',
    description: 'A comprehensive guide to building a healthy, lasting relationship based on decades of research.',
    addedDate: '2024-11-15',
    views: 342,
    status: 'Active',
    accessLevel: 'Registered Users Only',
  },
  {
    id: 2,
    title: 'Understanding Financial Compatibility',
    type: 'Article',
    primaryCategory: 'Finances and Money Management',
    secondaryCategories: ['Career and Life Goals'],
    author: 'Sarah Mitchell, CFP',
    description: 'Key insights on how couples can navigate money discussions and build shared financial goals.',
    url: 'https://example.com/financial-compatibility',
    addedDate: '2024-11-20',
    views: 287,
    status: 'Active',
    accessLevel: 'Public',
  },
  {
    id: 3,
    title: 'Hold Me Tight: Seven Conversations for a Lifetime of Love',
    type: 'Book',
    primaryCategory: 'Intimacy and Affection',
    secondaryCategories: ['Communication and Conflict Resolution'],
    author: 'Dr. Sue Johnson',
    description: 'An emotionally focused therapy approach to strengthening bonds between partners.',
    addedDate: '2024-11-22',
    views: 256,
    status: 'Active',
    accessLevel: 'Registered Users Only',
  },
];

export function ResourcesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Book' as Resource['type'],
    primaryCategory: '',
    secondaryCategories: [] as string[],
    author: '',
    description: '',
    url: '',
    accessLevel: 'Registered Users Only' as Resource['accessLevel'],
  });

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || 
      resource.primaryCategory === categoryFilter || 
      resource.secondaryCategories.includes(categoryFilter);
    const matchesAccess = accessFilter === 'all' || resource.accessLevel === accessFilter;

    return matchesSearch && matchesType && matchesCategory && matchesAccess;
  });

  const handleAddResource = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      type: 'Book',
      primaryCategory: '',
      secondaryCategories: [],
      author: '',
      description: '',
      url: '',
      accessLevel: 'Registered Users Only',
    });
    setShowAddModal(true);
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      type: resource.type,
      primaryCategory: resource.primaryCategory,
      secondaryCategories: resource.secondaryCategories,
      author: resource.author,
      description: resource.description,
      url: resource.url || '',
      accessLevel: resource.accessLevel,
    });
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    console.log('Saving resource:', formData);
    setShowAddModal(false);
  };

  const toggleSecondaryCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryCategories: prev.secondaryCategories.includes(category)
        ? prev.secondaryCategories.filter(c => c !== category)
        : [...prev.secondaryCategories, category]
    }));
  };

  const handleDeleteResource = () => {
    console.log('Deleting resource:', resourceToDelete?.title);
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'Book':
        return <BookOpen className="w-4 h-4" />;
      case 'Article':
        return <FileText className="w-4 h-4" />;
      case 'Video':
      case 'Podcast':
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'Book':
        return 'bg-blue-50 text-blue-600';
      case 'Article':
        return 'bg-purple-50 text-purple-600';
      case 'Video':
        return 'bg-rose-50 text-rose-600';
      case 'Podcast':
        return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Couples Resource Library</h1>
          <p className="text-gray-600">Manage resources for registered couples (separate from public blog).</p>
        </div>
        <button
          onClick={handleAddResource}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Resources</p>
          <p className="text-2xl text-gray-900 mt-1">{mockResources.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Registered Only</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockResources.filter(r => r.accessLevel === 'Registered Users Only').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Public</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockResources.filter(r => r.accessLevel === 'Public').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockResources.reduce((sum, r) => sum + r.views, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Book">Books</option>
                <option value="Article">Articles</option>
                <option value="Video">Videos</option>
                <option value="Podcast">Podcasts</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {resourceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Access Levels</option>
                <option value="Public">Public</option>
                <option value="Registered Users Only">Registered Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resource List */}
        <div className="divide-y divide-gray-200">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} flex-shrink-0`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 break-words">{resource.title}</h3>
                      <p className="text-sm text-gray-600">by {resource.author}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 sm:ml-11 break-words">{resource.description}</p>

                  <div className="flex flex-wrap items-center gap-2 sm:ml-11 text-sm">
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs">
                      {resource.primaryCategory}
                    </span>
                    {resource.secondaryCategories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        resource.accessLevel === 'Public'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {resource.accessLevel}
                    </span>
                    <span className="text-gray-500">{resource.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {resource.url && (
                    <button 
                      onClick={() => window.open(resource.url, '_blank')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleEditResource(resource)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => {
                      setResourceToDelete(resource);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl text-gray-900 mb-6">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Resource title"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="Book">Book</option>
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Access Level</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as Resource['accessLevel'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="Registered Users Only">Registered Users Only</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24"
                  placeholder="Resource description"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">URL (Optional)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Primary Category</label>
                <select
                  value={formData.primaryCategory}
                  onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select Primary Category</option>
                  {resourceCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Secondary Categories (Optional)</label>
                <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {resourceCategories
                    .filter(cat => cat !== formData.primaryCategory)
                    .map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleSecondaryCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors break-words ${
                          formData.secondaryCategories.includes(cat)
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
              >
                {editingResource ? 'Update Resource' : 'Add Resource'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full sm:flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && resourceToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Delete Resource</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{resourceToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteResource}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setResourceToDelete(null);
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
