import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  HeartHandshake,
  Building2,
  ExternalLink,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';

export default function CrisisResources() {
  const [copiedNumber, setCopiedNumber] = useState('');

  const crisisHelplines = [
    {
      name: 'SOS Samaritans of Singapore',
      region: 'Singapore (24/7)',
      number: '1767',
      desc: 'Dedicated 24/7 confidential helpline offering immediate emotional support for crisis moments.',
      badge: '24/7 Hotline'
    },
    {
      name: 'IMH Mental Health Helpline',
      region: 'Institute of Mental Health',
      number: '6389-2222',
      desc: '24-hour medical helpline for mental health emergencies and psychiatric triage.',
      badge: '24/7 Medical'
    },
    {
      name: 'CHATT Youth Mental Health',
      region: 'Youth Support (16-30)',
      number: '6493-6500',
      desc: 'Free confidential mental health assessment and early intervention service for students.',
      badge: 'Youth Support'
    },
  ];

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(''), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Red Action Callout */}
      <div className="bg-rose-900 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-800 text-white flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-5 h-5 text-rose-300" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold">
              24/7 Emergency Care & Hotlines
            </h1>
            <p className="text-xs text-rose-200 mt-0.5">
              If you or someone you know is in immediate physical danger, please call Emergency 999 or 995.
            </p>
          </div>
        </div>

        <a
          href="tel:1767"
          className="px-5 py-2.5 rounded-2xl bg-white text-rose-900 font-bold text-xs hover:bg-rose-100 transition-all shrink-0 shadow-xs flex items-center space-x-2"
        >
          <PhoneCall className="w-4 h-4 text-rose-600 fill-current" />
          <span>Call 1767 SOS</span>
        </a>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crisisHelplines.map((h, idx) => (
          <div
            key={idx}
            className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-5 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-mono">
                  {h.badge}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  {h.region}
                </span>
              </div>

              <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100">
                {h.name}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {h.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200/40 dark:border-stone-800 flex items-center justify-between">
              <a
                href={`tel:${h.number.replace('-', '')}`}
                className="text-base font-extrabold font-mono text-rose-600 dark:text-rose-400 hover:underline"
              >
                {h.number}
              </a>

              <button
                onClick={() => handleCopy(h.number)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-amber-200 transition-all"
              >
                {copiedNumber === h.number ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* University & Counseling Support */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold text-sm font-heading">
          <Building2 className="w-4 h-4 text-orange-600" />
          <span>Campus Counseling & Psychological Services</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50">
            <span className="font-bold text-stone-800 dark:text-stone-100 block">GIIS Healthline</span>
            <p className="text-stone-500 mt-0.5">WhatsApp: +65 9723 4398 (Office Hours) (24/7 Lifeline)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50">
            <span className="font-bold text-stone-800 dark:text-stone-100 block">NUS University Counseling Center</span>
            <p className="text-stone-500 mt-0.5">Hotline: +65 6516 2376 (24/7 Lifeline)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50">
            <span className="font-bold text-stone-800 dark:text-stone-100 block">NTU Wellbeing Center</span>
            <p className="text-stone-500 mt-0.5">Hotline: +65 6790 5133 (Office Hours)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
