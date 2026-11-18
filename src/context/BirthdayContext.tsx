import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctMessage: string;
  wrongMessage: string;
}

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What's something about yourself that you know drives me absolutely crazy?",
    options: [
      "Your laugh and your voice.",
      "Your teasing and the things you say.",
      "Your looks and the way you carry yourself.",
      "Pretty much everything about you."
    ],
    correctIndex: 3,
    correctMessage: "If you pick anything besides 4 you're larping",
    wrongMessage: "crazy foid"
  },
  {
    id: 2,
    question: "What do you think my cock misses the most?",
    options: [
      "Your mouth",
      "Your hands",
      "Your body",
      "All of the above"
    ],
    correctIndex: 3,
    correctMessage: "7:43",
    wrongMessage: "maghandir walo bcs i know you'll pick the right answer"
  },
  {
    id: 3,
    question: "What's one thing you'd be curious to try with me?",
    options: [
      "Taking the lead.",
      "Letting me take the lead.",
      "Trying something completely new together.",
      "Something you've been too shy to suggest."
    ],
    correctIndex: 0,
    correctMessage: "no correct answer tbh just wanted to see",
    wrongMessage: "no false answer tbh just wanted to see"
  },
  {
    id: 4,
    question: "If you could ask me one question and I had to answer honestly, what would you ask?",
    options: [
      "What's your biggest fantasy involving me?",
      "What's something you've always wanted to try?",
      "What's the most attractive thing I do without realizing?",
      "What's something you've never told me?"
    ],
    correctIndex: 2,
    correctMessage: "-",
    wrongMessage: "-"
  },
  {
    id: 5,
    question: "What's something you'd secretly love me to initiate?",
    options: [
      "A surprise kiss.",
      "Taking the lead when we're alone.",
      "Whispering something naughty.",
      "Something you've been imagining for a while."
    ],
    correctIndex: 0,
    correctMessage: "-",
    wrongMessage: "-"
  },
  {
    id: 6,
    question: "If you could make one request and I couldn't say no to it, what would it be?",
    options: [
      "Let you take control for the night.",
      "Let you choose everything we do.",
      "Give you my undivided attention.",
      "Tell you one of my secrets."
    ],
    correctIndex: 0,
    correctMessage: "-",
    wrongMessage: "-"
  },
  {
    id: 7,
    question: "What would make you feel most desired by me?",
    options: [
      "The way I look at you",
      "The way I kiss you",
      "The things I whisper to you",
      "The way I make you feel throughout the night"
    ],
    correctIndex: 0,
    correctMessage: "-",
    wrongMessage: "-"
  },
  {
    id: 8,
    question: "What's something you'd want to experience without having to ask for it?",
    options: [
      "Being kissed unexpectedly.",
      "Being held close.",
      "Being reassured and made comfortable.",
      "Being surprised by affection."
    ],
    correctIndex: 0,
    correctMessage: "-",
    wrongMessage: "-"
  },
  {
    id: 9,
    question: "What would you want more of this night?",
    options: [
      "Passion.",
      "Affection.",
      "Spontaneity.",
      "Intimacy."
    ],
    correctIndex: 0,
    correctMessage: "-",
    wrongMessage: "-"
  },
  {
    id: 10,
    question: "how do you wanna fuck, after this.",
    options: [
      "Missionary",
      "Doggy",
      "Cowgirl",
      "Not right now"
    ],
    correctIndex: 0,
    correctMessage: "-",
    wrongMessage: "-"
  }
];

