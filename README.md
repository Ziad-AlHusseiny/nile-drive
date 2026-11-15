# Nile Drive

A car rental website concept for a new business in Egypt. It is made for people who visit Egypt for 30, 60, or 90 days, including people who live in the Gulf.

The site uses plain HTML, CSS, and JavaScript. It does not need a build step.

## Run it on your computer

Open a terminal in this folder and run:

```sh
python3 -m http.server 4173 --directory dist
```

Then open [http://localhost:4173](http://localhost:4173).

## Files

- `dist/index.html`: page text and layout.
- `dist/styles.css`: colors, spacing, desktop layout, and phone layout.
- `dist/app.js`: sample cars, rates, filters, prices, and the trip request form.
- `dist/i18n.js`: Arabic and English page text and the language switch.
- `dist/assets/`: car photos, other images, and the site icon.
- `BUSINESS-NOTES.md`: business ideas and notes for the owner.
- `.openai/hosting.json`: Site settings, if a hosted Site has been set up.

## Languages

Arabic is the default language. The Arabic page reads from right to left. The header button switches to English, which reads from left to right. The site remembers the chosen language in `nile-language` browser storage. This setting contains no contact details. If storage is blocked, the switch still works for the current visit.

Static page text is in `dist/i18n.js`. Booking form and car text are in `dist/app.js`. Update both languages when changing the text.

## What works

- Use the full site in Arabic or English.

- Browse six sample cars.
- Filter cars by sedan or SUV.
- Choose a 30, 60, or 90-day stay.
- See a sample price in EGP, SAR, or AED.
- Set a pickup date and place.
- See the return date and full sample rental total.
- Add a name, phone number, and trip note.
- Check the request, then copy it or download a text file.
- Use the site on a phone or a desktop.

## Demo limits

This is a website concept. The cars, model years, rates, and plans are samples. Car photos may show a different year or trim from the owner's real cars.

The site does not check live car availability. It does not send requests to a company. It does not confirm bookings. There is no backend, payment service, or company WhatsApp link.

The sample plan includes 2,000 km per 30 days. The owner must set the real distance limit, price, deposit, cover, taxes, fees, and rental terms before launch. Airport and home pickup are options to request. They are not promises of free delivery.

A 30-day stay means exactly 30 days. It may not match one calendar month.

## Change the sample cars and prices

Open `dist/app.js` and find the `cars` list near the top.

Each car has a name, year, type, photo path, and `monthly` price in EGP. The price is for 30 days. Update the list to match the real fleet.

The `discountFor` function sets the sample discounts:

- 30 days: no discount.
- 60 days: 5% off the 30-day rate.
- 90 days: 10% off the 30-day rate.

The total uses the reduced 30-day rate multiplied by the number of 30-day periods.

The `rates` object sets fixed sample currency conversions:

- EGP: `1`.
- SAR: `0.075` per EGP.
- AED: `0.0735` per EGP.

These are not live exchange rates. They are only rough values for this demo. The final quote and payment are shown as EGP. Before launch, use a real rate source or remove the extra currencies.

## Personal data

The site does not send names, phone numbers, or trip notes to a server. It does not put them in browser storage that stays after the page closes.

The current request stays in browser memory while the page is open. A new request clears the old draft. Reloading or closing the page clears the draft.

The currency choice can stay in browser storage. It does not include contact details.

Copying a request puts it on the device clipboard. Downloading a request saves a text file on the device. The user chooses these actions.

## Before a real launch

- Add the real company name, logo, contact details, and WhatsApp number.
- Add the real cars, photos, prices, and pickup areas.
- Confirm rental terms, document rules, deposit, distance limits, cover, taxes, and extra fees.
- Connect the request flow to the company's WhatsApp or a real booking service.
- Make it clear when a request is sent and when a booking is confirmed.
- Add any needed privacy notice and consent for the real data flow.
- Test the full flow on phones and desktop browsers.

## QA checklist

- [x] JavaScript syntax: `node --check dist/app.js`.
- [x] Desktop layout and page links.
- [x] Phone layout and mobile menu.
- [x] Car filters and all-car view.
- [x] 30, 60, and 90-day price math.
- [x] Currency display and estimate note.
- [x] Date checks and return dates.
- [x] Request form and phone checks.
- [x] Request copy and download.
- [x] Keyboard use and dialog close behavior.
- [x] No real booking or sent-message claim.

Browser checks completed on 11 November 2026. Checked desktop, 768px tablet, and 390px, 375px, and 320px phone widths. No page-wide sideways scroll was found. Tested filters, all six cars, three stay lengths, currency notes, past-date checks, phone checks, copying, downloading, and closing the dialog with Escape.

Arabic update checked on 11 November 2026: Arabic first visit, English switch, saved language after reload, RTL desktop and 320/375px phone layouts, translated filters and price notes, Arabic dates and form errors, Arabic phone digits, and Arabic request copy/download. Switching language keeps the selected car type, currency, pickup details, and stay length.

## GitHub Pages

This repository publishes the `dist` folder with GitHub Actions. Push to `main` to publish changes. The separate Sites hosting setup stays in the original local project.
