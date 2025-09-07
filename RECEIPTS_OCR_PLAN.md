# Receipts & OCR — Later Feature Plan

## Why
Speed up entry by extracting totals and merchant info from receipt images, especially for grocery runs and big dinners.

## Scope (Post‑MVP)
- Upload receipt images to Supabase Storage (`receipts/`).
- Run OCR via serverless function; attach results to a suggested expense.
- Let the user confirm or edit before saving the expense.

## Technical Plan
- Storage: Supabase Storage bucket `receipts/` with RLS via signed URLs.
- DB: `receipts` table with fields for `group_id`, optional `expense_id`, `storage_path`, `ocr_text`, `ocr_status`, `vendor`, `total_cents`.
- Function: Netlify Function `ocr-receipt` that downloads the image and runs OCR (Tesseract.js or external OCR API), then updates DB with parsed fields.
- Parsing: heuristic parsing for total, date, merchant; fall back to manual confirmation.

## UX Flow
1) Tap “Add via receipt”.
2) Upload or take a photo.
3) App extracts summary; prefills title/amount/date.
4) Choose payer/participants; save expense.

## Risks
- OCR accuracy varies; always keep human confirmation.
- Performance on-device; prefer serverless processing.
- Privacy: provide delete and data notice.

