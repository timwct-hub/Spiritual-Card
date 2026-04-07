import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function CosmicBackground() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; isBright: boolean }[]>([]);

  useEffect(() => {
    // 產生隨機星星
    const newStars = Array.from({ length: 250 }).map((_, i) => {
      const isBright = Math.random() > 0.85; // 15% 的星星特別亮
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: isBright ? Math.random() * 2.5 + 2 : Math.random() * 2 + 1,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 5,
        isBright,
      };
    });
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050510]">
      {/* 宇宙深色基底 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#130826] via-[#050510] to-[#020205] opacity-90" />

      {/* 星雲 1: 左上方的紫紅色星雲 */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: ['0%', '-3%', '0%'],
          y: ['0%', '3%', '0%'],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,_rgba(148,0,211,0.35)_0%,_rgba(75,0,130,0.15)_40%,_transparent_70%)] blur-[90px] mix-blend-screen"
      />
      
      {/* 星雲 2: 右下方的深藍/靛色星雲 */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: ['0%', '4%', '0%'],
          y: ['0%', '-4%', '0%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] -right-[10%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle,_rgba(25,25,112,0.5)_0%,_rgba(138,43,226,0.2)_40%,_transparent_70%)] blur-[100px] mix-blend-screen"
      />

      {/* 星雲 3: 中間的明亮星際裂縫 (粉紫發光) */}
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] w-[120%] h-[50%] -rotate-45 bg-[radial-gradient(ellipse_at_center,_rgba(218,112,214,0.25)_0%,_rgba(148,0,211,0.1)_40%,_transparent_60%)] blur-[80px] mix-blend-screen"
      />

      {/* 星星層 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.isBright 
              ? `0 0 ${star.size * 4}px rgba(255,255,255,1), 0 0 ${star.size * 8}px rgba(218,112,214,0.6)` 
              : `0 0 ${star.size * 2}px rgba(255,255,255,0.4)`
          }}
          animate={{
            opacity: star.isBright ? [0.5, 1, 0.5] : [0.3, 0.8, 0.3],
            scale: star.isBright ? [0.8, 1.5, 0.8] : [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* 邊緣暗角，增加深度與文字可讀性 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)] pointer-events-none" />
    </div>
  );
}
