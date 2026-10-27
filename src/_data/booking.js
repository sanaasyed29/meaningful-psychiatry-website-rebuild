import fs from "node:fs";

// Decides where every booking button goes, from the links in site.json.
// Order for Dr. Qureshi: her own Osmind link, then the practice master link,
// then a request form, then call/text. `hint` is the name to pick on the
// shared master booking page.
const site = JSON.parse(fs.readFileSync(new URL("./site.json", import.meta.url)));
const master = site.masterBookingUrl;

const francis = master
  ? { kind: "book", url: master, label: "Book with Francis", hint: "Francis Agbotse" }
  : { kind: "book", url: site.bookingUrl, label: "Book with Francis", hint: "" };

let qureshi;
if (site.qureshiBookingUrl) {
  qureshi = { kind: "book", url: site.qureshiBookingUrl, label: "Book with Dr. Qureshi", hint: "" };
} else if (master) {
  qureshi = { kind: "book", url: master, label: "Book with Dr. Qureshi", hint: "Badeea Qureshi" };
} else if (site.inquiryFormUrl) {
  qureshi = { kind: "form", url: site.inquiryFormUrl, label: "Request an Appointment", hint: "" };
} else {
  qureshi = { kind: "phone", url: site.phoneLink, label: "Call or Text to Schedule", hint: "" };
}

export default { general: master || site.bookingUrl, francis, qureshi };
