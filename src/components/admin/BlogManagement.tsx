import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, User, Upload, Image as ImageIcon, X } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  primaryCategory: string;
  secondaryCategories: string[];
  status: 'Published' | 'Draft';
  publishedDate: string;
  views: number;
  coverImage?: string;
}

const blogCategories = [
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

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: '5 Essential Conversations Every Couple Should Have Before Marriage',
    excerpt: 'Discover the crucial topics that will help you build a strong foundation for your marriage.',
    content: 'Full content here...',
    author: 'Dr. Sarah Mitchell',
    primaryCategory: 'Communication and Conflict Resolution',
    secondaryCategories: ['Faith, Spirituality, and Core Values'],
    status: 'Published',
    publishedDate: '2024-12-01',
    views: 1243,
  },
  {
    id: 2,
    title: 'Understanding Financial Compatibility in Relationships',
    excerpt: 'Money matters can make or break a relationship. Learn how to navigate financial discussions with your partner.',
    content: 'Full content here...',
    author: 'Admin',
    primaryCategory: 'Finances and Money Management',
    secondaryCategories: ['Career and Life Goals'],
    status: 'Published',
    publishedDate: '2024-11-28',
    views: 987,
  },
];

export function BlogManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    primaryCategory: '',
    secondaryCategories: [] as string[],
    status: 'Draft' as 'Published' | 'Draft',
    coverImage: null as File | null,
  });

  const filteredPosts = mockPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.primaryCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      primaryCategory: '',
      secondaryCategories: [],
      status: 'Draft',
      coverImage: null,
    });
    setShowAddModal(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      primaryCategory: post.primaryCategory,
      secondaryCategories: post.secondaryCategories,
      status: post.status,
      coverImage: null,
    });
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    console.log('Saving post:', formData);
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

  const handleDeletePost = () => {
    console.log('Deleting post:', postToDelete?.title);
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      console.log('Adding new category:', newCategoryName);
      blogCategories.push(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Blog Management</h1>
          <p className="text-gray-600">Create and manage public blog posts for the platform.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
          <button
            onClick={handleAddPost}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Posts</p>
          <p className="text-2xl text-gray-900 mt-1">{mockPosts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockPosts.filter(p => p.status === 'Published').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockPosts.filter(p => p.status === 'Draft').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockPosts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="divide-y divide-gray-200">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-gray-900 break-words">{post.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs flex-shrink-0 ${
                      post.status === 'Published' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 break-words">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs">
                      {post.primaryCategory}
                    </span>
                    {post.secondaryCategories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">{new Date(post.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => console.log('Viewing post:', post.title)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleEditPost(post)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => {
                      setPostToDelete(post);
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
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-gray-900 mb-6">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h3>
            
            <div className="space-y-4">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.files?.[0] || null })}
                    className="hidden"
                    id="coverImage"
                  />
                  <label htmlFor="coverImage" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload cover image</p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-20"
                  placeholder="Brief description for preview"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Content</label>
                <div className="mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          console.log('Adding inline image:', file.name);
                          // Here you would handle the image upload and insert into content
                        }
                      };
                      input.click();
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Add Inline Image
                  </button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-64"
                  placeholder="Write your blog post content here..."
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
                  {blogCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Secondary Categories (Optional)</label>
                <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {blogCategories
                    .filter(cat => cat !== formData.primaryCategory)
                    .map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleSecondaryCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
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

              <div>
                <label className="block text-sm text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
              >
                {editingPost ? 'Update Post' : 'Publish Post'}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && postToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Delete Blog Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{postToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeletePost}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPostToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-4"
              placeholder="Enter category name"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName('');
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
