# TV Calendar

A month calendar of upcoming episode air dates and film release dates for the shows and films on your TMDB watchlist. It is a static page, with no build step and no backend.

## Use it

1. Get a TMDB **API Read Access Token** (the long token that starts with `eyJ`) at <https://www.themoviedb.org/settings/api>.
2. Open the site, open **Settings**, paste the token, and set your region (for example `GB`). Film release dates are shown for that country.
3. Select **Log in with TMDB** and approve the request on themoviedb.org. TMDB then sends you back to the site.

When you are logged in, the watchlist is your TMDB account watchlist, so all your devices show the same list. When you are logged out, the watchlist is saved in this browser only. When you log in, titles that were saved only in this browser are added to your account.

The token and the login session are saved in your browser's `localStorage` only. They are never in this repository. Enter the token once on each device.

## Run it locally

Login does not work when you open `index.html` directly as a `file://` page, because TMDB cannot redirect back to it. Serve the folder instead:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**, then select the `main` branch and the `/ (root)` folder.
4. The site will be at `https://<user>.github.io/<repo>/`.

## Test

```sh
node test.js
```

This checks how TMDB responses become calendar events and how the `.ics` file is made.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB. Calendar by [FullCalendar](https://fullcalendar.io/) (MIT licence).
