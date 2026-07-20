"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PROGRAM, TOTAL_DAYS, DAYS_PER_WEEK, TOTAL_WEEKS, TrainingDay } from "./program-data";

const STORAGE_KEY = "base-en-casa:progress:v1";
const START_DATE_KEY = "base-en-casa:start-date:v1";

export interface DayProgress {
  sets: boolean[][]; // sets[exerciseIndex][setIndex]
  warmupDone: boolean[];
  rpe?: number;
  note?: string;
}

type ProgressState = Record<string, DayProgress>;

function dayKey(week: number, day: number) {
  return `${week}-${day}`;
}

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysSince(startISO: string): number {
  const start = toDateOnly(new Date(startISO));
  const now = toDateOnly(new Date());
  return Math.round((now.getTime() - start.getTime()) / 86400000);
}

export function computeTodayPosition(startISO: string | null): {
  week: number;
  day: number;
  completed: boolean;
} {
  if (!startISO) return { week: 1, day: 1, completed: false };
  let ds = daysSince(startISO);
  if (ds < 0) ds = 0;
  const completed = ds >= TOTAL_DAYS;
  if (completed) ds = TOTAL_DAYS - 1;
  const week = Math.floor(ds / DAYS_PER_WEEK) + 1;
  const day = (ds % DAYS_PER_WEEK) + 1;
  return { week, day, completed };
}

function emptySetsFor(training: TrainingDay | undefined): boolean[][] {
  if (!training) return [];
  return training.exercises.map((e) => new Array(e.sets).fill(false));
}

function emptyWarmupFor(training: TrainingDay | undefined): boolean[] {
  if (!training?.warmup) return [];
  return new Array(training.warmup.length).fill(false);
}

