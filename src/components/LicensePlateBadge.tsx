import React from 'react';

interface Props {
  plate: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LicensePlateBadge: React.FC<Props> = ({ plate, size = 'md', className = '' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-stretch font-mono-numbers tracking-wider font-bold rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xs select-none bg-white dark:bg-slate-900 transition-transform duration-150 ${
        isSmall
          ? 'h-6 text-xs'
          : isLarge
          ? 'h-11 text-lg px-0.5'
          : 'h-8 text-sm'
      } ${className}`}
    >
      {/* EU / Regional Blue Strip */}
      <div className={`bg-gradient-to-b from-blue-700 to-indigo-900 text-white flex flex-col items-center justify-center font-sans font-semibold ${
        isSmall ? 'w-4 text-[7px] px-0.5' : isLarge ? 'w-7 text-[10px] px-1' : 'w-5 text-[8px] px-0.5'
      }`}>
        <span className="text-yellow-400 leading-none">★</span>
        <span className="leading-none mt-0.5 opacity-90">P</span>
      </div>

      {/* Main Plate Number */}
      <div className={`flex items-center justify-center text-slate-900 dark:text-slate-100 font-extrabold ${
        isSmall ? 'px-2' : isLarge ? 'px-4 tracking-widest' : 'px-2.5'
      }`}>
        {plate || '—'}
      </div>
    </div>
  );
};
