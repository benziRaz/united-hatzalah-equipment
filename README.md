# United Hatzalah Equipment Request

[עברית ↓](#עברית)

A Hebrew, right-to-left web app that lets United Hatzalah volunteers request medical equipment without paperwork. A volunteer picks the items they need, the app enforces per-item limits and required details, generates a PDF of the request, and e-mails it to the equipment coordinator.

Built as a volunteer project to make life easier for people who save lives as volunteers.

## Features

- Equipment catalogue grouped by category (bandages, oxygen and breathing, and more), with a maximum quantity for each item
- Items can require a reason, a size, an image or an approval, and the form enforces it
- Shopping-cart style request with a generated PDF summary
- E-mail delivery to the coordinator through [EmailJS](https://www.emailjs.com/), with automatic retries on failure
- Drafts are saved in the browser, so a half-finished request is not lost
- Works on phones, supports dark mode, and shows an offline indicator
- Full Hebrew / RTL interface

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod, jsPDF + html2canvas, EmailJS.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your EmailJS values
npm run dev
```

Open http://localhost:3000. Without the EmailJS values the app still runs, but sending an e-mail shows a clear "not configured" message.

### E-mail configuration

Create a free [EmailJS](https://www.emailjs.com/) service and template, then set in `.env.local`:

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Your EmailJS service ID |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Your EmailJS template ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Your EmailJS public key |
| `NEXT_PUBLIC_COORDINATOR_EMAIL` | Optional. Better: set the recipient inside the EmailJS template |

Security notes are in [SECURITY.md](SECURITY.md): restrict the allowed domains in EmailJS, and never put real secrets in `NEXT_PUBLIC_*` variables.

## Project layout

| Path | What it does |
|---|---|
| `app/` | Pages (home, equipment selection, success) and layout |
| `components/` | Request form, equipment selector, cart, draft manager, UI components |
| `lib/equipment-data.ts` | The equipment catalogue: add or change items here |
| `lib/pdf-generator*.ts` | PDF generation for the request |
| `lib/email-service.ts` | E-mail sending with retry; reads its settings from environment variables |

## Adapting it to another organisation

Edit the catalogue in `lib/equipment-data.ts` and configure your own EmailJS service and template through the environment variables above. No code change is needed for the e-mail settings.

## Status

Early-stage volunteer project. Issues and suggestions are welcome. Released under the [MIT License](LICENSE).

---

<a name="עברית"></a>
<div dir="rtl">

## עברית

אפליקציית ווב בעברית (ימין לשמאל) שמאפשרת למתנדבי איחוד הצלה לבקש ציוד רפואי בלי ניירת. המתנדב בוחר את הפריטים, האפליקציה אוכפת מגבלות כמות ופרטים נדרשים לכל פריט, יוצרת קובץ PDF של הבקשה ושולחת אותו במייל לרכז הציוד.

נבנה כפרויקט התנדבותי, כדי להקל על אנשים שמצילים חיים בהתנדבות.

### יכולות

- קטלוג ציוד לפי קטגוריות (תחבושות, ציוד חמצן ונשימה ועוד), עם כמות מקסימלית לכל פריט
- פריטים שדורשים סיבה, מידה, תמונה או אישור, והטופס אוכף זאת
- בקשה בסגנון עגלת קניות, עם סיכום PDF
- שליחה לרכז במייל דרך EmailJS, עם ניסיונות חוזרים אוטומטיים
- שמירת טיוטות בדפדפן, כדי שבקשה שלא הושלמה לא תלך לאיבוד
- מתאים לנייד, תומך במצב כהה ומציג חיווי כשאין חיבור לאינטרנט

### הרצה מקומית

```bash
npm install
cp .env.example .env.local   # ממלאים את הגדרות EmailJS
npm run dev
```

פותחים את http://localhost:3000. בלי הגדרות EmailJS האפליקציה עולה, אבל שליחת מייל תציג הודעה שהשירות לא מוגדר.

### התאמה לארגון אחר

עורכים את הקטלוג ב-`lib/equipment-data.ts`, פותחים שירות ותבנית משלכם ב-EmailJS ומגדירים אותם במשתני הסביבה שב-`.env.example`. אין צורך לשנות קוד. מומלץ להגדיר את הנמען בתבנית ב-EmailJS ולהגביל שם את הדומיינים המורשים (ראו SECURITY.md).

</div>
