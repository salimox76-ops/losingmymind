import React, { useState, useEffect } from 'react';
import { useBirthday } from '../../context/BirthdayContext';
import { Sparkles, Shield, Heart, ChevronRight, Edit3 } from 'lucide-react';

interface JourneyMilestone {
  category: string;
  badgeIcon: string;
  title: string;
  timeframe: string;
  story: string;
  reflection: string;
  lesson: string;
}

const DEFAULT_MILESTONES: JourneyMilestone[] = [
  {
    category: "Milestone 1",
    badgeIcon: "💬",
    title: "Late Night Calls & No Sleep",
    timeframe: "Late Nights",
    story:
      "Even back when we were just friends, I'd stay up talking to you, even when I knew I had to wake up early or had things to do the next day. Somehow, I never really minded losing sleep over it. I genuinely enjoyed talking to you, and what was supposed to be a short conversation would turn into hours.",
    reflection:
      "I didn't know what you'd become to me, but I knew I didn't want those conversations to end.",
    lesson: "I think that's when I first started realizing you were someone special to me. Even before I fully understood what you would become in my life, talking to you was already something I looked forward to. You were special to me from the very beginning."
  },
  {
    category: "Milestone 2",
    badgeIcon: "🛡️",
    title: "Handling Bad Days Together",
    timeframe: "Through Everything",
    story:
      "We've been through quite a lot together. Some problems affected us both, while others were things one of us had to deal with personally. But whatever it was, we always found a way to face it together. We talked things through, stayed close, and even when we needed some space from each other, we always found our way back. We never gave up on each other. And whenever I felt frustrated, angry, stressed, or just overwhelmed, you were there to help me through it.",
    reflection:
      "Being able to talk through things without making it weird proved we're an actual team.",
    lesson: "It taught me that being together isn't just about sharing the good moments. It's also about choosing to stay, understanding each other, and working through the difficult ones. I'm genuinely thankful to have someone like you by my side, someone I can count on even when things aren't easy."
  },
  {
    category: "Milestone 3",
    badgeIcon: "🎮",
    title: "Games, Calls & Normal Life",
    timeframe: "Every Day",
    story:
      "A lot of our time together is spent doing the simplest things. I usually start the day by messaging you on Instagram, checking on you, and sometimes going back to sleep afterwards. Then we get on Discord, talk about how our day is going, how we're feeling, and just enjoy each other's company.\n\nWe play League together, with you on Briar mid and me on Viego jungle. Even when our games don't go as planned, I still enjoy playing with you. I like watching you play, even when you don't listen to my advice. After League, we sometimes listen to music, play other games together, or watch movies and shows.\n\nAnd at the end of the day, there's usually another call or more messages. Sometimes you even fall asleep while we're still on the phone. These little routines have become a normal part of my days, and honestly, they're some of my favourite parts.",
    reflection:
      "Honestly, the random ordinary days are the ones I like most.",
    lesson: "It made me realize that I don't need every moment with you to be something special or planned. Even doing ordinary things together feels different when it's with you. I genuinely enjoy having you as part of my everyday life, and I wouldn't trade these little routines for anything."
  },
  {
    category: "Milestone 4",
    badgeIcon: "🎂",
    title: "Turning 21",
    timeframe: "November 23, 2026",
    story:
      "And now you're officially 21. Seeing how much we've both grown since that first awkward text message is crazy. It's amazing to think about how things developed and how much we've been through together. I'm really proud of the person you've become and the person you're becoming, and I'm just genuinely grateful to have you in my life.",
    reflection:
      "You're turning 21, and I'm just happy I get to be here celebrating with you.",
    lesson: "There's still so much ahead of us. So much more for us to experience, learn, and become. I hope we get to look back years from now and see just how far we've come, knowing this was only the beginning."
  }
];

