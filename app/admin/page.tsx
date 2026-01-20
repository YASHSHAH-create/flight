"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Loader2, Plus, Send, Image as ImageIcon, Type, Link as LinkIcon, Trash2, Edit2, RefreshCw } from 'lucide-react';

interface PostRecord {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    imageUrl: string;
    keywords: string[];
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Destinations',
        readTime: '5 min read',
        imageUrl: '/blog/img1.png',
        keywords: ''
    });

    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(true);

    // Fetch posts on mount only if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin@123') {
            setIsAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('Invalid credentials');
        }
    };

    const fetchPosts = async () => {
        setIsLoadingList(true);
        try {
            const res = await fetch('/api/blog/list');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setIsLoadingList(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (post: PostRecord) => {
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            readTime: post.readTime,
            imageUrl: post.imageUrl,
            keywords: post.keywords ? post.keywords.join(', ') : ''
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStatus('Editing mode: Update the fields and click Update.');
    };

    const handleCancelEdit = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            category: 'Destinations',
            readTime: '5 min read',
            imageUrl: '/blog/img1.png',
            keywords: ''
        });
        setIsEditing(false);
        setStatus('');
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;

        try {
            const res = await fetch('/api/blog/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug })
            });

            if (res.ok) {
                alert("Post deleted!");
                fetchPosts(); // Refresh list
            } else {
                alert("Failed to delete post.");
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting post.");
        }
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPublishing(true);
        setStatus(isEditing ? 'Updating...' : 'Publishing...');

        try {
            // Process keywords string into array
            const postData = {
                ...formData,
                keywords: formData.keywords.split(',').map(k => k.trim())
            };

            const res = await fetch('/api/blog/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (res.ok) {
                setStatus(isEditing ? 'Post updated successfully!' : 'Post published successfully!');
                handleCancelEdit(); // Reset form
                fetchPosts(); // Refresh list
            } else {
                setStatus('Failed to save.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error saving.');
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
                    <h1 className="text-2xl font-black text-slate-900 mb-6 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                {isEditing ? <Edit2 className="text-amber-500" /> : <Plus className="text-blue-600" />}
                                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                            </h2>

                            <form onSubmit={handlePublish} className="space-y-6">
                                {/* Title & Slug */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Post Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={(e) => {
                                                if (!isEditing) {
                                                    // Auto-generate slug from title
                                                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                                    setFormData(prev => ({ ...prev, title: e.target.value, slug }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, title: e.target.value }));
                                                }
                                            }}
                                            required
                                            placeholder="e.g., Top 10 Hidden Gems in Bali"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><LinkIcon size={14} /> URL Slug</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
                                            disabled={isEditing}
                                            placeholder="top-10-hidden-gems-bali"
                                            className={`w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm ${isEditing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-slate-500'}`}
                                        />
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Short Excerpt (SEO Description)</label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        required
                                        rows={2}
                                        placeholder="A brief summary that will appear on Google and social media..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Main Content */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Type size={14} /> Content (HTML Supported)</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                        rows={10}
                                        placeholder="<h1>Main Heading</h1><p>Write your blog content here...</p>"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Tip: Use &lt;h2&gt; for subheadings and &lt;p&gt; for paragraphs.</p>
                                </div>

                                {/* Meta Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option>Destinations</option>
                                            <option>Travel Tips</option>
                                            <option>Adventure</option>
                                            <option>Food</option>
                                            <option>Culture</option>
                                            <option>International</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Read Time</label>
                                        <input
                                            type="text"
                                            name="readTime"
                                            value={formData.readTime}
                                            onChange={handleChange}
                                            placeholder="e.g. 5 min read"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><ImageIcon size={14} /> Image URL</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            placeholder="/blog/img1.png"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">SEO Keywords (Comma separated)</label>
                                    <input
                                        type="text"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleChange}
                                        placeholder="travel, bali, beach, budget"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                                    <span className={`text-sm font-bold ${status.includes('success') ? 'text-green-600' : 'text-slate-500'}`}>
                                        {status}
                                    </span>
                                    <div className="flex gap-3">
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isPublishing}
                                            className={`flex items-center gap-2 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isEditing ? 'bg-amber-500' : 'bg-slate-900'}`}
                                        >
                                            {isPublishing ? <Loader2 className="animate-spin" /> : (isEditing ? <RefreshCw size={18} /> : <Send size={18} />)}
                                            {isPublishing ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Post' : 'Publish Post')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 sticky top-32">
                            <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center justify-between">
                                <span>Existing Posts</span>
                                <button onClick={fetchPosts} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><RefreshCw size={16} /></button>
                            </h3>

                            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingList ? (
                                    <div className="text-center py-10 text-slate-400">Loading...</div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400">No posts found.</div>
                                ) : (
                                    posts.map(post => (
                                        <div key={post.slug} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                            <h4 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-2">{post.title}</h4>
                                            <div className="flex items-center justify-between mt-3 text-xs">
                                                <span className="text-slate-500 font-mono truncate max-w-[100px]">{post.category}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(post)}
                                                        className="p-2 bg-white text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post.slug)}
                                                        className="p-2 bg-white text-red-600 rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
