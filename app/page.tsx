"use client";

import { useEffect, useState } from "react";
import { Menu, TreePine } from "lucide-react";

import { getDay } from "@/lib/program-data";
import { useProgress } from "@/lib/use-progress";
import { SidebarNav } from "@/components/sidebar-nav";
import { DayView } from "@/components/day-view";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const progress = useProgress();
  const [selected, setSelected] = useState<{ week: number; day: number } | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (progress.hydrated && !selected) {
      setSelected({ week: progress.todayPosition.week, day: progress.todayPosition.day });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.hydrated]);

  if (!progress.hydrated || !selected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TreePine className="h-5 w-5 animate-pulse" />
          <span className="text-sm">Cargando programa…</span>
        </div>
      </div>
    );
  }

  const training = getDay(selected.week, selected.day);
  const dayProgress = progress.getDayProgress(selected.week, selected.day, training);
  const today = progress.todayPosition;

  function handleSelect(week: number, day: number) {
    setSelected({ week, day });
    setMobileNavOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar de escritorio */}
      <aside className="hidden w-72 shrink-0 border-r border-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarNav
            selectedWeek={selected.week}
            selectedDay={selected.day}
            today={today}
            overallPercent={progress.overallStats.percent}
            streak={progress.currentStreak}
            isDayFullyDone={progress.isDayFullyDone}
            onSelect={handleSelect}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
      </aside>

      {/* Sidebar móvil */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent>
          <SidebarNav
            selectedWeek={selected.week}
            selectedDay={selected.day}
            today={today}
            overallPercent={progress.overallStats.percent}
            streak={progress.currentStreak}
            isDayFullyDone={progress.isDayFullyDone}
            onSelect={handleSelect}
            onOpenSettings={() => {
              setMobileNavOpen(false);
              setSettingsOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:justify-end">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Abrir menú">
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          {training ? (
            <DayView
              training={training}
              dayProgress={dayProgress}
              isToday={selected.week === today.week && selected.day === today.day}
              onToggleSet={(exerciseIdx, setIdx) =>
                progress.toggleSet(selected.week, selected.day, training, exerciseIdx, setIdx)
              }
              onToggleExercise={(exerciseIdx) =>
                progress.toggleExerciseComplete(selected.week, selected.day, training, exerciseIdx)
              }
              onToggleWarmupItem={(itemIdx) =>
                progress.toggleWarmupItem(selected.week, selected.day, training, itemIdx)
              }
              onRpeChange={(rpe) => progress.setRpe(selected.week, selected.day, training, rpe)}
              onNoteChange={(note) => progress.setNote(selected.week, selected.day, training, note)}
            />
          ) : (
            <p className="text-muted-foreground">Día no encontrado.</p>
          )}
        </main>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        startDate={progress.startDate}
        onStartDateChange={progress.setStartDate}
        onReset={progress.resetProgress}
      />
    </div>
  );
}
