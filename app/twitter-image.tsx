/**
 * X/Twitter does not inherit the Open Graph image from the file convention — without
 * this route the card renders with an alt attribute and no picture. Re-exporting
 * keeps one definition rather than a second card that can drift.
 */
export { default, size, contentType, alt } from "./opengraph-image";
export const dynamic = "force-static";
