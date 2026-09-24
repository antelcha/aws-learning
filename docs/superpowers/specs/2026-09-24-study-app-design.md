# Study App — Design

**Date:** 2026-09-24  
**Status:** Approved in conversation; awaiting spec review

## Purpose

A local web app that helps Mustafa understand each AWS Cloud Practitioner module through simulations, practice it with exam-style scenario questions, and enjoy doing so. It grows lesson by lesson alongside the course and later becomes a hosting project on Amazon S3 and CloudFront.

## Constraints

- Lives in this repository at `study-app/`.
- Vite + React + TypeScript; builds to static files with no backend.
- Progress stays in the browser.
- The repository is public: no course transcript or page text in the app. Content is paraphrased and within course scope; anything beyond the course is labeled.
- Prices used in simulations are labeled "example values" with the date they were checked. They are time-sensitive and not a quote.
- Running locally costs nothing. S3 and CloudFront hosting is a separate, later project with its own cost notes and teardown.

## Structure

```
study-app/
  src/
    shell/     # navigation by module, progress, XP, badges, mistake log
    engine/    # question engine: answer checking, hints, XP, weak-spot scheduling
    sims/      # one React component per simulation
  content/
    module-01/ # one typed data file per lesson
    module-02/
```

### Content model

Content is data, not code. Adding a lesson means adding a data file. Each lesson file contains:

- `id`, `module`, `title`, and a relative link to the matching note in this repository
- `keyIdea`: 3–5 lines of refresher text, plus an optional diagram
- `sim`: the simulation ID and its configuration, if the lesson has one
- `questions`: each with `id`, `type` (`single` or `multi`), `prompt`, `options`, `answer`, `hint`, `explanation`, and `concepts` (tags such as `pricing` or `shared-responsibility`)

Content is written during the lesson loop from the transcript, the lesson note, and its Recall Check. Items tagged `#misconception` in notes become questions.

### Progress

Stored in `localStorage` with export and import as JSON. If stored progress fails to parse, the app backs up the raw value, resets, and tells the user instead of crashing.

## Experience

Each lesson page has:

1. **Key idea:** short refresher, not a replacement for the notes.
2. **Simulation:** when the lesson suits one. Inputs change and results update live.
3. **Challenge:** 2–3 scenario questions. A wrong answer shows the hint first, then the explanation.

### Game layer

- **XP:** 10 for a correct first attempt, 5 when correct after the hint, 0 after the explanation is shown.
- **Module badge:** when every lesson challenge in the module is cleared.
- **Weak spots:** a missed question's concepts are asked again after 1, 3, and 7 days in a "Weak spots" round. A correct answer advances to the next interval, and passing the 7-day step clears it; a wrong answer restarts at 1 day.
- **Boss round:** one incident scenario per module that mixes lessons and is solved in steps, for example: "Monday traffic spike, the site is slow, and the bill is up 40%."

## First Version Scope

Modules 1 and 2, with these simulations:

| Lesson | Simulation |
| --- | --- |
| Global infrastructure | Choose Regions and AZs, trigger an outage, see what survives |
| Shared responsibility | Assign responsibilities to AWS or the customer for EC2 vs. S3 |
| Instance types | Workload → instance family matcher |
| EC2 pricing | Choose a usage pattern; compare yearly cost across pricing options |
| Scaling + ELB | Draw a traffic curve; watch instances and requests respond |
| Messaging and queuing | Producer → queue → consumer, with and without a queue |

Other Module 1 and 2 lessons get questions only. The scaling and queuing simulations are built after Mustafa watches those lessons, so they match the course. The first simulation built is EC2 pricing.

## Quality

- **Unit tests (Vitest):** answer checking, XP, weak-spot scheduling, and simulation math such as pricing calculations.
- **Content validation:** `npm run check` fails when a question lacks a hint or explanation, an ID repeats, a concept tag is unknown, or a note link does not resolve.
- **Build:** invalid content fails the build.
- No browser end-to-end tests in the first version.

## Workflow Integration

After this app exists, the lesson loop in `AGENTS.md` gains a step after writing the note: add or update the lesson's content file. The note and the content are committed together.

## Out of Scope

- Backend, accounts, or sync across devices
- Deployment to AWS (a later, separate project)
- Mock exams across all modules (added near the end of the course)
