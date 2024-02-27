import { createContext } from '#pandabox/fixtures'
import type { Config } from '@pandacss/types'
import { describe, expect, test } from 'vitest'
import { transformMissingCssWarnings, type MissingCssWarnings } from '../src/missing-css-warnings'

const run = (userConfig: Config, options: MissingCssWarnings) => {
  const ctx = createContext(userConfig)
  const artifacts = ctx.getArtifacts()

  const updated = transformMissingCssWarnings({ artifacts, changed: undefined }, options)

  const helpersArtifact = updated.find((art) => art.id === 'helpers')
  const helpersFile = helpersArtifact?.files.find((f) => f.file.includes('helpers'))

  return helpersFile?.code
}
describe('missing-css-warnings', () => {
  test('enabled: false', () => {
    expect(run({}, { enabled: false })).toMatchInlineSnapshot(`
      "// src/assert.ts
      function isObject(value) {
        return typeof value === "object" && value != null && !Array.isArray(value);
      }

      // src/compact.ts
      function compact(value) {
        return Object.fromEntries(Object.entries(value ?? {}).filter(([_, value2]) => value2 !== void 0));
      }

      // src/condition.ts
      var isBaseCondition = (v) => v === "base";
      function filterBaseConditions(c) {
        return c.slice().filter((v) => !isBaseCondition(v));
      }

      // src/hash.ts
      function toChar(code) {
        return String.fromCharCode(code + (code > 25 ? 39 : 97));
      }
      function toName(code) {
        let name = "";
        let x;
        for (x = Math.abs(code); x > 52; x = x / 52 | 0)
          name = toChar(x % 52) + name;
        return toChar(x % 52) + name;
      }
      function toPhash(h, x) {
        let i = x.length;
        while (i)
          h = h * 33 ^ x.charCodeAt(--i);
        return h;
      }
      function toHash(value) {
        return toName(toPhash(5381, value) >>> 0);
      }

      // src/important.ts
      var importantRegex = /\\s*!(important)?/i;
      function isImportant(value) {
        return typeof value === "string" ? importantRegex.test(value) : false;
      }
      function withoutImportant(value) {
        return typeof value === "string" ? value.replace(importantRegex, "").trim() : value;
      }
      function withoutSpace(str) {
        return typeof str === "string" ? str.replaceAll(" ", "_") : str;
      }

      // src/memo.ts
      var memo = (fn) => {
        const cache = /* @__PURE__ */ new Map();
        const get = (...args) => {
          const key = JSON.stringify(args);
          if (cache.has(key)) {
            return cache.get(key);
          }
          const result = fn(...args);
          cache.set(key, result);
          return result;
        };
        return get;
      };

      // src/merge-props.ts
      function mergeProps(...sources) {
        const objects = sources.filter(Boolean);
        return objects.reduce((prev, obj) => {
          Object.keys(obj).forEach((key) => {
            const prevValue = prev[key];
            const value = obj[key];
            if (isObject(prevValue) && isObject(value)) {
              prev[key] = mergeProps(prevValue, value);
            } else {
              prev[key] = value;
            }
          });
          return prev;
        }, {});
      }

      // src/walk-object.ts
      var isNotNullish = (element) => element != null;
      function walkObject(target, predicate, options = {}) {
        const { stop, getKey } = options;
        function inner(value, path = []) {
          if (isObject(value) || Array.isArray(value)) {
            const result = {};
            for (const [prop, child] of Object.entries(value)) {
              const key = getKey?.(prop, child) ?? prop;
              const childPath = [...path, key];
              if (stop?.(value, childPath)) {
                return predicate(value, path);
              }
              const next = inner(child, childPath);
              if (isNotNullish(next)) {
                result[key] = next;
              }
            }
            return result;
          }
          return predicate(value, path);
        }
        return inner(target);
      }
      function mapObject(obj, fn) {
        if (Array.isArray(obj))
          return obj.map((value) => fn(value));
        if (!isObject(obj))
          return fn(obj);
        return walkObject(obj, (value) => fn(value));
      }

      // src/normalize-style-object.ts
      function toResponsiveObject(values, breakpoints) {
        return values.reduce((acc, current, index) => {
          const key = breakpoints[index];
          if (current != null) {
            acc[key] = current;
          }
          return acc;
        }, {});
      }
      function normalizeStyleObject(styles, context, shorthand = true) {
        const { utility, conditions } = context;
        const { hasShorthand, resolveShorthand } = utility;
        return walkObject(
          styles,
          (value) => {
            return Array.isArray(value) ? toResponsiveObject(value, conditions.breakpoints.keys) : value;
          },
          {
            stop: (value) => Array.isArray(value),
            getKey: shorthand ? (prop) => hasShorthand ? resolveShorthand(prop) : prop : void 0
          }
        );
      }

      // src/classname.ts
      var fallbackCondition = {
        shift: (v) => v,
        finalize: (v) => v,
        breakpoints: { keys: [] }
      };
      var sanitize = (value) => typeof value === "string" ? value.replaceAll(/[\\n\\s]+/g, " ") : value;
      function createCss(context) {
        const { utility, hash, conditions: conds = fallbackCondition } = context;
        const formatClassName = (str) => [utility.prefix, str].filter(Boolean).join("-");
        const hashFn = (conditions, className) => {
          let result;
          if (hash) {
            const baseArray = [...conds.finalize(conditions), className];
            result = formatClassName(utility.toHash(baseArray, toHash));
          } else {
            const baseArray = [...conds.finalize(conditions), formatClassName(className)];
            result = baseArray.join(":");
          }
          return result;
        };
        return memo(({ base, ...styles } = {}) => {
          const styleObject = Object.assign(styles, base);
          const normalizedObject = normalizeStyleObject(styleObject, context);
          const classNames = /* @__PURE__ */ new Set();
          walkObject(normalizedObject, (value, paths) => {
            const important = isImportant(value);
            if (value == null)
              return;
            const [prop, ...allConditions] = conds.shift(paths);
            const conditions = filterBaseConditions(allConditions);
            const transformed = utility.transform(prop, withoutImportant(sanitize(value)));
            let className = hashFn(conditions, transformed.className);
            if (important)
              className = \`\${className}!\`;
            classNames.add(className);
          });
          return Array.from(classNames).join(" ");
        });
      }
      function compactStyles(...styles) {
        return styles.filter((style) => isObject(style) && Object.keys(compact(style)).length > 0);
      }
      function createMergeCss(context) {
        function resolve(styles) {
          const allStyles = compactStyles(...styles);
          if (allStyles.length === 1)
            return allStyles;
          return allStyles.map((style) => normalizeStyleObject(style, context));
        }
        function mergeCss(...styles) {
          return mergeProps(...resolve(styles));
        }
        function assignCss(...styles) {
          return Object.assign({}, ...resolve(styles));
        }
        return { mergeCss: memo(mergeCss), assignCss };
      }

      // src/hypenate-property.ts
      var wordRegex = /([A-Z])/g;
      var msRegex = /^ms-/;
      var hypenateProperty = memo((property) => {
        if (property.startsWith("--"))
          return property;
        return property.replace(wordRegex, "-$1").replace(msRegex, "-ms-").toLowerCase();
      });

      // src/is-css-function.ts
      var fns = ["min", "max", "clamp", "calc"];
      var fnRegExp = new RegExp(\`^(\${fns.join("|")})\\\\(.*\\\\)\`);
      var isCssFunction = (v) => typeof v === "string" && fnRegExp.test(v);

      // src/is-css-unit.ts
      var lengthUnits = "cm,mm,Q,in,pc,pt,px,em,ex,ch,rem,lh,rlh,vw,vh,vmin,vmax,vb,vi,svw,svh,lvw,lvh,dvw,dvh,cqw,cqh,cqi,cqb,cqmin,cqmax,%";
      var lengthUnitsPattern = \`(?:\${lengthUnits.split(",").join("|")})\`;
      var lengthRegExp = new RegExp(\`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?\${lengthUnitsPattern}$\`);
      var isCssUnit = (v) => typeof v === "string" && lengthRegExp.test(v);

      // src/is-css-var.ts
      var isCssVar = (v) => typeof v === "string" && /^var\\(--.+\\)$/.test(v);

      // src/pattern-fns.ts
      var patternFns = {
        map: mapObject,
        isCssFunction,
        isCssVar,
        isCssUnit
      };
      var getPatternStyles = (pattern, styles) => {
        if (!pattern.defaultValues)
          return styles;
        const defaults = typeof pattern.defaultValues === "function" ? pattern.defaultValues(styles) : pattern.defaultValues;
        return Object.assign({}, defaults, compact(styles));
      };

      // src/slot.ts
      var getSlotRecipes = (recipe = {}) => {
        const init = (slot) => ({
          className: [recipe.className, slot].filter(Boolean).join("__"),
          base: recipe.base?.[slot] ?? {},
          variants: {},
          defaultVariants: recipe.defaultVariants ?? {},
          compoundVariants: recipe.compoundVariants ? getSlotCompoundVariant(recipe.compoundVariants, slot) : []
        });
        const slots = recipe.slots ?? [];
        const recipeParts = slots.map((slot) => [slot, init(slot)]);
        for (const [variantsKey, variantsSpec] of Object.entries(recipe.variants ?? {})) {
          for (const [variantKey, variantSpec] of Object.entries(variantsSpec)) {
            recipeParts.forEach(([slot, slotRecipe]) => {
              slotRecipe.variants[variantsKey] ??= {};
              slotRecipe.variants[variantsKey][variantKey] = variantSpec[slot] ?? {};
            });
          }
        }
        return Object.fromEntries(recipeParts);
      };
      var getSlotCompoundVariant = (compoundVariants, slotName) => compoundVariants.filter((compoundVariant) => compoundVariant.css[slotName]).map((compoundVariant) => ({ ...compoundVariant, css: compoundVariant.css[slotName] }));

      // src/split-props.ts
      function splitProps(props, ...keys) {
        const descriptors = Object.getOwnPropertyDescriptors(props);
        const dKeys = Object.keys(descriptors);
        const split = (k) => {
          const clone = {};
          for (let i = 0; i < k.length; i++) {
            const key = k[i];
            if (descriptors[key]) {
              Object.defineProperty(clone, key, descriptors[key]);
              delete descriptors[key];
            }
          }
          return clone;
        };
        const fn = (key) => split(Array.isArray(key) ? key : dKeys.filter(key));
        return keys.map(fn).concat(split(dKeys));
      }

      // src/uniq.ts
      var uniq = (...items) => items.filter(Boolean).reduce((acc, item) => Array.from(/* @__PURE__ */ new Set([...acc, ...item])), []);
      export {
        compact,
        createCss,
        createMergeCss,
        filterBaseConditions,
        getPatternStyles,
        getSlotCompoundVariant,
        getSlotRecipes,
        hypenateProperty,
        isBaseCondition,
        isObject,
        mapObject,
        memo,
        mergeProps,
        patternFns,
        splitProps,
        toHash,
        uniq,
        walkObject,
        withoutSpace
      };



      // src/normalize-html.ts
      var htmlProps = ["htmlSize", "htmlTranslate", "htmlWidth", "htmlHeight"];
      function convert(key) {
        return htmlProps.includes(key) ? key.replace("html", "").toLowerCase() : key;
      }
      function normalizeHTMLProps(props) {
        return Object.fromEntries(Object.entries(props).map(([key, value]) => [convert(key), value]));
      }
      normalizeHTMLProps.keys = htmlProps;
      export {
        normalizeHTMLProps
      };


      export function __spreadValues(a, b) {
        return { ...a, ...b }
      }

      export function __objRest(source, exclude) {
        return Object.fromEntries(Object.entries(source).filter(([key]) => !exclude.includes(key)))
      }"
    `)
  })

  test('enabled: true', () => {
    expect(run({}, { enabled: true })).toMatchInlineSnapshot(`
      "// src/assert.ts
      function isObject(value) {
        return typeof value === "object" && value != null && !Array.isArray(value);
      }

      // src/compact.ts
      function compact(value) {
        return Object.fromEntries(Object.entries(value ?? {}).filter(([_, value2]) => value2 !== void 0));
      }

      // src/condition.ts
      var isBaseCondition = (v) => v === "base";
      function filterBaseConditions(c) {
        return c.slice().filter((v) => !isBaseCondition(v));
      }

      // src/hash.ts
      function toChar(code) {
        return String.fromCharCode(code + (code > 25 ? 39 : 97));
      }
      function toName(code) {
        let name = "";
        let x;
        for (x = Math.abs(code); x > 52; x = x / 52 | 0)
          name = toChar(x % 52) + name;
        return toChar(x % 52) + name;
      }
      function toPhash(h, x) {
        let i = x.length;
        while (i)
          h = h * 33 ^ x.charCodeAt(--i);
        return h;
      }
      function toHash(value) {
        return toName(toPhash(5381, value) >>> 0);
      }

      // src/important.ts
      var importantRegex = /\\s*!(important)?/i;
      function isImportant(value) {
        return typeof value === "string" ? importantRegex.test(value) : false;
      }
      function withoutImportant(value) {
        return typeof value === "string" ? value.replace(importantRegex, "").trim() : value;
      }
      function withoutSpace(str) {
        return typeof str === "string" ? str.replaceAll(" ", "_") : str;
      }

      // src/memo.ts
      var memo = (fn) => {
        const cache = /* @__PURE__ */ new Map();
        const get = (...args) => {
          const key = JSON.stringify(args);
          if (cache.has(key)) {
            return cache.get(key);
          }
          const result = fn(...args);
          cache.set(key, result);
          return result;
        };
        return get;
      };

      // src/merge-props.ts
      function mergeProps(...sources) {
        const objects = sources.filter(Boolean);
        return objects.reduce((prev, obj) => {
          Object.keys(obj).forEach((key) => {
            const prevValue = prev[key];
            const value = obj[key];
            if (isObject(prevValue) && isObject(value)) {
              prev[key] = mergeProps(prevValue, value);
            } else {
              prev[key] = value;
            }
          });
          return prev;
        }, {});
      }

      // src/walk-object.ts
      var isNotNullish = (element) => element != null;
      function walkObject(target, predicate, options = {}) {
        const { stop, getKey } = options;
        function inner(value, path = []) {
          if (isObject(value) || Array.isArray(value)) {
            const result = {};
            for (const [prop, child] of Object.entries(value)) {
              const key = getKey?.(prop, child) ?? prop;
              const childPath = [...path, key];
              if (stop?.(value, childPath)) {
                return predicate(value, path);
              }
              const next = inner(child, childPath);
              if (isNotNullish(next)) {
                result[key] = next;
              }
            }
            return result;
          }
          return predicate(value, path);
        }
        return inner(target);
      }
      function mapObject(obj, fn) {
        if (Array.isArray(obj))
          return obj.map((value) => fn(value));
        if (!isObject(obj))
          return fn(obj);
        return walkObject(obj, (value) => fn(value));
      }

      // src/normalize-style-object.ts
      function toResponsiveObject(values, breakpoints) {
        return values.reduce((acc, current, index) => {
          const key = breakpoints[index];
          if (current != null) {
            acc[key] = current;
          }
          return acc;
        }, {});
      }
      function normalizeStyleObject(styles, context, shorthand = true) {
        const { utility, conditions } = context;
        const { hasShorthand, resolveShorthand } = utility;
        return walkObject(
          styles,
          (value) => {
            return Array.isArray(value) ? toResponsiveObject(value, conditions.breakpoints.keys) : value;
          },
          {
            stop: (value) => Array.isArray(value),
            getKey: shorthand ? (prop) => hasShorthand ? resolveShorthand(prop) : prop : void 0
          }
        );
      }

      // src/classname.ts
      var fallbackCondition = {
        shift: (v) => v,
        finalize: (v) => v,
        breakpoints: { keys: [] }
      };
      var sanitize = (value) => typeof value === "string" ? value.replaceAll(/[\\n\\s]+/g, " ") : value;
      function createCss(context) {
        const { utility, hash, conditions: conds = fallbackCondition } = context;
        const formatClassName = (str) => [utility.prefix, str].filter(Boolean).join("-");
        const hashFn = (conditions, className) => {
          let result;
          if (hash) {
            const baseArray = [...conds.finalize(conditions), className];
            result = formatClassName(utility.toHash(baseArray, toHash));
          } else {
            const baseArray = [...conds.finalize(conditions), formatClassName(className)];
            result = baseArray.join(":");
          }
          return result;
        };
        return memo(({ base, ...styles } = {}) => {
          const styleObject = Object.assign(styles, base);
          const normalizedObject = normalizeStyleObject(styleObject, context);
          const classNames = /* @__PURE__ */ new Set();
          walkObject(normalizedObject, (value, paths) => {
            const important = isImportant(value);
            if (value == null)
              return;
            const [prop, ...allConditions] = conds.shift(paths);
            const conditions = filterBaseConditions(allConditions);
            const transformed = utility.transform(prop, withoutImportant(sanitize(value)));
            let className = hashFn(conditions, transformed.className);
            if (important)
              className = \`\${className}!\`;
            classNames.add(className);
      isInCss(className);
          });
          return Array.from(classNames).join(" ");
        });
      }
      function compactStyles(...styles) {
        return styles.filter((style) => isObject(style) && Object.keys(compact(style)).length > 0);
      }
      function createMergeCss(context) {
        function resolve(styles) {
          const allStyles = compactStyles(...styles);
          if (allStyles.length === 1)
            return allStyles;
          return allStyles.map((style) => normalizeStyleObject(style, context));
        }
        function mergeCss(...styles) {
          return mergeProps(...resolve(styles));
        }
        function assignCss(...styles) {
          return Object.assign({}, ...resolve(styles));
        }
        return { mergeCss: memo(mergeCss), assignCss };
      }

      // src/hypenate-property.ts
      var wordRegex = /([A-Z])/g;
      var msRegex = /^ms-/;
      var hypenateProperty = memo((property) => {
        if (property.startsWith("--"))
          return property;
        return property.replace(wordRegex, "-$1").replace(msRegex, "-ms-").toLowerCase();
      });

      // src/is-css-function.ts
      var fns = ["min", "max", "clamp", "calc"];
      var fnRegExp = new RegExp(\`^(\${fns.join("|")})\\\\(.*\\\\)\`);
      var isCssFunction = (v) => typeof v === "string" && fnRegExp.test(v);

      // src/is-css-unit.ts
      var lengthUnits = "cm,mm,Q,in,pc,pt,px,em,ex,ch,rem,lh,rlh,vw,vh,vmin,vmax,vb,vi,svw,svh,lvw,lvh,dvw,dvh,cqw,cqh,cqi,cqb,cqmin,cqmax,%";
      var lengthUnitsPattern = \`(?:\${lengthUnits.split(",").join("|")})\`;
      var lengthRegExp = new RegExp(\`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?\${lengthUnitsPattern}$\`);
      var isCssUnit = (v) => typeof v === "string" && lengthRegExp.test(v);

      // src/is-css-var.ts
      var isCssVar = (v) => typeof v === "string" && /^var\\(--.+\\)$/.test(v);

      // src/pattern-fns.ts
      var patternFns = {
        map: mapObject,
        isCssFunction,
        isCssVar,
        isCssUnit
      };
      var getPatternStyles = (pattern, styles) => {
        if (!pattern.defaultValues)
          return styles;
        const defaults = typeof pattern.defaultValues === "function" ? pattern.defaultValues(styles) : pattern.defaultValues;
        return Object.assign({}, defaults, compact(styles));
      };

      // src/slot.ts
      var getSlotRecipes = (recipe = {}) => {
        const init = (slot) => ({
          className: [recipe.className, slot].filter(Boolean).join("__"),
          base: recipe.base?.[slot] ?? {},
          variants: {},
          defaultVariants: recipe.defaultVariants ?? {},
          compoundVariants: recipe.compoundVariants ? getSlotCompoundVariant(recipe.compoundVariants, slot) : []
        });
        const slots = recipe.slots ?? [];
        const recipeParts = slots.map((slot) => [slot, init(slot)]);
        for (const [variantsKey, variantsSpec] of Object.entries(recipe.variants ?? {})) {
          for (const [variantKey, variantSpec] of Object.entries(variantsSpec)) {
            recipeParts.forEach(([slot, slotRecipe]) => {
              slotRecipe.variants[variantsKey] ??= {};
              slotRecipe.variants[variantsKey][variantKey] = variantSpec[slot] ?? {};
            });
          }
        }
        return Object.fromEntries(recipeParts);
      };
      var getSlotCompoundVariant = (compoundVariants, slotName) => compoundVariants.filter((compoundVariant) => compoundVariant.css[slotName]).map((compoundVariant) => ({ ...compoundVariant, css: compoundVariant.css[slotName] }));

      // src/split-props.ts
      function splitProps(props, ...keys) {
        const descriptors = Object.getOwnPropertyDescriptors(props);
        const dKeys = Object.keys(descriptors);
        const split = (k) => {
          const clone = {};
          for (let i = 0; i < k.length; i++) {
            const key = k[i];
            if (descriptors[key]) {
              Object.defineProperty(clone, key, descriptors[key]);
              delete descriptors[key];
            }
          }
          return clone;
        };
        const fn = (key) => split(Array.isArray(key) ? key : dKeys.filter(key));
        return keys.map(fn).concat(split(dKeys));
      }

      // src/uniq.ts
      var uniq = (...items) => items.filter(Boolean).reduce((acc, item) => Array.from(/* @__PURE__ */ new Set([...acc, ...item])), []);
      export {
        compact,
        createCss,
        createMergeCss,
        filterBaseConditions,
        getPatternStyles,
        getSlotCompoundVariant,
        getSlotRecipes,
        hypenateProperty,
        isBaseCondition,
        isObject,
        mapObject,
        memo,
        mergeProps,
        patternFns,
        splitProps,
        toHash,
        uniq,
        walkObject,
        withoutSpace
      };



      // src/normalize-html.ts
      var htmlProps = ["htmlSize", "htmlTranslate", "htmlWidth", "htmlHeight"];
      function convert(key) {
        return htmlProps.includes(key) ? key.replace("html", "").toLowerCase() : key;
      }
      function normalizeHTMLProps(props) {
        return Object.fromEntries(Object.entries(props).map(([key, value]) => [convert(key), value]));
      }
      normalizeHTMLProps.keys = htmlProps;
      export {
        normalizeHTMLProps
      };


      export function __spreadValues(a, b) {
        return { ...a, ...b }
      }

      export function __objRest(source, exclude) {
        return Object.fromEntries(Object.entries(source).filter(([key]) => !exclude.includes(key)))
      }
            /* eslint-disable no-control-regex */
            var rcssescape = /([\\0-\\x1f\\x7f]|^-?\\d)|^-$|^-|[^\\x80-\\uFFFF\\w-]/g;
            var fcssescape = function (ch, asCodePoint) {
              if (!asCodePoint) return "\\\\" + ch;
              if (ch === "\\0") return "\\uFFFD";
              if (ch === "-" && ch.length === 1) return "\\\\-";
              return ch.slice(0, -1) + "\\\\" + ch.charCodeAt(ch.length - 1).toString(16);
            };

            var esc = (sel) => {
              return (sel + "").replace(rcssescape, fcssescape);
            };

            const isCssStyleRule = (rule) => rule instanceof CSSStyleRule
            const isGroupingRule = (rule) => 'cssRules' in rule
            function traverseCSSRule(rule, className) {
              const stack = []
              stack.push(rule)
              while (stack.length > 0) {
                const currentRule = stack.pop()
                if (!currentRule) continue
                if (isCssStyleRule(currentRule)) {
                  const selectorText = currentRule.selectorText
                  if (selectorText && selectorText.includes(className)) {
                    return currentRule
                  }
                }
                if (isGroupingRule(currentRule) && currentRule.cssRules) {
                  stack.push(...Array.from(currentRule.cssRules))
                }
              }
            }
            const missingRules = new Set()
            const isInCss = (className) => {
              if (typeof window === 'undefined') return
              const escaped = '.' + esc(className)
              const styleSheets = document.styleSheets
              for (const styleSheet of styleSheets) {
                const rules = styleSheet.cssRules || styleSheet.rules
                if (!rules) continue
                for (const rule of rules) {
                  const match = traverseCSSRule(rule, escaped)
                  if (match) return match
                }
              }
              if (missingRules.has(className)) return
              missingRules.add(className)
              console.log(\`No matching CSS rule found for "\${className}"\`)
            }"
    `)
  })
})
