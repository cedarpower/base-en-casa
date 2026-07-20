"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate: string | null;
  onStartDateChange: (iso: string) => void;
  onReset: () => void;
}

export function SettingsDialog({ open, onOpenChange, startDate, onStartDateChange, onReset }: SettingsDialogProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  const dateValue = startDate ? startDate.slice(0, 10) : "";

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setConfirmingReset(false); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustes del programa</DialogTitle>
          <DialogDescription>
            La app calcula el día de hoy a partir de esta fecha de inicio. Cámbiala si empiezas otro día o
            quieres desplazar el calendario.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label htmlFor="start-date" className="text-sm font-medium">
            Fecha de inicio (Semana 1, Día 1)
          </label>
          <input
            id="start-date"
            type="date"
            value={dateValue}
            onChange={(e) => {
              if (e.target.value) onStartDateChange(new Date(e.target.value).toISOString());
            }}
            className="mt-2 w-full rounded-md border border-border bg-background p-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="rounded-md border border-border bg-muted/50 p-3">
          <p className="text-sm font-medium">Reiniciar progreso</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Borra todas las series marcadas, RPE y notas de las 6 semanas. No se puede deshacer.
          </p>
          {!confirmingReset ? (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setConfirmingReset(true)}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar progreso
            </Button>
          ) : (
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onReset();
                  setConfirmingReset(false);
                }}
              >
                Sí, borrar todo
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmingReset(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
