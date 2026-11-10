import React, { useState, useEffect } from 'react';
import { Heart, Star, Award, ArrowRight, Volume2, CheckCircle, XCircle, Link, Moon, Sun } from 'lucide-react';

const MarathiLearningApp = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [shuffledPairs, setShuffledPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Audio functions
  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (type === 'correct') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
      } else if (type === 'wrong') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.type = 'triangle';
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  // Text-to-Speech for Marathi pronunciation
  const speakMarathi = (text, englishFallback) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice => 
        voice.lang.includes('hi') || voice.lang.includes('mr') || voice.name.includes('Hindi')
      );
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      if (!selectedVoice || !selectedVoice.lang.includes('hi')) {
        utterance.text = englishFallback || text;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      playSound('correct');
    }
  };

  // Load voices when they're available
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        }
      };
      
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const lessons = [
    {
      title: "Basic Greetings",
      description: "Learn essential Marathi greetings",
      color: "from-rose-100 to-pink-100",
      questions: [
        {
          type: "translate",
          english: "Hello",
          marathi: "नमस्कार",
          pronunciation: "Namaskar",
          options: ["नमस्कार", "धन्यवाद", "कसे आहात", "बाय"],
          correct: "नमस्कार"
        },
        {
          type: "translate", 
          english: "Thank you",
          marathi: "धन्यवाद",
          pronunciation: "Dhanyawad",
          options: ["नमस्कार", "धन्यवाद", "माफ करा", "कृपया"],
          correct: "धन्यवाद"
        },
        {
          type: "translate",
          english: "How are you?",
          marathi: "तुम्ही कसे आहात?",
          pronunciation: "Tumhi kase ahat?",
          options: ["तुम्ही कसे आहात?", "माझे नाव काय?", "तुम्हाला कसे वाटते?", "कुठे आहात?"],
          correct: "तुम्ही कसे आहात?"
        }
      ]
    },
    {
      title: "Family Members",
      description: "Learn family relationships in Marathi",
      color: "from-blue-100 to-cyan-100", 
      questions: [
        {
          type: "translate",
          english: "Mother",
          marathi: "आई",
          pronunciation: "Aai",
          options: ["आई", "वडील", "भाऊ", "बहीण"],
          correct: "आई"
        },
        {
          type: "translate",
          english: "Father", 
          marathi: "वडील",
          pronunciation: "Vadil",
          options: ["आई", "वडील", "आजोबा", "आजी"],
          correct: "वडील"
        },
        {
          type: "match",
          title: "Match the Family Members",
          pairs: [
            { english: "Mother", marathi: "आई", pronunciation: "Aai" },
            { english: "Father", marathi: "वडील", pronunciation: "Vadil" },
            { english: "Brother", marathi: "भाऊ", pronunciation: "Bhau" },
            { english: "Sister", marathi: "बहीण", pronunciation: "Bahin" }
          ]
        }
      ]
    },
    {
      title: "Numbers",
      description: "Learn basic numbers in Marathi",
      color: "from-green-100 to-emerald-100",
      questions: [
        {
          type: "match",
          title: "Match the Numbers",
          pairs: [
            { english: "One", marathi: "एक", pronunciation: "Ek" },
            { english: "Two", marathi: "दोन", pronunciation: "Don" },
            { english: "Three", marathi: "तीन", pronunciation: "Teen" },
            { english: "Four", marathi: "चार", pronunciation: "Char" },
            { english: "Five", marathi: "पाच", pronunciation: "Paach" }
          ]
        }
      ]
    }
  ];

  const currentLessonData = lessons[currentLesson];
  const currentQuestionData = currentLessonData ? currentLessonData.questions[currentQuestion] : null;

  // Initialize shuffled pairs when question changes
  useEffect(() => {
    if (currentQuestionData && currentQuestionData.type === 'match' && currentQuestionData.pairs) {
      const newShuffled = [...currentQuestionData.pairs].sort(() => Math.random() - 0.5);
      setShuffledPairs(newShuffled);
    }
  }, [currentLesson, currentQuestion]);

  const handleMatchSelect = (item, side) => {
    if (side === 'left') {
      setSelectedLeft(selectedLeft === item ? null : item);
    } else {
      setSelectedRight(selectedRight === item ? null : item);
    }
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null && currentQuestionData && currentQuestionData.type === 'match') {
      const isMatch = currentQuestionData.pairs.some(pair => 
        (pair.english === selectedLeft && pair.marathi === selectedRight) ||
        (pair.marathi === selectedLeft && pair.english === selectedRight)
      );
      
      setTimeout(() => {
        if (isMatch) {
          playSound('correct');
          setMatchedPairs(prev => new Set([...prev, selectedLeft, selectedRight]));
          setXP(prev => prev + 5);
          setStreak(prev => prev + 1);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 800);
        } else {
          playSound('wrong');
          const newHearts = Math.max(0, hearts - 1);
          setHearts(newHearts);
          if (newHearts === 0) {
            setGameOver(true);
          }
        }
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  }, [selectedLeft, selectedRight, hearts]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!currentQuestionData) return;
    
    const correct = selectedAnswer === currentQuestionData.correct;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      setXP(prev => prev + 10);
      setStreak(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    } else {
      playSound('wrong');
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      setStreak(0);
      if (newHearts === 0) {
        setGameOver(true);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < currentLessonData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentLesson < lessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
      setCurrentQuestion(0);
    }
    setSelectedAnswer('');
    setShowResult(false);
    setMatchedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const playPronunciation = (marathiText, pronunciation) => {
    speakMarathi(marathiText, pronunciation);
  };

  const isMatchGameComplete = () => {
    return currentQuestionData && currentQuestionData.type === 'match' && 
           currentQuestionData.pairs &&
           matchedPairs.size === currentQuestionData.pairs.length * 2;
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setHearts(5);
    setXP(0);
    setStreak(0);
    setCurrentLesson(0);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setMatchedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setGameOver(false);
  };

  const goToMenu = () => {
    setGameOver(false);
    setGameStarted(false);
    setCurrentLesson(0);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setHearts(5);
    setXP(0);
    setStreak(0);
    setMatchedPairs(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Main Menu Component
  if (!gameStarted) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50'
      }`}>
        {/* Simple animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse ${
            darkMode ? 'bg-blue-400' : 'bg-blue-300'
          }`}></div>
          <div className={`absolute top-40 right-20 w-24 h-24 rounded-full opacity-20 animate-pulse ${
            darkMode ? 'bg-cyan-400' : 'bg-cyan-300'
          }`}></div>
          <div className={`absolute bottom-40 left-20 w-20 h-20 rounded-full opacity-20 animate-pulse ${
            darkMode ? 'bg-sky-400' : 'bg-sky-300'
          }`}></div>
        </div>

        {/* Menu Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
          {/* Dark mode toggle */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                darkMode 
                  ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo and Title */}
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-6xl shadow-2xl">
              म
            </div>
            <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                BolChaal
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Master the beauty of Marathi language
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="px-12 py-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto"
          >
            Start Learning
            <ArrowRight className="w-8 h-8" />
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className={`p-6 rounded-2xl backdrop-blur-sm ${
              darkMode ? 'bg-white/10' : 'bg-white/40'
            }`}>
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Interactive Learning</h3>
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Engaging exercises with immediate feedback</p>
            </div>
            
            <div className={`p-6 rounded-2xl backdrop-blur-sm ${
              darkMode ? 'bg-white/10' : 'bg-white/40'
            }`}>
              <Volume2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Audio Pronunciation</h3>
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Listen and learn proper Marathi pronunciation</p>
            </div>
            
            <div className={`p-6 rounded-2xl backdrop-blur-sm ${
              darkMode ? 'bg-white/10' : 'bg-white/40'
            }`}>
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Track Progress</h3>
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Earn XP and maintain learning streaks</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameOver) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50'
      }`}>
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-6xl shadow-2xl animate-pulse">
              💔
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Game Over!
              </span>
            </h1>
            <p className={`text-xl mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              आपले हृदय संपले! (Your hearts are finished!)
            </p>
            <p className={`text-lg mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Don't worry, learning is a journey. Try again!
            </p>
          </div>

          <div className={`p-6 rounded-2xl backdrop-blur-sm mb-8 ${
            darkMode ? 'bg-white/10' : 'bg-white/40'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Your Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{xp}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{streak}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Best Streak</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🔄 Restart Game
            </button>
            <button
              onClick={goToMenu}
              className={`px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check for game data
  if (!currentLessonData || !currentQuestionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
          <button
            onClick={goToMenu}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`flex items-center justify-between mb-8 backdrop-blur-sm rounded-2xl p-4 shadow-lg transition-colors duration-300 ${
          darkMode ? 'bg-gray-800/70 border border-gray-700' : 'bg-white/70'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>BolChaal</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Back to menu button */}
            <button
              onClick={goToMenu}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ← Menu
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                darkMode 
                  ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-600">{hearts}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-600">{xp} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-orange-600">{streak}🔥</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {currentLessonData.title} - Question {currentQuestion + 1} of {currentLessonData.questions.length}
            </span>
            <span className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {Math.round(((currentQuestion) / currentLessonData.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className={`w-full rounded-full h-3 overflow-hidden transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentQuestion / currentLessonData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80'
        }`}>
          
          {currentQuestionData.type === 'translate' ? (
            <>
              {/* Translation Question */}
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Translate to Marathi
                </h2>
                <div className={`rounded-2xl p-6 mb-6 transition-colors duration-300 ${
                  darkMode ? 'bg-gradient-to-r from-blue-800/50 to-cyan-800/50' : 'bg-gradient-to-r from-blue-100 to-cyan-100'
                }`}>
                  <p className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    "{currentQuestionData.english}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => playPronunciation(currentQuestionData.marathi, currentQuestionData.pronunciation)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{currentQuestionData.pronunciation}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg ${
                      selectedAnswer === option
                        ? showResult
                          ? isCorrect && option === currentQuestionData.correct
                            ? darkMode ? 'border-green-400 bg-green-900/50 text-green-300' : 'border-green-400 bg-green-50 text-green-700'
                            : option === currentQuestionData.correct
                            ? darkMode ? 'border-green-400 bg-green-900/50 text-green-300' : 'border-green-400 bg-green-50 text-green-700'
                            : darkMode ? 'border-red-400 bg-red-900/50 text-red-300' : 'border-red-400 bg-red-50 text-red-700'
                          : darkMode ? 'border-blue-400 bg-blue-900/50 text-blue-300' : 'border-blue-400 bg-blue-50 text-blue-700'
                        : showResult && option === currentQuestionData.correct
                        ? darkMode ? 'border-green-400 bg-green-900/50 text-green-300' : 'border-green-400 bg-green-50 text-green-700'
                        : darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-blue-400 hover:bg-blue-900/50 hover:scale-102'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && (
                        <div>
                          {option === currentQuestionData.correct ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : selectedAnswer === option ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Match Game */}
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {currentQuestionData.title}
                </h2>
                <p className={`mb-6 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Match the English words with their Marathi translations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column - English */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold text-center mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>English</h3>
                  {currentQuestionData.pairs.map((pair, index) => (
                    <button
                      key={`left-${index}`}
                      onClick={() => handleMatchSelect(pair.english, 'left')}
                      disabled={matchedPairs.has(pair.english)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg ${
                        matchedPairs.has(pair.english)
                          ? darkMode ? 'border-green-400 bg-green-900/50 text-green-300 opacity-50' : 'border-green-400 bg-green-50 text-green-700 opacity-50'
                          : selectedLeft === pair.english
                          ? darkMode ? 'border-blue-400 bg-blue-900/50 text-blue-300 scale-105' : 'border-blue-400 bg-blue-50 text-blue-700 scale-105'
                          : darkMode 
                            ? 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-blue-400 hover:bg-blue-900/50 hover:scale-102'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{pair.english}</span>
                        {matchedPairs.has(pair.english) && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {selectedLeft === pair.english && !matchedPairs.has(pair.english) && <Link className="w-5 h-5 text-blue-600" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Column - Marathi */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold text-center mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>मराठी (Marathi)</h3>
                  {shuffledPairs && shuffledPairs.map((pair, index) => (
                    <button
                      key={`right-${index}`}
                      onClick={() => handleMatchSelect(pair.marathi, 'right')}
                      disabled={matchedPairs.has(pair.marathi)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg ${
                        matchedPairs.has(pair.marathi)
                          ? darkMode ? 'border-green-400 bg-green-900/50 text-green-300 opacity-50' : 'border-green-400 bg-green-50 text-green-700 opacity-50'
                          : selectedRight === pair.marathi
                          ? darkMode ? 'border-cyan-400 bg-cyan-900/50 text-cyan-300 scale-105' : 'border-cyan-400 bg-cyan-50 text-cyan-700 scale-105'
                          : darkMode
                            ? 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-cyan-400 hover:bg-cyan-900/50 hover:scale-102'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-cyan-300 hover:bg-cyan-50 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div>{pair.marathi}</div>
                          <div className={`text-sm transition-colors duration-300 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>({pair.pronunciation})</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playPronunciation(pair.marathi, pair.pronunciation);
                            }}
                            className={`p-1 rounded-full transition-colors ${
                              darkMode ? 'hover:bg-cyan-800' : 'hover:bg-cyan-200'
                            }`}
                          >
                            <Volume2 className="w-4 h-4 text-cyan-600" />
                          </button>
                          {matchedPairs.has(pair.marathi) && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {selectedRight === pair.marathi && !matchedPairs.has(pair.marathi) && <Link className="w-5 h-5 text-cyan-600" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {isMatchGameComplete() && (
                <div className={`text-center p-6 rounded-2xl mb-6 border transition-colors duration-300 ${
                  darkMode ? 'bg-green-900/50 border-green-400' : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-green-300' : 'text-green-700'
                  }`}>
                    छान! (Chhan!) - Excellent!
                  </div>
                  <p className={`text-lg transition-colors duration-300 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    You've matched all pairs correctly!
                  </p>
                  <div className={`text-sm mt-2 transition-colors duration-300 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>+{(currentQuestionData && currentQuestionData.pairs ? currentQuestionData.pairs.length : 0) * 5} XP earned!</div>
                </div>
              )}
            </>
          )}

          {/* Result Feedback for Translation Questions */}
          {showResult && currentQuestionData.type === 'translate' && (
            <div className={`text-center p-6 rounded-2xl mb-6 border transition-colors duration-300 ${
              isCorrect 
                ? darkMode ? 'bg-green-900/50 border-green-400' : 'bg-green-50 border-green-200'
                : darkMode ? 'bg-red-900/50 border-red-400' : 'bg-red-50 border-red-200'
            }`}>
              <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                isCorrect 
                  ? darkMode ? 'text-green-300' : 'text-green-700'
                  : darkMode ? 'text-red-300' : 'text-red-700'
              }`}>
                {isCorrect ? 'शाबास! (Shabas!)' : 'चुकीचे! (Chukiche!)'}
              </div>
              <p className={`text-lg transition-colors duration-300 ${
                isCorrect 
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {isCorrect ? 'Correct! Well done!' : `The correct answer is "${currentQuestionData.correct || ''}"`}
              </p>
              {isCorrect && <div className={`text-sm mt-2 transition-colors duration-300 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>+10 XP earned!</div>}
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            {currentQuestionData.type === 'translate' && !showResult ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>
            ) : (showResult || isMatchGameComplete()) ? (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Lesson Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl transition-all duration-200 border ${
                index === currentLesson
                  ? `bg-gradient-to-r ${lesson.color} border-2 ${
                      darkMode ? 'border-blue-400' : 'border-blue-300'
                    } shadow-lg scale-105`
                  : index < currentLesson
                  ? darkMode ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-200'
                  : darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>{lesson.title}</h3>
              <p className={`text-sm mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{lesson.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs transition-colors duration-300 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {lesson.questions.length} questions
                </span>
                {index < currentLesson && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {index === currentLesson && (
                  <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
};

export default MarathiLearningApp;