export const Chapter3Journey: React.FC = () => {
  const { nextChapter } = useBirthday();
  const [activeIdx, setActiveIdx] = useState(0);
  const [milestones, setMilestones] = useState<JourneyMilestone[]>(() => {
    try {
      const saved = localStorage.getItem('bday_journey_milestones');
      if (!saved) return DEFAULT_MILESTONES;
      const parsed = JSON.parse(saved) as JourneyMilestone[];
      const migrationKey = 'bday_journey_late_nights_reflection_v1';
      if (!localStorage.getItem(migrationKey) && parsed.length > 0) {
        parsed[0] = {
          ...parsed[0],
          story: DEFAULT_MILESTONES[0].story,
          reflection: DEFAULT_MILESTONES[0].reflection,
          lesson: DEFAULT_MILESTONES[0].lesson
        };
        localStorage.setItem(migrationKey, 'true');
      }
      const approvedMilestoneMigrations = [
        { index: 1, key: 'bday_journey_milestone_2_approved_copy_v1' },
        { index: 2, key: 'bday_journey_milestone_3_approved_copy_v1' },
        { index: 3, key: 'bday_journey_milestone_4_approved_copy_v1' }
      ];
      approvedMilestoneMigrations.forEach(({ index, key }) => {
        if (!localStorage.getItem(key) && parsed[index] && DEFAULT_MILESTONES[index]) {
          parsed[index] = {
            ...parsed[index],
            story: DEFAULT_MILESTONES[index].story,
            lesson: DEFAULT_MILESTONES[index].lesson
          };
          localStorage.setItem(key, 'true');
        }
      });
      return parsed;
    } catch {
      return DEFAULT_MILESTONES;
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('bday_journey_milestones', JSON.stringify(milestones));
  }, [milestones]);

  const current = milestones[activeIdx];

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-20 select-none overflow-y-auto">
      {/* Background with dark crimson atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#080205]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4c0519]/40 via-[#18040d]/60 to-[#080205]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f43f5e]/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#fb7185] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#fb7185]" />
              <span>Chapter III · Our Odyssey</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#ffe4e6] mt-1 tracking-tight">
              Our Journey Together
            </h2>
            <p className="font-serif italic text-sm sm:text-base text-[#fda4af]/70 mt-1">
              "The chapters we’ve lived, the storms we weathered, and the bond that only grew deeper."
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#f43f5e]/40 bg-[#2b0a1a]/60 hover:bg-[#431029] text-xs text-[#fecdd3] transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#fb7185]" />
            <span>{isEditing ? "Done Editing" : "Personalize Notes"}</span>
          </button>
        </div>

        {/* Milestone Steps Carousel Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {milestones.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-300 ${
                activeIdx === idx
                  ? 'bg-gradient-to-br from-[#881337] to-[#4c0519] border-[#fb7185] text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]'
                  : 'bg-[#15040d]/80 border-white/10 text-[#fda4af]/70 hover:bg-[#200714] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{m.badgeIcon}</span>
                <span className="text-[10px] font-mono text-[#fb7185] uppercase">
                  {m.category}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-serif font-semibold truncate text-[#ffe4e6]">
                {m.title}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Milestone Hero Card */}
        <div className="rounded-2xl bg-[#13030b]/90 border border-[#f43f5e]/30 backdrop-blur-md p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          {isEditing ? (
            /* Editing form */
            <div className="flex flex-col gap-4 text-xs">
              <span className="font-mono text-[#fb7185] uppercase tracking-wider">
                Editing Milestone: {current.title}
              </span>
              <div>
                <label className="text-white/60 block mb-1">Milestone Title:</label>
                <input
                  type="text"
                  value={current.title}
                  onChange={e => {
                    const val = e.target.value;
                    setMilestones(prev =>
                      prev.map((m, idx) => (idx === activeIdx ? { ...m, title: val } : m))
                    );
                  }}
                  className="w-full bg-[#1b0511] border border-white/20 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 block mb-1">Timeframe / Date:</label>
                <input
                  type="text"
                  value={current.timeframe}
                  onChange={e => {
                    const val = e.target.value;
                    setMilestones(prev =>
                      prev.map((m, idx) => (idx === activeIdx ? { ...m, timeframe: val } : m))
                    );
                  }}
                  className="w-full bg-[#1b0511] border border-white/20 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 block mb-1">Story & Memory:</label>
                <textarea
                  rows={4}
                  value={current.story}
                  onChange={e => {
                    const val = e.target.value;
                    setMilestones(prev =>
                      prev.map((m, idx) => (idx === activeIdx ? { ...m, story: val } : m))
                    );
                  }}
                  className="w-full bg-[#1b0511] border border-white/20 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 block mb-1">Side Text:</label>
                <textarea
                  rows={3}
                  value={current.lesson}
                  onChange={e => {
                    const val = e.target.value;
                    setMilestones(prev =>
                      prev.map((m, idx) => (idx === activeIdx ? { ...m, lesson: val } : m))
                    );
                  }}
                  className="w-full bg-[#1b0511] border border-white/20 rounded p-2 text-white"
                />
              </div>
            </div>
          ) : (
            /* Cinematic View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Story Narrative (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#881337]/50 border border-[#f43f5e]/30 text-[11px] font-mono text-[#fecdd3]">
                    {current.category}
                  </span>
                  <span className="text-xs font-mono text-[#fda4af]/60">
                    {current.timeframe}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#ffe4e6] leading-snug">
                  {current.title}
                </h3>

                <p className="font-serif text-base sm:text-lg text-[#fce7f3]/90 leading-relaxed pt-2">
                  {current.story}
                </p>

                <div className="pt-2">
                  <div className="font-serif italic text-sm text-[#fda4af] pl-4 border-l-2 border-[#e11d48]">
                    "{current.reflection}"
                  </div>
                </div>
              </div>

              {/* Reflection & Key Lesson Box (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="rounded-xl bg-[#230716]/60 border border-[#f43f5e]/30 p-5">
                  <p className="font-serif italic text-sm sm:text-base text-[#ffe4e6] leading-relaxed">
                    {current.lesson}
                  </p>
                </div>

                <div className="rounded-xl bg-[#18040e]/60 border border-white/10 p-5 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-[#881337]/30 text-[#fb7185] shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/50 uppercase">Teamwork Promise</div>
                    <div className="font-serif text-xs sm:text-sm text-[#fda4af] mt-0.5">
                      "Side by side through every level, every boss fight, every sunrise."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Card Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#fda4af]/60">
              <Heart className="w-3.5 h-3.5 text-[#fb7185]" />
              <span>Milestone {activeIdx + 1} of {milestones.length}</span>
            </div>

            {activeIdx < milestones.length - 1 ? (
              <button
                onClick={() => setActiveIdx(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#881337] hover:bg-[#9f1239] text-white text-xs font-serif transition-colors"
              >
                <span>Next Milestone</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={nextChapter}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white text-xs font-serif font-medium transition-all shadow-md"
              >
                <span>Continue To The Little Things</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
