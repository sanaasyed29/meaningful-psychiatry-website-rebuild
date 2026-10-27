# Meaningful Psychiatry website

The website for [meaningfulpsychiatry.com](https://meaningfulpsychiatry.com), rebuilt from the
original WordPress/Elementor site as a fast, simple static site using [Eleventy](https://www.11ty.dev/).

Every page address from the old site is kept the same, so Google rankings and existing links keep working.

## Where things live

| To change… | Edit this file |
| --- | --- |
| Phone, email, booking (Osmind) link, insurance list, menu, social links | `src/_data/site.json` |
| "Now Accepting" banner on the homepage | `acceptingBanner` in `src/_data/site.json` |
| Testimonials | `src/_data/testimonials.json` |
| FAQ questions and answers | `src/_data/faqs.json` |
| Specialty services grid (homepage) | `src/_data/specialties.json` |
| Special interests in psychotherapy (homepage slider + `/service/...` pages) | `src/_data/interests.json` |
| Blog posts and podcast episodes | `src/blog/` (one `.md` file per post) |
| Homepage | `src/index.njk` |
| Other pages (About, Services, Contact, FAQ, insurance pages…) | `src/pages/` |
| Header, footer, shared sections | `src/_includes/partials/` |
| Colors, fonts, layout | `src/assets/css/style.css` (brand colors are at the top) |
| Images | `src/images/` |

### Adding a blog post

Create a new file in `src/blog/`, for example `2026-11-01-my-new-post.md`:

```markdown
---
title: "My New Post"
date: 2026-11-01
permalink: /my-new-post/
image: "/images/2026/11/my-photo.webp"
categories: ["Psychotherapy"]
tags: ["post", "anxiety"]
excerpt: "A one- or two-sentence summary shown on the blog page."
description: "A short summary for Google search results."
---

The post text goes here. **Bold**, _italic_, [links](https://example.com) and

## Headings

all work.
```

Keep `"post"` as the first tag. Add the category `"Unequal Parts Podcast"` to make a post show on the Podcast page.

## Running it on a computer

```bash
npm install
npm start        # preview at http://localhost:8080 with live reload
npm run build    # produce the finished site in _site/
```

## Hosting

The site is hosted on Netlify at <https://existing-project-94e492.netlify.app>, linked to this
repository: every push to `main` rebuilds and publishes the site automatically.

The site is plain files, so any static host works. `netlify.toml` and `src/_redirects` are ready for
Netlify or Cloudflare Pages:

- Build command: `npm run build`
- Output folder: `_site`

`src/_redirects` sends old WordPress image addresses (`/wp-content/uploads/...`) to their new home.

## Forms and booking

There is no contact form: patients book and complete intake in Osmind (HIPAA-compliant),
so no health information passes through the website. The booking panel lives in
`src/_includes/partials/booking-card.njk`; links come from `bookingUrl`, `portalUrl` and
`phone` in `site.json`. When Dr. Qureshi has her own Osmind booking link, paste it into
`qureshiBookingUrl` in `site.json` and her "Call or text to schedule" buttons become
"Book with Dr. Qureshi" buttons automatically.

To offer a request form instead (a Google Form created in the practice's Google Workspace
account, which is covered by the practice's HIPAA BAA), paste its link into
`inquiryFormUrl`. Her buttons then read "Request an Appointment" and the booking panel
mentions the form. A booking link takes priority over the form when both are set.

The only form left is the newsletter sign-up (email address only), handled by Netlify
Forms under the form name `newsletter`.
