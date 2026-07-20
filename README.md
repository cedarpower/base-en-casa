# Base en casa — progresión de fuerza

App de React + Next.js (App Router) + Tailwind + componentes estilo shadcn/ui para seguir
una progresión de fuerza de 6 semanas hecha con peso corporal y garrafas de agua de 6L,
pensada para alternar con bici y carrera.

## El programa

- **6 semanas, 3 fases de 2 semanas**: Reactivación → Carga progresiva → Consolidación.
- **6 ejercicios básicos y poliarticulares cada día**: sentadilla, bisagra de cadera, empuje,
  tracción, pierna única (zancada/step-up) y core. Siempre los mismos patrones — lo que cambia
  semana a semana es la carga, las series y la complejidad.
- **Dos tipos de día**: "A" (fuerza, algo más exigente) y "B" (técnica y activación, series
  más ligeras — pensado para el día después de series o en semanas de más carga de bici/carrera).
  Se alternan A-B-A-B-A-B a lo largo de la semana, con un día de descanso.
- **Carga**: empieza solo con peso corporal, introduce 1 garrafa de 6L en la fase 2, y llega a
  2 garrafas (12kg) o variantes a una pierna en la fase 3, como puente antes de pasar a cargas
  reales de gimnasio.

Todo el contenido del programa (ejercicios, series, reps, notas) vive en un único archivo:
`lib/program-data.ts`. Editarlo ahí basta para ajustar cualquier semana sin tocar el resto de
la app.

## Cómo funciona la app

- La app calcula automáticamente qué semana/día toca "hoy" a partir de una fecha de inicio
  (por defecto, el primer día que se abre la app). Se puede cambiar desde **Ajustes del
  programa** en la barra lateral.
- Cada ejercicio tiene un icono de cumplimiento (marca el ejercicio entero como hecho) y una
  fila de series individuales (marca cada serie por separado).
- El progreso, la fecha de inicio, el RPE y las notas de cada día se guardan en `localStorage`
  del navegador — no hay backend ni base de datos. Los datos son locales a cada dispositivo/navegador.
- Modo oscuro por defecto, con toggle a modo claro.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Desplegar en Vercel

1. Sube esta carpeta a un repositorio de GitHub (o similar).
2. En [vercel.com](https://vercel.com), "Add New Project" → importa el repositorio.
3. Vercel detecta Next.js automáticamente — no hace falta configurar nada más.
4. Deploy.

También puedes desplegar directamente desde local con la CLI de Vercel:

```bash
npm install -g vercel
vercel
```

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS, con tokens de color propios (paleta musgo/graphite) vía variables CSS
- Componentes estilo shadcn/ui construidos sobre Radix UI (`@radix-ui/react-*`)
- lucide-react para iconos
- Sin backend: persistencia en `localStorage`
