import re
import subprocess
import markdown

with open("docs/DRISHTI_AI_SYSTEM_ARCHITECTURE_AND_RESEARCH.md", "r", encoding="utf-8") as f:
    md_content = f.read()

# Convert markdown to HTML using tables and fenced_code
html_body = markdown.markdown(md_content, extensions=['tables', 'fenced_code', 'toc'])

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DRISHTI AI — Master System Architecture & Deep Research Dossier</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- KaTeX for math formulas -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <!-- Mermaid.js for architecture diagrams -->
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({{ 
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'Geist, sans-serif'
    }});

    // Transform code.language-mermaid into div.mermaid
    document.querySelectorAll('pre code.language-mermaid').forEach(el => {{
      const pre = el.parentElement;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = el.textContent;
      pre.replaceWith(div);
    }});

    await mermaid.run();

    // Render KaTeX math
    renderMathInElement(document.body, {{
      delimiters: [
        {{left: '$$', right: '$$', display: true}},
        {{left: '$', right: '$', display: false}}
      ],
      throwOnError: false
    }});

    window.__READY_FOR_PDF__ = true;
  </script>

  <style>
    @page {{
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {{
        content: counter(page);
      }}
    }}

    *, *:before, *:after {{
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 10pt;
      line-height: 1.6;
      color: #171717;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}

    h1, h2, h3, h4, h5, h6 {{
      color: #0A0A0A;
      font-weight: 700;
      line-height: 1.25;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }}

    h1 {{
      font-size: 22pt;
      border-bottom: 2px solid #F97316;
      padding-bottom: 8px;
      margin-top: 0;
      letter-spacing: -0.02em;
    }}

    h2 {{
      font-size: 15pt;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 6px;
      margin-top: 1.8em;
      letter-spacing: -0.01em;
    }}

    h3 {{
      font-size: 12pt;
      margin-top: 1.3em;
    }}

    h4 {{
      font-size: 10.5pt;
    }}

    p, ul, ol {{
      margin-top: 0.4em;
      margin-bottom: 0.8em;
    }}

    li {{
      margin-bottom: 0.25em;
    }}

    blockquote {{
      margin: 1.2em 0;
      padding: 10px 16px;
      background: #FAFAF9;
      border-left: 4px solid #F97316;
      color: #44403C;
      font-size: 9.5pt;
      border-radius: 0 6px 6px 0;
    }}

    blockquote p {{
      margin: 0;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 1.2em 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }}

    th, td {{
      padding: 7px 10px;
      border: 1px solid #E5E5E5;
      text-align: left;
      vertical-align: top;
    }}

    th {{
      background: #F5F5F4;
      font-weight: 600;
      color: #171717;
    }}

    tr:nth-child(even) td {{
      background: #FAFAF9;
    }}

    code {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #F5F5F4;
      padding: 1.5px 4px;
      border-radius: 4px;
      color: #C2410C;
      border: 1px solid #E7E5E4;
    }}

    pre {{
      background: #18181B;
      color: #F4F4F5;
      padding: 12px 14px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      line-height: 1.5;
      margin: 1em 0;
      page-break-inside: avoid;
      border: 1px solid #27272A;
    }}

    pre code {{
      background: transparent;
      padding: 0;
      border: none;
      color: inherit;
    }}

    .mermaid {{
      text-align: center;
      margin: 1.5em 0;
      background: #FAFAF9;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #E5E5E5;
      page-break-inside: avoid;
    }}

    .katex-display {{
      margin: 1em 0;
      page-break-inside: avoid;
    }}

    hr {{
      border: none;
      border-top: 1px solid #E5E5E5;
      margin: 2em 0;
    }}

    a {{
      color: #EA580C;
      text-decoration: none;
    }}

    .badge {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
  </style>
</head>
<body>
  {html_body}
</body>
</html>"""

with open("docs/drishti_architecture_print.html", "w", encoding="utf-8") as f:
    f.write(html_template)

print("Generated docs/drishti_architecture_print.html successfully")
