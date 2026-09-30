# Sources and provenance

## Assignment and course material

- User-supplied CS 4501 Homework 1 screenshots dated September 29, 2026: assignment scope, submission guidance, rubric overview, and the five detailed rubric criteria. These establish the assessment requirements, not lecture-slide citations.
- User's pasted implementation brief and subsequent decisions: website behavior, modified ad/motion design, spending objective, filter/payment rules, desktop evaluation, session cart, and English-only requirement.
- User explicitly confirmed that the proposed Anti-UX concepts were covered in lecture and intends to obtain instructor feedback at Office Hours. No lecture filenames, weeks, or slide numbers were supplied. These have not been fabricated. Exact references can be added after that review.

No outside UX framework was substituted for the course concepts.

## Code and tools

The HTML, CSS, JavaScript, documentation, and logic tests were created for this assignment with OpenAI Codex assistance. No third-party code snippets, UI framework, web font, or JavaScript runtime package is shipped. Browser APIs and standard language features provide routing, dialogs, animation, and session storage.

Development verification used Node.js's built-in test runner and Codex's connected Chromium browser automation. A separate headless Chrome launch was unavailable in the local sandbox; functional browser checks were executed in the connected browser instead. This tooling is not required by the website and is not evidence of a human usability study.

## Images

All 33 garment images were generated using the built-in **OpenAI imagegen** tool on September 29–30, 2026 (10 original images and 23 revision-2 additions). They are fictional studio product photographs, not photos of actual branded items. All brand labels are simulated catalog/filter data; prices and availability are invented for the exercise. The project is not affiliated with those companies.

Each image was generated independently, then converted from the generated PNG to a local 900×1200 WebP for delivery. This used Pillow for mechanical resizing/encoding only. No externally hosted images, logos, trackers, or ad service are included.

Full final prompts, delivered asset filenames, generation method, and output hashes are in [image-prompts.json](image-prompts.json). Delivered photos are in `../assets/`.

The manifest lists every asset and its full subject prompt. Revision 2 adds two jeans, two chinos, one sweatpants, five graphic short-sleeve tees, five differently colored plain short-sleeve tees, three distinct long-sleeve tees, three long-sleeve shirts, and two short-sleeve shirts.

## Hosting references

The deployment instructions were checked against these official GitHub sources on September 29, 2026:

- [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

GitHub Pages has not been configured or verified for a real repository as part of this delivery.
