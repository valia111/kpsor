import React from 'react';

interface FractionProps {
  num: number | string;
  den: number | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlightNumerator?: boolean;
  highlightDenominator?: boolean;
}

export const Fraction: React.FC<FractionProps> = ({
  num,
  den,
  className = '',
  size = 'md',
  highlightNumerator = false,
  highlightDenominator = false,
}) => {
  const sizeConfig = {
    sm: { text: 'text-sm', line: 'border-b', px: 'px-1', py: 'py-0' },
    md: { text: 'text-base font-semibold', line: 'border-b-2', px: 'px-1.5', py: 'py-0.5' },
    lg: { text: 'text-xl font-bold', line: 'border-b-2', px: 'px-2', py: 'py-0.5' },
    xl: { text: 'text-2xl font-bold', line: 'border-b-[2.5px]', px: 'px-2.5', py: 'py-1' },
  };

  const cfg = sizeConfig[size];

  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle font-math select-none ${className}`}
      dir="ltr"
    >
      <span
        className={`leading-none text-center ${cfg.text} ${cfg.px} ${
          highlightNumerator ? 'text-blue-600 font-extrabold' : ''
        }`}
      >
        {num}
      </span>
      <span className={`w-full ${cfg.line} border-current opacity-80 my-0.5`} />
      <span
        className={`leading-none text-center ${cfg.text} ${cfg.px} ${
          highlightDenominator ? 'text-emerald-600 font-extrabold' : ''
        }`}
      >
        {den}
      </span>
    </span>
  );
};
