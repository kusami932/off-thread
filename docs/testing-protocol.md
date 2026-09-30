# Baseline estimate and human usability study — revision 2

## Current evidence status

**Human test results: UNMEASURED.** No participant completion times, mean, success rate, or fivefold result are claimed. Technical browser tests establish functionality, not the duration of real users' reasoning. A developer who knows the solution is not a substitute for an unfamiliar participant.

The earlier **240-second provisional estimate** is retained unchanged for traceability, not validated as the revised baseline. Its nominal fivefold threshold is **1,200 seconds (20 minutes)**. Revision 2 changes the original ten-product catalog to 33 cards, now comprising 22 shoppable products and 11 ads placed at the top, the objective to $88–$100 inclusive, payment transcription requirements, and the timing boundary. **Revalidate or measure the normal baseline before making a final fivefold claim.** Do not reduce the estimate after viewing Anti-UX results merely to improve the ratio. No forced delay is used.

## 1. Comparable normal-interface baseline

A comparable revision-2 normal interface must use the same **22 shoppable products and 11 advertisement entries**, prices, stock, repeat-purchase rules, no tax/shipping, dummy values, and **$88–$100 inclusive** target. It should clearly label ads and distinguish them from purchasable items, show product names/prices on cards, group the 111 filter options, indicate stock before Add, make the cart visible, show totals, label fields conventionally, and avoid redundant confirmations. The new Anti-UX card number is less patterned and must be typed manually; explicitly include transcription time in the revised estimate. If the normal interface permits copying, identify that difference as a design factor rather than a different task.

The table below preserves the **original revision-1 estimate**. Its ten-product scan, optimization stage, and recognition endpoint no longer match revision 2. Retaining the values documents the previous rationale; it does not validate their use as a final denominator.

| Stage | Estimated seconds | Rationale |
|---|---:|---|
| Read task and purchase rules | 25 | Understand that spending, not item count, is optimized; repeated purchases are allowed |
| Scan ten products and available variants | 35 | Read prices and compare likely candidates in one catalog view |
| Form a feasible maximum-spend combination | 60 | Reason about repeated prices and the budget; allow time for arithmetic and alternate combinations |
| Open products, select available options, and add quantities | 40 | Choose at least two products and their variants; perform ordinary quantity selection |
| Review and adjust the cart | 30 | Read displayed total, check option choices, and correct a quantity or item if needed |
| Enter dummy payment data and finish | 35 | Read labeled fields, enter test values, review, and submit |
| Recognize completion | 15 | Read completion status and confirm the task is finished |
| **Total** | **240** | **Provisional estimate, not an observation** |

For revision 2, estimate scanning/comparison across 33 cards (22 shoppable products and 11 ads), finding any basket inside the accepted range, and manual payment transcription, using the new start/finish boundaries below. A range task can be easier than maximization, while the larger catalog and manual entry can add work; the net change must not be guessed to favor a fivefold claim. Pilot the normal interface or obtain an instructor-reviewed estimate. If using 240 seconds in exploratory calculations before revalidation, label the ratio **provisional and unvalidated for revision 2**. A developer's quickest Anti-UX run is not a normal baseline.

Before the main study, have the instructor or an independent pilot evaluate whether the stage estimates are reasonable. Record any revision and rationale before reviewing the main Anti-UX results. A measured normal baseline should use participants with similar familiarity and should avoid teaching them the exact solution before their Anti-UX trial.

## 2. Participant instructions

Read exactly this task to each participant:

> Complete a simulated order totaling between $88 and $100, including both boundaries. Any total in that range succeeds; you do not need to maximize spending or item count. You may buy more than one of the same product. Available variants have no quantity cap, and shipping and tax are zero. Use the site's dummy payment information and enter it manually; do not enter real payment or personal information. The on-screen timer starts automatically when the store opens. You may stop whenever you wish.

Do not reveal a successful combination or demonstrate the faint cart control first. The participant may independently use the site's Payment help. Keep their usual scratch-calculation method consistent across conditions and record whether paper, a calculator, or another aid was used. Do not restrict these aids only in the Anti-UX condition to inflate the ratio.

