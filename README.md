# Xtreme Flight

Mobile front-end prototype for [Xtreme Flight](https://xtreme-flight.com/): real aerobatic flights in the XA-42 at Wings Field, near Memphis.

The app is a phone-sized dark interface (about 390×844, fluid from 360px to 430px). On a wide desktop it sits in a centered device frame. On a phone it is full screen.

## Setup

```sh
npm install
npm run dev
```

Open the URL Vite prints. The app is served at `/`.

## Deploy on Vercel

Import the repo in Vercel and leave the framework preset on **Other**. The build command is `npm run build`. Do not set an output directory: Nitro writes Vercel’s Build Output API to `.vercel/output`, and Vercel picks that up automatically.

Use Node.js 24. The install uses npm because `package-lock.json` is the lockfile.

Demo account with bookings, media, and a gift certificate:

- Email: `alex@xtreme-flight.com`
- Password: `flyhigh`

You can also create an account, continue as a guest, or walk the forgot-password flow. The preview OTP is shown on the verification screen. Nothing is charged; card fields are a mock.

## Folder map

| Path | Role |
| --- | --- |
| `src/routes/` | File routes. Each screen has a URL. |
| `src/screens/` | One screen component per flow. |
| `src/components/` | Navigation, cards, sheets, calendar, player, gallery, forms. |
| `src/data/` | Packages, FAQs, crew, reviews, and seed bookings. |
| `src/services/` | Mock API (`api.ts`) with a short delay and offline failure. Swap the bodies for `fetch` later. |
| `src/store/app-store.tsx` | Account, bookings, gifts, media, notifications. Saved on this device. |
| `src/theme/tokens.ts` | Lime `#a3e635` and ink `#111827` tokens. |
| `src/img/logo.png` | Logo used on splash, welcome, profile, and certificates. |
| `src/img/` | Photos downloaded from the Xtreme Flight website. |
| `src/img/generated/` | Generated onboarding, empty-state, and weather images. |
| `public/media/` | Hero and kids flight videos from the website. |

## Screens

- Splash, onboarding, welcome, login, register, forgot password, notification prompt
- Home
- Flights: packages, experiences, compare, package detail, XA-42, kids, crew
- Eligibility, safety, what to wear / wellness / cameras
- Multi-step booking and confirmation
- Bookings list and detail, reschedule, cancel, receipts
- Flight-day guide and checklist
- Weather and flight status
- Media library, video player, photo viewer, share sheet
- Gift certificates: buy, mine, redeem
- Notification center and settings
- Support, FAQ, contact form, help articles
- Wings Field map and directions
- Reviews and write-a-review
- Group and event inquiry
- Profile, personal info, payments, saved passengers, language, privacy, about, terms

Guest browsing can open packages, the aircraft, FAQ, and the field. Booking, gifts, and media ask you to sign in.
