# Neo Gao — Research & Reverie

Qiang Gao (Neo), AI Researcher at ByteDance since September 2026.

## A small static site

Only four editable website files. No framework, package manager, build step, backend, or API key.

- `index.html` — profile, publications, journey, art playground, hobbies, and company-grouped work.
- `style.css` — layout, palette, responsive styles, and motion preferences.
- `script.js` — particle animation, local generative drawing, and recent activity rendering.
- `activity.json` — short updates, sorted automatically by date (latest eight shown).

`.nojekyll` serves the site directly on GitHub Pages. The old Jekyll template, Ruby/Node manifests, maps, and generated assets have been removed. Git history is preserved; the previous site backup is outside this repository.

## Post a recent activity

Add an object to `activity.json` (or edit that file directly on GitHub), then commit and push it:

```json
{
  "date": "2026-09-26",
  "text": "Write a short update here.",
  "url": "https://example.com/your-post",
  "linkLabel": "Read the note ↗"
}
```

Use an ISO date `YYYY-MM-DD`. `url` and `linkLabel` are optional. Separate objects with commas inside the outer array. Text is displayed safely as plain text. Dates are currently displayed at month precision; original milestone records use the first of their known month as a sorting key, not as an asserted exact start date. Publishing requires a repository commit/push; the site has no public editing form or database.

## Preview and publish

Run `python3 -m http.server 4174` in this directory and open http://localhost:4174.

GitHub Pages: choose **Deploy from a branch**, branch `master`, folder `/ (root)`. No build command is needed. Optional Google Fonts have system-font fallbacks.

## Content and interactions

Profile facts and publication links come from the supplied resume and previous personal website. The owner confirmed the ByteDance start month, researcher wording, hobbies (reading, hiking, tennis, cycling), and contact email: gaoqiang.nlp@gmail.com. Neo is the owner-approved English display name; Qiang Gao remains in the biography for publication attribution. Alibaba's final month is unspecified, so its dates remain June 2025–2026.

The playground is a working local procedural drawing tool with phrase input, a randomness slider, preset inspiration, and PNG download. It makes no AI calls and uploads nothing. The two AI-art concept notes are ideas, not claimed completed projects. Animations respect reduced-motion settings and pause offscreen.