## 3. Setup

- Use a desktop with a mouse; record browser, viewport, zoom, and study date.
- Use the same catalog/version in every trial. Note any implementation change between trials, including this follow-up conversion to 22 shoppable products and 11 ads placed at the top. Do not pool results from the earlier 33-product catalog with this layout without identifying the difference.
- Prepare the instructions before opening the store. Start each participant with an empty cart, default filters/search, empty payment fields, and a fresh timer. In a controlled test reset only this app's sessionStorage keys: `offthread.cart.v1`, `offthread.receipt.v2`, and `offthread.timer.v2`, then reload when the participant is ready. Do not clear unrelated site data. The Start a new attempt control also resets the attempt; simply emptying the bag does not.
- Use a working local preview or the verified published URL; record which one. Do not mix network loading time into cognitive overhead without noting it.
- Recruit unfamiliar participants, such as friends, family, or peers outside the course. Record prior exposure to the site or cheatsheet.
- Prefer at least five independent unfamiliar participants as a practical pilot target; this is a proposed study size, not a claimed course minimum or guarantee of statistical precision.
- Use separate comparable groups for normal and Anti-UX trials where possible. If using the same people, counterbalance order and record it because the first trial teaches prices and solutions.

## 4. Timing and observation rules

**Start:** first app opening/boot for a new attempt. Read instructions before opening it for the participant. The stopwatch starts automatically; no Begin or Start control is needed. A comparable normal trial must use the same opening boundary.

**Primary finish:** valid order completion, when the site freezes the stopwatch. Record the displayed elapsed minutes/seconds and, if available, observer start/system-completion timestamps. Participant recognition time is an optional separate measure; do not silently include it in the automatic duration. The old estimate included 15 seconds for recognition, which is one reason it needs revalidation.

Navigation, refresh, errors, retries, and background-tab time continue the same attempt. The timer stores start/stop timestamps, not sensitive payment data. A successful receipt preserves the frozen elapsed time. Start a new attempt resets the timer; leaving a completed receipt for any shopping route also begins a new attempt, so all new browsing counts. Reloading the completed receipt preserves the frozen result. A stopwatch value from an automated check is not human usability evidence.

Do not pause for searching, reading help, computation, mistakes, or manual payment re-entry; these are interaction cost. The app timer does not pause in the background. If an external interruption occurs, record its length and show raw and adjusted time with an explanation; do not alter the app timer to hide it. Exclude accidental infrastructure outages from the human-friction analysis only under a documented, consistently applied rule, and report the exclusion.

Classify each outcome:

- **Independent success:** completes without observer hints or the separate cheatsheet. Opening the website's own Payment help is allowed; log it.
- **Assisted success:** completes after a hint or the separate cheatsheet. Retain its timing, but report separately from independent completion.
- **Abandoned:** participant stops before completion. Keep elapsed time and reason; do not replace it with a successful time.
- **Technical interruption:** a genuine implementation/environment fault prevents a valid trial. Document, fix, and rerun without hiding the failed trial.

Choose a stopping policy before testing. Participants may always stop voluntarily. If a session cap is used, record the predetermined cap; an unfinished trial at the cap is censored/abandoned, not a completion at that time.

## 5. Count definitions

Use these operational definitions consistently:

- **Rejected add:** each Add action blocked for missing options or known unavailable stock. Record the subtype.
- **Invalid-payment attempt:** each payment submission rejected for incorrect dummy values or format.
- **Reset error:** each third-dialog Yes that clears payment fields when the participant intended to finish. Count observer-confirmed mistakes separately from intentional edits.
- **Budget rejection:** each final processing attempt above $100.
- **Below-minimum rejection:** each final processing attempt with a total below $88. Values between $88 and $100 are not errors, even if less than $100.
- **Checkout retry:** each new Pay submission following a rejected, canceled, or reset checkout attempt. The initial Pay submission is not a retry.
- **Navigation recovery:** a return from an ad, empty result set, or wrong product; log separately from error counts because its intent may be ambiguous.
- **Assistance:** the first time the observer gives a procedural hint or shares the separate cheatsheet. Record timestamp and exact content.

