import React from 'react';

// Exact constants from PitchSurface-CCxjhv2Y.js
export const PITCH_X = 105;
export const PITCH_Y = 68;
export const HALF_X = PITCH_X / 2; // 52.5
export const PENALTY_BOX_X = 16.5;
export const PENALTY_BOX_Y = 40.32;
export const GOAL_BOX_X = 5.5;
export const GOAL_BOX_Y = 18.32;
export const PENALTY_SPOT = 11;
export const PENALTY_ARC_R = 9.15;
export const CENTER_CIRCLE_R = 9.15;

export interface PitchSurfaceProps {
  half?: boolean;
  vertical?: boolean;
  bleed?: boolean;
  frame?: { x: number; y: number; w: number; h: number } | null;
  depth?: number | null;
  children?: React.ReactNode;
  className?: string;
  overlay?: React.ReactNode;
  preserveAspectRatio?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

// Goal Net component matching H function in PitchSurface-CCxjhv2Y.js
const GoalNet: React.FC<{ x: number; side: 'left' | 'right' }> = ({ x, side }) => {
  const s = side === 'left' ? -1 : 1;
  return (
    <g>
      <rect
        x={x + (side === 'left' ? -2.6 : 0)}
        y={PITCH_Y / 2 - 3.66}
        width="2.6"
        height="7.32"
        fill="rgba(0,0,0,0.35)"
      />
      <rect
        x={x + (side === 'left' ? -2.6 : 0)}
        y={PITCH_Y / 2 - 3.66}
        width="2.6"
        height="7.32"
        fill="url(#pitchNet)"
      />
      <line
        x1={x}
        y1={PITCH_Y / 2 - 3.66}
        x2={x}
        y2={PITCH_Y / 2 + 3.66}
        stroke="#fff"
        strokeWidth="0.42"
        strokeLinecap="round"
      />
      <circle cx={x} cy={PITCH_Y / 2 - 3.66} r="0.36" fill="#fff" />
      <circle cx={x} cy={PITCH_Y / 2 + 3.66} r="0.36" fill="#fff" />
      <line
        x1={x + s * 2.6}
        y1={PITCH_Y / 2 - 3.66}
        x2={x + s * 2.6}
        y2={PITCH_Y / 2 + 3.66}
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="0.1"
      />
    </g>
  );
};

// Penalty Box Component matching E function in PitchSurface-CCxjhv2Y.js
const PenaltyArea: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const isLeft = side === 'left';
  const boxX = isLeft ? 0 : PITCH_X - PENALTY_BOX_X;
  const sixYardX = isLeft ? 0 : PITCH_X - GOAL_BOX_X;
  const spotX = isLeft ? PENALTY_SPOT : PITCH_X - PENALTY_SPOT;
  const arcX = isLeft ? PENALTY_BOX_X : PITCH_X - PENALTY_BOX_X;
  const arcHeight = Math.sqrt(
    Math.max(0, PENALTY_ARC_R ** 2 - (arcX - spotX) ** 2)
  );
  const sweepFlag = isLeft ? 1 : 0;

  return (
    <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.16">
      <rect
        x={boxX}
        y={(PITCH_Y - PENALTY_BOX_Y) / 2}
        width={PENALTY_BOX_X}
        height={PENALTY_BOX_Y}
      />
      <rect
        x={sixYardX}
        y={(PITCH_Y - GOAL_BOX_Y) / 2}
        width={GOAL_BOX_X}
        height={GOAL_BOX_Y}
      />
      <circle
        cx={spotX}
        cy={PITCH_Y / 2}
        r="0.26"
        fill="rgba(255,255,255,0.55)"
        stroke="none"
      />
      <path
        d={`M ${arcX},${PITCH_Y / 2 - arcHeight} A ${PENALTY_ARC_R},${PENALTY_ARC_R} 0 0 ${sweepFlag} ${arcX},${PITCH_Y / 2 + arcHeight}`}
      />
    </g>
  );
};

