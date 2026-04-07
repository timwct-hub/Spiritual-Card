import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import cardsData from '../data/cards.json';

export default function Archive() {
  const [selectedCard, setSelectedCard] = useState<typeof cardsData[0] | null>(null);

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-6 py-12 lg:py-24 flex-grow z-10">
        <div className="text-center mb-16 lg:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-widest text-text-light mb-6"
          >
            全部卡牌
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-text-muted text-sm md:text-base tracking-wider max-w-md mx-auto leading-relaxed"
          >
            每一張卡，都是一種照見。<br />
            你可以憑直覺瀏覽，也可以等待某一張主動與你相遇。
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12"
        >
          {cardsData.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col items-center"
              onClick={() => setSelectedCard(card)}
            >
              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/5 mb-4 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl" style={{ boxShadow: `0 10px 30px -10px ${card.dominantColor}30` }}>
                <img 
                  src={card.image} 
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-lg font-serif tracking-widest text-text-light">{card.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-universe/95 backdrop-blur-md p-6 overflow-y-auto"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-glass border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: `0 0 100px -20px ${selectedCard.dominantColor}40` }}
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-6 right-6 text-text-muted hover:text-text-light transition-colors p-2"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="w-full max-w-xs md:w-1/3 flex-shrink-0">
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src={selectedCard.image} 
                    alt={selectedCard.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h2 className="text-2xl font-serif tracking-widest text-text-light mb-1">{selectedCard.title}</h2>
                    <p className="text-[10px] tracking-[0.2em] text-accent-gold uppercase">{selectedCard.theme}</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3 flex flex-col text-center md:text-left">
                <h3 className="text-lg md:text-xl font-serif tracking-widest text-accent-gold mb-6 italic">
                  "{selectedCard.shortIntro}"
                </h3>
                
                <div className="space-y-4 text-text-light/80 text-sm md:text-base tracking-wider leading-loose mb-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                  {selectedCard.fullMessage.split('。').filter(Boolean).map((sentence, idx) => (
                    <p key={idx}>{sentence}。</p>
                  ))}
                </div>

                <div className="w-full h-px bg-white/10 mb-8" />

                <div>
                  <h4 className="text-xs tracking-widest text-text-muted mb-4 uppercase">給自己的提問</h4>
                  <ul className="space-y-3 text-text-light/70 text-sm tracking-wider list-none pl-0">
                    {selectedCard.reflectionPrompts.map((prompt, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-accent-gold/50 mt-1">✧</span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
