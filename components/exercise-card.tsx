"use client";

import { CheckCircle2, Circle, Droplet, PersonStanding, MoveDown, Waves, MoveUp, Anchor, Footprints, Shield } from "lucide-react";

import { Exercise, LOAD_LABEL, PATTERN_LABEL, Pattern } from "@/lib/program-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PATTERN_ICON: Record<Pattern, React.ComponentType<{ className?: string }>> = {
  squat: MoveDown,
  hinge: Waves,
  push: MoveUp,
  pull: Anchor,
  unilateral: Footprints,
  core: Shield,
};

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  sets: boolean[];
  onToggleSet: (setIdx: number) => void;
  onToggleAll: () => void;
}

export function ExerciseCard({ exercise, sets, onToggleSet, onToggleAll }: ExerciseCardProps) {
  const PatternIcon = PATTERN_ICON[exercise.pattern];
  const doneCount = sets.filter(Boolean).length;
  const allDone = sets.length > 0 && doneCount === sets.length;

  return (
    <Card
      className={cn(
        "p-4 transition-colors",
        allDone && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              allDone ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <PatternIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold leading-tight">{exercise.name}</h4>
            <p className="text-xs text-muted-foreground">{PATTERN_LABEL[exercise.pattern]}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleAll}
          aria-pressed={allDone}
          aria-label={allDone ? "Marcar ejercicio como no completado" : "Marcar ejercicio como completado"}
          className={cn(
            "shrink-0 rounded-full transition-transform active:scale-90",
            allDone ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {allDone ? (
            <CheckCircle2 className="h-7 w-7 animate-pop" strokeWidth={2} />
          ) : (
            <Circle className="h-7 w-7" strokeWidth={1.5} />
          )}
        </button>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{exercise.cue}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
          {exercise.load === "peso_corporal" ? (
            <PersonStanding className="h-3.5 w-3.5" />
          ) : (
            <span className="flex items-center gap-0.5">
              {Array.from({ length: exercise.load === "1_garrafa" ? 1 : 2 }).map((_, i) => (
                <Droplet key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
          )}
          {LOAD_LABEL[exercise.load]}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {exercise.sets} × {exercise.reps}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {sets.map((done, setIdx) => (
          <button
            key={setIdx}
            type="button"
            onClick={() => onToggleSet(setIdx)}
            aria-pressed={done}
            aria-label={`Serie ${setIdx + 1} de ${exercise.name}, ${done ? "completada" : "sin completar"}`}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs font-medium transition-all active:scale-90",
              done
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {setIdx + 1}
          </button>
        ))}
        <span className="ml-1 font-mono text-xs text-muted-foreground">
          {doneCount}/{sets.length}
        </span>
      </div>
    </Card>
  );
}
