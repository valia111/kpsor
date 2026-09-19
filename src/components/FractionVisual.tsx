import React from 'react';

interface FractionBarProps {
  num: number;
  den: number;
  color?: string; // e.g., 'blue', 'amber', 'emerald', 'purple'
  width?: number | string;
  height?: number;
  label?: string;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  num,
  den,
  color = 'blue',
  width = '100%',
  height = 36,
  label,
}) => {
  const colorMap: Record<string, { fill: string; empty: string; border: string }> = {
    blue: { fill: 'bg-blue-500', empty: 'bg-blue-50', border: 'border-blue-400' },
    amber: { fill: 'bg-amber-500', empty: 'bg-amber-50', border: 'border-amber-400' },
    emerald: { fill: 'bg-emerald-500', empty: 'bg-emerald-50', border: 'border-emerald-400' },
    purple: { fill: 'bg-purple-500', empty: 'bg-purple-50', border: 'border-purple-400' },
    rose: { fill: 'bg-rose-500', empty: 'bg-rose-50', border: 'border-rose-400' },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`w-full flex border-2 ${scheme.border} rounded-lg overflow-hidden bg-white shadow-xs`}
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {Array.from({ length: den }).map((_, index) => {
          const isFilled = index < num;
          return (
            <div
              key={index}
              className={`flex-1 flex items-center justify-center border-r border-slate-300 last:border-r-0 transition-colors duration-200 ${
                isFilled ? scheme.fill : scheme.empty
              }`}
            >
              <span className="text-[10px] font-math opacity-60 select-none">
                {isFilled ? '✓' : ''}
              </span>
            </div>
          );
        })}
      </div>
      {label && <span className="text-xs text-slate-500 mt-1 font-medium">{label}</span>}
    </div>
  );
};

interface FractionPieProps {
  num: number;
  den: number;
  size?: number;
  color?: string;
}

export const FractionPie: React.FC<FractionPieProps> = ({
  num,
  den,
  size = 72,
  color = '#3b82f6',
}) => {
  const radius = size / 2 - 4;
  const center = size / 2;

  // Generate SVG path for a sector
  const getSectorPath = (startAngle: number, endAngle: number) => {
    const rad = (angle: number) => ((angle - 90) * Math.PI) / 180;
    const x1 = center + radius * Math.cos(rad(startAngle));
    const y1 = center + radius * Math.sin(rad(startAngle));
    const x2 = center + radius * Math.cos(rad(endAngle));
    const y2 = center + radius * Math.sin(rad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const sliceAngle = 360 / den;

  return (
    <svg width={size} height={size} className="drop-shadow-xs select-none">
      <circle cx={center} cy={center} r={radius} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {Array.from({ length: den }).map((_, i) => {
        const start = i * sliceAngle;
        const end = (i + 1) * sliceAngle;
        const isFilled = i < num;

        return (
          <path
            key={i}
            d={getSectorPath(start, end)}
            fill={isFilled ? color : '#f1f5f9'}
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="transition-colors duration-200"
          />
        );
      })}
    </svg>
  );
};
