import React, { useEffect } from 'react';
import { StampType } from '../types';
import { StampBadge } from './StampBadge';

interface StampEffectProps {
  studentNumber: number;
  stampType: StampType;
  onComplete: () => void;
}

export const StampEffect: React.FC<StampEffectProps> = ({
  studentNumber,
  stampType,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="stamp-slam-effect-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-stone-900/40 backdrop-blur-[2px]"
      onClick={onComplete}
    >
      {/* Decorative starburst rays */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-400/20 blur-3xl animate-ping" />

      {/* Slamming Stamp */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-150 duration-300 ease-out">
        <div className="transform -rotate-6 filter drop-shadow-2xl">
          <StampBadge
            studentNumber={studentNumber}
            stampType={stampType}
            size="xl"
            rotation={-6}
          />
        </div>

        <div className="mt-6 bg-stone-900/90 text-white px-8 py-3 rounded-full border-2 border-amber-400 shadow-2xl flex items-center gap-3">
          <span className="text-3xl">💮</span>
          <span className="text-2xl md:text-3xl font-black text-amber-300">
            쾅! {studentNumber}번 도장이 찍혔습니다!
          </span>
          <span className="text-3xl">🎉</span>
        </div>
      </div>
    </div>
  );
};
