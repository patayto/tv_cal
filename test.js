// Run: node test.js
const assert = require('assert');
const { seasonsToFetch, tvEvents, movieEvents, toIcs } = require('./lib.js');

const show = {
  next_episode_to_air: { season_number: 2 },
  seasons: [{ season_number: 0 }, { season_number: 1 }, { season_number: 2 }, { season_number: 3 }],
};
assert.deepStrictEqual(seasonsToFetch(show), [2, 3]);
assert.deepStrictEqual(seasonsToFetch({ last_episode_to_air: { season_number: 1 }, seasons: show.seasons }), [1, 2, 3]);
assert.deepStrictEqual(seasonsToFetch({ seasons: show.seasons }), []);

const tv = tvEvents({ id: 95396, title: 'Severance' }, [{ episodes: [
  { season_number: 2, episode_number: 1, air_date: '2025-01-17' },
  { season_number: 2, episode_number: 2, air_date: null },
] }]);
assert.strictEqual(tv.length, 1);
assert.strictEqual(tv[0].label, 'S02E01');
assert.strictEqual(tv[0].date, '2025-01-17');

const movie = {
  release_date: '2026-12-18',
  release_dates: { results: [
    { iso_3166_1: 'US', release_dates: [{ type: 3, release_date: '2026-12-18T00:00:00.000Z' }] },
    { iso_3166_1: 'GB', release_dates: [
      { type: 1, note: 'London Film Festival', release_date: '2026-10-10T00:00:00.000Z' },
      { type: 3, release_date: '2026-12-26T00:00:00.000Z' },
    ] },
  ] },
};
const gb = movieEvents({ id: 1, title: 'Film' }, movie, 'GB');
assert.deepStrictEqual(gb.map(e => [e.date, e.label]), [['2026-10-10', 'Premiere (London Film Festival)'], ['2026-12-26', 'Cinema']]);
assert.strictEqual(movieEvents({ id: 1, title: 'Film' }, movie, 'FR')[0].label, 'Release (no FR date)');
assert.deepStrictEqual(movieEvents({ id: 1, title: 'Film' }, { release_dates: { results: [] } }, 'GB'), []);

const ics = toIcs([{ id: 'x', title: 'A, B; C', label: 'S01E01', date: '2026-11-03', url: 'https://example.org' }]);
assert.ok(ics.includes('DTSTART;VALUE=DATE:20261103\r\n'));
assert.ok(ics.includes('SUMMARY:A\\, B\\; C - S01E01\r\n'));
assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));

console.log('ok');
