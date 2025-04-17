/**
 * This file is used to allow Presentation to set the app in Draft Mode,
 * which will load Visual Editing and query draft content and preview
 * the content as it will appear once everything is published.
 */

import { client } from "@/sanity/lib/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Sanity API read token from environment variables
const token = process.env.SANITY_API_READ_TOKEN;

export async function GET(request: Request) {
  // Validate the preview URL and extract the redirect target
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    client.withConfig({ token }),
    request.url
  );

  // If the secret or URL is invalid, return an unauthorized response
  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  // Enable Next.js draft mode
  (await draftMode()).enable();

  // Redirect to the validated preview page
  redirect(redirectTo);
}
