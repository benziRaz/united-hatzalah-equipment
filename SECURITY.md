# Security

This is a browser-only app: every `NEXT_PUBLIC_*` variable is visible to anyone who opens the site. Do not put real secrets in them.

- EmailJS public keys are designed to be public, but you should restrict **Allowed domains** for your EmailJS service to your own site, and set the recipient inside the EmailJS template rather than from the browser.
- If you find a vulnerability, please report it privately through GitHub Security Advisories on this repository instead of opening a public issue.
