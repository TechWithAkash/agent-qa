/**
 * Class name merger utility (standard shadcn/ui pattern)
 * Combines conditional classes cleanly without requiring external dependencies
 */
export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const key of Object.keys(input)) {
        if (input[key]) classes.push(key);
      }
    }
  }

  return classes.join(" ").replace(/\s+/g, " ").trim();
}