export function useProgress() {
  const [hydrated, setHydrated] = useState(false);
  const [startDate, setStartDateState] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState>({});

  useEffect(() => {
    try {
      const savedStart = localStorage.getItem(START_DATE_KEY);
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedStart) setStartDateState(savedStart);
      else {
        const today = toDateOnly(new Date()).toISOString();
        localStorage.setItem(START_DATE_KEY, today);
        setStartDateState(today);
      }
      if (savedProgress) setProgress(JSON.parse(savedProgress));
    } catch {
      // localStorage no disponible: seguimos con estado en memoria
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignoramos errores de almacenamiento
    }
  }, []);

  const setStartDate = useCallback((iso: string) => {
    setStartDateState(iso);
    try {
      localStorage.setItem(START_DATE_KEY, iso);
    } catch {
      // ignoramos errores de almacenamiento
    }
  }, []);

  const getDayProgress = useCallback(
    (week: number, day: number, training: TrainingDay | undefined): DayProgress => {
      const key = dayKey(week, day);
      const existing = progress[key];
      const emptySets = emptySetsFor(training);
      const emptyWarmup = emptyWarmupFor(training);
      if (!existing) return { sets: emptySets, warmupDone: emptyWarmup };
      // aseguramos que la forma coincide con el nº de ejercicios/series actual
      const sets = emptySets.map((setsRow, exIdx) =>
        setsRow.map((_, setIdx) => existing.sets?.[exIdx]?.[setIdx] ?? false)
      );
      const warmupDone = emptyWarmup.map((_, i) => existing.warmupDone?.[i] ?? false);
      return { sets, warmupDone, rpe: existing.rpe, note: existing.note };
    },
    [progress]
  );

  const toggleSet = useCallback(
    (week: number, day: number, training: TrainingDay, exerciseIdx: number, setIdx: number) => {
      const key = dayKey(week, day);
      const current = getDayProgress(week, day, training);
      const sets = current.sets.map((row) => [...row]);
      sets[exerciseIdx][setIdx] = !sets[exerciseIdx][setIdx];
      persist({ ...progress, [key]: { ...current, sets } });
    },
    [getDayProgress, persist, progress]
  );

  const toggleExerciseComplete = useCallback(
    (week: number, day: number, training: TrainingDay, exerciseIdx: number) => {
      const key = dayKey(week, day);
      const current = getDayProgress(week, day, training);
      const sets = current.sets.map((row) => [...row]);
      const allDone = sets[exerciseIdx].every(Boolean);
      sets[exerciseIdx] = sets[exerciseIdx].map(() => !allDone);
      persist({ ...progress, [key]: { ...current, sets } });
    },
    [getDayProgress, persist, progress]
  );

  const toggleWarmupItem = useCallback(
    (week: number, day: number, training: TrainingDay, itemIdx: number) => {
      const key = dayKey(week, day);
      const current = getDayProgress(week, day, training);
      const warmupDone = [...current.warmupDone];
      warmupDone[itemIdx] = !warmupDone[itemIdx];
      persist({ ...progress, [key]: { ...current, warmupDone } });
    },
    [getDayProgress, persist, progress]
  );

  const setRpe = useCallback(
    (week: number, day: number, training: TrainingDay, rpe: number) => {
      const key = dayKey(week, day);
      const current = getDayProgress(week, day, training);
      persist({ ...progress, [key]: { ...current, rpe } });
    },
    [getDayProgress, persist, progress]
  );

  const setNote = useCallback(
    (week: number, day: number, training: TrainingDay, note: string) => {
      const key = dayKey(week, day);
      const current = getDayProgress(week, day, training);
      persist({ ...progress, [key]: { ...current, note } });
    },
    [getDayProgress, persist, progress]
  );

  const resetProgress = useCallback(() => {
    persist({});
  }, [persist]);

  const dayCompletionRatio = useCallback(
    (week: number, day: number, training: TrainingDay | undefined): number => {
      if (!training || training.exercises.length === 0) return 0;
      const { sets } = getDayProgress(week, day, training);
      const total = sets.reduce((acc, row) => acc + row.length, 0);
      if (total === 0) return 0;
      const done = sets.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
      return done / total;
    },
    [getDayProgress]
  );

  const isDayFullyDone = useCallback(
    (week: number, day: number, training: TrainingDay | undefined): boolean => {
      if (!training || training.exercises.length === 0) return false;
      return dayCompletionRatio(week, day, training) === 1;
    },
    [dayCompletionRatio]
  );

  const overallStats = useMemo(() => {
    let totalSets = 0;
    let doneSets = 0;
    let daysFullyDone = 0;
    let trainingDaysCount = 0;
    for (const t of PROGRAM) {
      if (t.type === "rest") continue;
      trainingDaysCount++;
      const key = dayKey(t.week, t.day);
      const existing = progress[key];
      const totalForDay = t.exercises.reduce((acc, e) => acc + e.sets, 0);
      totalSets += totalForDay;
      let doneForDay = 0;
      if (existing) {
        doneForDay = existing.sets.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
      }
      doneSets += doneForDay;
      if (totalForDay > 0 && doneForDay === totalForDay) daysFullyDone++;
    }
    const percent = totalSets === 0 ? 0 : Math.round((doneSets / totalSets) * 100);
    return { percent, daysFullyDone, trainingDaysCount };
  }, [progress]);

  const currentStreak = useMemo(() => {
    const pos = computeTodayPosition(startDate);
    let streak = 0;
    const idx = PROGRAM.findIndex((d) => d.week === pos.week && d.day === pos.day);
    if (idx === -1) return 0;
    for (let i = idx; i >= 0; i--) {
      const t = PROGRAM[i];
      if (t.type === "rest") continue;
      const key = dayKey(t.week, t.day);
      const existing = progress[key];
      const totalForDay = t.exercises.reduce((acc, e) => acc + e.sets, 0);
      const doneForDay = existing
        ? existing.sets.reduce((acc, row) => acc + row.filter(Boolean).length, 0)
        : 0;
      if (totalForDay > 0 && doneForDay === totalForDay) streak++;
      else break;
    }
    return streak;
  }, [progress, startDate]);

  return {
    hydrated,
    startDate,
    setStartDate,
    getDayProgress,
    toggleSet,
    toggleExerciseComplete,
    toggleWarmupItem,
    setRpe,
    setNote,
    resetProgress,
    dayCompletionRatio,
    isDayFullyDone,
    overallStats,
    currentStreak,
    todayPosition: computeTodayPosition(startDate),
  };
}

export { TOTAL_WEEKS, DAYS_PER_WEEK, TOTAL_DAYS };
