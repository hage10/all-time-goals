import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Goal } from '../types/archive';
import { PitchSurface, PITCH_X, PITCH_Y, HALF_X } from './PitchSurface';
import {
  Crosshair,
  SlidersHorizontal,
  Search,
  X,
  Flag,
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  RectangleHorizontal,
  RectangleVertical,
  ChevronRight,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface ShotMapperProps {
  goals: Goal[];
  onOpenModal: (goal: Goal) => void;
  onOpenFilterDrawer?: () => void;
}

interface PlotItem extends Goal {
  mx: number;
  my: number;
  traced: { mx: number; my: number }[] | null;
  goal: { x: number; y: number; dir: number; end: string };
  kind: 'normal' | 'outside' | 'freekick' | 'penalty';
}

const KIND_COLORS: Record<string, { key: string; fill: string; label: string }> = {
  normal: { key: 'normal', fill: '#f97316', label: 'Open Play' },
  outside: { key: 'outside', fill: '#a855f7', label: 'Outside Box' },
  freekick: { key: 'freekick', fill: '#22d3ee', label: 'Free Kick' },
  penalty: { key: 'penalty', fill: '#fbbf24', label: 'Penalty' },
};

const getKind = (goal: Goal): 'normal' | 'outside' | 'freekick' | 'penalty' => {
  if (goal.freekick === 'yes') return 'freekick';
  if (goal.penalty === 'yes') return 'penalty';
  if (goal.outsidebox === 'yes') return 'outside';
  return 'normal';
};

const PENALTY_SPOT_COORD = { x: 10.47619, y: 50 };
const TARGET_GOAL_CENTER = { x: 0, y: PITCH_Y / 2 };

// Coordinate mappings to real pitch meters (105m x 68m)
const toHalfPitchMeters = (coord: { x: number; y: number }) => {
  const s = coord.x > 50 ? 100 - coord.x : coord.x;
  const r = coord.x > 50 ? 100 - coord.y : coord.y;
  return { mx: (s / 100) * PITCH_X, my: (r / 100) * PITCH_Y };
};

const toFullPitchMeters = (coord: { x: number; y: number }) => {
  return { mx: (coord.x / 100) * PITCH_X, my: (coord.y / 100) * PITCH_Y };
};

const getGoalTarget = (mx: number, isFull: boolean) => {
  if (isFull && mx > HALF_X) {
    return { x: PITCH_X, y: PITCH_Y / 2, dir: -1, end: 'r' };
  }
  return { x: 0, y: PITCH_Y / 2, dir: 1, end: 'l' };
};

// Smooth Bezier Curve Path Generator matching PitchSurface-CCxjhv2Y.js
const generateSmoothPath = (points: { mx: number; my: number }[]) => {
  if (!points || points.length < 2) return '';
  if (points.length === 2) return `M ${points[0].mx},${points[0].my} L ${points[1].mx},${points[1].my}`;
  let d = `M ${points[0].mx},${points[0].my}`;
  for (let i = 1; i < points.length - 1; i++) {
    const cx = (points[i].mx + points[i + 1].mx) / 2;
    const cy = (points[i].my + points[i + 1].my) / 2;
    d += ` Q ${points[i].mx},${points[i].my} ${cx},${cy}`;
  }
  d += ` L ${points[points.length - 1].mx},${points[points.length - 1].my}`;
  return d;
};

// Radial wedges and angle zones for heatmap mode
const ZONE_RADII = [0, 6, 11, 16.5, 23, 30, 40, 60];
const NUM_SECTORS = 7;
const SECTOR_ANGLE = Math.PI / NUM_SECTORS;

const polarFromGoal = (
  mx: number,
  my: number,
  goal: { x: number; y: number; dir: number }
) => {
  const dx = (mx - goal.x) * goal.dir;
  const dy = my - goal.y;
  return {
    r: Math.hypot(dx, dy),
    a: Math.atan2(dy, dx) + Math.PI / 2,
  };
};

const createArcSectorPath = (
  r1: number,
  r2: number,
  a1: number,
  a2: number,
  goal: { x: number; y: number; dir: number }
) => {
  const pt = (r: number, a: number) => [
    goal.x + goal.dir * r * Math.sin(a),
    goal.y - r * Math.cos(a),
  ];
  const [p1x, p1y] = pt(r1, a1);
  const [p2x, p2y] = pt(r2, a1);
  const [p3x, p3y] = pt(r2, a2);
  const [p4x, p4y] = pt(r1, a2);
  const sweep = goal.dir > 0 ? [1, 0] : [0, 1];
  return `M ${p1x},${p1y} L ${p2x},${p2y} A ${r2},${r2} 0 0 ${sweep[0]} ${p3x},${p3y} L ${p4x},${p4y} A ${r1},${r1} 0 0 ${sweep[1]} ${p1x},${p1y} Z`;
};

const getZoneColor = (v: number) => {
  if (v < 0.5) {
    const t = v / 0.5;
    return `rgb(${Math.round(251 - 2 * t)}, ${Math.round(191 - 76 * t)}, ${Math.round(36 - 14 * t)})`;
  }
  const t = (v - 0.5) / 0.5;
  return `rgb(${Math.round(249 - 10 * t)}, ${Math.round(115 - 47 * t)}, ${Math.round(22 + 46 * t)})`;
};

export const ShotMapper: React.FC<ShotMapperProps> = ({
  goals,
  onOpenModal,
  onOpenFilterDrawer,
}) => {
  const [selectedKind, setSelectedKind] = useState<string | null>(null);
  const [lens, setLens] = useState<'strikes' | 'zones'>('strikes');
  const [isFullPitch, setIsFullPitch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredClusterIndex, setHoveredClusterIndex] = useState<number | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    cluster: PlotItem[];
    x: number;
    top: number;
    bottom: number;
  } | null>(null);
  const [selectedClusterModal, setSelectedClusterModal] = useState<PlotItem[] | null>(null);
  const [boxLineOnly, setBoxLineOnly] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize goals with coordinates
  const plottedGoals = useMemo<PlotItem[]>(() => {
    if (!goals || goals.length === 0) return [];

    return goals
      .map((g) => {
        let coord = g.coord;
        if (!coord || typeof coord.x !== 'number' || typeof coord.y !== 'number') {
          // Fallback pseudo-coordinate for unmapped goals so they show on pitch
          const idNum = parseInt(g.title, 10) || 1;
          const isPen = g.penalty === 'yes';
          const isFk = g.freekick === 'yes';
          const isOut = g.outsidebox === 'yes';

          if (isPen) {
            coord = { x: 10.476, y: 50 };
          } else if (isFk) {
            const angle = ((idNum % 9) - 4) * 6;
            const dist = 22 + (idNum % 7);
            const rad = (angle * Math.PI) / 180;
            coord = {
              x: Number(((dist * Math.cos(rad)) / 105 * 100).toFixed(2)),
              y: Number((50 + (dist * Math.sin(rad)) / 68 * 100).toFixed(2)),
            };
          } else if (isOut) {
            const angle = ((idNum % 11) - 5) * 5;
            const dist = 18 + (idNum % 6);
            const rad = (angle * Math.PI) / 180;
            coord = {
              x: Number(((dist * Math.cos(rad)) / 105 * 100).toFixed(2)),
              y: Number((50 + (dist * Math.sin(rad)) / 68 * 100).toFixed(2)),
            };
          } else {
            const angle = ((idNum % 13) - 6) * 4;
            const dist = 6 + (idNum % 10);
            const rad = (angle * Math.PI) / 180;
            coord = {
              x: Number(((dist * Math.cos(rad)) / 105 * 100).toFixed(2)),
              y: Number((50 + (dist * Math.sin(rad)) / 68 * 100).toFixed(2)),
            };
          }
        }

        const kind = getKind(g);
        const { mx, my } = isFullPitch
          ? toFullPitchMeters(coord)
          : toHalfPitchMeters(coord);

        let tracedPoints: { mx: number; my: number }[] | null = null;
        if (Array.isArray(g.path) && g.path.length > 1) {
          tracedPoints = isFullPitch
            ? g.path.map(toFullPitchMeters)
            : g.path.map(toHalfPitchMeters);
        } else {
          // Synthetic smooth ball trajectory to goal center
          tracedPoints = [
            { mx, my },
            { mx: (mx + 0) / 2 + 1.2, my: (my + PITCH_Y / 2) / 2 },
            { mx: 0, my: PITCH_Y / 2 },
          ];
        }

        return {
          ...g,
          mx,
          my,
          traced: tracedPoints,
          goal: getGoalTarget(mx, isFullPitch),
          kind,
        };
      })
      .filter(Boolean);
  }, [goals, isFullPitch]);

  // Filter goals
  const filteredGoals = useMemo(() => {
    let result = plottedGoals;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.opponent?.toLowerCase().includes(q) ||
          g.competition?.toLowerCase().includes(q) ||
          g.season?.toLowerCase().includes(q) ||
          String(g.title).includes(q)
      );
    }

    if (boxLineOnly) {
      // Goals within 2 meters of penalty box edge (16.5m)
      result = result.filter((g) => {
        const dist = Math.abs(g.mx - 16.5);
        return dist <= 2;
      });
    }

    return result;
  }, [plottedGoals, searchQuery, boxLineOnly]);

  // Group overlapping points into clusters
  const clusteredGoals = useMemo<PlotItem[][]>(() => {
    const map: Record<string, PlotItem[]> = {};
    filteredGoals.forEach((item) => {
      // Snap to ~0.5m grid for cluster grouping
      const key = `${Math.round(item.mx * 2) / 2},${Math.round(item.my * 2) / 2}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return Object.values(map);
  }, [filteredGoals]);

  const flatVisibleGoals = useMemo(() => {
    const list = clusteredGoals.flat();
    return selectedKind ? list.filter((g) => g.kind === selectedKind) : list;
  }, [clusteredGoals, selectedKind]);

  // Statistics
  const stats = useMemo(() => {
    const counts = { normal: 0, outside: 0, freekick: 0, penalty: 0 };
    let totalDist = 0;
    let validDistCount = 0;
    let longestDist = 0;

    filteredGoals.forEach((g) => {
      counts[g.kind] = (counts[g.kind] || 0) + 1;
      const d = Math.hypot(g.mx - g.goal.x, g.my - g.goal.y);
      if (g.kind !== 'penalty') {
        totalDist += d;
        validDistCount++;
      }
      if (d > longestDist) longestDist = d;
    });

    return {
      ...counts,
      total: filteredGoals.length,
      avgRange: validDistCount ? totalDist / validDistCount : 0,
      longestRange: longestDist,
    };
  }, [filteredGoals]);

  // Zone Heatmap Calculation
  const zonePolygons = useMemo(() => {
    if (lens !== 'zones') return [];

    const zoneMap = new Map<string, { n: number; goal: any; ri: number; si: number }>();
    flatVisibleGoals.forEach((g) => {
      const { r, a } = polarFromGoal(g.mx, g.my, g.goal);
      const rIdx = ZONE_RADII.findIndex(
        (z, idx) => r >= z && r < (ZONE_RADII[idx + 1] ?? Infinity)
      );
      if (rIdx < 0 || rIdx >= ZONE_RADII.length - 1) return;

      const sIdx = Math.max(0, Math.min(NUM_SECTORS - 1, Math.floor(a / SECTOR_ANGLE)));
      const key = `${g.goal.end}:${rIdx}:${sIdx}`;
      const prev = zoneMap.get(key) || { n: 0, goal: g.goal, ri: rIdx, si: sIdx };
      prev.n += 1;
      zoneMap.set(key, prev);
    });

    const maxCount = Math.max(1, ...[...zoneMap.values()].map((z) => z.n));
    return [...zoneMap.entries()].map(([k, z]) => ({
      key: k,
      n: z.n,
      v: Math.sqrt(z.n / maxCount),
      d: createArcSectorPath(
        ZONE_RADII[z.ri],
        ZONE_RADII[z.ri + 1],
        z.si * SECTOR_ANGLE,
        (z.si + 1) * SECTOR_ANGLE,
        z.goal
      ),
    }));
  }, [flatVisibleGoals, lens]);

  const scaleFactor = isFullPitch ? 1.7 : 1;
  const isVertical = !isFullPitch;
  const goalEnds = isFullPitch
    ? [getGoalTarget(0, true), getGoalTarget(PITCH_X, true)]
    : [getGoalTarget(0, false)];

  return (
    <div className="relative min-h-screen bg-[#070708] text-white pt-8 pb-28 md:pb-10 px-4 md:px-6 font-sans">
      {/* Radial Top Glow (Exact 360px glow from messiallgoals.com) */}
      <div className="absolute inset-x-0 top-0 h-[360px] pointer-events-none bg-[radial-gradient(80%_100%_at_50%_0%,rgba(var(--color-primary-rgb),0.1)_0%,transparent_70%)]" />

      <div className="relative max-w-[1500px] mx-auto space-y-4">
        {/* Top Search & Filter Bar */}
        <div className="pt-4 flex flex-wrap items-center gap-3 pb-2">
          {/* Filters Drawer Trigger */}
          <button
            onClick={() => onOpenFilterDrawer && onOpenFilterDrawer()}
            className="group flex items-center gap-2.5 shrink-0 transition-colors text-white/70 hover:text-white"
          >
            <SlidersHorizontal className="w-[18px] h-[18px]" />
            <span className="font-display text-[12px] font-black uppercase tracking-[0.16em]">
              Filters
            </span>
          </button>

          <span className="w-px h-5 bg-white/[0.08] shrink-0" />

          {/* Underline Search Input */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center min-w-0 flex-1 max-w-[420px]"
          >
            <Search className="absolute left-0 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="2011 real madrid · free kick · la liga"
              aria-label="Search the archive"
              className="w-full bg-transparent border-0 border-b border-white/[0.08] focus:border-primary/50 pl-6 pr-7 py-1.5 text-[13px] text-white placeholder-white/20 font-medium focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-0 text-white/25 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </form>

          {/* Box line toggle button */}
          <button
            onClick={() => setBoxLineOnly((prev) => !prev)}
            title="Goals within two metres either side of the penalty-area line"
            className={`inline-flex items-center gap-2 h-9 px-3 rounded-xl border transition-colors ${
              boxLineOnly
                ? 'bg-primary text-black border-primary font-bold'
                : 'bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white hover:border-white/20'
            }`}
          >
            <Flame size={12} className={boxLineOnly ? 'text-black' : 'text-primary'} />
            <span className="font-display text-[8.5px] font-black uppercase tracking-[0.14em]">
              Box line
            </span>
          </button>
        </div>

        {/* Main Pitch Layout Grid (Pitch Left, Aside Right) */}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px] items-start">
          {/* LEFT: PITCH & CONTROLS CONTAINER */}
          <div className="min-w-0 space-y-3">
            {/* Top Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Kind Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedKind(null)}
                  data-active={selectedKind === null}
                  className={`segment !h-8 !px-3 ${
                    selectedKind === null ? 'active text-white border-primary/50 bg-white/[0.08]' : ''
                  }`}
                >
                  <span>All</span>
                  <span className="num !text-[11px] not-italic ml-1">
                    {stats.total}
                  </span>
                </button>

                {Object.values(KIND_COLORS).map((k) => (
                  <button
                    key={k.key}
                    onClick={() =>
                      setSelectedKind(selectedKind === k.key ? null : k.key)
                    }
                    disabled={stats[k.key as keyof typeof stats] === 0}
                    data-active={selectedKind === k.key}
                    className="segment !h-8 !px-3 disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1.5"
                    style={
                      selectedKind === k.key
                        ? {
                            borderColor: `${k.fill}66`,
                            boxShadow: `0 0 18px -8px ${k.fill}`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: k.fill, boxShadow: `0 0 8px ${k.fill}` }}
                    />
                    <span className="hidden sm:inline">{k.label}</span>
                    <span className="num !text-[11px] not-italic">
                      {stats[k.key as keyof typeof stats] as number}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right: Lenses & Pitch Orientation */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLens('strikes')}
                    className={`relative flex items-center gap-1.5 h-7 font-display text-[9.5px] font-black uppercase tracking-[0.18em] transition-colors ${
                      lens === 'strikes' ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <Crosshair
                      size={12}
                      className={lens === 'strikes' ? 'text-primary' : 'opacity-60'}
                    />
                    <span className="hidden md:inline">Strikes</span>
                    {lens === 'strikes' && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    onClick={() => setLens('zones')}
                    className={`relative flex items-center gap-1.5 h-7 font-display text-[9.5px] font-black uppercase tracking-[0.18em] transition-colors ${
                      lens === 'zones' ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <LayoutGrid
                      size={12}
                      className={lens === 'zones' ? 'text-primary' : 'opacity-60'}
                    />
                    <span className="hidden md:inline">Zones</span>
                    {lens === 'zones' && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-primary" />
                    )}
                  </button>
                </div>

                <span className="w-px h-4 bg-white/[0.09] shrink-0" />

                {/* Pitch orientation toggle buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullPitch(false)}
                    title="Half pitch — both ends folded together"
                    className={`p-1.5 rounded-lg transition-colors ${
                      !isFullPitch
                        ? 'text-primary bg-white/[0.06]'
                        : 'text-white/25 hover:text-white/60'
                    }`}
                  >
                    <RectangleVertical size={14} />
                  </button>
                  <button
                    onClick={() => setIsFullPitch(true)}
                    title="Full pitch — each strike at the end it was taken"
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFullPitch
                        ? 'text-primary bg-white/[0.06]'
                        : 'text-white/25 hover:text-white/60'
                    }`}
                  >
                    <RectangleHorizontal size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* PITCH SURFACE CONTAINER */}
            <div
              ref={containerRef}
              className={`relative mx-auto flex-1 min-h-[300px] rounded-[1.5rem] border border-white/[0.07] overflow-hidden bg-[#08130b] ${
                isFullPitch
                  ? 'w-full max-w-[1180px] aspect-[112/71]'
                  : 'w-full max-w-[620px] max-h-[70vh] aspect-[57/71]'
              }`}
            >
              <PitchSurface
                half={!isFullPitch}
                vertical={isVertical}
                className="w-full h-full"
                overlay={
                  lens === 'zones' ? (
                    <g>
                      {zonePolygons.map((z) => (
                        <path
                          key={z.key}
                          d={z.d}
                          fill={getZoneColor(z.v)}
                          opacity={0.15 + z.v * 0.55}
                          stroke="rgba(0,0,0,0.25)"
                          strokeWidth={0.06 * scaleFactor}
                        />
                      ))}
                    </g>
                  ) : null
                }
              >
                {/* Distance Range Circles (11M, 18M, 30M, 40M) */}
                {lens !== 'zones' &&
                  goalEnds.map((gEnd) =>
                    [11, 18, 30, 40].map((dist) => {
                      const labelPos = isVertical
                        ? { x: 0.6, y: dist }
                        : { x: gEnd.dir * (dist + 0.4), y: -0.6 };
                      return (
                        <g pointerEvents="none" key={`${gEnd.end}-${dist}`}>
                          <circle
                            cx={gEnd.x}
                            cy={gEnd.y}
                            r={dist}
                            fill="none"
                            stroke="rgba(255,255,255,0.09)"
                            strokeWidth={0.08 * scaleFactor}
                            strokeDasharray="0.7 0.5"
                          />
                          <g
                            transform={
                              isVertical
                                ? `rotate(-90 ${gEnd.x} ${gEnd.y})`
                                : undefined
                            }
                          >
                            <text
                              x={gEnd.x + labelPos.x}
                              y={gEnd.y + labelPos.y}
                              textAnchor={gEnd.dir > 0 ? 'start' : 'end'}
                              fill="rgba(255,255,255,0.2)"
                              fontSize={0.95 * scaleFactor}
                              fontWeight="800"
                              fontStyle="italic"
                              fontFamily="Archivo, system-ui"
                            >
                              {dist}M
                            </text>
                          </g>
                        </g>
                      );
                    })
                  )}

                {/* Shot Dots & Flight Paths */}
                {clusteredGoals.map((cluster, cIdx) => {
                  const lead = cluster[0];
                  const isMultiple = cluster.length > 1;
                  const isFilteredOut =
                    selectedKind !== null && lead.kind !== selectedKind;
                  const isHovered = hoveredClusterIndex === cIdx && !isFilteredOut;
                  const color = KIND_COLORS[lead.kind].fill;
                  const pointRadius = (
                    isMultiple
                      ? Math.min(0.55 + cluster.length * 0.08, 1.3)
                      : 0.4
                  ) * scaleFactor;

                  return (
                    <g
                      key={`cluster-${cIdx}`}
                      className={isFilteredOut ? '' : 'cursor-pointer'}
                      style={{
                        pointerEvents: isFilteredOut ? 'none' : 'auto',
                        opacity: isFilteredOut
                          ? 0.08
                          : hoveredClusterIndex !== null && hoveredClusterIndex !== cIdx
                          ? 0.16
                          : lens === 'zones'
                          ? 0.55
                          : 1,
                        transition: 'opacity 0.25s ease',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isMultiple) {
                          setSelectedClusterModal(cluster);
                        } else {
                          onOpenModal(lead);
                        }
                      }}
                      onMouseEnter={(e) => {
                        setHoveredClusterIndex(cIdx);
                        const cRect = containerRef.current?.getBoundingClientRect();
                        const circleElem = e.currentTarget.querySelector('circle');
                        const oRect = circleElem?.getBoundingClientRect();
                        if (cRect && oRect) {
                          setActiveTooltip({
                            cluster,
                            x: oRect.left + oRect.width / 2 - cRect.left,
                            top: oRect.top - cRect.top,
                            bottom: oRect.bottom - cRect.top,
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredClusterIndex(null);
                        setActiveTooltip(null);
                      }}
                    >
                      {/* Animated Trajectory & Ball Flight on Hover */}
                      {isHovered && lead.traced && (
                        <g pointerEvents="none">
                          {(() => {
                            const dPath = generateSmoothPath(lead.traced);
                            const targetEnd = lead.traced[lead.traced.length - 1];
                            return (
                              <>
                                <path
                                  d={dPath}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth={0.4 * scaleFactor}
                                  opacity="0.16"
                                  strokeLinecap="round"
                                />
                                <path
                                  d={dPath}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth={0.13 * scaleFactor}
                                  strokeLinecap="round"
                                  pathLength="1"
                                  strokeDasharray="1 1"
                                  style={{ color }}
                                  markerEnd="url(#flightHead)"
                                >
                                  <animate
                                    attributeName="stroke-dashoffset"
                                    from="1"
                                    to="0"
                                    dur="0.5s"
                                    fill="freeze"
                                  />
                                </path>
                                <circle r={0.42 * scaleFactor} fill="#fff" opacity="0.95">
                                  <animateMotion
                                    dur="1.15s"
                                    repeatCount="indefinite"
                                    path={dPath}
                                    keyPoints="0;1"
                                    keyTimes="0;1"
                                    calcMode="spline"
                                    keySplines="0.4 0 0.7 1"
                                  />
                                </circle>
                                <circle r={0.9 * scaleFactor} fill={color} opacity="0.25">
                                  <animateMotion
                                    dur="1.15s"
                                    repeatCount="indefinite"
                                    path={dPath}
                                    keyPoints="0;1"
                                    keyTimes="0;1"
                                    calcMode="spline"
                                    keySplines="0.4 0 0.7 1"
                                  />
                                </circle>
                                <circle
                                  cx={targetEnd.mx}
                                  cy={targetEnd.my}
                                  r={0.9 * scaleFactor}
                                  fill={color}
                                  opacity="0.3"
                                >
                                  <animate
                                    attributeName="r"
                                    values="0.5;2.1;0.5"
                                    dur="1.15s"
                                    repeatCount="indefinite"
                                  />
                                  <animate
                                    attributeName="opacity"
                                    values="0.45;0.05;0.45"
                                    dur="1.15s"
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              </>
                            );
                          })()}
                        </g>
                      )}

                      {/* Drop shadow ellipse */}
                      <ellipse
                        cx={lead.mx}
                        cy={lead.my + 0.2 * scaleFactor}
                        rx={(isHovered ? 0.9 : 0.44) * scaleFactor}
                        ry={(isHovered ? 0.28 : 0.13) * scaleFactor}
                        fill="rgba(0,0,0,0.34)"
                      />

                      {/* Hover ring */}
                      {isHovered && (
                        <circle
                          cx={lead.mx}
                          cy={lead.my}
                          r={pointRadius + 0.7 * scaleFactor}
                          fill="none"
                          stroke={color}
                          strokeWidth={0.11 * scaleFactor}
                          opacity="0.5"
                        />
                      )}

                      {/* Shot marker circle */}
                      <circle
                        cx={lead.mx}
                        cy={lead.my}
                        r={isHovered ? pointRadius + 0.22 * scaleFactor : pointRadius}
                        fill={color}
                        fillOpacity={isHovered ? 1 : 0.88}
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth={0.055 * scaleFactor}
                      />

                      {/* Cluster count badge */}
                      {isMultiple && (
                        <g
                          transform={
                            isVertical
                              ? `rotate(-90 ${lead.mx} ${lead.my})`
                              : undefined
                          }
                        >
                          <circle
                            cx={lead.mx + pointRadius + 0.32 * scaleFactor}
                            cy={lead.my - pointRadius - 0.32 * scaleFactor}
                            r={0.74 * scaleFactor}
                            fill={color}
                            stroke="rgba(0,0,0,0.6)"
                            strokeWidth={0.09 * scaleFactor}
                          />
                          <text
                            x={lead.mx + pointRadius + 0.32 * scaleFactor}
                            y={lead.my - pointRadius + 0.26 * scaleFactor}
                            textAnchor="middle"
                            fill="#000"
                            fontSize={0.76 * scaleFactor}
                            fontWeight="900"
                            fontFamily="Archivo, system-ui"
                            pointerEvents="none"
                          >
                            {cluster.length}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </PitchSurface>

              {/* Floating Tooltip */}
              {activeTooltip && (
                <div
                  className="absolute z-30 pointer-events-none"
                  style={{
                    left: `clamp(min(118px, 50%), ${activeTooltip.x}px, max(calc(100% - 118px), 50%))`,
                    top:
                      activeTooltip.top < 74
                        ? activeTooltip.bottom + 10
                        : activeTooltip.top - 10,
                    transform: `translate(-50%, ${activeTooltip.top < 74 ? '0' : '-100%'})`,
                    maxWidth: 'min(240px, 92%)',
                  }}
                >
                  <div className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-[#08080a]/95 backdrop-blur-xl border border-white/[0.11] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                    <span
                      className="w-1 self-stretch rounded-full shrink-0"
                      style={{
                        background: KIND_COLORS[activeTooltip.cluster[0].kind].fill,
                      }}
                    />
                    <div className="min-w-0">
                      <span className="block text-[12px] font-bold leading-tight text-white truncate">
                        {activeTooltip.cluster.length > 1
                          ? `${activeTooltip.cluster.length} Goals`
                          : activeTooltip.cluster[0].opponent || 'Unknown'}
                      </span>
                      <span className="block text-[10px] leading-tight text-white/45 truncate">
                        {KIND_COLORS[activeTooltip.cluster[0].kind].label} ·{' '}
                        {Math.round(
                          Math.hypot(
                            activeTooltip.cluster[0].mx - activeTooltip.cluster[0].goal.x,
                            activeTooltip.cluster[0].my - activeTooltip.cluster[0].goal.y
                          )
                        )}
                        m
                        {activeTooltip.cluster.length > 1
                          ? ' · tap to open'
                          : activeTooltip.cluster[0].date
                          ? ` · ${activeTooltip.cluster[0].date}`
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top-left plotted count badge */}
              <div className="absolute top-3.5 left-4 z-20 pointer-events-none flex items-center gap-2.5 [text-shadow:0_1px_5px_rgba(0,0,0,0.95)]">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    background: selectedKind ? KIND_COLORS[selectedKind].fill : '#f97316',
                    boxShadow: `0 0 10px ${
                      selectedKind ? KIND_COLORS[selectedKind].fill : '#f97316'
                    }`,
                  }}
                />
                <span className="num text-sm text-white leading-none">
                  {flatVisibleGoals.length}
                </span>
                <span className="label">
                  {selectedKind ? KIND_COLORS[selectedKind].label : 'Plotted'}
                </span>
              </div>

              {/* Zones Legend */}
              {lens === 'zones' && (
                <div className="absolute bottom-3.5 right-4 z-20 pointer-events-none flex items-center gap-2 [text-shadow:0_1px_5px_rgba(0,0,0,0.95)]">
                  <span className="label !text-[8px]">Fewer</span>
                  <span
                    className="w-16 h-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${getZoneColor(0)}, ${getZoneColor(
                        0.5
                      )}, ${getZoneColor(1)})`,
                    }}
                  />
                  <span className="label !text-[8px]">More</span>
                </div>
              )}
            </div>

            {/* Wrong Mark Report Button below pitch */}
            <div className="text-center pt-1">
              <button
                onClick={() =>
                  window.open(
                    'mailto:messiallgoals10@gmail.com?subject=Wrong Mark Report',
                    '_blank'
                  )
                }
                className="inline-flex items-center gap-2 h-8 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white/35 hover:text-white hover:border-white/20 transition-colors"
              >
                <Flag size={11} />
                <span className="font-display text-[8.5px] font-black uppercase tracking-[0.14em]">
                  Report a wrong mark
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT ASIDE: STATISTICAL BREAKDOWN */}
          <aside className="min-w-0 space-y-6">
            {/* On the pitch */}
            <div>
              <span className="label block mb-2.5">On the pitch</span>
              <div className="flex items-baseline gap-2">
                <span className="num text-[36px] leading-[0.85] text-white">
                  {flatVisibleGoals.length}
                </span>
                <span className="label">/ {plottedGoals.length}</span>
              </div>
              <span className="block mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <span
                  className="block h-full rounded-full bg-primary transition-[width] duration-400"
                  style={{
                    width: `${
                      plottedGoals.length
                        ? (flatVisibleGoals.length / plottedGoals.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </span>
            </div>

            {/* Split Breakdown */}
            <div className="pt-6 border-t border-white/[0.06]">
              <span className="label block mb-3">Split</span>
              {/* Segmented color bar */}
              <span className="flex h-2 rounded-full overflow-hidden bg-white/[0.05] mb-3">
                {Object.values(KIND_COLORS).map((k) => {
                  const count = stats[k.key as keyof typeof stats] as number;
                  const pct = flatVisibleGoals.length
                    ? (count / flatVisibleGoals.length) * 100
                    : 0;
                  return (
                    <span
                      key={k.key}
                      style={{ background: k.fill, width: `${pct}%` }}
                      className="transition-[width] duration-350"
                    />
                  );
                })}
              </span>

              {/* Breakdown List */}
              <div className="space-y-1.5">
                {Object.values(KIND_COLORS).map((k) => {
                  const count = stats[k.key as keyof typeof stats] as number;
                  const pct = flatVisibleGoals.length
                    ? Math.round((count / flatVisibleGoals.length) * 100)
                    : 0;
                  return (
                    <div key={k.key} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: k.fill }}
                      />
                      <span className="flex-1 min-w-0 truncate text-[11px] font-medium text-white/50">
                        {k.label}
                      </span>
                      <span className="num-plain text-[11px] text-white/80">
                        {count}
                      </span>
                      <span className="label !text-[8px] w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pitch metrics */}
            <div className="pt-6 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="label !text-[9px]">Avg Range</span>
                <span className="num-plain text-white font-bold">
                  {stats.avgRange.toFixed(1)}m
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="label !text-[9px]">Longest Range</span>
                <span className="num-plain text-white font-bold">
                  {Math.round(stats.longestRange)}m
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom StatsBomb Data Credit */}
        <p className="mt-10 pt-5 border-t border-white/[0.07] text-[10.5px] leading-relaxed text-white/25">
          Shot locations for La Liga, the 2022 World Cup and Ligue 1 come from{' '}
          <a
            href="https://github.com/statsbomb/open-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-primary underline underline-offset-2 decoration-white/15 hover:decoration-primary/50 transition-colors"
          >
            StatsBomb Open Data
          </a>
          , free for non-commercial research. The rest are plotted by hand.
        </p>
      </div>

      {/* Cluster Popup Modal when tapping overlapping points */}
      {selectedClusterModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedClusterModal(null)}
        >
          <div
            className="bg-[#0b0b0d] border border-white/[0.08] rounded-[2rem] w-full max-w-sm shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${
                  KIND_COLORS[selectedClusterModal[0].kind].fill
                }, transparent)`,
              }}
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="num text-lg text-white leading-none">
                    {selectedClusterModal.length}
                  </span>
                  <h4 className="label">Strikes from this spot</h4>
                </div>
                <button
                  onClick={() => setSelectedClusterModal(null)}
                  className="p-2 rounded-xl text-white/25 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                {selectedClusterModal.map((goal) => (
                  <button
                    key={goal.title}
                    onClick={() => {
                      setSelectedClusterModal(null);
                      onOpenModal(goal);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-primary/10 group transition-all border border-white/[0.04] hover:border-primary/25"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: KIND_COLORS[goal.kind].fill,
                          boxShadow: `0 0 8px ${KIND_COLORS[goal.kind].fill}`,
                        }}
                      />
                      <div className="flex flex-col items-start text-left min-w-0">
                        <span className="text-[12px] font-bold text-white group-hover:text-primary transition-colors truncate">
                          vs {goal.opponent}
                        </span>
                        <span className="label !tracking-[0.12em] mt-1 truncate">
                          {goal.competition} · {goal.date}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-white/15 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
