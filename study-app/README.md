# AWS Study App

A local web app for the AWS Certified Cloud Practitioner course. Each lesson has a short refresher, an optional simulation, and 2–3 scenario questions. A small game layer adds XP, module badges, a mistake log, spaced "weak spot" rounds, and one multi-step boss round per module.

Design: [`docs/superpowers/specs/2026-09-24-study-app-design.md`](../docs/superpowers/specs/2026-09-24-study-app-design.md)

## Run

Requires Node.js 22 or later.

```sh
cd study-app
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm test` | Unit tests (Vitest): answer checking, XP, weak spots, progress, storage, content validation, simulation math |
| `npm run check` | Validates all content; fails on a missing hint or explanation, a duplicate ID, an unknown concept tag, or a note link that does not resolve |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Runs the content check and typecheck, then builds static files to `dist/` |

## Cost

Running locally costs $0: no AWS resources, no backend. Progress stays in the browser's `localStorage`; use **Progress → Export JSON** to keep a copy. Hosting on Amazon S3 and CloudFront is a separate, later project with its own cost notes and teardown.

Prices in the EC2 pricing simulation are illustrative example values, not AWS quotes (course maximum discounts, checked 2026-09-24).

## Add a lesson

Content is data. To add a lesson:

1. Create `content/module-XX/lesson-YY.ts` exporting a `Lesson` (see `src/engine/types.ts`). Copy an existing lesson as a template.
   - `note`: path to the lesson note, relative to `study-app/` (for example `../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/05-....md`).
   - `keyIdea`: 3–5 short lines.
   - `questions`: 2–3 paraphrased scenario questions, each with `hint`, `explanation`, and `concepts`. Turn each `#misconception` from the note's Recall Check into a question. Set `beyondCourse: true` on anything not from the course.
   - `sim` (optional): a simulation ID from `src/sims/registry.tsx`.
2. Add it to `content/module-XX/index.ts`, and remove it from `locked` if it was listed there.
3. Add any new concept tag to `content/concepts.ts`.
4. Run `npm run check` and `npm test`.

A new module needs an `index.ts` with a boss round (`boss.ts`) and an entry in `content/index.ts`.

The repository is public: never paste course transcripts or page text into content files.

## Structure

```
content/          # typed lesson data, concept tags, boss rounds
scripts/          # check-content.ts (npm run check)
src/engine/       # pure logic: answers, XP, weak spots, progress, storage, validation
src/sims/         # simulation models (model.ts, unit-tested) and React components
src/shell/        # hash router, pages, question card, progress hook
```
