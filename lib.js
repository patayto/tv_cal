// Pure helpers: TMDB responses -> common event shape {id, title, kind, date, label, url}, and .ics export.
// Loaded as a classic script by index.html (works from file://) and by test.js via require().

const RELEASE_TYPES = { 1: 'Premiere', 2: 'Limited release', 3: 'Cinema', 4: 'Digital', 5: 'Physical', 6: 'TV' };
const pad = n => String(n).padStart(2, '0');

// Season numbers to fetch: the season of the next episode (or the last one if nothing is announced) and every later season.
function seasonsToFetch(show) {
  const ep = show.next_episode_to_air || show.last_episode_to_air;
  if (!ep) return [];
  return (show.seasons || []).map(s => s.season_number).filter(n => n > 0 && n >= ep.season_number);
}

function tvEvents(item, seasons) {
  return seasons.flatMap(s => (s.episodes || []).filter(e => e.air_date).map(e => ({
    id: `tv-${item.id}-${e.season_number}-${e.episode_number}`,
    title: item.title,
    kind: 'tv',
    date: e.air_date,
    label: `S${pad(e.season_number)}E${pad(e.episode_number)}`,
    url: `https://www.themoviedb.org/tv/${item.id}/season/${e.season_number}/episode/${e.episode_number}`,
  })));
}

// movie = movie/{id}?append_to_response=release_dates
function movieEvents(item, movie, region) {
  const url = `https://www.themoviedb.org/movie/${item.id}`;
  const local = (movie.release_dates?.results || []).find(r => r.iso_3166_1 === region);
  if (!local) {
    return movie.release_date
      ? [{ id: `movie-${item.id}`, title: item.title, kind: 'movie', date: movie.release_date, label: `Release (no ${region} date)`, url }]
      : [];
  }
  return local.release_dates.map((d, i) => ({
    id: `movie-${item.id}-${i}`,
    title: item.title,
    kind: 'movie',
    date: d.release_date.slice(0, 10),
    label: (RELEASE_TYPES[d.type] || 'Release') + (d.note ? ` (${d.note})` : ''),
    url,
  }));
}

// ponytail: no 75-octet line folding; Apple/Google Calendar accept long lines. Fold if a strict client rejects the file.
function toIcs(events) {
  const esc = s => s.replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//tv_cal//EN'];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@tv_cal`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`,
      `SUMMARY:${esc(`${e.title} - ${e.label}`)}`,
      `URL:${e.url}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

if (typeof module === 'object') module.exports = { seasonsToFetch, tvEvents, movieEvents, toIcs };
