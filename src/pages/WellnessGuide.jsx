import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Heart,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Info
} from 'lucide-react';
import {
  BoxBreathingDiagram,
  GroundingVagalDiagram,
  SomaticStretchDiagram,
  PMRProtocolDiagram,
  ProgressiveOverloadDiagram,
  CatCowMobilityDiagram,
  HIITProtocolDiagram,
  ErgonomicsPostureDiagram,
  HybridSystemDiagram
} from '../components/wellness/VisualTutorialDiagrams.jsx';

export default function WellnessGuide() {
  const [selectedPart, setSelectedPart] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCardIds, setOpenCardIds] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const toggleCard = (id) => {
    setOpenCardIds((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setOpenCardIds([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  const handleCollapseAll = () => {
    setOpenCardIds([]);
  };

  const methodologies = [
    // PART I: MENTAL HEALTH
    {
      id: 1,
      part: 'part1',
      partTitle: 'Part I: Mental Health & Mindfulness Practices',
      title: '1. The Five Minute Journal',
      badge: 'Gratitude & Daily Reflection',
      author: 'Intelligent Change',
      primaryFocus: 'Positive psychology, gratitude cultivation, daily intentionality',
      coreMechanism: 'Morning priming & evening reflection loops',
      overview: 'Rooted in positive psychology research, The Five Minute Journal uses structured morning and evening micro-prompts to cultivate daily optimism, emotional stability, and mindfulness. It eliminates journaling burnout by constraining writing time to five minutes daily.',
      diagramComponent: <BoxBreathingDiagram />,
      practiceSteps: [
        'Morning Centering (3 Mins): Perform 4 cycles of Box Breathing (4-4-4-4 technique diagram above), then record 3 gratitude items, 3 daily priorities, and 1 positive affirmation.',
        'Evening Audit (2 Mins): Write 3 amazing highlights of the day and 1 reflection on continuous personal growth.',
      ],
      tag: 'Mental Health'
    },
    {
      id: 2,
      part: 'part1',
      partTitle: 'Part I: Mental Health & Mindfulness Practices',
      title: '2. The Anti-Anxiety Notebook',
      badge: 'Cognitive Behavioral Therapy (CBT)',
      author: 'Therapy Notebooks',
      primaryFocus: 'Anxiety reduction, emotional regulation, cognitive reframing',
      coreMechanism: 'CBT Thought Record + Diaphragmatic vagal stimulation',
      overview: 'Created with cognitive therapists, this tool uses CBT principles to identify cognitive distortions, reduce physiological arousal, and reframe acute anxious thoughts into objective statements.',
      diagramComponent: <GroundingVagalDiagram />,
      practiceSteps: [
        'Physiological Calming: Initiate 3 deep diaphragmatic breaths (belly expands) paired with the 5-4-3-2-1 sensory grounding sequence above to interrupt panic response.',
        'Document & Reframe: Write the anxiety trigger, identify cognitive traps (e.g., catastrophizing), and construct a factual, balanced alternative thought.',
      ],
      tag: 'Mental Health'
    },
    {
      id: 3,
      part: 'part1',
      partTitle: 'Part I: Mental Health & Mindfulness Practices',
      title: '3. The Positive Wellness Journal',
      badge: 'Holistic Mind-Body Integration',
      author: 'The Positive Co.',
      primaryFocus: 'Mind-body wellness, yoga mobility, daily habit balance',
      coreMechanism: '3-Pillar alignment (Mind/Body/Soul) + Gentle Somatic Stretching',
      overview: 'Integrates mental health reflection with somatic movement over 12-week cycles divided into Mind, Body, and Soul sections, cultivating daily self-care and posture mindfulness.',
      diagramComponent: <SomaticStretchDiagram />,
      practiceSteps: [
        'Physical Awakening: Perform 3 repetitions of the Somatic Stretch Sequence (Mountain → Extended → Fold → Cobra) accompanied by full inhalations.',
        'Pillar Entry: Write 1 Mind intention, 1 Body habit (nutrition/water), and 1 Soul reflection.',
      ],
      tag: 'Mental Health'
    },
    {
      id: 4,
      part: 'part1',
      partTitle: 'Part I: Mental Health & Mindfulness Practices',
      title: '4. Wreck This Journal',
      badge: 'Somatic Tension Release',
      author: 'Keri Smith',
      primaryFocus: 'Anti-perfectionism, somatic stress discharge, playfulness',
      coreMechanism: 'Tactile release & emotional desensitization',
      overview: 'Combats rigid perfectionism and creative anxiety through expressive, destructive tactile prompts (staining, tearing, puncturing pages), releasing stored somatic motor tension.',
      diagramComponent: <PMRProtocolDiagram />,
      practiceSteps: [
        'Physical Tension Check: Perform 2 cycles of Progressive Muscle Relaxation (squeeze shoulders/fists for 5s, release forcefully).',
        'Execute Tactile Destruction: Open to a random prompt (e.g., tear page, poke holes, spill paint) and execute rapidly without analyzing aesthetic outcome.',
      ],
      tag: 'Mental Health'
    },

    // PART II: PHYSICAL HEALTH
    {
      id: 5,
      part: 'part2',
      partTitle: 'Part II: Physical Health & Fitness Frameworks',
      title: '5. SaltWrap Daily Fitness Planner',
      badge: 'Strength & Progressive Overload',
      author: 'SaltWrap',
      primaryFocus: 'Progressive strength overload, CNS recovery, macro tracking',
      coreMechanism: 'RPE / Load logging + Recovery readiness metrics',
      overview: 'A high-performance training journal focused on mechanical tension, progressive strength overload, and biological recovery tracking (sleep, HRV, macronutrients).',
      diagramComponent: <ProgressiveOverloadDiagram />,
      practiceSteps: [
        'Pre-Workout Readiness: Log sleep duration, soreness score, and warm-up sets.',
        'Lift & Log: Record working sets, exact loads, reps, and RPE rating. Increase weight by 2.5% once rep target is reached with sound form (squat depth < 90°).',
      ],
      tag: 'Physical Health'
    },
    {
      id: 6,
      part: 'part2',
      partTitle: 'Part II: Physical Health & Fitness Frameworks',
      title: '6. Papier Wellness Journal',
      badge: 'Daily Mobility & Habit Tracking',
      author: 'Papier',
      primaryFocus: 'Hydration pacing, full-body mobility, restorative habits',
      coreMechanism: 'Daily check-in spreads & spinal decompression exercises',
      overview: 'Emphasizes consistent lifestyle movement, hydration pacing, balanced macronutrient intake, and daily spinal joint mobility routines.',
      diagramComponent: <CatCowMobilityDiagram />,
      practiceSteps: [
        'Morning Joint Decompression: Complete 10 fluid Cat-Cow repetitions (diagram above) to lubricate intervertebral discs.',
        'Daily Tracking: Check off 250ml water increments every 2 hours and record daily movement activity.',
      ],
      tag: 'Physical Health'
    },
    {
      id: 7,
      part: 'part2',
      partTitle: 'Part II: Physical Health & Fitness Frameworks',
      title: '7. Fitlosophy Fitbook',
      badge: '12-Week Sprint & HIIT Tracking',
      author: 'Fitlosophy',
      primaryFocus: 'Quarterly fitness sprints, HIIT conditioning, body metrics',
      coreMechanism: '12-Week target setting & heart-rate zone tracking',
      overview: 'Utilizes 12-week goal blocks paired with high-intensity interval training (HIIT) protocols and strict nutritional accountability spreads.',
      diagramComponent: <HIITProtocolDiagram />,
      practiceSteps: [
        'Execute Conditioning: Perform 10 cycles of 30-second all-out sprint efforts interspersed with 60-second recovery walks (diagram above).',
        'Weekly Metric Review: Record heart rate peak and average, body measurements, and weekly goal compliance.',
      ],
      tag: 'Physical Health'
    },
    {
      id: 8,
      part: 'part2',
      partTitle: 'Part II: Physical Health & Fitness Frameworks',
      title: '8. Moleskine Passion Journal – Wellness',
      badge: 'Long-Term Ergonomics & Health Archiving',
      author: 'Moleskine',
      primaryFocus: 'Long-term medical & physical archiving, postural alignment',
      coreMechanism: 'Tabbed records & workplace ergonomic alignment',
      overview: 'A structured health binder meant for multi-year tracking of blood panels, physical milestones, sports achievements, and ergonomics.',
      diagramComponent: <ErgonomicsPostureDiagram />,
      practiceSteps: [
        'Ergonomic Setup: Adjust desk and chair to achieve the 90° spinal neutrality guidelines shown above.',
        'Log Health Milestones: File quarterly blood biomarkers, physical screening data, and year-end fitness achievements in the tabbed sections.',
      ],
      tag: 'Physical Health'
    },

    // PART III: HYBRID SYSTEMS
    {
      id: 9,
      part: 'part3',
      partTitle: 'Part III: Hybrid & Digital Wellness Systems',
      title: '9. Custom Hybrid & Digital Systems',
      badge: 'Custom Dot-Grid & Workspace Systems',
      author: 'Flexible Systems',
      primaryFocus: 'Customized well-being architectures',
      coreMechanism: 'Custom dot-grid bullet journals & Notion/Day One relational databases',
      overview: 'Custom dot-grid bullet journals and digital relational databases (Notion/Day One) allow complete flexibility to combine mood tracking, strength records, and habits in a single personalized workspace.',
      diagramComponent: <HybridSystemDiagram />,
      practiceSteps: [
        'Analog Bullet Grid Setup: Draw a monthly habit matrix tracking daily compliance (mind meditation, workout sessions, sleep hours) using checkboxes.',
        'Digital Workspace Setup: Build two linked databases in Notion—one for daily emotional reflections and one for exercise volume—and review weekly correlations between workout volume and mood scores.',
      ],
      tag: 'Hybrid Systems'
    }
  ];

  const filtered = methodologies.filter((m) => {
    const matchesPart = selectedPart === 'all' || m.part === selectedPart;
    const matchesQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPart && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-stone-800 shadow-xs relative overflow-hidden space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 tracking-wider uppercase font-serif">
            COMPLETE PRACTICE GUIDE & TOOLKIT
          </span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Mind & Body Wellness Guide
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-serif italic">
            An authoritative handbook detailing top mental and physical health journals, featuring step-by-step implementation methods and visual exercise & breathing tutorials.
          </p>
        </div>

        <div className="pt-2 border-t border-amber-200/50 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
          Structured wellness tracking provides the foundation for sustainable mental resilience and physical vitality. Selecting the right practice is essential for long-term student success.
        </div>
      </div>

      {/* Controls: Category Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#FFFDF9] dark:bg-[#262220] p-1.5 rounded-2xl border border-amber-200/80 dark:border-stone-800 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedPart('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPart === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            All Methodologies (9)
          </button>
          <button
            onClick={() => setSelectedPart('part1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPart === 'part1'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            Part I: Mental Health
          </button>
          <button
            onClick={() => setSelectedPart('part2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPart === 'part2'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            Part II: Physical Health
          </button>
          <button
            onClick={() => setSelectedPart('part3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPart === 'part3'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            Part III: Hybrid Systems
          </button>
        </div>

        {/* Search & Bulk Expand Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides or methods..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FFFDF9] dark:bg-[#262220] border border-amber-200/80 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={openCardIds.length === 9 ? handleCollapseAll : handleExpandAll}
            className="px-3 py-2 rounded-2xl border border-amber-200/80 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#262220] hover:bg-amber-100/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            {openCardIds.length === 9 ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Guide Method Cards List */}
      <div className="space-y-6">
        {filtered.map((item) => {
          const isOpen = openCardIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-[#FFFDF9] dark:bg-[#262220] rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => toggleCard(item.id)}
                className="p-5 sm:p-6 bg-[#FAF6EE]/70 dark:bg-stone-900/60 border-b border-amber-200/60 dark:border-stone-800 flex items-start justify-between cursor-pointer hover:bg-amber-100/40 dark:hover:bg-stone-800/60 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 uppercase tracking-wider font-mono">
                      {item.badge}
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 font-serif">
                      by {item.author}
                    </span>
                  </div>

                  <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h2>
                </div>

                <button
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all shrink-0"
                >
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Card Body */}
              {isOpen && (
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Overview & Theoretical Framework */}
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                      {item.overview}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-amber-200/50 dark:border-stone-800">
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200 block">Primary Focus:</span>
                        <span className="text-stone-600 dark:text-stone-400">{item.primaryFocus}</span>
                      </div>
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200 block">Core Mechanism:</span>
                        <span className="text-stone-600 dark:text-stone-400">{item.coreMechanism}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Visual Tutorial Diagram */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block uppercase tracking-wider font-mono">
                      Tutorial Diagram & Practice Mechanics:
                    </span>
                    {item.diagramComponent}
                  </div>

                  {/* Daily Practice Method Steps */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5 font-serif">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      <span>How to Use: Daily Practice Method</span>
                    </span>
                    <ol className="space-y-1.5 pl-4 text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed list-decimal">
                      {item.practiceSteps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
