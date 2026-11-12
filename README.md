# Data Journey — 15-Week Data Engineering Learning Tracker

A personal learning web app for organising a 15-week data engineering self-study plan, with a target of **8–10 hours per week**.

The app connects SQL and Python practice to practical data processing tasks, using Airbnb listings as a recurring example. It supports thinking before checking an answer, recording practical evidence, and keeping unverified progress visible.

## Why I built this

I wanted a clear place to track what I am learning, what I have actually tried, and the next small action to take. A learning plan alone does not show whether I can apply a concept, so the app separates planned content from self-reported progress and practical evidence.

The interface uses simple Korean explanations alongside English technical terms to support my learning.

## Features

- A 15-week learning path covering data quality, SQL, Python, PostgreSQL, ETL/ELT, reliable loading, APIs, orchestration, monitoring, cloud foundations, Azure, and a final portfolio project.
- One integrated practical task per week that connects Python and SQL to data processing or validation.
- Three progress states: **Complete (완료)**, **In progress (진행 중)**, and **Unverified (미확인)**.
- One practice question visible at a time, with separate SQL and Python tabs.
- Reasoning and answer fields before hints or model answers can be opened. If no code comes to mind, an honest “I don’t know” attempt is accepted.
- Model answers and simple explanations for all **30 practice questions**.
- Previously understood exercises hidden from active practice, with an option to review or reopen them.
- Editable notes, practical results, study hours, next action, and next-week goals.
- A dashboard showing progress counts, recorded study hours, the selected week's core concept, and practical results.
- Automatic browser-local saving and JSON backup/restore.

## Progress rules

Progress does not advance because time has passed. Opening a hint or model answer does not mark a skill or week complete. A week can be marked complete only after practical evidence has been entered, and completion is still a **self-assessment**, not an independently verified result.

The initial baseline records Week 1 as in progress, based on earlier learning records. Weeks 2–15 begin as unverified. This baseline is not a claim that the course or its hands-on exercises have been completed.

## Getting started

No build step, package installation, or API key is required for the tracker itself.

1. Download or clone this repository.
2. Keep `index.html`, `app.js`, and `answers.js` together.
3. Open `index.html` in a modern browser.

For a more consistent local storage origin, serve the folder locally with Python:

```bash
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser. The tracker does not require Python when opened directly as a file; this command is an optional way to serve it.

## How to use

1. Select a week and read its core concept and practical task.
2. Choose SQL or Python practice.
3. Write your reasoning and attempt an answer.
4. Open a hint or model answer when needed, then compare it with your attempt.
5. Record your practical results and notes.
6. Set one next action and a next-week goal.
7. Update your progress state yourself and download a backup periodically.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and embedded responsive CSS |
| `app.js` | Curriculum, user interactions, progress rules, and browser storage |
| `answers.js` | Model answers and explanations for SQL and Python practice |
| `README.md` | Project purpose, setup, usage, and limitations |
| `.gitignore` | Excludes personal learning backups and common local files |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- JSON for backup and restore

SQL and Python are **learning content**, not execution engines inside this app. The app does not connect to PostgreSQL or run Python code. Some exercise examples require external tools or libraries such as pandas, requests, or psycopg, and actual dataset paths, schemas, and environment settings must be checked before running them.

## Storage and privacy

Learning records are stored in the current browser using `localStorage`. There is no server-side database or automatic cross-device synchronisation. Browser settings, private browsing, clearing site data, or changing the site origin may affect access to records. Direct `file://` storage behaviour can vary between browsers.

Use **Export backup (백업 받기)** and **Restore (복원하기)** to move records between browsers or devices. Restoring a backup replaces the current records after confirmation.

Personal answers and notes are not part of this repository. Do not upload learning backup files, credentials, or private datasets to a public repository.

## AI assistance and my role

This app was designed and implemented with assistance from ChatGPT and Sites. I defined the learning requirements, including the weekly workload, Korean explanations, evidence-based progress states, small practice questions, and the need for model answers and explanations. AI generated the initial interface and implementation from those requirements.

I use this project to practise defining requirements, reviewing the resulting behaviour, and improving a tool around my own learning needs. I do not present all generated code as independently written by me. The tracker is a learning-management project; completed Python and SQL pipeline exercises will provide separate evidence of my data engineering skills.

## Validation and current limitations

- JavaScript syntax was checked during implementation.
- All 15 weeks have SQL and Python model answers and explanations.
- Browser checks covered answer unlocking after an attempt, displaying model answers, and retaining entered answers and the opened answer after a refresh.
- There is no automatic code execution, grading, or personalised feedback.
- Example answers are possible solutions, not the only valid solutions.
- Cloud exercises may use an explicitly labelled local simulation when access is unavailable.
- Saving a result is not proof that the underlying exercise was executed correctly.

## Current scope

This repository contains the learning tracker source, including the model-answer update. It does not contain completed capstone work, personal learning records, or a live connection to the source data.
