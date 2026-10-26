# Hōlus Nutrition Counselling

Static website for Hōlus Nutrition Counselling, an evidence-informed and person-centred nutrition counselling practice.

## Website

The production site is served from the repository root through GitHub Pages.

## Local preview

Serve this directory with any static web server and open `index.html`.

## Structure

- `index.html` - Hōlus Nutrition Counselling presentation layer and homepage entry point
- `home.html` - source homepage used by the presentation layer
- `brand-config.js` - central working brand name, descriptor, tagline and favicon configuration
- `HOLUS-BRAND-GUIDELINES.md` - canonical written brand rules and implementation guidance
- `brand-guide.html` - interactive visual companion for the approved brand system
- `nutritional-counselling/` - services, appointments, pricing and FAQ
- `nutrition-behaviour-change/` - physiology and behaviour approach
- `digest/` - curated nutrition and behaviour-change resources
- `about/` - professional background and approach
- `assets/` - website imagery and visual assets
- `styles.css` and `script.js` - shared responsive styling and interactions

## Contact form

The guided contact page lives at `contact/index.html`. It is intentionally for
general service and booking enquiries only; clinical information belongs in
Jane.

To connect delivery:

1. Create a Formspree form that sends to `hello@holus.ca`.
2. Copy the public form ID from `https://formspree.io/f/FORM_ID`.
3. Add only that ID to `CONTACT.formspreeId` in `brand-config.js`.
4. Test with fictional information, then restrict the Formspree project to
   `holus.ca` and test once more on the live site.

Never add a Formspree password or private API key to the repository. Until a
valid form ID is configured, the page safely shows a direct-email fallback.
Use `/contact/?preview=form` on localhost to review the complete form without
sending anything.

## Website search

The dependency-free website search uses the explicitly public records in
`search-index.js`. Search runs in the visitor's browser and does not include
the private Practice Hub or internal design pages.

When a public page, service, FAQ or Digest topic changes, update the matching
record in `search-index.js` and run:

```text
node --test tests/search.test.cjs
```
