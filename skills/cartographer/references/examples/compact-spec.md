# Pocket Queue — Example Project Specification

Status: Accepted — fictional example, not a specification for the reader's project.

This example illustrates depth and labels; all user agreements below are fictional.

## Project name

Pocket Queue.

## Goals and intended users

**Requirement:** one person tracks their next few tasks on their own computer.
Success means finding unfinished work and marking it done without a spreadsheet.

### Current process and pain point

Tasks live in scattered text notes; completed items are hard to distinguish.

## Core workflows

Add a task, list unfinished tasks, mark one done, and export the list.

## Scope and non-goals

**Requirements:** a local command-line first release; data persists between runs.
No accounts, synchronization, background reminders, or public hosting.

## Central alternatives and tradeoffs

| Option | Fit | Added burden |
| --- | --- | --- |
| Local CLI — selected, D1 | One computer; no browser or network needed | Local installation and user-managed copies of data |
| Hosted web app | Useful for multiple devices, not needed now | Hosting, account/access design, service costs and operations |

## Consequential commitments

- D1, Agreed: local-only means no automatic cross-device access or hosted recovery.
- D2, Agreed: Python and SQLite; installing a Python runtime is a prerequisite.
- No recurring hosted-service cost or background operator service is planned.

## Acceptance criteria

**Requirements:** adding a nonempty task returns its stable ID; it appears after
restarting the tool. Marking that ID done removes it from the unfinished list.
Empty input and unknown IDs produce useful errors without modifying saved tasks.
Export contains every task's ID, title, and completion state. Repeating a done
operation preserves the completed state. A failed save is not reported as success.

## Design decisions and dependencies

- D1 — Agreed: local CLI for one user; no prerequisites. See Scope and alternatives.
  - D2 — Agreed: Python/SQLite for persistent local data; depends on D1. See Stack.

## Tech stack and rationale

**Requirement:** Python with its standard SQLite interface, avoiding a service.
**Changeable default:** standard-library argument parsing; supported runtime
version and packaging are feature-plan work, not a version promise here.

## Data sources, APIs, and data models

**Requirements:** manual task entry; Task has ID, nonempty title, and done state.
An on-disk SQLite database is the source of truth. Export uses versioned JSON.
SQL names, indexes, and migration mechanics belong in the first feature plan.

## Project folder structure

**Changeable default:** one application package and a test directory. Choose their
names and module split in the feature plan; no application files exist yet.

## Pages and screens

No graphical screens. **Changeable default** terminal listing:

```text
ID   Task
12   Prepare demo
13   Send draft
```

## Components and API contracts

**Requirements:** add/list/done/export commands operate on the same stored tasks.
Exact command syntax, function signatures, and error codes are feature-plan work.
No public network API.

## UI/UX design system

**Requirement:** readable text output without color-only status.
Fonts, browser styling, and graphical components are not applicable to this CLI.

## Authentication, authorization, and data privacy

**Requirement:** no network transmission of task data. The user's OS account is
the access boundary; no shared-machine confidentiality guarantee or app login.

## Environment variables

None required. Storage-path configuration is feature-plan work; never require
credentials or hosted-service keys for the agreed local-only scope.

## Deployment plan

Local installation only. Packaging and exact install instructions are feature-plan
work. The user owns local data copies; no automated backup subsystem is promised.

### Release gates

First release must demonstrate persistence and complete export. No hosted/public
release is planned; such a change would require scope and commitments review.

## Development phases

P0 = essential, P1 = next improvement, P2 = optional convenience, P3 = later ideas.
P0: persistent add/list/done plus export pass the acceptance scenarios. P1: improve
help and packaging. P2: filtering. P3: cross-device access, only after scope review.

### Feature plans

Suggested first plan: persistent task commands and export. No plan file exists yet.

## Constraints, risks, and known limitations

One person and one computer. Loss of the local database without a copy loses data.
The first feature plan must select a predictable storage path and test save failures.

## Open questions and assumptions

No unresolved product choice blocks the fictional accepted scope. Syntax, storage
path, packaging, and internal structure are explicitly deferred implementation
details; they must preserve the requirements above. This example specifies no
budget, delivery date, or measured runtime behavior.
