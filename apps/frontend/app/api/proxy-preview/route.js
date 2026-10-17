import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    let urlToFetch = targetUrl.trim();
    if (!urlToFetch.startsWith("http://") && !urlToFetch.startsWith("https://")) {
      urlToFetch = `https://${urlToFetch}`;
    }

    const res = await fetch(urlToFetch, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 DRISHTI-AI-Preview/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    let html = await res.text();
    const parsed = new URL(urlToFetch);
    const baseHref = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;

    // 1. Strip ALL <script>...</script> tags completely across newlines and nested symbols
    html = html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "");
    html = html.replace(/<script\b[^>]*\/>/gi, "");
    html = html.replace(/<script\b[^>]*>/gi, "");

    // 2. Strip inline event handlers (onclick, onload, onerror, etc.)
    html = html.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

    // 3. Inject base tag, Content-Security-Policy to disable script execution, and responsive preview styles
    const previewStyles = `
      <base href="${baseHref}">
      <meta http-equiv="Content-Security-Policy" content="script-src 'none'; default-src * 'unsafe-inline' data: blob:;">
      <style>
        html, body {
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #0f172a !important;
        }
        img, svg {
          max-width: 100% !important;
          height: auto !important;
        }
      </style>
    `;

    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${previewStyles}`);
    } else if (html.includes("<HEAD>")) {
      html = html.replace("<HEAD>", `<HEAD>${previewStyles}`);
    } else {
      html = `${previewStyles}${html}`;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err) {
    return new NextResponse(
      `<div style="font-family:sans-serif;padding:32px;text-align:center;background:#090b10;color:#f8fafc;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <h4 style="color:#6366f1;margin-bottom:8px;font-size:14px;">Preview Connected to Live Target</h4>
        <p style="color:#94a3b8;font-size:12px;">${err.message}</p>
      </div>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
