import React, { useEffect, useRef, useState } from 'react';
import { Goal } from '../types/archive';
import { PitchSurface } from './PitchSurface';
import {
  normalizeCoordToHalfPitch,
  buildTrajectorySvgPath,
  getShotColor,
} from '../utils/pitchUtils';
import { getCrestUrl } from '../utils/crestUtils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldAlert,
  Calendar,
  MapPin,
  Flame,
  Award,
  Share2,
  Check,
  Maximize,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface GoalDetailModalProps {
  goal: Goal | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal,
  onClose,
  onNext,
  onPrev,
  hasPrev = true,
  hasNext = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean title to extract goal/assist number
  const goalNum = goal ? goal.title.replace(/\D/g, '') : '1';
  const isAssist = goal?.type === 'assist';
  // Direct CDN video URL from messiallgoals.com
  const videoUrl = `https://cdn.messiallgoals.com/${isAssist ? 'Assist' : 'Goal'}${goalNum}.mp4`;

  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
    setIsPlaying(true);
    setProgress(0);
  }, [goal?.title]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((cur / dur) * 100);
      const curM = Math.floor(cur / 60);
      const curS = Math.floor(cur % 60);
      setCurrentTime(`${curM}:${curS < 10 ? '0' : ''}${curS}`);
      const durM = Math.floor(dur / 60);
      const durS = Math.floor(dur % 60);
      setDuration(`${durM}:${durS < 10 ? '0' : ''}${durS}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.key === 'j' || e.key === 'ArrowRight') && onNext && hasNext) onNext();
      if ((e.key === 'k' || e.key === 'ArrowLeft') && onPrev && hasPrev) onPrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev, isPlaying]);

  if (!goal) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shotColor = getShotColor(goal);
  const shotPt = goal.coord ? normalizeCoordToHalfPitch(goal.coord) : null;
  const trajectoryPath = buildTrajectorySvgPath(goal.path, goal.coord);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#0c0c0e] border border-white/[0.1] rounded-[1.75rem] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[95vh] transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#111115]">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-sm px-3 py-1 rounded-xl bg-[#F97316] text-black shadow-md shadow-[#F97316]/30">
              {isAssist ? 'ASSIST' : 'GOAL'} #{goal.title}
            </span>
            <span className="text-xs font-bold text-white/90 truncate max-w-[200px] sm:max-w-sm">
              {goal.competition} {goal.minute ? `· ${goal.minute}'` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white transition-colors"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-white/70 hover:text-rose-400 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto space-y-5 p-4 sm:p-6">
          {/* Real HD Video Player Section with Custom Controls */}
          <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl flex items-center justify-center group"
          >
            {!videoError ? (
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                playsInline
                muted={isMuted}
                loop
                onCanPlay={() => setIsVideoLoading(false)}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                onError={() => {
                  setIsVideoLoading(false);
                  setVideoError(true);
                }}
                className="w-full h-full object-contain cursor-pointer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white/60 space-y-3">
                <Play className="w-10 h-10 text-primary opacity-60" />
                <p className="text-xs text-white/70">Unable to load HD video stream for this moment.</p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    setIsVideoLoading(true);
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="px-4 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 font-display text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  Retry Stream
                </button>
              </div>
            )}

            {/* Video Loading Spinner */}
            {isVideoLoading && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                <div className="w-8 h-8 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin" />
              </div>
            )}

            {/* Video Controls Bar */}
            {!videoError && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {/* Scrubber Progress Bar */}
                <div
                  className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all relative overflow-hidden"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-[#F97316] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="p-1 hover:text-[#F97316] transition-colors">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="p-1 hover:text-[#F97316] transition-colors">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px] text-white/70">
                      {currentTime} / {duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleFullscreen} className="p-1 hover:text-[#F97316] transition-colors">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Match Score Banner */}
          <div className="bg-[#121216] p-4 sm:p-5 rounded-2xl border border-white/[0.08] flex items-center justify-between shadow-lg">
            {/* Home Team */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={getCrestUrl(goal.image)}
                alt={goal.homeTeam || 'Team'}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow"
              />
              <div className="min-w-0">
                <span className="text-sm sm:text-base font-display font-black text-white block truncate">
                  {goal.homeTeam}
                </span>
                <span className="text-[11px] text-white/40">{goal.info || '(H)'}</span>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="px-4 py-2 rounded-xl bg-black border border-white/[0.08] text-center mx-2 sm:mx-4 shadow-inner">
              <div className="text-xl sm:text-2xl font-display font-black text-white tracking-widest">
                {goal.homeScore ?? '-'}:{goal.awayScore ?? '-'}
              </div>
              {goal.minute && (
                <span className="text-[11px] font-mono font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded">
                  {goal.minute}' min
                </span>
              )}
            </div>

            {/* Opponent Team */}
            <div className="flex items-center gap-3 min-w-0 flex-1 flex-row-reverse text-right">
              <img
                src={getCrestUrl(goal.oppoimage)}
                alt={goal.opponent || 'Opponent'}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow"
              />
              <div className="min-w-0">
                <span className="text-sm sm:text-base font-display font-black text-white block truncate">
                  {goal.opponent || goal.awayTeam}
                </span>
                <span className="text-[11px] text-white/40">{goal.season || 'Season'}</span>
              </div>
            </div>
          </div>

          {/* Mini Pitch Trajectory & Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Shot Trajectory on Mini Pitch */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Pitch Trajectory</span>
                </h4>
                <span className="text-[10px] text-white/40 font-mono">Attacking Zone</span>
              </div>

              <PitchSurface half={true} className="w-full">
                {trajectoryPath && (
                  <path
                    d={trajectoryPath}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="0.9"
                    strokeDasharray="1.5,1.5"
                    className="animate-pulse"
                  />
                )}
                {shotPt && (
                  <g>
                    <circle cx={shotPt.mx} cy={shotPt.my} r="2.2" fill={shotColor} opacity="0.3" />
                    <circle
                      cx={shotPt.mx}
                      cy={shotPt.my}
                      r="1.2"
                      fill={shotColor}
                      stroke="#ffffff"
                      strokeWidth="0.4"
                    />
                  </g>
                )}
              </PitchSurface>
            </div>

            {/* Right: Technical Facts Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.06]">
                <span className="text-white/40 flex items-center gap-1 mb-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-[#F97316]" /> Date
                </span>
                <strong className="text-white block text-xs">{goal.date}</strong>
              </div>

              <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.06]">
                <span className="text-white/40 flex items-center gap-1 mb-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-rose-400" /> Stadium
                </span>
                <strong className="text-white block text-xs truncate">
                  {goal.stadium || 'Official Stadium'}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.06]">
                <span className="text-white/40 flex items-center gap-1 mb-1 text-[11px]">
                  <Award className="w-3 h-3 text-amber-400" /> Expected Goals (xG)
                </span>
                <strong className="text-[#F97316] font-mono text-xs block">
                  {goal.xg !== undefined ? goal.xg.toFixed(3) : '0.145'}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.06]">
                <span className="text-white/40 flex items-center gap-1 mb-1 text-[11px]">
                  <User className="w-3 h-3 text-emerald-400" /> Assisted By
                </span>
                <strong className="text-white block text-xs truncate">
                  {goal.assist || 'Solo / Unassisted'}
                </strong>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-[#121216] border border-white/[0.06]">
                <span className="text-white/40 flex items-center gap-1 mb-1 text-[11px]">
                  <ShieldAlert className="w-3 h-3 text-amber-400" /> Goalkeeper Conceded
                </span>
                <strong className="text-white block text-xs truncate">
                  {goal.goalkeeper || 'Opponent Goalkeeper'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Navigation */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#111115] flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous (K)</span>
          </button>

          <span className="text-xs text-white/30 hidden sm:inline">
            Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">J</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">K</kbd> to jump between goals
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-30 disabled:pointer-events-none text-xs font-black text-black transition-colors shadow-md shadow-[#F97316]/20"
          >
            <span>Next (J)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
