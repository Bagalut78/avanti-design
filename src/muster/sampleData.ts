/**
 * Feste Beispieldaten der Musterseite. Erfunden, keine echten Personen, keine
 * Berechnung – nur zum Zeigen der Bausteine.
 */

export type SampleStatus = 'Im Plan' | 'Verspätet' | 'Krank' | 'Urlaub';

export interface SampleAgent {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly skill: string;
  readonly shift: string;
  readonly shiftNote: string;
  readonly status: SampleStatus;
  /** Plantreue der Woche in Prozent. */
  readonly adherence: number;
  readonly hours: number;
  readonly contract: number;
}

export const SAMPLE_AGENTS: readonly SampleAgent[] = [
  {
    id: 'a01',
    name: 'Lena Hoffmann',
    team: 'Team Nord',
    skill: 'Bestellannahme',
    shift: '08:00–16:30',
    shiftNote: 'Früh · Pause 12:00',
    status: 'Im Plan',
    adherence: 97,
    hours: 31.5,
    contract: 32,
  },
  {
    id: 'a02',
    name: 'Murat Yıldız',
    team: 'Team Nord',
    skill: 'Kartensperrung',
    shift: '09:00–17:30',
    shiftNote: 'Mittel · Pause 13:00',
    status: 'Verspätet',
    adherence: 88,
    hours: 30,
    contract: 38.5,
  },
  {
    id: 'a03',
    name: 'Sophie Krüger',
    team: 'Team Süd',
    skill: 'Bestellannahme',
    shift: '–',
    shiftNote: 'ganzer Tag',
    status: 'Krank',
    adherence: 0,
    hours: 0,
    contract: 20,
  },
  {
    id: 'a04',
    name: 'Jonas Becker',
    team: 'Team Süd',
    skill: 'Technik',
    shift: '12:00–20:30',
    shiftNote: 'Spät · Pause 16:30',
    status: 'Im Plan',
    adherence: 94,
    hours: 36,
    contract: 38.5,
  },
  {
    id: 'a05',
    name: 'Aylin Demir',
    team: 'Team Nord',
    skill: 'Kartensperrung',
    shift: '07:00–15:30',
    shiftNote: 'Früh · Pause 11:30',
    status: 'Im Plan',
    adherence: 99,
    hours: 38.5,
    contract: 38.5,
  },
  {
    id: 'a06',
    name: 'Paul Schneider',
    team: 'Team West',
    skill: 'Technik',
    shift: '–',
    shiftNote: 'bis Fr 20.11.',
    status: 'Urlaub',
    adherence: 0,
    hours: 0,
    contract: 30,
  },
  {
    id: 'a07',
    name: 'Mia Wagner',
    team: 'Team West',
    skill: 'Bestellannahme',
    shift: '10:00–18:30',
    shiftNote: 'Mittel · Pause 14:00',
    status: 'Im Plan',
    adherence: 92,
    hours: 28,
    contract: 30,
  },
  {
    id: 'a08',
    name: 'Elias Fischer',
    team: 'Team Süd',
    skill: 'Bestellannahme',
    shift: '14:00–22:00',
    shiftNote: 'Spät · Pause 18:00',
    status: 'Verspätet',
    adherence: 81,
    hours: 22.5,
    contract: 25,
  },
  {
    id: 'a09',
    name: 'Hanna Weber',
    team: 'Team Nord',
    skill: 'Technik',
    shift: '08:30–17:00',
    shiftNote: 'Früh · Pause 12:30',
    status: 'Im Plan',
    adherence: 96,
    hours: 34,
    contract: 38.5,
  },
  {
    id: 'a10',
    name: 'Noah Schulz',
    team: 'Team West',
    skill: 'Kartensperrung',
    shift: '11:00–19:30',
    shiftNote: 'Mittel · Pause 15:00',
    status: 'Im Plan',
    adherence: 90,
    hours: 26,
    contract: 30,
  },
  {
    id: 'a11',
    name: 'Emma Neumann',
    team: 'Team Süd',
    skill: 'Technik',
    shift: '06:00–14:30',
    shiftNote: 'Früh · Pause 10:30',
    status: 'Im Plan',
    adherence: 98,
    hours: 38.5,
    contract: 38.5,
  },
  {
    id: 'a12',
    name: 'Luca Richter',
    team: 'Team Nord',
    skill: 'Bestellannahme',
    shift: '–',
    shiftNote: 'seit Mi 18.11.',
    status: 'Krank',
    adherence: 0,
    hours: 12,
    contract: 20,
  },
  {
    id: 'a13',
    name: 'Clara Wolf',
    team: 'Team West',
    skill: 'Bestellannahme',
    shift: '13:00–21:30',
    shiftNote: 'Spät · Pause 17:30',
    status: 'Im Plan',
    adherence: 93,
    hours: 30,
    contract: 32,
  },
  {
    id: 'a14',
    name: 'Ben Zimmermann',
    team: 'Team Süd',
    skill: 'Kartensperrung',
    shift: '09:30–18:00',
    shiftNote: 'Mittel · Pause 13:30',
    status: 'Im Plan',
    adherence: 95,
    hours: 35,
    contract: 38.5,
  },
];