export const PitchSurface: React.FC<PitchSurfaceProps> = ({
  half = false,
  vertical = false,
  bleed = true,
  frame = null,
  depth = null,
  children,
  className = '',
  overlay = null,
  preserveAspectRatio = 'xMidYMid meet',
  onClick,
}) => {
  const h = half ? HALF_X : PITCH_X;
  const dimensions = half
    ? vertical
      ? { w: PITCH_Y, h: HALF_X }
      : { w: HALF_X, h: PITCH_Y }
    : vertical
    ? { w: PITCH_Y, h: PITCH_X }
    : { w: PITCH_X, h: PITCH_Y };

  const margin = h + (half ? 5 : 6.8);
  const totalDepth = half && depth ? depth + (vertical ? 3.4 : 0) : margin;
  const viewBoxFrame =
    frame ||
    (bleed
      ? vertical
        ? { x: -1.6, y: -3.4, w: PITCH_Y + 3.2, h: totalDepth }
        : { x: -3.4, y: -1.6, w: totalDepth, h: PITCH_Y + 3.2 }
      : { x: 0, y: 0, w: dimensions.w, h: dimensions.h });

  return (
    <svg
      viewBox={`${viewBoxFrame.x} ${viewBoxFrame.y} ${viewBoxFrame.w} ${viewBoxFrame.h}`}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="pitchGrass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a6b31" />
          <stop offset="45%" stopColor="#165c28" />
          <stop offset="100%" stopColor="#114d20" />
        </linearGradient>
        <pattern
          id="pitchMow"
          x="0"
          y="0"
          width={h / 8}
          height={PITCH_Y}
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width={h / 16} height={PITCH_Y} fill="rgba(255,255,255,0.022)" />
        </pattern>
        <pattern
          id="pitchNet"
          x="0"
          y="0"
          width="0.45"
          height="0.45"
          patternUnits="userSpaceOnUse"
        >
          <rect
            width="0.45"
            height="0.45"
            fill="none"
            stroke="rgba(255,255,255,0.11)"
            strokeWidth="0.035"
          />
        </pattern>
        <radialGradient id="pitchVignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>
        <marker
          id="flightHead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" />
        </marker>
        <clipPath id="pitchClip">
          <rect x="0" y="0" width={h} height={PITCH_Y} />
        </clipPath>
      </defs>

      <g transform={vertical ? `translate(${PITCH_Y},0) rotate(90)` : undefined}>
        <rect x="0" y="0" width={h} height={PITCH_Y} fill="url(#pitchGrass)" />
        <rect x="0" y="0" width={h} height={PITCH_Y} fill="url(#pitchMow)" />
        <g clipPath="url(#pitchClip)">{overlay}</g>

        {/* Pitch boundary and lines */}
        <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.16">
          <rect x="0" y="0" width={h} height={PITCH_Y} />
          {half ? (
            <>
              <line x1={h} y1="0" x2={h} y2={PITCH_Y} strokeWidth="0.18" />
              <path
                d={`M ${h},${PITCH_Y / 2 - CENTER_CIRCLE_R} A ${CENTER_CIRCLE_R},${CENTER_CIRCLE_R} 0 0 0 ${h},${PITCH_Y / 2 + CENTER_CIRCLE_R}`}
              />
              <circle
                cx={h}
                cy={PITCH_Y / 2}
                r="0.26"
                fill="rgba(255,255,255,0.55)"
                stroke="none"
              />
            </>
          ) : (
            <>
              <line x1={h / 2} y1="0" x2={h / 2} y2={PITCH_Y} strokeWidth="0.18" />
              <circle cx={h / 2} cy={PITCH_Y / 2} r={CENTER_CIRCLE_R} />
              <circle
                cx={h / 2}
                cy={PITCH_Y / 2}
                r="0.26"
                fill="rgba(255,255,255,0.55)"
                stroke="none"
              />
            </>
          )}
        </g>

        <PenaltyArea side="left" />
        {!half && <PenaltyArea side="right" />}
        <GoalNet x={0} side="left" />
        {!half && <GoalNet x={PITCH_X} side="right" />}

        {children}

        <rect
          x="0"
          y="0"
          width={h}
          height={PITCH_Y}
          fill="url(#pitchVignette)"
          pointerEvents="none"
        />
      </g>
    </svg>
  );
};
