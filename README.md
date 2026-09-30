# OFF/THREAD — CS 4501 Anti-UX fashion store

A functioning, intentionally frustrating fashion-shopping simulation. All interface text, code comments, and submission documentation are in English. No account, real payment, server database, or runtime library is required.

**Revision 2 task:** complete a simulated order totaling **$88–$100 inclusive**. Any amount in that interval succeeds; maximizing expenditure is no longer required. Item count is not scored. Duplicate purchases are allowed, available variants have no quantity cap, and shipping/tax are zero.

**Delivery status:** revision 2 is provided in this package; see [verification status](docs/verification.md) for the exact checks executed. **Not published to GitHub Pages**. Real human usability results are **UNMEASURED**. Course coverage is user-confirmed; exact slide references and instructor review of conceptual distinctness remain pending.

## Run locally

Open a terminal in this folder and run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the local store](http://127.0.0.1:8000/) and [submission documentation](http://127.0.0.1:8000/docs/). Stop the server with Ctrl+C when finished. Use an HTTP server instead of double-clicking index.html, because browsers restrict JavaScript modules under file://. Python is only a local development server; the deployed website is entirely static.

## Deploy to GitHub Pages

1. Create or choose a repository you control. With GitHub Free, use a public repository.
2. Put the **contents of this folder** at the repository root: `index.html` must be at the root, alongside `styles.css`, `js/`, `assets/`, `docs/`, and `.nojekyll`. Do not add an extra wrapper directory unless you intend another URL segment.
3. Commit and push these files to `main` using GitHub Desktop, Git, or the GitHub upload interface. No package install or build is necessary. Include `.nojekyll` when using tools that hide dotfiles.
4. In the repository, open **Settings → Pages → Build and deployment**. Set **Source: Deploy from a branch**, then choose **main** and **/(root)** and save.
5. Wait for GitHub's Pages deployment to finish. Open the exact URL shown in Settings → Pages, normally `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
6. On that published URL, verify product photos, a detail page, refresh on `#/cart`, and the completed-order flow. Do not report public deployment verified until this check is performed.

The implementation uses relative asset/module paths and hash navigation (`#/shop`, `#/product/tee`, `#/cart`, `#/complete`). No domain-root `/assets` paths or server route rewrites are required. Local verification used `/anti-ux-fashion/` as a repository-like prefix. This establishes subpath compatibility, not actual GitHub deployment.

Official references: [Configure the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). Checked September 29, 2026.

## Submission materials

- [Readable submission report and screenshots](docs/index.html)
- [Requirements and success conditions](docs/requirements.md)
- [Ten-device course concept mapping](docs/concept-mapping.md)
- [Complete solution cheatsheet](docs/cheatsheet.md)
- [Baseline estimate and human testing protocol](docs/testing-protocol.md)
- [Interactive human-test recorder](docs/study-recorder.html) — computes means and the ratio, exports/imports JSON
- [Technical verification and remaining work](docs/verification.md)
- [Sources and asset provenance](docs/sources.md)

The cheatsheet and report reveal solutions; do not give them to independent study participants before testing. The store itself does not link to these evaluator materials.

## Files and customization

| File | Purpose |
|---|---|
| `index.html` | App shell, local scripts/styles, no-network payment policy |
| `styles.css` | Layout and intentional visual behaviors |
| `js/products.js` | 33 catalog cards: 22 shoppable products and 11 advertisement-only entries, with prices, availability, metadata, and fixed display order |
| `js/config.js` | Approved $88–$100 rules, dummy values, motion, and timer settings |
| `js/filters.js` | 111 exact filter labels, matching metadata, and fixed shuffled order |
| `js/core.js` | Stock checks, cart normalization, exact totals, inclusive spending-range validation, search/filter predicates, payment validation |
| `js/app.js` | Three screens, completion, dialogs, manual payment entry, session cart, and attempt lifecycle |
| `js/timer.js` | Restore, update, freeze, and format the session attempt stopwatch |
| `assets/*.webp` | 33 local generated clothing photos; no external image dependencies |
| `tests/*.test.mjs` | Executable catalog, checkout, filter, and stopwatch tests |

Prices, tags, and variant availability can be edited in `products.js`. The success range is $88–$100 inclusive and does not depend on a catalog optimum. Update the task documentation, cheatsheet, and screenshots after data changes. There are 111 exact filter labels in a fixed shuffled order: choices OR within an attribute and AND across attributes. The earlier expansion added 5 pants, 10 short-sleeve tees, 3 long-sleeve tees, and 5 shirts (3 long-sleeve and 2 short-sleeve), bringing the original 10 entries to 33. In the latest follow-up, 11 of those entries become advertisement-only cards, leaving **22 shoppable products and 11 ads, exactly 33 cards total**. All 33 local images are retained. The ads occupy the top of the catalog across its columns; the former two extra duplicate ad cards are removed. Ads retain their search/filter metadata, so matching results can include ads, but ads cannot be purchased or retained in the cart. Their fixed close controls work immediately. Never add arbitrary delays or random stock failures.

## Test and reset

Optional logic tests require Node.js 20 or newer:

```sh
node --test tests/*.test.mjs
```

No npm install is needed. The delivery also includes observed browser checks and screenshots in `docs/verification.md`.

For an entirely new attempt, use **Start a new attempt** after a successful order, or start a fresh independent browser session. Merely emptying the cart does not restart the stopwatch. The attempt begins automatically on the first opening, continues during navigation, refresh, background time, and errors, freezes on successful completion, and resets for a new attempt. The centered header and completion screen show elapsed minutes and seconds. The timer uses `offthread.timer.v2`, the receipt uses `offthread.receipt.v2`, and the cart uses `offthread.cart.v1`. Leaving a completed receipt for any shopping route also starts a fresh timed attempt; reloading the completed receipt keeps its frozen result. For study resets, follow the app-specific key instructions in the testing protocol; do not clear unrelated site data.

Cart state survives routes and reloads in the same tab. Browsers may restore sessionStorage during session restoration, so closing a tab is not a guaranteed secure-erasure mechanism. Payment data is never placed in sessionStorage, localStorage, cookies, URLs, logs, or network requests. The only accepted values are `968`, `4871928904556523`, and `12/30`, in that top-to-bottom order. The Payment help guide has no copy action; its displayed values cannot be selected/copied through the guide, and paste/drop into payment fields are blocked. Type the values manually. No real payment can occur.

## Assessment limits

Ten implemented devices are documented, with the proposed concepts confirmed by the user as course material. Exact lecture citations were not supplied, and Office Hours review is planned. The former **240-second provisional estimate** is retained for traceability only, with a nominal fivefold threshold of **1,200 seconds**. It needs revalidation for revision 2: 33 catalog cards (22 shoppable products and 11 ads concentrated at the top), a range-based task, manual payment transcription, and automatic timing change the comparison. No unfamiliar-human completion times or fivefold result have been measured. The normal UI baseline is an estimate, not a second implemented comparison website.
