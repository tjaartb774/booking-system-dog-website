# Beyond the Leash website

A fun, interactive site for Beyond the Leash, a force-free dog grooming and training business in Stilbaai, South Africa. Plain HTML, CSS and JavaScript. No build step, no backend.

## What is on the site

- `index.html` - home page: hero with floating paws and a paw-print cursor trail, flip cards for the Force-Free / Fun / Trust approach, services (quote on request), the Groom Finder quiz, natural products strip, pre-visit checklist, community links, booking wizard and contact details.
- `terms.html` - the full Booking Policy and Terms as an accordion.
- `js/data.js` - **the one file to edit** for contact details, social links, services, quiz rules and checklist items.
- `js/main.js`, `js/quiz.js`, `js/booking.js` - behaviour.
- `css/styles.css` - design (cream, charcoal and purple taken from the logo).
- `assets/logo.png`, `assets/favicon.svg`.

## How booking works

The booking wizard collects the dog's details, service, preferred date, behaviour and health flags, the owner's details and agreement to the terms. It then opens WhatsApp (`https://wa.me/27769610712`) with the whole request prefilled, so you receive a tidy message and reply to confirm. There is also a copy button and an email fallback. Nothing is stored on a server.

## Things to update before going live

1. **Facebook page URL** - `business.facebook` in `js/data.js` is a placeholder (`https://www.facebook.com/`).
2. **Services** - the list in `js/data.js` is typical grooming wording. Edit names, blurbs and what each includes to match what you offer. Set `training: true` on any item that should show the Training tag.
3. **Service area** - `business.serviceArea` currently says "Stilbaai, Riversdale and surrounds".
4. **Natural products strip** - the five badges on the home page mirror the ones on the Facebook cover. Delete the `#natural` section in `index.html` if you do not want it.

## Run locally

Any static server works, for example:

```
python3 -m http.server 8080
```

then open http://localhost:8080.

## Deploy

**GitHub Pages**: in the repository settings, under Pages, choose "Deploy from a branch", pick `main` and the `/ (root)` folder. The site will be served from the repository URL.

**Netlify or Vercel**: drag the folder in, or connect the repository. There is no build command and the publish directory is the repository root.