export interface BirthdayContextType {
  currentChapter: number;
  goToChapter: (chapter: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  unlockedChapters: number[];
  isArchiveOpen: boolean;
  setIsArchiveOpen: (open: boolean) => void;
  
  // Audio
  isMuted: boolean;
  toggleMute: () => void;

  // Custom Cursor
  isCatCursorActive: boolean;
  toggleCatCursor: () => void;

  // Cake State (Chapter 6)
  candles: boolean[];
  extinguishCandle: (index: number) => void;
  extinguishAllCandles: () => void;
  cakeSliceState: 'uncut' | 'cut' | 'bite1' | 'bite2' | 'bite3' | 'eaten';
  cutCake: () => void;
  takeBite: () => void;
  resetCake: () => void;

  // Letter State (Chapter 7)
  envelopeOpen: boolean;
  openEnvelope: () => void;
  resetEnvelope: () => void;

  // Quiz State (Chapter 5)
  quizQuestions: QuizQuestion[];
  setQuizQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  updateQuizQuestion: (updated: QuizQuestion) => void;
  resetQuizQuestionsToDefault: () => void;
  quizCurrentQuestion: number;
  quizAnswers: Record<number, number>;
  quizSubmitted: Record<number, boolean>;
  selectAnswer: (questionId: number, optionIndex: number) => void;
  submitAnswer: (questionId: number) => void;
  nextQuizQuestion: () => void;
  resetQuiz: () => void;

  // Bunny companion dialogs
  bunnyThought: string | null;
  setBunnyThought: (thought: string | null) => void;
  triggerBunnyEasterEgg: () => void;
}

const BirthdayContext = createContext<BirthdayContextType | null>(null);

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChapter, setCurrentChapter] = useState<number>(() => {
    const saved = localStorage.getItem('bday_chapter');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 1), 8) : 1;
  });

  const [unlockedChapters, setUnlockedChapters] = useState<number[]>(() => {
    const saved = localStorage.getItem('bday_unlocked');
    return saved ? JSON.parse(saved) : [1];
  });

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCatCursorActive, setIsCatCursorActive] = useState(true);

  // Exactly 21 candles for 21st birthday (all true = lit)
  const [candles, setCandles] = useState<boolean[]>(() => Array(21).fill(true));
  const [cakeSliceState, setCakeSliceState] = useState<'uncut' | 'cut' | 'bite1' | 'bite2' | 'bite3' | 'eaten'>('uncut');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // Quiz state with 10 questions & editing support
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem('bday_quiz_questions_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 10) return parsed;
      } catch {
        // Fall back to default
      }
    }
    return DEFAULT_QUIZ_QUESTIONS;
  });

  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  // Bunny easter eggs
  const [bunnyThought, setBunnyThought] = useState<string | null>("Hey... you can tap me whenever you want a little reminder 🐰");

  useEffect(() => {
    localStorage.setItem('bday_chapter', currentChapter.toString());
    setUnlockedChapters(prev => {
      if (!prev.includes(currentChapter)) {
        const next = [...prev, currentChapter].sort((a, b) => a - b);
        localStorage.setItem('bday_unlocked', JSON.stringify(next));
        return next;
      }
      return prev;
    });
  }, [currentChapter]);

  useEffect(() => {
    localStorage.setItem('bday_quiz_questions_v2', JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  const updateQuizQuestion = (updated: QuizQuestion) => {
    setQuizQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
  };

  const resetQuizQuestionsToDefault = () => {
    setQuizQuestions(DEFAULT_QUIZ_QUESTIONS);
    localStorage.removeItem('bday_quiz_questions_v2');
  };

  const goToChapter = (chapter: number) => {
    if (chapter >= 1 && chapter <= 8) {
      setCurrentChapter(chapter);
      setIsArchiveOpen(false);
      sound.playChime(620);
    }
  };

  const nextChapter = () => {
    if (currentChapter < 8) {
      goToChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      goToChapter(currentChapter - 1);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.playChime(740);
    }
  };

  const toggleCatCursor = () => {
    setIsCatCursorActive(prev => !prev);
  };

  // Candle interactions
  const extinguishCandle = (index: number) => {
    if (!candles[index]) return;
    sound.playCandleBlow();
    setCandles(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  const extinguishAllCandles = () => {
    sound.playCandleBlow();
    setCandles(Array(21).fill(false));
  };

  const cutCake = () => {
    if (cakeSliceState === 'uncut') {
      sound.playCakeCut();
      setCakeSliceState('cut');
    }
  };

  const takeBite = () => {
    sound.playBite();
    if (cakeSliceState === 'cut') setCakeSliceState('bite1');
    else if (cakeSliceState === 'bite1') setCakeSliceState('bite2');
    else if (cakeSliceState === 'bite2') setCakeSliceState('bite3');
    else if (cakeSliceState === 'bite3') setCakeSliceState('eaten');
  };

  const resetCake = () => {
    setCandles(Array(21).fill(true));
    setCakeSliceState('uncut');
    sound.playChime(550);
  };

  const openEnvelope = () => {
    sound.playPaperRustle();
    setEnvelopeOpen(true);
  };

  const resetEnvelope = () => {
    setEnvelopeOpen(false);
  };

  // Quiz methods
  const selectAnswer = (questionId: number, optionIndex: number) => {
    if (quizSubmitted[questionId]) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitAnswer = (questionId: number) => {
    const selected = quizAnswers[questionId];
    if (selected === undefined) return;
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));
    const question = quizQuestions.find(q => q.id === questionId);
    if (question && selected === question.correctIndex) {
      sound.playChime(880);
    } else {
      sound.playBoop();
    }
  };

  const nextQuizQuestion = () => {
    if (quizCurrentQuestion < quizQuestions.length - 1) {
      setQuizCurrentQuestion(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setQuizCurrentQuestion(0);
    setQuizAnswers({});
    setQuizSubmitted({});
    sound.playChime(600);
  };

  const bunnyThoughts = [
    "Bunny says: I heard you asked for his credit card on day two... iconic move honestly 💳",
    "Bunny says: Don't let him lie, you know who caught feelings first! 🐰",
    "Bunny whispers: Take your time with the cake candles, make a real wish. 🎂",
    "Bunny says: Happy 21st! You're his favourite person in the whole world. ✨",
    "Bunny says: Briar frenzy into the tower, let's go! 🐾"
  ];

  const triggerBunnyEasterEgg = () => {
    sound.playHop();
    const randomThought = bunnyThoughts[Math.floor(Math.random() * bunnyThoughts.length)];
    setBunnyThought(randomThought);
  };

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        nextChapter();
      } else if (e.key === 'ArrowLeft') {
        prevChapter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter]);

  return (
    <BirthdayContext.Provider
      value={{
        currentChapter,
        goToChapter,
        nextChapter,
        prevChapter,
        unlockedChapters,
        isArchiveOpen,
        setIsArchiveOpen,
        isMuted,
        toggleMute,
        isCatCursorActive,
        toggleCatCursor,
        candles,
        extinguishCandle,
        extinguishAllCandles,
        cakeSliceState,
        cutCake,
        takeBite,
        resetCake,
        envelopeOpen,
        openEnvelope,
        resetEnvelope,
        quizQuestions,
        setQuizQuestions,
        updateQuizQuestion,
        resetQuizQuestionsToDefault,
        quizCurrentQuestion,
        quizAnswers,
        quizSubmitted,
        selectAnswer,
        submitAnswer,
        nextQuizQuestion,
        resetQuiz,
        bunnyThought,
        setBunnyThought,
        triggerBunnyEasterEgg,
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used within BirthdayProvider');
  }
  return context;
};
