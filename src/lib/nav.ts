/**
 * Navigation der Designsprache 2: der aktive Eintrag der Seitenleiste. Rein funktional,
 * ohne Router und ohne React (Eintragsform siehe src/ui/nav-types.ts).
 */

/** Was die Suche nach dem aktiven Eintrag von einem Eintrag braucht. */
export interface NavTarget {
  readonly to?: string;
  /** Weitere Pfade, unter denen der Eintrag aktiv ist. */
  readonly activeFor?: readonly string[];
  readonly sections?: readonly { readonly items: readonly NavTarget[] }[];
}

const normalize = (p: string) => p.replace(/\/$/, '') || '/';

/** Alle Links (Einträge mit `to`), auch in aufklappbaren Bereichen. */
export function navLeaves<T extends NavTarget>(items: readonly T[]): T[] {
  return items.flatMap((i) => [
    ...(i.to ? [i] : []),
    ...(i.sections ?? []).flatMap((s) => navLeaves(s.items as readonly T[])),
  ]);
}

/** Pfade eines Eintrags, unter denen er aktiv ist. */
const pathsOf = (i: NavTarget) => [i.to ?? '', ...(i.activeFor ?? [])].filter(Boolean);

/**
 * Der aktive Link (sein `to`): genau passend, sonst der längste, unter dem der Pfad liegt (`/` nur
 * genau). `null`, wenn keiner passt.
 */
export function activeNavTarget(
  groups: readonly { readonly items: readonly NavTarget[] }[],
  currentPath: string,
): string | null {
  const path = normalize(currentPath);
  let best: { to: string; length: number } | null = null;
  for (const item of groups.flatMap((g) => navLeaves(g.items))) {
    for (const p of pathsOf(item)) {
      const n = normalize(p);
      const hit = n === path || (n !== '/' && path.startsWith(`${n}/`));
      if (hit && item.to && (!best || n.length > best.length))
        best = { to: item.to, length: n.length };
    }
  }
  return best?.to ?? null;
}
