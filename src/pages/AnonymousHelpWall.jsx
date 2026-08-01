import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Send,
  MessageCircle,
  Filter,
  PlusCircle,
  UserCheck,
  Smile,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  subscribeToAnonymousPosts,
  createAnonymousPost,
  togglePostReaction,
  addCommentToPost
} from '../services/firestore.js';

export default function AnonymousHelpWall() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Exam Stress');
  const [postAlias, setPostAlias] = useState('Quiet Breeze 🌿');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [expandedCommentsMap, setExpandedCommentsMap] = useState({});

  const presetAliases = [
    { name: 'Quiet Breeze 🌿', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    { name: 'Mindful Panda 🐼', bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
    { name: 'Gentle Cloud ☁️', bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
    { name: 'Peaceful Willow 🌸', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
    { name: 'Hopeful Ember 🔥', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    { name: 'Serene River 🌊', bg: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300' },
  ];

  const categories = [
    'All', 'Exam Stress', 'Loneliness', 'Burnout', 'Friendship', 'Career & Future', 'General Venting'
  ];

  useEffect(() => {
    const unsub = subscribeToAnonymousPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
    });
    return unsub;
  }, []);

  const handleRandomizeAlias = () => {
    const random = presetAliases[Math.floor(Math.random() * presetAliases.length)];
    setPostAlias(random.name);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const matchedAlias = presetAliases.find((a) => a.name === postAlias) || presetAliases[0];
    await createAnonymousPost({
      alias: postAlias,
      avatarBg: matchedAlias.bg,
      category: postCategory,
      content: postContent.trim(),
    });

    setPostContent('');
    setIsPosting(false);
  };

  const handleReaction = (postId, reactionType) => {
    const updated = togglePostReaction(postId, reactionType);
    setPosts(updated);
  };

  const handleAddComment = (postId) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    const randomAlias = presetAliases[Math.floor(Math.random() * presetAliases.length)].name;
    const updated = addCommentToPost(postId, {
      alias: randomAlias,
      text: text.trim(),
    });

    setPosts(updated);
    setReplyTextMap({ ...replyTextMap, [postId]: '' });
  };

  const toggleExpandComments = (postId) => {
    setExpandedCommentsMap((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div id="tour-peerhaven-header" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Anonymous & Judgment-Free</span>
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Peer Haven — Anonymous Support Wall 🤝
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Share what's on your heart, ask for exam tips, vent about burnout, or send warm supportive hugs to fellow students anonymously.
            </p>
          </div>

          <button
            onClick={() => setIsPosting(!isPosting)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isPosting ? 'Cancel Post' : 'Post Anonymously'}</span>
          </button>
        </div>
      </div>

      {/* Community Guidelines Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Community Care:</strong> Please keep this space compassionate and supportive. Severe crisis messages will automatically highlight emergency hotlines.
        </span>
      </div>

      {/* New Post Modal/Expand Form */}
      {isPosting && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <MessageSquareHeart className="w-5 h-5 text-indigo-500" />
              <span>Create Anonymous Post</span>
            </h3>
            <span className="text-xs text-slate-400">Your real name & email will never be shown</span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category Tag</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Alias Selector & Generator */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Anonymous Alias</label>
                  <button
                    type="button"
                    onClick={handleRandomizeAlias}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Randomize</span>
                  </button>
                </div>
                <select
                  value={postAlias}
                  onChange={(e) => setPostAlias(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-semibold"
                >
                  {presetAliases.map((a) => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Post Content Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">What would you like to share?</label>
              <textarea
                rows="4"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Ask for exam coping tips, talk about feeling lonely, or express what's bothering you today..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 leading-relaxed"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Anonymously</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Posts Feed Grid */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gradient-to-br from-indigo-50/20 via-white to-emerald-50/20 dark:from-indigo-950/10 dark:via-slate-800/80 dark:to-emerald-950/10 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4 max-w-xl mx-auto animate-float">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
              <MessageSquareHeart className="w-7 h-7 animate-pulse-soft" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                A Peaceful Space Waiting for Your Voice 🌿
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                There are no anonymous posts under "{selectedCategory}" yet. Share a concern, vent your thoughts, or ask a question. Your identity is 100% protected.
              </p>
            </div>
            <button
              onClick={() => setIsPosting(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share First Thought</span>
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const commentsList = post.comments || [];
            const isExpanded = expandedCommentsMap[post.id];
            const reactions = post.reactions || { warmth: 0, support: 0, relatable: 0 };

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-xl text-xs font-bold ${post.avatarBg || 'bg-indigo-100 text-indigo-700'}`}>
                      {post.alias || 'Anonymous Student'}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {post.category}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(post.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {post.content}
                </p>

                {/* Peer Reaction Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReaction(post.id, 'warmth')}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <span>🤍 Send Warmth</span>
                      <span className="bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 px-1.5 py-0.2 rounded-full text-[10px]">
                        {reactions.warmth}
                      </span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'support')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <span>🤝 You're Not Alone</span>
                      <span className="bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 px-1.5 py-0.2 rounded-full text-[10px]">
                        {reactions.support}
                      </span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'relatable')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <span>🌿 So Relatable</span>
                      <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.2 rounded-full text-[10px]">
                        {reactions.relatable}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleExpandComments(post.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{commentsList.length} Peer Comments</span>
                  </button>
                </div>

                {/* Comment Section Thread */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3 animate-fadeIn">
                    
                    {/* Input for adding comment */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={replyTextMap[post.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                        placeholder="Write a supportive anonymous reply…"
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Existing Comments */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {commentsList.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No peer replies yet. Be the first to offer encouragement!</p>
                      ) : (
                        commentsList.map((c) => (
                          <div
                            key={c.id}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-600 dark:text-indigo-300 text-[11px]">
                                {c.alias}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
