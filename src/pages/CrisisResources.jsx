import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  HeartHandshake,
  Building2,
  FileText,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  Sparkles,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';

export default function CrisisResources() {
  const [copiedNumber, setCopiedNumber] = useState('');

  const crisisHelplines = [
    {
      name: 'SOS Samaritans of Singapore',
      region: 'Singapore (24/7)',
      number: '1767',
      desc: 'Dedicated 24/7 confidential helpline offering emotional support for individuals facing crisis or mental health struggles.',
      badge: '24/7 Hotline',
      color: 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
    },
    {
      name: 'IMH Mental Health Helpline',
      region: 'Singapore Institute of Mental Health',
      number: '6389-2222',
      desc: '24-hour medical helpline for mental health emergencies, psychiatric triage, and hospital referrals.',
      badge: '24/7 Medical Hotline',
      color: 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200'
    },
    {
      name: 'CHATT / Youth Mental Health',
      region: 'Youth Support Singapore',
      number: '6493-6500',
      desc: 'Free confidential mental health assessment and early intervention service for students and young adults aged 16-30.',
      badge: 'Youth Specialist',
      color: 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
    },
  ];

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(''), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Emergency Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 p-6 sm:p-8 text-white shadow-md">
        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
            <span>Emergency Support & Immediate Care</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            You Are Not Alone. Free, Confidential Help is Available 24/7.
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            If you are in distress, feeling hopeless, or having thoughts of self-harm, please reach out right away. Compassionate counselors are ready to listen without judgment.
          </p>
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-rose-500" />
          <span>24/7 Hotlines & Helplines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crisisHelplines.map((item) => (
            <div
              key={item.name}
              className={`p-6 rounded-3xl border-2 space-y-4 shadow-xs flex flex-col justify-between ${item.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/80 dark:bg-slate-900/80 shadow-xs">
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-medium opacity-80">{item.region}</span>
                </div>

                <h3 className="font-heading text-base font-bold">{item.name}</h3>
                <p className="text-xs leading-relaxed opacity-90">{item.desc}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-black/10 dark:border-white/10">
                <a
                  href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center space-x-1.5 hover:opacity-90 transition-all shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>

                <button
                  onClick={() => handleCopy(item.number)}
                  className="text-xs font-semibold underline opacity-80 hover:opacity-100"
                >
                  {copiedNumber === item.number ? 'Copied! ✓' : 'Copy Number'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Counseling & Self-Care Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Campus Counseling Guide */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                Campus Student Care & Counseling
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Free confidential counseling provided by university & college centers
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-100 block">
                🎓 University Wellness & Counseling Services
              </span>
              <p>Most schools offer 4–8 free individual counseling sessions per academic year. Contact your student health center or dean of students office.</p>
            </li>
            <li className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-100 block">
                📝 Academic Accommodation & Extensions
              </span>
              <p>If severe anxiety or grief is affecting your exams, reach out to your faculty advisor or student disability support office for temporary exam extensions.</p>
            </li>
          </ul>
        </div>

        {/* Self-Help Safety Plan Checklist */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 dark:text-slate-100">
                Personal Safety Plan Steps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simple steps to prepare for moments of high emotional overwhelm
              </p>
            </div>
          </div>

          <ol className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span><strong>Identify Warning Signs:</strong> Recognize triggers (racing heart, insomnia, isolating in room).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span><strong>Internal Coping:</strong> Practice 4-7-8 breathing or listen to rain soundscapes in Serenity Corner.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span><strong>Reach Out to Friends:</strong> Message a trusted roommate, classmate, or post on Peer Haven.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
              <span><strong>Call Professional Crisis Lines:</strong> Dial 988 or 1767 for immediate expert help.</span>
            </li>
          </ol>
        </div>

      </div>

    </div>
  );
}