Do not count every corrective click as a new error. Keep a timeline when uncertain and apply the same rule during analysis.

## 6. Participant log

Leave unobserved values blank or write `UNMEASURED`; never use zero to mean “not tested.” Use anonymous participant IDs.

| Participant | Date / build | Condition / order | Prior exposure | Start | System complete | System complete / stopped | Raw seconds | External interruption seconds | Adjusted seconds | Outcome | Observer help / cheatsheet | Site Payment help | Calculation aid | Rejected adds | Invalid payment | Reset errors | Budget rejects | Below-minimum rejects | Checkout retries | Notes |
|---|---|---|---|---|---|---|---:|---:|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
| P01 | | Anti-UX | | | | | | | | UNMEASURED | | | | | | | | | | |
| P02 | | Anti-UX | | | | | | | | UNMEASURED | | | | | | | | | | |
| P03 | | Anti-UX | | | | | | | | UNMEASURED | | | | | | | | | | |
| P04 | | Anti-UX | | | | | | | | UNMEASURED | | | | | | | | | | |
| P05 | | Anti-UX | | | | | | | | UNMEASURED | | | | | | | | | | |

Optional event log:

| Participant | Elapsed seconds | Screen / action | Observed issue | Category | Recovery | Hint given |
|---|---:|---|---|---|---|---|
| | | | | | | |

## 7. Calculations and transparent reporting

For the primary report, use the arithmetic mean of **independent successful Anti-UX trials**:

`mean = sum(independent successful completion seconds) / number of independent successes`

`ratio = Anti-UX independent-success mean / normal baseline seconds`

Before revision-2 baseline revalidation, a denominator of 240 seconds yields only a **provisional, unvalidated comparison**, not a confirmed fivefold result. After revalidation, record the approved estimate, rationale, date, and matched start/stop boundary. If using a measured normal baseline, report that group's size, mean, task equivalence, and conditions. Do not mix the two denominators silently.

Report at least:

| Metric | Current value |
|---|---|
| Previous normal-interface estimate, pending revision-2 revalidation | 240 seconds |
| Nominal fivefold threshold before revalidation | 1,200 seconds |
| Participants attempted / independently completed | UNMEASURED |
| Independent completion mean / median / range | UNMEASURED |
| Assisted completion count / mean | UNMEASURED |
| Abandoned or capped trials and elapsed times | UNMEASURED |
| Success proportion (independent successes / attempts) | UNMEASURED |
| Mean Anti-UX time ÷ stated normal baseline | UNMEASURED |
| Fivefold target empirically met? | NOT YET DETERMINED |

Do not impute completion times for abandoned trials or omit them from the report. A large successful-completer mean with many failures is not evidence that the task is reliably achievable. Include a sensitivity summary with assisted successes if useful, while retaining separate labels. If no independent participants finish, the independent completion mean and ratio are undefined, not zero or infinity.

## 8. If the measured ratio is below five

First inspect the observation logs and obtain instructor feedback. A lower ratio is a result to report, not conceal. Within the approved course concepts, possible adjustments include revising the density of mixed filters or the legibility/location of the already requested peripheral success message. Propose any meaningful behavior change to the user first, verify that every step remains possible, and run new trials with unfamiliar participants. Do not add waiting timers, random stock changes, forced failures, or unclickable controls. Do not silently shrink the normal baseline or pool trials from different versions.

## Interactive recording form

Open [study-recorder.html](study-recorder.html) for timestamps or observed app-stopwatch seconds, interruption calculations, separate assisted/abandoned reporting, and the mean-to-baseline ratio. Mark the baseline revalidated only after it has been reviewed or measured for revision 2. Revision-1 imports are labeled legacy and excluded from revision-2 aggregates. Export JSON before closing; records are not automatically persisted or transmitted. The delivered form starts with no participant data. A measured normal-group mean is shown separately; explicitly set the baseline denominator and basis if using that measurement.
