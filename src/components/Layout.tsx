import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import deckData from '../data/deck.json';
import CosmicBackground from './CosmicBackground';

interface LayoutProps {
  children: ReactNode;
  dominantColor?: string;
}

export default function Layout({ children, dominantColor = '#0B1020' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-accent-gold/30 selection:text-text-light">
      <CosmicBackground />
      
      {/* Dynamic Background Glow */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none opacity-40 mix-blend-screen"
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${dominantColor}60 0%, transparent 70%)`,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Header */}
      <header className="relative z-10 w-full px-6 py-8 md:px-12 md:py-10 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl tracking-widest font-serif text-text-light hover:text-accent-gold transition-colors duration-500">
          {deckData.deckTitle}
        </Link>
        <nav>
          <Link to="/archive" className="text-sm md:text-base tracking-widest text-text-muted hover:text-text-light transition-colors duration-500">
            全部卡牌
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-16 md:px-12 text-center text-xs md:text-sm text-text-muted flex flex-col gap-12 items-center border-t border-white/5 mt-12 bg-bg-dark/30">
        <div className="max-w-2xl flex flex-col items-center gap-6">
          <h4 className="text-accent-gold tracking-widest uppercase text-xs">關於這套卡</h4>
          <div className="space-y-4 leading-loose tracking-wider opacity-80">
            <p>這套卡不是為了預測未來。<br />它比較像一面鏡子，一個入口，一次與自己對話的機會。</p>
            <p>有些訊息來自放下，<br />有些訊息來自臣服，<br />有些訊息來自痛感、愛、失去、孤單、時間與流動。</p>
            <p>每一張卡都不是結論，<br />而是一個邀請。<br />邀請你停下來，照見自己，並容許內在某些尚未被承認的部分，慢慢浮現。</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center max-w-2xl opacity-60">
          <p className="leading-relaxed">
            {deckData.disclaimer}
          </p>
          <p className="tracking-widest mt-2">
            {deckData.footerNote}
          </p>
        </div>
      </footer>
    </div>
  );
}
