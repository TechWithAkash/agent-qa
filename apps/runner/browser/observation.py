"""
DOM observation and interactive element extraction.
Section 5.2 and Section 7 of the Technical Architecture.
"""

import asyncio
from typing import Any
from urllib.parse import urlparse
from playwright.async_api import Page

async def wait_dom_quiet(page: Page, quiet_ms: int = 300, max_timeout_ms: int = 5000):
    """
    Custom DOM quiet wait: checks that page reaches a stable state
    without relying solely on networkidle. Section 7.
    """
    try:
        await page.wait_for_load_state("domcontentloaded", timeout=max_timeout_ms)
        await asyncio.sleep(quiet_ms / 1000.0)
    except Exception:
        pass

async def extract_interactive_elements(page: Page) -> list[dict[str, Any]]:
    """
    Extract visible interactive elements with stable locators and accessibility details.
    Derived from role, accessible name, and DOM ordinal.
    """
    js_code = """
    () => {
        const results = [];
        const seen = new Set();
        let refCounter = 1;

        const isVisible = (elem) => {
            const style = window.getComputedStyle(elem);
            return style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   style.opacity !== '0' &&
                   elem.offsetWidth > 0 &&
                   elem.offsetHeight > 0;
        };

        const getAccessibleName = (elem) => {
            return (
                elem.getAttribute('aria-label') ||
                elem.getAttribute('aria-labelledby') ||
                elem.innerText ||
                elem.getAttribute('placeholder') ||
                elem.getAttribute('title') ||
                elem.getAttribute('value') ||
                elem.getAttribute('name') ||
                elem.getAttribute('id') ||
                ''
            ).trim().replace(/\\s+/g, ' ');
        };

        const candidates = document.querySelectorAll(
            'a[href], button, input, select, textarea, [role="button"], [role="link"], [tabindex="0"]'
        );

        candidates.forEach(elem => {
            if (!isVisible(elem)) return;

            const tag = elem.tagName.toLowerCase();
            let role = elem.getAttribute('role');
            if (!role) {
                if (tag === 'a') role = 'link';
                else if (tag === 'button') role = 'button';
                else if (tag === 'input') {
                    const inputType = (elem.getAttribute('type') || 'text').toLowerCase();
                    if (inputType === 'submit' || inputType === 'button') role = 'button';
                    else if (inputType === 'checkbox') role = 'checkbox';
                    else if (inputType === 'radio') role = 'radio';
                    else role = 'textbox';
                }
                else if (tag === 'select') role = 'combobox';
                else if (tag === 'textarea') role = 'textbox';
                else role = 'element';
            }

            const name = getAccessibleName(elem);
            const id = elem.getAttribute('id') || '';
            const href = elem.getAttribute('href') || '';
            const inputType = elem.getAttribute('type') || '';
            const required = elem.hasAttribute('required');
            const minLength = elem.getAttribute('minlength') || null;

            // Generate CSS selector for Playwright fallback
            let selector = '';
            if (id) {
                selector = `#${id}`;
            } else if (elem.getAttribute('name')) {
                selector = `${tag}[name="${elem.getAttribute('name')}"]`;
            } else if (role === 'button' && name) {
                selector = `button:has-text("${name}")`;
            } else if (role === 'link' && href) {
                selector = `a[href="${href}"]`;
            } else {
                selector = tag;
            }

            results.push({
                ref: `e${refCounter++}`,
                role: role,
                name: name,
                tag: tag,
                id: id,
                href: href,
                type: inputType,
                required: required,
                minlength: minLength ? parseInt(minLength, 10) : null,
                selector: selector,
            });
        });

        return results;
    }
    """
    try:
        elements = await page.evaluate(js_code)
        return elements
    except Exception:
        return []

async def extract_forms(page: Page, elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Extract form structures and relate fields to submit buttons."""
    js_code = """
    () => {
        const forms = [];
        document.querySelectorAll('form').forEach((f, idx) => {
            const formId = f.getAttribute('id') || `form_${idx + 1}`;
            const method = (f.getAttribute('method') || 'GET').toUpperCase();
            const action = f.getAttribute('action') || '';
            const inputs = [];
            f.querySelectorAll('input, select, textarea').forEach(inp => {
                inputs.push(inp.getAttribute('id') || inp.getAttribute('name') || '');
            });
            forms.push({
                id: formId,
                method: method,
                action: action,
                field_ids: inputs.filter(Boolean)
            });
        });
        return forms;
    }
    """
    try:
        raw_forms = await page.evaluate(js_code)
        for rf in raw_forms:
            # Map field_ids to element refs
            matched_refs = []
            for elem in elements:
                if elem.get("id") in rf["field_ids"]:
                    matched_refs.append(elem["ref"])
            rf["fields"] = matched_refs
        return raw_forms
    except Exception:
        return []

async def observe_page(page: Page) -> dict[str, Any]:
    """Capture a comprehensive state observation of the active page."""
    await wait_dom_quiet(page)
    url = page.url
    title = await page.title()
    elements = await extract_interactive_elements(page)
    forms = await extract_forms(page, elements)

    # Visible text summary (truncated)
    try:
        body_text = await page.inner_text("body")
        text_excerpt = body_text[:1000]
    except Exception:
        text_excerpt = ""

    return {
        "url": url,
        "title": title,
        "elements": elements,
        "forms": forms,
        "text_excerpt": text_excerpt,
    }
