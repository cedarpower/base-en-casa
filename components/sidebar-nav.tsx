"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Flame, Feather, Moon as MoonIcon, Settings, TreePine } from "lucide-react";

import { PHASES, PROGRAM, TrainingDay } from "@/lib/program-data";
import { ProgressRing } from "@/components/progress-ring";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  selectedWeek: number;
  selectedDay: number;
  today: { week: number; day: number };
  overallPercent: number;
  streak: number;
  isDayFullyDone: (week: number, day: number, training: TrainingDay | undefined) => boolean;
  onSelect: (week: number, day: number) => void;
  onOpenSettings: () => void;
}

export function SidebarNav({
  selectedWeek,
  selectedDay,
  today,
  overallPercent,
  streak,
  isDayFullyDone,
  onSelect,
  onOpenSettings,
}: SidebarNavProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([today.week]));

  function toggleWeek(week: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <TreePine className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-tight">Base en casa</p>
          <p className="text-xs text-muted-foreground">Progresión de fuerza · 6 semanas</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <ProgressRing value={overallPercent} size={56} strokeWidth={5} sublabel="total" />
        <div>
          <p className="font-mono text-lg font-semibold leading-none">{streak}</p>
          <p className="text-xs text-muted-foreground">
            {streak === 1 ? "día seguido" : "días seguidos"}
          </p>
        </div>
      </div>

      <nav className="scroll-thin flex-1 overflow-y-auto px-2 py-3">
        {PHASES.map((phase) => (
          <div key={phase.id} className="mb-3">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Fase {phase.id} · {phase.name}
            </p>
            {Array.from({ length: phase.weeks[1] - phase.weeks[0] + 1 }, (_, i) => phase.weeks[0] + i).map(
              (week) => {
                const weekDays = PROGRAM.filter((d) => d.week === week);
                const isExpanded = expandedWeeks.has(week);
                const weekTrainingDays = weekDays.filter((d) => d.type !== "rest");
                const weekDone = weekTrainingDays.every((d) => isDayFullyDone(d.week, d.day, d));
                return (
                  <div key={week} className="mb-1">
                    <button
                      type="button"
                      onClick={() => toggleWeek(week)}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted"
                    >
                      <span className="flex items-center gap-1.5">
                        {weekDone && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                        Semana {week}
                      </span>
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-2 mt-0.5 space-y-0.5 border-l border-border pl-2">
                        {weekDays.map((d) => {
                          const isSelected = d.week === selectedWeek && d.day === selectedDay;
                          const isToday = d.week === today.week && d.day === today.day;
                          const done = d.type !== "rest" && isDayFullyDone(d.week, d.day, d);
                          const Icon = d.type === "A" ? Flame : d.type === "B" ? Feather : MoonIcon;
                          return (
                            <button
                              key={d.day}
                              type="button"
                              onClick={() => onSelect(d.week, d.day)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                                isSelected ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                isToday && !isSelected && "ring-1 ring-inset ring-primary/40"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="flex-1 truncate">
                                Día {d.day} · {d.title}
                              </span>
                              {done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />}
                              {isToday && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Ajustes del programa
        </button>
      </div>
    </div>
  );
}
