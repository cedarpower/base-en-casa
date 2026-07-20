"use client";

import { Clock, Flame, Feather, Moon as MoonIcon, Sparkles } from "lucide-react";

import { TrainingDay, getPhaseForWeek } from "@/lib/program-data";
import { DayProgress } from "@/lib/use-progress";
import { ExerciseCard } from "@/components/exercise-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface DayViewProps {
  training: TrainingDay;
  dayProgress: DayProgress;
  isToday: boolean;
  onToggleSet: (exerciseIdx: number, setIdx: number) => void;
  onToggleExercise: (exerciseIdx: number) => void;
  onToggleWarmupItem: (itemIdx: number) => void;
  onRpeChange: (rpe: number) => void;
  onNoteChange: (note: string) => void;
}

export function DayView({
  training,
  dayProgress,
  isToday,
  onToggleSet,
  onToggleExercise,
  onToggleWarmupItem,
  onRpeChange,
  onNoteChange,
}: DayViewProps) {
  const phase = getPhaseForWeek(training.week);
  const totalSets = training.exercises.reduce((acc, e) => acc + e.sets, 0);
  const doneSets = dayProgress.sets.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  const pct = totalSets === 0 ? 0 : Math.round((doneSets / totalSets) * 100);

  if (training.type === "rest") {
    return (
      <div className="mx-auto max-w-2xl">
        <DayHeader training={training} phaseName={phase.name} isToday={isToday} />
        <div className="mt-6 rounded-lg border border-dashed border-border bg-card/50 p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MoonIcon className="h-5 w-5" />
            <span className="font-display text-sm font-semibold text-foreground">Hoy toca descansar</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{training.note}</p>
          <ul className="mt-4 space-y-2">
            {training.mobility?.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <DayHeader training={training} phaseName={phase.name} isToday={isToday} />

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progreso de hoy</span>
          <span className="font-mono text-muted-foreground">
            {doneSets}/{totalSets} series
          </span>
        </div>
        <Progress value={pct} className="mt-2" />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{training.note}</p>

      {training.warmup && training.warmup.length > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <span className="text-sm font-medium">Calentamiento antes de cargar</span>
          <ul className="mt-2 space-y-2">
            {training.warmup.map((item, i) => {
              const done = dayProgress.warmupDone[i] ?? false;
              return (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                    <Checkbox checked={done} onCheckedChange={() => onToggleWarmupItem(i)} className="mt-0.5" />
                    <span className={cn(done && "text-muted-foreground line-through")}>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {training.exercises.map((exercise, idx) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={idx}
            sets={dayProgress.sets[idx] ?? []}
            onToggleSet={(setIdx) => onToggleSet(idx, setIdx)}
            onToggleAll={() => onToggleExercise(idx)}
          />
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <span className="text-sm font-medium">Esfuerzo percibido (RPE)</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onRpeChange(n)}
              aria-pressed={dayProgress.rpe === n}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs transition-colors",
                dayProgress.rpe === n
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border text-muted-foreground hover:border-secondary/50 hover:text-foreground"
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium" htmlFor="day-note">
          Notas del día
        </label>
        <textarea
          id="day-note"
          value={dayProgress.note ?? ""}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Cómo te has encontrado, molestias, ajustes que has hecho..."
          rows={3}
          className="mt-2 w-full resize-none rounded-md border border-border bg-background p-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

function DayHeader({
  training,
  phaseName,
  isToday,
}: {
  training: TrainingDay;
  phaseName: string;
  isToday: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Semana {training.week}</Badge>
        <Badge variant="muted">{phaseName}</Badge>
        {isToday && (
          <Badge className="animate-pop">
            <span>Hoy</span>
          </Badge>
        )}
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">{training.title}</h1>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          {training.type === "A" ? (
            <Flame className="h-3.5 w-3.5" />
          ) : training.type === "B" ? (
            <Feather className="h-3.5 w-3.5" />
          ) : (
            <MoonIcon className="h-3.5 w-3.5" />
          )}
          {training.focus}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />~{training.durationMin} min
        </span>
      </div>
    </div>
  );
}
