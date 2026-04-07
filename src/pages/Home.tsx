import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import deckData from '../data/deck.json';
import cardsData from '../data/cards.json';
import { getSpiritualReading } from '../services/ai';

type DrawState = 'idle' | 'breathing' | 'revealing';

export default function Home() {
  const [drawState, setDrawState] = useState<DrawState>('idle');
  const [drawnCard, setDrawnCard] = useState<typeof cardsData[0] | null>(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiReading, setAiReading] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const startDraw = () => {
    setDrawState('breathing');
    setBreathPhase(0);
    
    // Select a random card
    const randomCard = cardsData[Math.floor(Math.random() * cardsData.length)];
    setDrawnCard(randomCard);

    // Simulate breathing phases
    let phase = 0;
    const interval = setInterval(() => {
      phase++;
      setBreathPhase(phase);
      if (phase >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          setDrawState('revealing');
        }, 1000);
      }
    }, 5500); // 5.5 seconds per breath phase
  };

  const handleGenerateReading = async () => {
    if (!drawnCard) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const reading = await getSpiritualReading(userQuestion, drawnCard.title, drawnCard.theme, drawnCard.fullMessage);
      setAiReading(reading);
    } catch (err: any) {
      setAiError(err.message || "生成解讀時發生錯誤，請稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (drawState === 'revealing' && !aiReading && !isGenerating && !aiError) {
      handleGenerateReading();
    }
  }, [drawState]);

  const resetDraw = () => {
    setDrawState('idle');
    setDrawnCard(null);
    setAiReading(null);
    setAiError(null);
    setUserQuestion('');
  };

  const renderIdle = () => (
    <motion.div 
      key="idle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto px-6 py-12 gap-16 lg:gap-24 flex-grow"
    >
      {/* Left Text */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-widest leading-tight mb-8 text-text-light">
          聽聽內在<br />想對你說什麼
        </h1>
        
        <div className="space-y-6 text-text-muted text-base md:text-lg tracking-wider leading-relaxed max-w-md">
          <p>這不是預測未來，<br />而是一場與內在相遇的機會。</p>
          <p>讓卡牌成為一面鏡子，照見你此刻真正需要面對與擁抱的部分。</p>
        </div>

        <div className="mt-12 space-y-4 w-full max-w-md">
          <label className="text-accent-gold tracking-widest text-sm uppercase block text-center lg:text-left">你的問題 (選填)</label>
          <textarea
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="在心中默想，或寫下你最近的困惑、情緒，或一個放不下的問題..."
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-text-light placeholder:text-text-muted/50 focus:outline-none focus:border-accent-gold/50 transition-colors resize-none h-24 text-sm tracking-wider"
          />
          <p className="text-text-muted text-xs tracking-wider text-center lg:text-left opacity-70">
            當你準備好，點擊右側卡牌，接收此刻屬於你的訊息。
          </p>
        </div>
      </div>

      {/* Right Card */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full max-w-sm gap-6">
        <motion.div 
          className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer border border-accent-gold/20"
          animate={{ 
            boxShadow: [
              "0 0 15px rgba(214, 176, 106, 0.15)", 
              "0 0 40px rgba(214, 176, 106, 0.4)", 
              "0 0 15px rgba(214, 176, 106, 0.15)"
            ] 
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(214, 176, 106, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          onClick={startDraw}
        >
          {/* Card Back / Cover */}
          <div className="absolute inset-0 bg-bg-dark flex flex-col items-center justify-center">
            <img 
              src={import.meta.env.BASE_URL + deckData.coverImage.replace(/^\//, '')} 
              alt="Cover" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Hover Glow */}
          <motion.div 
            className="absolute inset-0 bg-accent-gold/10 opacity-0 transition-opacity duration-500"
            whileHover={{ opacity: 1 }}
          />
        </motion.div>
        
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent-gold/70 text-sm tracking-widest uppercase"
        >
          點擊卡牌開始
        </motion.p>
      </div>
    </motion.div>
  );

  const renderBreathing = () => (
    <motion.div
      key="breathing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center flex-grow w-full h-full absolute inset-0 z-50 bg-bg-universe/90 backdrop-blur-md"
    >
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-48 h-48 rounded-full bg-accent-gold/20 blur-3xl absolute"
      />
      <AnimatePresence mode="wait">
        <motion.p 
          key={breathPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 2 }}
          className="text-2xl font-serif tracking-widest text-text-light z-10"
        >
          {breathPhase === 0 && "吸氣..."}
          {breathPhase === 1 && "呼氣..."}
          {breathPhase === 2 && "放下..."}
          {breathPhase >= 3 && "接收..."}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );

  const renderRevealing = () => {
    if (!drawnCard) return null;
    
    return (
      <motion.div
        key="revealing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full max-w-6xl mx-auto px-6 py-12 gap-12 lg:gap-24 flex-grow z-10"
      >
        {/* Left: Card Image */}
        <div className="flex-1 flex flex-col items-center w-full max-w-sm">
          <div className="mb-6 text-center flex flex-col items-center">
            <p className="text-xs tracking-widest text-text-muted uppercase">
              {userQuestion ? "你的提問" : "此刻浮現的訊息"}
            </p>
            {userQuestion && (
              <p className="text-sm tracking-wider text-text-light/90 italic mt-3 max-w-xs">
                "{userQuestion}"
              </p>
            )}
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ boxShadow: `0 20px 50px -10px ${drawnCard.dominantColor}40` }}
          >
            <img 
              src={import.meta.env.BASE_URL + drawnCard.image.replace(/^\//, '')} 
              alt={drawnCard.title} 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <h2 className="text-3xl font-serif tracking-widest text-text-light mb-2">{drawnCard.title}</h2>
              <p className="text-xs tracking-[0.2em] text-accent-gold uppercase">{drawnCard.theme}</p>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="mt-8 text-sm text-text-muted tracking-wider text-center max-w-xs"
          >
            先不要急著分析。<br />讓文字在你心裡停留一會。
          </motion.p>
        </div>

        {/* Right: Message Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg w-full"
        >
          <h3 className="text-xl md:text-2xl font-serif tracking-widest text-accent-gold mb-8 italic">
            "{drawnCard.shortIntro}"
          </h3>
          
          <div className="space-y-6 text-text-light/90 text-base md:text-lg tracking-wider leading-loose mb-12">
            {drawnCard.fullMessage.split('。').filter(Boolean).map((sentence, idx) => (
              <p key={idx}>{sentence}。</p>
            ))}
          </div>

          <div className="w-full h-px bg-white/10 mb-12" />

          {/* AI Reading Section */}
          <div className="w-full bg-glass p-8 rounded-2xl border border-white/5 backdrop-blur-sm mb-12 flex flex-col items-center text-center min-h-[200px] justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-6 py-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-accent-gold/30 border-t-accent-gold rounded-full"
                />
                <p className="text-sm tracking-widest text-text-muted uppercase">宇宙正在為你流動專屬訊息...</p>
              </div>
            ) : aiError ? (
              <div className="py-4">
                <p className="text-red-400 text-sm mb-4">{aiError}</p>
                <button
                  onClick={handleGenerateReading}
                  className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-text-light text-sm transition-colors border border-white/10"
                >
                  重新嘗試
                </button>
              </div>
            ) : aiReading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left w-full"
              >
                <h4 className="text-sm tracking-widest text-accent-gold mb-6 uppercase text-center">✨ 專屬靈性解讀</h4>
                <div className="space-y-4 text-text-light/90 text-base tracking-wider leading-loose whitespace-pre-wrap">
                  {aiReading}
                </div>
              </motion.div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
            <button 
              onClick={startDraw}
              className="px-8 py-4 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/30 hover:bg-accent-gold hover:text-bg-universe transition-all duration-500 tracking-widest text-sm"
            >
              再抽一張
            </button>
            <Link 
              to="/archive"
              className="px-8 py-4 rounded-full bg-transparent text-text-muted border border-white/10 hover:border-white/30 hover:text-text-light transition-all duration-500 tracking-widest text-sm text-center"
            >
              查看全部卡牌
            </Link>
            <button 
              onClick={resetDraw}
              className="px-8 py-4 rounded-full bg-transparent text-text-muted border border-white/10 hover:border-white/30 hover:text-text-light transition-all duration-500 tracking-widest text-sm text-center"
            >
              回到起點
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <Layout dominantColor={drawnCard?.dominantColor}>
      <AnimatePresence mode="wait">
        {drawState === 'idle' && renderIdle()}
        {drawState === 'breathing' && renderBreathing()}
        {drawState === 'revealing' && renderRevealing()}
      </AnimatePresence>
    </Layout>
  );
}
