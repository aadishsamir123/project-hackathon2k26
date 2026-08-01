import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  RefreshCw,
  Brain,
  Eye,
  Compass,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Zap,
  Shield
} from 'lucide-react';
import { BookOpen, Sliders } from 'lucide-react';
import { getEmpatheticCounselorResponse, reframeCognitiveThought } from '../services/gemini.js';
import { subscribeToMoodLogs, markDailyPathStepCompleted } from '../services/firestore.js';
import { GroundingVagalDiagram } from '../components/wellness/VisualTutorialDiagrams.jsx';
import PagePurposeHeader from '../components/common/PagePurposeHeader.jsx';
import MarkdownRenderer from '../components/common/MarkdownRenderer.jsx';

export default function AIMentor({ user, onOpenResources }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'reframer', 'grounding'
  const [journalLogs, setJournalLogs] = useState([]);
  const [useJournalContext, setUseJournalContext] = useState(true);
  
  const userName = user?.displayName ? user.displayName.split(' ')[0] : user?.email ? user.email.split('@')[0] : 'Friend';

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.displayName ? user.displayName.split(' ')[0] : 'friend'} 👋 I'm **MindPal**, your warm AI mental health companion. How are you feeling today? Whether it's exam pressure, feeling overwhelmed, or just needing a listening ear, I'm here for you.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Update initial AI greeting when user profile loads if chat has not progressed
  useEffect(() => {
    if (user?.displayName && chatMessages.length === 1 && chatMessages[0].sender === 'ai') {
      const name = user.displayName.split(' ')[0];
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello ${name} 👋 I'm **MindPal**, your warm AI mental health companion. How are you feeling today? Whether it's exam pressure, feeling overwhelmed, or just needing a listening ear, I'm here for you.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [user]);

  // Thought Reframer state
  const [anxiousThought, setAnxiousThought] = useState('');
  const [reframeResult, setReframeResult] = useState('');
  const [isReframing, setIsReframing] = useState(false);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { num: 5, sense: 'SEE 👁️', prompt: 'Look around your room. Name 5 distinct things you can see right now.', color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200' },
    { num: 4, sense: 'TOUCH ✋', prompt: 'Feel your surroundings. Name 4 things you can physically touch (your clothes, chair, desk, hair).', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200' },
    { num: 3, sense: 'HEAR 👂', prompt: 'Listen closely. Name 3 quiet sounds around you (fan hum, birds outside, your breath).', color: 'border-stone-500 bg-stone-50 dark:bg-stone-900/40 text-stone-900 dark:text-stone-200' },
    { num: 2, sense: 'SMELL 👃', prompt: 'Inhale slowly. Name 2 things you can smell or scents you enjoy (coffee, fresh rain, tea).', color: 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200' },
    { num: 1, sense: 'TASTE 👅', prompt: 'Notice your mouth. Name 1 thing you can taste (mint, water, food), or take a slow sip of water.', color: 'border-orange-600 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200' },
  ];

  const messagesContainerRef = useRef(null);

  // Subscribe to mood journal logs for context-aware responses
  useEffect(() => {
    const unsub = subscribeToMoodLogs(user?.uid, (logs) => {
      setJournalLogs(logs);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Build a compact journal context string from recent mood logs
  const buildJournalContext = (logs) => {
    if (!logs || logs.length === 0) return '';
    const recent = logs.slice(0, 10); // last 10 entries
    const lines = recent.map(log => {
      const date = new Date(log.createdAt || log.timestamp);
      const dateStr = isNaN(date.getTime()) ? 'Recent' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const parts = [`[${dateStr}] Mood: ${log.emotion || 'Unknown'} (Intensity: ${log.intensity ?? '?'}/10)`];
      if (log.tags && log.tags.length > 0) parts.push(`Context tags: ${log.tags.join(', ')}`);
      if (log.note) parts.push(`Note: "${log.note.slice(0, 120)}${log.note.length > 120 ? '...' : ''}"`);
      return parts.join(' | ');
    });
    return lines.join('\n');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    markDailyPathStepCompleted('step-4');
    const userText = inputMessage.trim();
    setInputMessage('');

    const newChat = [
      ...chatMessages,
      {
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatMessages(newChat);
    setIsTyping(true);

    try {
      // Crisis keyword check
      const crisisKeywords = ['suicide', 'end my life', 'want to die', 'harm myself', 'no point living'];
      const matchesCrisis = crisisKeywords.some((k) => userText.toLowerCase().includes(k));

      const journalContext = useJournalContext ? buildJournalContext(journalLogs) : '';
      const response = await getEmpatheticCounselorResponse(userText, 'Student Chat', newChat, journalContext, userName);

      setChatMessages([
        ...newChat,
        {
          sender: 'ai',
          text: response,
          isCrisisMatch: matchesCrisis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn("AI response error:", err);
      setChatMessages([
        ...newChat,
        {
          sender: 'ai',
          text: `I hear you, ${userName}, and what you're feeling is valid. Take a slow, deep breath in and out. I'm right here with you. How can I best support you in this moment?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReframeThought = async (e) => {
    e.preventDefault();
    if (!anxiousThought.trim() || isReframing) return;
    setIsReframing(true);
    try {
      const result = await reframeCognitiveThought(anxiousThought.trim());
      setReframeResult(result);
    } catch (err) {
      console.warn("Reframe error:", err);
      setReframeResult("### Identified Cognitive Distortion\n**Catastrophizing / Overthinking**\n\n### Empathetic Reality Check\nYour thoughts are mental events, not immutable facts. You are capable of navigating challenging moments one step at a time.\n\n### 3 Grounded Reframed Perspectives\n1. *'My worth is not defined by a single moment, grade, or challenge.'*\n2. *'I have handled difficult situations before and I have resources available.'*\n3. *'I only need to handle the next immediate step in front of me.'*\n\n### Micro Action Step\nUnclench your jaw, take 3 slow deep breaths, and sip a glass of water.");
    } finally {
      setIsReframing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Mental Health Purpose Header */}
      <PagePurposeHeader
        badge="Cognitive Reframing & AI Support"
        title="MindPal AI Assistant & CBT Toolkit"
        purpose="Receive non-judgmental 24/7 empathetic listening, reframe cognitive distortions, and practice sensory grounding."
        evidence="Cognitive Behavioral Therapy (CBT) thought reframing helps interrupt cognitive traps like catastrophizing and black-and-white thinking."
        dailyAction="Chat with MindPal about your day, or enter an unhelpful anxious thought into the CBT Reframer to get 3 grounded perspectives."
        stepNumber={4}
        totalSteps={6}
      />

      {/* Navigation Sub-tabs */}
      <div className="flex items-center justify-start">
        <div className="flex items-center space-x-1.5 bg-[#FFFDF9] dark:bg-[#262220] p-1.5 rounded-2xl border border-amber-200/80 dark:border-stone-700 shadow-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Listener</span>
          </button>

          <button
            onClick={() => setActiveTab('reframer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'reframer'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>CBT Reframer</span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'grounding'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>5-4-3-2-1 Grounding</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Chat Listener */}
      {activeTab === 'chat' && (
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-xs overflow-hidden flex flex-col h-[600px]">
          
          {/* Chat Top Info */}
          <div className="p-4 bg-[#FAF6EE] dark:bg-stone-900 border-b border-amber-200/60 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                <Bot className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-bold text-stone-800 dark:text-stone-100">
                  MindPal AI Counselor
                </h3>
                <span className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span>Empathetic Companion Active</span>
                </span>
              </div>
            </div>

            {/* Journal Context Toggle */}
            <button
              onClick={() => setUseJournalContext(!useJournalContext)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                useJournalContext && journalLogs.length > 0
                  ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'
                  : 'border-amber-200/60 dark:border-stone-700 bg-[#FFFDF9] dark:bg-stone-800 text-stone-500 dark:text-stone-400'
              }`}
              title={useJournalContext ? 'Journal context is ON — MindPal reads your entries' : 'Journal context is OFF'}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {useJournalContext && journalLogs.length > 0
                  ? `Journal-Aware (${journalLogs.length})`
                  : journalLogs.length === 0
                  ? 'No Journal Yet'
                  : 'Journal Off'}
              </span>
            </button>
          </div>

          {/* Journal Context Banner */}
          {useJournalContext && journalLogs.length > 0 && (
            <div className="px-4 py-2 bg-orange-50/80 dark:bg-orange-950/30 border-b border-orange-200/60 dark:border-orange-900/40 flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
              <p className="text-[11px] text-orange-700 dark:text-orange-300 leading-snug">
                <span className="font-bold">Journal-Aware Mode:</span> MindPal has privately read your {journalLogs.length} journal entries and will personalize its support based on your emotional patterns and reflections.
              </p>
            </div>
          )}

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={idx}
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'} space-x-2`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-orange-700 dark:text-orange-300" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 space-y-2 text-xs sm:text-sm ${
                    isAi
                      ? 'bg-[#FAF6EE] dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-tl-xs border border-amber-200/50'
                      : 'bg-orange-600 text-white rounded-tr-xs'
                  }`}>
                    <div>
                      <MarkdownRenderer content={msg.text} />
                    </div>

                    {msg.isCrisisMatch && (
                      <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-2 mt-3">
                        <div className="flex items-center space-x-1.5 font-bold text-xs">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>Immediate Crisis Helplines Available</span>
                        </div>
                        <p className="text-[11px]">
                          Please remember that you can call or text <strong>1767 SOS</strong> or <strong>988 Lifeline</strong> right now for free, confidential 24/7 care.
                        </p>
                        <button
                          onClick={onOpenResources}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all"
                        >
                          View 24/7 Crisis Hotlines
                        </button>
                      </div>
                    )}

                    <div className={`text-[10px] text-right ${isAi ? 'text-stone-400' : 'text-orange-200'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold text-xs shrink-0">
                  <Bot className="w-4 h-4 text-orange-700 dark:text-orange-300 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 text-xs text-stone-400 flex items-center space-x-2 animate-pulse">
                  <span>MindPal AI is reflecting…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#FAF6EE] dark:bg-stone-900 border-t border-amber-200/60 dark:border-stone-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Tab 2: CBT Thought Reframer */}
      {activeTab === 'reframer' && (
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-amber-200/60 dark:border-stone-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-stone-800 dark:text-stone-100">
                Cognitive CBT Thought Reframer
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Transform anxious, catastrophizing, or self-critical thoughts into grounded, compassionate perspectives.
              </p>
            </div>
          </div>

          <form onSubmit={handleReframeThought} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Enter your unhelpful or anxious thought:
              </label>
              <textarea
                rows="3"
                value={anxiousThought}
                onChange={(e) => setAnxiousThought(e.target.value)}
                placeholder="e.g. 'I am definitely going to fail this midterm and my whole future will be ruined.'"
                className="w-full bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 rounded-2xl p-4 text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isReframing || !anxiousThought.trim()}
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isReframing ? 'Reframing Thought…' : 'Reframe This Thought'}</span>
            </button>
          </form>

          {reframeResult && (
            <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-4 animate-fadeIn">
              <h4 className="font-heading text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-orange-600" />
                <span>Reframed Cognitive Analysis</span>
              </h4>

              <div>
                <MarkdownRenderer content={reframeResult} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 5-4-3-2-1 Grounding Tool */}
      {activeTab === 'grounding' && (
        <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-amber-200/60 dark:border-stone-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-stone-800 dark:text-stone-100">
                5-4-3-2-1 Sensory Grounding Technique
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                A proven mindfulness technique to pull your mind back into the present moment when experiencing high anxiety.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border-2 transition-all space-y-4 bg-[#FAF6EE] dark:bg-stone-900/60 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                Step {groundingStep + 1} of {groundingSteps.length}
              </span>
              <span className="text-xs font-extrabold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                {groundingSteps[groundingStep].sense}
              </span>
            </div>

            <div className="space-y-2 py-2">
              <h4 className="font-heading text-lg font-bold text-stone-800 dark:text-stone-100">
                Find {groundingSteps[groundingStep].num} Items
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {groundingSteps[groundingStep].prompt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-amber-200/60 dark:border-stone-800">
              <button
                onClick={() => setGroundingStep(Math.max(0, groundingStep - 1))}
                disabled={groundingStep === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-stone-700 disabled:opacity-30 text-stone-600 dark:text-stone-300"
              >
                Previous Step
              </button>

              <button
                onClick={() => setGroundingStep((groundingStep + 1) % groundingSteps.length)}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1"
              >
                <span>{groundingStep === groundingSteps.length - 1 ? 'Start Over 🔄' : 'Next Sense →'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Anti-Anxiety Notebook Grounding & Vagal Visualizer */}
          <div className="pt-2">
            <GroundingVagalDiagram />
          </div>
        </div>
      )}

    </div>
  );
}
