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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEmpatheticCounselorResponse, reframeCognitiveThought } from '../services/gemini.js';

export default function AIMentor({ onOpenResources }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'reframer', 'grounding'
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello friend 👋 I'm **MindPal**, your AI mental health companion. How are you feeling today? Whether it's exam pressure, feeling overwhelmed, or just needing a listening ear, I'm here for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Thought Reframer state
  const [anxiousThought, setAnxiousThought] = useState('');
  const [reframeResult, setReframeResult] = useState('');
  const [isReframing, setIsReframing] = useState(false);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { num: 5, sense: 'SEE 👁️', prompt: 'Look around your room. Name 5 distinct things you can see right now.', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200' },
    { num: 4, sense: 'TOUCH ✋', prompt: 'Feel your surroundings. Name 4 things you can physically touch (your clothes, chair, desk, hair).', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200' },
    { num: 3, sense: 'HEAR 👂', prompt: 'Listen closely. Name 3 quiet sounds around you (fan hum, birds outside, your breath).', color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200' },
    { num: 2, sense: 'SMELL 👃', prompt: 'Inhale slowly. Name 2 things you can smell or scents you enjoy (coffee, fresh rain, tea).', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200' },
    { num: 1, sense: 'TASTE 👅', prompt: 'Notice your mouth. Name 1 thing you can taste (mint, water, food), or take a slow sip of water.', color: 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200' },
  ];

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

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

    // Crisis keyword check
    const crisisKeywords = ['suicide', 'end my life', 'want to die', 'harm myself', 'no point living'];
    const matchesCrisis = crisisKeywords.some((k) => userText.toLowerCase().includes(k));

    const response = await getEmpatheticCounselorResponse(userText, 'Student Chat', newChat);

    setChatMessages([
      ...newChat,
      {
        sender: 'ai',
        text: response,
        isCrisisMatch: matchesCrisis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsTyping(false);
  };

  const handleReframeThought = async (e) => {
    e.preventDefault();
    if (!anxiousThought.trim() || isReframing) return;
    setIsReframing(true);
    const result = await reframeCognitiveThought(anxiousThought.trim());
    setReframeResult(result);
    setIsReframing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div id="tour-mindpal-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              MindPal AI Companion
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1">
            MindPal AI Assistant 🤖
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Empathetic AI listener providing cognitive reframing, emotional guidance, and grounding exercises.
          </p>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Listener</span>
          </button>

          <button
            onClick={() => setActiveTab('reframer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'reframer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>CBT Reframer</span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'grounding'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>5-4-3-2-1 Grounding</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Chat Listener */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden flex flex-col h-[600px]">
          
          {/* Chat Top Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                🤖
              </div>
              <div>
                <h3 className="font-heading text-xs font-bold text-slate-800 dark:text-slate-100">
                  MindPal AI Counselor
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Empathetic AI Companion Active</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 hidden sm:block italic">
              "You are worthy of support and care."
            </p>
          </div>

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
                    <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      🤖
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 space-y-2 text-xs sm:text-sm ${
                    isAi
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs'
                  }`}>
                    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
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

                    <div className={`text-[10px] text-right ${isAi ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start space-x-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  🤖
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-400 flex items-center space-x-2 animate-pulse">
                  <span>MindPal AI is thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700/80 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Tab 2: CBT Thought Reframer */}
      {activeTab === 'reframer' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                Cognitive CBT Thought Reframer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform anxious, catastrophizing, or self-critical thoughts into grounded, compassionate perspectives.
              </p>
            </div>
          </div>

          <form onSubmit={handleReframeThought} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Enter your unhelpful or anxious thought:
              </label>
              <textarea
                rows="3"
                value={anxiousThought}
                onChange={(e) => setAnxiousThought(e.target.value)}
                placeholder="e.g. 'I am definitely going to fail this midterm and my whole future will be ruined.'"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isReframing || !anxiousThought.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isReframing ? 'Reframing Thought…' : 'Reframe This Thought'}</span>
            </button>
          </form>

          {reframeResult && (
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-4 animate-fadeIn">
              <h4 className="font-heading text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>AI Reframed Cognitive Analysis</span>
              </h4>

              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-3 prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {reframeResult}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 5-4-3-2-1 Grounding Tool */}
      {activeTab === 'grounding' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                5-4-3-2-1 Sensory Grounding Technique
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A proven mindfulness technique to pull your mind back into the present moment when experiencing high anxiety.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border-2 transition-all space-y-4 bg-slate-50 dark:bg-slate-900/60 border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Step {groundingStep + 1} of {groundingSteps.length}
              </span>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                {groundingSteps[groundingStep].sense}
              </span>
            </div>

            <div className="space-y-2 py-2">
              <h4 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100">
                Find {groundingSteps[groundingStep].num} Items
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {groundingSteps[groundingStep].prompt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/80">
              <button
                onClick={() => setGroundingStep(Math.max(0, groundingStep - 1))}
                disabled={groundingStep === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"
              >
                Previous Step
              </button>

              <button
                onClick={() => setGroundingStep((groundingStep + 1) % groundingSteps.length)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1"
              >
                <span>{groundingStep === groundingSteps.length - 1 ? 'Start Over 🔄' : 'Next Sense →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