/** Kennzahlen der Beispielwoche (aktuell und Vorwoche) mit Verlauf der letzten 14 Tage. */
export const SAMPLE_KPIS = {
  calls: {
    value: 18_420,
    previous: 17_150,
    trend: [1180, 1240, 1310, 1290, 1205, 640, 410, 1260, 1330, 1390, 1360, 1300, 700, 455],
  },
  serviceLevel: {
    value: 82.4,
    previous: 78.9,
    trend: [76, 79, 81, 74, 77, 85, 88, 80, 83, 84, 79, 82, 86, 89],
  },
  asa: { value: 24, previous: 31, trend: [38, 33, 29, 41, 35, 22, 18, 30, 27, 25, 31, 26, 20, 17] },
  shrinkage: {
    value: 31.2,
    previous: 29.8,
    trend: [28, 29, 30, 31, 29, 27, 26, 30, 31, 32, 33, 31, 30, 31],
  },
} as const;

/** Anrufe je Tag der Woche (Fläche mit Verlauf). */
export const SAMPLE_CALLS_BY_DAY: readonly { readonly day: string; readonly calls: number }[] = [
  { day: 'Mo', calls: 3310 },
  { day: 'Di', calls: 3125 },
  { day: 'Mi', calls: 2980 },
  { day: 'Do', calls: 3090 },
  { day: 'Fr', calls: 2870 },
  { day: 'Sa', calls: 1690 },
  { day: 'So', calls: 1355 },
];

/** Besetzung der Woche: geplante gegen benötigte Stunden (Bogen). */
export const SAMPLE_COVERAGE = { planned: 1_184, needed: 1_312 } as const;

export type SampleRequestKind = 'Urlaub' | 'Zeitkorrektur' | 'Tausch';

export interface SampleRequest {
  readonly id: string;
  readonly person: string;
  readonly team: string;
  readonly kind: SampleRequestKind;
  readonly period: string;
  readonly reason: string;
  /** Auswirkung auf die Besetzung, ein Satz. */
  readonly impact: string;
}

/** Offene Anträge (Beispiel für das Seitenblatt: ein Objekt im Zusammenhang einer Liste). */
export const SAMPLE_REQUESTS: readonly SampleRequest[] = [
  {
    id: 'r01',
    person: 'Mia Wagner',
    team: 'Team West',
    kind: 'Urlaub',
    period: 'Mo 23.11. – Fr 27.11.',
    reason: 'Familienbesuch',
    impact: 'Team West ist in der Woche zu 94 % besetzt.',
  },
  {
    id: 'r02',
    person: 'Jonas Becker',
    team: 'Team Süd',
    kind: 'Zeitkorrektur',
    period: 'Di 17.11.',
    reason: 'Gehen nicht gestempelt, Ende 20:30',
    impact: 'Keine Auswirkung auf die Besetzung.',
  },
  {
    id: 'r03',
    person: 'Hanna Weber',
    team: 'Team Nord',
    kind: 'Tausch',
    period: 'Do 19.11., Früh gegen Spät',
    reason: 'Arzttermin am Vormittag',
    impact: 'Früh bleibt besetzt, Spät gewinnt eine Person.',
  },
];
