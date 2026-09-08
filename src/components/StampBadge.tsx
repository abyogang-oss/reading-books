import React from 'react';
import { Stamp, STAMP_TYPES, StampType } from '../types';

interface StampBadgeProps {
  stamp?: Stamp;
  studentNumber?: number;
  stampType?: StampType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rotation?: number;
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  stamp,
  studentNumber,
  stampType,
  size = 'md',
  rotation,
}) => {
  const num = stamp ? stamp.studentNumber : (studentNumber ?? 1);
  const type = stamp ? stamp.stampType : (stampType ?? 'praise');
  const meta = STAMP_TYPES[type] || STAMP_TYPES.praise;
  const rot = rotation ?? (stamp?.rotation ?? 0);

  // Size variations
  const sizeStyles = {
    sm: {
      container: 'w-16 h-16 border-[2.5px]',
      num: 'text-sm font-black',
      label: 'text-[9px] font-bold tracking-tight',
      emoji: 'text-xs',
    },
    md: {
      container: 'w-22 h-22 border-[3px]',
      num: 'text-lg font-black',
      label: 'text-[11px] font-bold tracking-tight',
      emoji: 'text-sm',
    },
    lg: {
      container: 'w-28 h-28 border-[3.5px]',
      num: 'text-2xl font-black',
      label: 'text-sm font-bold tracking-tight',
      emoji: 'text-lg',
    },
    xl: {
      container: 'w-40 h-40 border-[5px]',
      num: 'text-4xl font-black',
      label: 'text-lg font-black tracking-tight',
      emoji: 'text-2xl',
    },
  }[size];

  return (
    <div
      id={`stamp-badge-${num}-${type}`}
      className={`stamp-seal relative flex flex-col items-center justify-center rounded-full transition-transform select-none ${meta.borderClass} ${meta.bgClass} ${meta.colorClass} ${sizeStyles.container}`}
      style={{
        transform: `rotate(${rot}deg)`,
      }}
      title={`${num}번 학생 도장 (${meta.label})`}
    >
      {/* Top micro badge or emoji */}
      <span className={`${sizeStyles.emoji} leading-none mb-0.5 opacity-90`}>
        {meta.emoji}
      </span>

      {/* Student Number in high-contrast bold font */}
      <div className={`${sizeStyles.num} leading-none tracking-tight font-black`}>
        {num}번
      </div>

      {/* Stamp text */}
      <div className={`${sizeStyles.label} leading-tight mt-0.5 px-1 text-center font-black`}>
        {meta.label}
      </div>
    </div>
  );
};
