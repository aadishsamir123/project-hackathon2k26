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
  const [postAlias, setPostAlias] = useState('Quiet Breeze');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [expandedCommentsMap, setExpandedCommentsMap] = useState({});

  const presetAliases = [
    { name: 'Quiet Breeze', bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' },
    { name: 'Mindful Panda', bg: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200' },
    { name: 'Gentle Cloud', bg: 'bg-[#FAF6EE] text-stone-800 dark:bg-stone-800 dark:text-stone-200' },
    { name: 'Hopeful Ember', bg: 'bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100' },
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || isPosting) return;

    setIsPosting(true);
    const updated = await createAnonymousPost({
      alias: postAlias,
      category: postCategory,
      content: postContent.trim()
    });
    if (updated && Array.isArray(updated)) {
      setPosts(updated);
    }
    setPostContent('');
    setIsPosting(false);
  };

  const handleReaction = async (postId) => {
    const updated = await togglePostReaction(postId, 'support');
    if (updated && Array.isArray(updated)) {
      setPosts(updated);
    }
  };

  const handleAddComment = async (postId) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    const updated = await addCommentToPost(postId, {
      authorAlias: postAlias || 'Student Friend',
      text: text.trim()
    });
    if (updated && Array.isArray(updated)) {
      setPosts(updated);
    }
    setReplyTextMap({ ...replyTextMap, [postId]: '' });
  };

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
            Community
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Peer Haven Support Wall
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Create Post (5 cols) */}
        <div id="tour-peer-wall" className="lg:col-span-5 bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-stone-800 dark:text-stone-100 font-bold text-sm font-heading">
            <PlusCircle className="w-4 h-4 text-orange-600" />
            <span>Post Anonymous Support Request</span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            
            {/* Alias Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Choose Anonymous Alias:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {presetAliases.map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => setPostAlias(a.name)}
                    className={`p-2 rounded-xl text-xs font-medium text-left transition-all ${
                      postAlias === a.name
                        ? 'ring-2 ring-orange-500 font-bold bg-amber-100 dark:bg-amber-950 text-amber-950'
                        : 'bg-[#FAF6EE] dark:bg-stone-800 border border-amber-200/50 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Topic Category:
              </label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl p-2.5 text-xs text-stone-800 dark:text-stone-100"
              >
                {categories.filter(c => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Content Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Your Message:
              </label>
              <textarea
                rows="4"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your thoughts anonymously..."
                className="w-full bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl p-3.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={isPosting || !postContent.trim()}
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Post Anonymously</span>
            </button>
          </form>
        </div>

        {/* Right Column: Posts Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === c
                    ? 'bg-orange-600 text-white font-bold'
                    : 'bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/60 text-stone-600 dark:text-stone-300 hover:bg-amber-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-8 border border-amber-200/60 dark:border-stone-800 text-center text-xs text-stone-400 italic">
                No posts found in this category yet. Be the first to share!
              </div>
            ) : (
              filteredPosts.map((p) => {
                const supportCount = p.reactions ? (p.reactions.support || p.reactions.hearts || 0) : 0;
                const commentsList = p.comments || [];
                const isExpanded = !!expandedCommentsMap[p.id];

                return (
                  <div
                    key={p.id}
                    className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200">
                        {p.alias || 'Quiet Breeze'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {p.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                      {p.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/40 dark:border-stone-800 text-xs">
                      <button
                        onClick={() => handleReaction(p.id)}
                        className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-bold transition-all px-2.5 py-1 rounded-xl hover:bg-amber-100/60"
                      >
                        <HeartHandshake className="w-4 h-4 text-orange-600" />
                        <span>{supportCount} Support</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedCommentsMap({
                            ...expandedCommentsMap,
                            [p.id]: !isExpanded
                          })
                        }
                        className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-amber-100/60 font-medium transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{commentsList.length} Replies</span>
                      </button>
                    </div>

                    {/* Replies Section */}
                    {isExpanded && (
                      <div className="pt-3 space-y-2 border-t border-amber-200/40 dark:border-stone-800">
                        {commentsList.length === 0 ? (
                          <p className="text-[11px] text-stone-400 italic">No replies yet. Leave a kind reply below!</p>
                        ) : (
                          commentsList.map((c, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800 text-xs space-y-0.5">
                              <span className="font-bold text-orange-700 dark:text-orange-300 text-[11px] block">
                                {c.authorAlias || c.alias || 'Student Friend'}
                              </span>
                              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{c.text}</p>
                            </div>
                          ))
                        )}

                        <div className="flex items-center space-x-2 pt-1">
                          <input
                            type="text"
                            value={replyTextMap[p.id] || ''}
                            onChange={(e) => setReplyTextMap({ ...replyTextMap, [p.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(p.id);
                            }}
                            placeholder="Write a supportive reply..."
                            className="flex-1 bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                          />
                          <button
                            onClick={() => handleAddComment(p.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
