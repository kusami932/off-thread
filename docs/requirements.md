# Confirmed requirements and assessment criteria — revision 2

The assignment screenshots supply assessment criteria. The user's implementation request and subsequent decisions define website behavior. The later revision replaces the earlier maximum-spending task with an accepted range. Lecture slides themselves were not supplied. Interface and submission-document text is English.

## 1. Task and success conditions

**Complete a simulated order totaling $88–$100 inclusive.** Every amount in that range succeeds; there is no maximum-spending or item-count objective. Repeated purchases are allowed, available variants have no separate quantity cap, and tax/shipping are $0. There is no real payment, account registration, or delivery.

Order processing rejects totals below $88 and above $100. It accepts both boundaries. Prices and totals use integer cents, so the acceptance condition is `8800 <= totalCents <= 10000`.

An available $18 tee, $32 denim, and $38 washed denim give a valid **$88** order. The original two $18 tees plus two $32 denims still give a valid **$100** order. These totals appear only in evaluator documentation, never as a running total in the store. They demonstrate feasible completion at both accepted boundaries.

The catalog has **33 cards: 22 shoppable products and 11 advertisement-only entries**. The earlier expansion added 5 pants, 10 short-sleeve tees, 3 long-sleeve tees, and 5 shirts (3 long-sleeve, 2 short-sleeve) to the original 10 entries. This follow-up converts 11 existing entries into ads and removes the former two extra duplicate ads. All 33 local images remain. Purchasable variants have deterministic availability. See `js/products.js` for authoritative prices, variants, ad classification, and filter metadata. Changes require rechecking the documented completion paths.

## 2. Screens, state, and stopwatch

`Browse products → View details, select options, and add → Review cart and simulate payment`

- Users can repeatedly browse and add products. Cart entries show product, selected options, unit price, and quantity; Remove deletes the matching line.
- Evaluation uses a desktop with a mouse.
- The cart uses browser `sessionStorage`, retaining it across screen navigation and refresh in the same tab. Persistent cross-session storage is not required.
- Payment fields stay in memory only, clear on refresh, and are not transmitted or persistently stored.
- No shopping or completion screen shows cart total or remaining budget. The target range and unit prices are visible.
- The stopwatch starts automatically on the first opening of a new attempt. It continues through navigation, refresh, background time, errors, cancellation, and retries. It freezes when a valid order completes; beginning a new attempt resets it.
- Elapsed minutes and seconds appear in the center of the header and on completion. The stopwatch reports elapsed time; it does not impose a waiting period or establish human-study evidence by itself.

## 3. Browse behavior

- Search, a mixed filter area, and the photo grid appear in that order. Products are not grouped by clothing type.
- **111 filter labels** appear in a fixed shuffled order, preserving the requested spelling and capitalization. There are no visible attribute subgroups or separators.
- Options OR within the same attribute and AND across attributes. Attributes include price, brand, color, garment category, material, fit, audience, season, occasion, and color scheme. For example, two selected brands are alternatives, but a selected color must also match.
- `around 30` includes $25–$35. All `under` and `over` price boundaries are strict. Filter labels match assigned catalog data; unavailable brands or combinations legitimately produce zero results.
- Search covers name, brand, colors, clothing type, and tags. Search ANDs with selected filters. Ads keep their matching metadata, so search/filter results may include advertisement-only entries. Clear search & filters recovers from empty results.
- Real product cards show images only: no name, price, brand, stock text, hover tooltip, overlay, or enlargement.
- Click areas remain fixed. Images alone translate upward over 24px at 4px/second, repeating; every product remains immediately selectable.
- **11 of the 33 cards are ads**, placed before shoppable products and spread across the catalog columns so they appear as high as possible. Matching ads stay ahead of products in filtered results. They replace existing entries rather than adding duplicate cards.
- Mock ads resemble product cards and open internal dialogs. Their fixed close buttons work immediately; no external ad service or mandatory delay is used. Ads have no purchase flow and are excluded from cart normalization, including entries restored from an older cart.
- The fixed browse-screen cart icon is **faint light gray (`#d2d2cf`)**, not invisible. Hover or keyboard focus reveals a stronger icon.

## 4. Detail behavior

- Show image, product name, price, color, size, and Add.
- Require both options. Disclose an unavailable combination only after Add, leave the cart unchanged, and allow another choice.
- Stock is deterministic, not random or dependent on click count.
- Successful additions update the cart immediately without leaving details. A tiny, thin red success message appears at the bottom right.

## 5. Payment and recovery

Checkout introduces the fields with: **“Fill in your card information. For guidance, check below for help.”**

The three equal gray fields have no visible per-field labels, placeholders, or examples. Only these values are accepted, in this order:

| Position | Meaning | Test value |
|---|---|---|
| First | CVC | `968` |
| Second | Card number | `4871928904556523` |
| Third | Expiry | `12/30` |

There is no automatic grouping or space insertion. A separate Payment help guide supplies the order and values, with no copy control; guide text selection/copy is blocked. Paste and drop are blocked in payment fields, so values must be transcribed manually. Real card or personal information is not requested. Invalid input displays `Please check the test payment information. See Payment help.`

Processing: empty-cart check → exact input validation → three confirmations → upper-bound check → lower-bound check → success.

| Stage | Prompt | Yes | No |
|---|---|---|---|
| 1 | Are you sure you want to pay? | Stage 2 | Return; preserve fields and cart |
| 2 | You sure? | Stage 3 | Return; preserve fields and cart |
| 3 | Change Information? | Return and clear payment fields only | Run spending-range checks |

All confirmations share styling and button placement. Above $100, retain cart but clear payment fields; remove products and retry. Below $88, retain cart and payment fields while staying at checkout; adjust purchases and retry. A total within $88–$100 inclusive completes the simulated order and freezes the stopwatch. An empty cart cannot complete. No error or cancellation resets the attempt timer.

## 6. Rubric versus implementation decisions

| Assignment criterion | Implementation response | Additional evidence needed |
|---|---|---|
| Operable and accessible to the evaluator | Static HTML/CSS/JS, local assets, working routes and recovery | Current checks in verification report; actual GitHub Pages access check |
| Clear, achievable task | $88–$100 instructions and available boundary examples | Current browser completion checks |
| At least 10 distinct course concepts violated | Original A1–A5, B1–B2, C1–C3 devices retained | Instructor review of exact labels and overlap |
| Average time at least five times normal baseline | Baseline rationale, stopwatch, and human-study protocol | Revalidated baseline and actual participant data |
| Documentation and resources | Mapping, screenshots, cheatsheet, sources, recorder | Final evidence must match this revision |

Course coverage is user-confirmed; exact lecture filenames, weeks, and slides remain unsupplied. Ten devices do not automatically establish ten distinct concepts. The user plans Office Hours review. No external framework replaces the course sources.

## 7. Approved revisions and evidence status

Previously approved safeguards remain: immediate ad dismissal, fixed close controls, and moving images inside stationary hit areas. Revision 2 additionally changes the task, inventory, filter count, cart contrast, payment values/entry, checkout copy, and timing. The follow-up converts 11 existing entries to ads, places them at the top, and leaves 22 shoppable products. The previous footer phrase was removed. There are no random failures, forced waits, or moving button targets.

Implementation, technical verification, deployment, lecture-source validation, and human usability testing are separate statuses. Only checks actually executed may be reported as verified. **Human results remain UNMEASURED**, and a running stopwatch or automation does not change that status. A deployment-ready package is not a verified public deployment.
