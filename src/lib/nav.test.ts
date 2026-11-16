import { describe, expect, it } from 'vitest';
import { activeNavTarget, navLeaves } from './nav';

const GROUPS = [
  {
    items: [
      { to: '/' },
      {
        sections: [
          { items: [{ to: '/bedarfsplanung' }, { to: '/bedarfsplanung/forecast' }] },
          { items: [{ to: '/dienstplan', activeFor: ['/planungsablauf'] }] },
        ],
      },
    ],
  },
  { items: [{ to: '/einstellungen' }, { to: '/einstellungen/nutzer' }] },
];

describe('activeNavTarget', () => {
  it('genau passend vor längstem Präfix; `/` nur genau', () => {
    expect(activeNavTarget(GROUPS, '/')).toBe('/');
    expect(activeNavTarget(GROUPS, '/bedarfsplanung/forecast')).toBe('/bedarfsplanung/forecast');
    expect(activeNavTarget(GROUPS, '/bedarfsplanung/forecast/')).toBe('/bedarfsplanung/forecast');
    expect(activeNavTarget(GROUPS, '/bedarfsplanung/historie')).toBe('/bedarfsplanung');
    expect(activeNavTarget(GROUPS, '/einstellungen/nutzer')).toBe('/einstellungen/nutzer');
    expect(activeNavTarget(GROUPS, '/gibt-es-nicht')).toBeNull();
  });

  it('weitere Pfade über activeFor', () => {
    expect(activeNavTarget(GROUPS, '/planungsablauf')).toBe('/dienstplan');
  });
});

describe('navLeaves', () => {
  it('alle Links, auch in Bereichen, in Reihenfolge', () => {
    expect(navLeaves(GROUPS.flatMap((g) => g.items)).map((i) => i.to)).toEqual([
      '/',
      '/bedarfsplanung',
      '/bedarfsplanung/forecast',
      '/dienstplan',
      '/einstellungen',
      '/einstellungen/nutzer',
    ]);
  });
});
