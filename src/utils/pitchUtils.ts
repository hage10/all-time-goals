import { PitchCoord } from '../types/archive';

export const PITCH_LENGTH = 105;
export const PITCH_WIDTH = 68;
export const HALF_LENGTH = 52.5;
export const CENTER_Y = 34;

// Standard pitch markers (in meters)
export const PENALTY_BOX_LENGTH = 16.5;
export const PENALTY_BOX_WIDTH = 40.32;
export const SIX_YARD_LENGTH = 5.5;
export const SIX_YARD_WIDTH = 18.32;
export const PENALTY_SPOT_X = 11;
export const CENTER_CIRCLE_RADIUS = 9.15;
export const GOAL_WIDTH = 7.32;

/**
 * Normalizes coordinate to pitch coordinates (0..105, 0..68)
 * In half-pitch attacking view, standardizes shots targeting the goal at x = 0 or x = 105.
 */
export function normalizeCoordToHalfPitch(coord: PitchCoord): { mx: number; my: number } {
  // If x > 50, shot was recorded from the right side. Flip to attacking left half.
  const isRightSide = coord.x > 50;
  const x = isRightSide ? 100 - coord.x : coord.x;
  const y = isRightSide ? 100 - coord.y : coord.y;
  
  return {
    mx: (x / 100) * PITCH_LENGTH,
    my: (y / 100) * PITCH_WIDTH,
  };
}

export function normalizeCoordToFullPitch(coord: PitchCoord): { mx: number; my: number } {
  return {
    mx: (coord.x / 100) * PITCH_LENGTH,
    my: (coord.y / 100) * PITCH_WIDTH,
  };
}

/**
 * Builds an SVG Path string for the trajectory of the ball from point of shot into goal.
 */
export function buildTrajectorySvgPath(path?: PitchCoord[], targetGoalCoord?: PitchCoord): string {
  if (!path || path.length < 2) {
    if (targetGoalCoord) {
      const start = normalizeCoordToHalfPitch(targetGoalCoord);
      const goal = { mx: 0, my: CENTER_Y };
      return `M ${start.mx} ${start.my} Q ${(start.mx + goal.mx) / 2} ${start.my} ${goal.mx} ${goal.my}`;
    }
    return '';
  }

  const normalized = path.map(p => normalizeCoordToHalfPitch(p));
  let d = `M ${normalized[0].mx} ${normalized[0].my}`;

  if (normalized.length === 2) {
    d += ` L ${normalized[1].mx} ${normalized[1].my}`;
  } else {
    // Quadratic / cubic bezier smoothing
    for (let i = 1; i < normalized.length - 1; i++) {
      const xc = (normalized[i].mx + normalized[i + 1].mx) / 2;
      const yc = (normalized[i].my + normalized[i + 1].my) / 2;
      d += ` Q ${normalized[i].mx} ${normalized[i].my}, ${xc} ${yc}`;
    }
    const last = normalized[normalized.length - 1];
    d += ` L ${last.mx} ${last.my}`;
  }

  return d;
}

export function getShotColor(goal: {
  freekick?: string;
  penalty?: string;
  outsidebox?: string;
  header?: string;
}): string {
  if (goal.freekick === 'yes') return '#38bdf8'; // Sky blue
  if (goal.penalty === 'yes') return '#fbbf24'; // Amber / Yellow
  if (goal.outsidebox === 'yes') return '#f43f5e'; // Rose / Pink
  if (goal.header === 'yes') return '#a855f7'; // Purple
  return '#10b981'; // Emerald (Open play inside box)
}
