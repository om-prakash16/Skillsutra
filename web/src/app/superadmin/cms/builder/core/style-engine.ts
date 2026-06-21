export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export interface StylePayload {
  className: string;
  style: React.CSSProperties;
}

/**
 * The StyleEngine is responsible for translating component JSON properties
 * into actual CSS classes (Tailwind) and inline styles (Design Tokens).
 */
export class StyleEngine {
  
  // A map of property keys that should be translated directly to CSS variables
  // rather than Tailwind utility classes, allowing for dynamic Theme swapping.
  private static TOKEN_MAP: Record<string, string> = {
    backgroundColor: '--bg-color',
    textColor: '--text-color',
    borderColor: '--border-color',
    shadowColor: '--shadow-color',
    fontFamily: '--font-family',
  };

  /**
   * Compiles the raw block props into a style payload for React.
   * Handles responsive properties (objects) and scalar values.
   */
  static compile(props: Record<string, any>, activeBreakpoint: Breakpoint = 'base'): StylePayload {
    const classNames: string[] = [];
    const styles: Record<string, any> = {};

    for (const [key, rawValue] of Object.entries(props)) {
      // Ignore internal builder props
      if (key.startsWith('_')) continue;
      // Ignore complex data bindings (handled by data engine, not style engine)
      if (typeof rawValue === 'object' && rawValue !== null && rawValue.__binding) continue;

      // Extract value based on current breakpoint
      let value = rawValue;
      if (typeof rawValue === 'object' && rawValue !== null && ('base' in rawValue || 'md' in rawValue)) {
        // Simple fallback cascade for responsive values: exact -> smaller -> base
        value = this.resolveResponsiveValue(rawValue, activeBreakpoint);
      }

      if (value === undefined || value === null || value === '') continue;

      // Map to CSS Variable if it's a known token
      if (this.TOKEN_MAP[key]) {
        styles[this.TOKEN_MAP[key]] = value;
      } 
      // Handle known Layout tailwind mappers
      else if (key === 'padding') classNames.push(value);
      else if (key === 'margin') classNames.push(value);
      else if (key === 'gap') classNames.push(`gap-[${value}]`);
      else if (key === 'width') styles.width = value;
      else if (key === 'height') styles.height = value;
      else if (key === 'borderRadius') styles.borderRadius = value;
      // Catch-all for arbitrary styles if they match CSS properties
      else {
        // Only inject if it's likely a valid CSS property (simple heuristic)
        if (typeof value === 'string' || typeof value === 'number') {
          // styles[key] = value; // Be careful with arbitrary injection, but allowed in builder
        }
      }
    }

    return {
      className: classNames.filter(Boolean).join(' '),
      style: styles as React.CSSProperties
    };
  }

  /**
   * Helper to resolve responsive object `{ base: '10px', md: '20px' }` for a given breakpoint
   */
  private static resolveResponsiveValue(responsiveObj: any, currentBp: Breakpoint): any {
    const bps: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];
    const currentIndex = bps.indexOf(currentBp);
    
    // Walk backwards from current breakpoint to find the nearest defined value
    for (let i = currentIndex; i >= 0; i--) {
      if (responsiveObj[bps[i]] !== undefined) {
        return responsiveObj[bps[i]];
      }
    }
    return undefined;
  }
}
