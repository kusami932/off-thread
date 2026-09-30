# Technical verification — revision 2

Verified locally on September 30, 2026. This is implementation evidence, not participant-study evidence or confirmation of public deployment.

## Automated logic and data checks

All **21 tests** passed with Node's built-in test runner (`node --test tests/*.test.mjs`). Coverage includes:

- Inclusive checkout boundaries: $87.99 rejected, $88 accepted, $100 accepted, $100.01 rejected; distinct empty, below-minimum, and over-budget outcomes.
- Real in-stock $88 and $100 combinations, spending rather than item count, exact integer-cent arithmetic, normalization, deterministic stock, and removal.
- Attribute OR/AND matching, strict price-filter boundaries, search composition, unstocked-brand empty results, and the requested catalog counts/colors.
- Exact new payment values and rejection of previous or near-matching values.
- Automatic timer initialization, serialized-state restoration, background elapsed time, one-time stopping, reset, and minute/second formatting.

Additional data checks confirmed all 101 requested new filter labels exactly once, 111 total unique filter IDs, all 33 unique catalog entries, 33 local product assets, 33 prompt/provenance records, metadata search, and English source text.

## Advertisement-count follow-up

The latest user request converts 11 of the 33 existing entries into advertisements rather than adding duplicate cards. The original two inserted ads were removed. All 33 images remain, with exactly 22 purchasable products and 11 ad-only entries.

- Two additional automated tests verify the leading ad order, exact 22/11 counts, unique cards, filterable ad metadata, and rejection of ad variants during restored-cart normalization.
- At 1440×1000, the last ad started at document y=1539.29 and the first purchasable card started at y=1680.97. Every ad therefore began above every purchasable card. Shortest-column placement preserves the varied-height photo layout.
- Browser checks found 33 cards, 11 ad buttons, 22 product links, and zero broken catalog images.
- The first ad opened an internal advertisement dialog and closed immediately. BAPE filtering returned its one ad and zero product links; clearing restored the whole catalog.
- A direct former-product URL for a converted ad returned to the catalog with no purchase control.
- Two $44 indigo jeans still completed the task for $88 through the normal checkout. The automated tests also retain the valid $100 completion path.
- No browser console warnings or errors appeared. Relevant browse, ad, cart-icon, and animation screenshots were refreshed; unchanged checkout evidence below comes from the earlier revision-2 verification.

## Desktop browser verification

Executed in the connected Chromium browser at **1440 × 1000**, using the static site under `/anti-ux-fashion/` to exercise repository-subpath hosting. Screenshots in `screenshots/` were recaptured for revision 2.

| Check | Observed result |
|---|---|
| Expanded catalog, latest ad follow-up | Exactly 33 cards: 22 purchasable products and 11 converted ads; all images loaded |
| Filters | 111 options; Doc-Marten returned an empty result; clearing restored the catalog; Nike OR Puma AND Green returned the expected four products |
| Stationary targets | Card document bounds were unchanged while its image transform changed; 24px/6s image-only animation remains |
| Cart contrast | Default icon `rgb(210,210,207)` against `rgb(250,250,248)`; keyboard focus revealed `rgb(28,36,32)`; fixed 48×48 hitbox |
| Ads | Dialog opened and the fixed close control worked immediately |
| Unavailable stock | Green/M field jacket rejected after Add; an available product remained purchasable |
| Add feedback | Detail page remained visible and the small red bottom-right success strip appeared |
| Checkout copy | Requested “Fill in your card information…” wording displayed; removed footer sentence absent |
| Guide values | CVC 968, card 4871928904556523, expiry 12/30 displayed in the approved order |
| Guide copy restriction | Guide computed selection style was `none`; select-all/copy left a clipboard sentinel unchanged |
| Paste restriction | Pasting into each of the three fields left all values empty; normal sequential typing of the approved values passed |
| Below minimum | A single $18 tee failed with the new $88–$100 recovery message; entered payment values remained |
| Exactly $88 | Two $44 indigo jeans completed successfully through Yes / Yes / No |
| Over budget and retry | A $100 selection plus a $118 trench failed, retained cart, and cleared all payment values; removal and re-entry succeeded |
| Exactly $100 | Two $18 tees and two $32 denims completed successfully |
| Automatic timing | Started on opening with no Start button; continued through navigation and errors |
| Refresh | Cart quantities and timer survived; payment fields were blank; stopwatch changed from 03:20 to 03:21 rather than resetting |
| Completion | Congratulations and elapsed minutes/seconds appeared; completed time 03:52 stayed 03:52 after refresh |
| New attempt | Explicit new-attempt button reset the timer; returning via the logo after completion also started a fresh timed attempt before browsing |
| Console | No warnings or errors in the completed desktop test session |

The 03:52 and other times above are **automation verification observations**, not human participant results and not evidence for the rubric's fivefold requirement. Keyboard copy/paste blocking is a normal-interaction constraint, not protection against developer tools, screenshots, or other extraction. Drop/beforeinput blocking is implemented and source-reviewed; an external drag/drop action was not separately exercised.

The study-recorder revision received syntax and focused calculation/import checks, including separation of legacy version-1 trials. Human outcomes remain UNMEASURED. The provisional 240-second baseline must be revalidated for revision 2.

## Review and privacy

An independent source review found a second-attempt timing issue: starting the clock only at the first new Add omitted browsing time. It was corrected so leaving completion for shopping begins a new attempt immediately, and the behavior was verified in the browser. No other material source-review findings remained.

The app contains no payment request, analytics, remote image, third-party script, or external font. Its CSP blocks app connections and form submissions. Session storage contains cart, non-sensitive simulated receipt data, and timer timestamps. Payment inputs stay in memory and are cleared when leaving checkout or refreshing; they are not saved, logged, or transmitted.

All 23 added images were independently generated and visually inspected. The delivered images are local WebP encodings; prompts and hashes are recorded in `image-prompts.json`.

## Remaining evaluation work

- Publish to the chosen GitHub repository and verify the public Pages URL.
- Obtain the planned Office Hours feedback. Exact lecture references can be recorded when available; course coverage is user-confirmed.
- Revalidate the normal-site baseline and collect unfamiliar-human trials. The stopwatch alone does not establish a fivefold average interaction cost.

Cross-browser compatibility and public hosting have not been claimed from these local tests.
