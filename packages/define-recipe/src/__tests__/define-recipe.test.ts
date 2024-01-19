import { describe, expect, expectTypeOf, test } from 'vitest'
import { defineRecipe, type RecipeBuilder } from '../define-recipe'

describe('define-recipe', () => {
  test('identity fn', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
          },
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: { color: 'blue.100' }
          red: { color: 'red.100' }
        }
        size: {
          sm: { h: string }
          md: { h: string }
        }
      }>
    >()
  })

  test('config.merge', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    }).merge({
      className: 'aaa',
      variants: {
        visual: {
          green: { color: 'green.100' },
          yellow: { color: 'yellow.100' },
        },
        size: {
          lg: { h: '12' },
          xl: { h: '14' },
        },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "aaa",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "lg": {
              "h": "12",
            },
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
            "xl": {
              "h": "14",
            },
          },
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "green": {
              "color": "green.100",
            },
            "red": {
              "color": "red.100",
            },
            "yellow": {
              "color": "yellow.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: { color: 'blue.100' }
          red: { color: 'red.100' }
          green: { color: 'green.100' }
          yellow: { color: 'yellow.100' }
        }
        size: {
          sm: { h: string }
          md: { h: string }
          lg: { h: string }
          xl: { h: string }
        }
      }>
    >()
  })

  test('config.omit', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    }).omit('visual')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        size: {
          sm: { h: string }
          md: { h: string }
        }
      }>
    >()
  })

  test('config.omit multiple', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
        border: {
          solid: { border: '1px solid' },
          dashed: { border: '1px dashed' },
        },
      },
    }).omit('visual', 'size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "border": {
            "dashed": {
              "border": "1px dashed",
            },
            "solid": {
              "border": "1px solid",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        border: {
          solid: {
            border: '1px solid'
          }
          dashed: {
            border: '1px dashed'
          }
        }
      }>
    >()
  })

  test('config.pick', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    }).pick('visual')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: { color: 'blue.100' }
          red: { color: 'red.100' }
        }
      }>
    >()
  })

  test('config.pick multiple', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
        border: {
          solid: { border: '1px solid' },
          dashed: { border: '1px dashed' },
        },
      },
    }).pick('visual', 'border')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "border": {
            "dashed": {
              "border": "1px dashed",
            },
            "solid": {
              "border": "1px solid",
            },
          },
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        border: {
          solid: {
            border: '1px solid'
          }
          dashed: {
            border: '1px dashed'
          }
        }
        visual: {
          blue: { color: 'blue.100' }
          red: { color: 'red.100' }
        }
      }>
    >()
  })

  test('config.extend', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    }).extend({
      visual: {
        green: { color: 'green.100' },
        yellow: { color: 'yellow.100' },
      },
      size: {
        lg: { h: '12' },
        xl: { h: '14' },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "lg": {
              "h": "12",
            },
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
            "xl": {
              "h": "14",
            },
          },
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "green": {
              "color": "green.100",
            },
            "red": {
              "color": "red.100",
            },
            "yellow": {
              "color": "yellow.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: { color: 'blue.100' }
          red: { color: 'red.100' }
          green: { color: 'green.100' }
          yellow: { color: 'yellow.100' }
        }
        size: {
          sm: { h: string }
          md: { h: string }
          lg: { h: string }
          xl: { h: string }
        }
      }>
    >()
  })

  test('config.extend existing', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    }).extend({
      visual: {
        blue: { backgroundColor: 'blue.900' },
        yellow: { color: 'yellow.100' },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
          },
          "visual": {
            "blue": {
              "backgroundColor": "blue.900",
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
            "yellow": {
              "color": "yellow.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: { color: 'blue.100'; backgroundColor: 'blue.900' }
          red: { color: 'red.100' }
          yellow: { color: 'yellow.100' }
        }
      }>
    >()
  })

  test('config.extend + config.omit', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    })
      .extend({
        visual: {
          green: { color: 'green.100' },
          yellow: { color: 'yellow.100' },
        },
        size: {
          lg: { h: '12' },
          xl: { h: '14' },
        },
      })
      .omit('visual')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "lg": {
              "h": "12",
            },
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
            "xl": {
              "h": "14",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        size: {
          sm: { h: string }
          md: { h: string }
          lg: { h: string }
          xl: { h: string }
        }
      }>
    >()
  })

  test('config.extend + config.pick', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    })
      .extend({
        visual: {
          green: { color: 'green.100' },
          yellow: { color: 'yellow.100' },
        },
        size: {
          lg: { h: '12' },
          xl: { h: '14' },
        },
      })
      .pick('visual')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "green": {
              "color": "green.100",
            },
            "red": {
              "color": "red.100",
            },
            "yellow": {
              "color": "yellow.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: { color: 'blue.100' }
          red: { color: 'red.100' }
          green: { color: 'green.100' }
          yellow: { color: 'yellow.100' }
        }
      }>
    >()
  })

  test('config.extend + config.omit + config.pick', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    })
      .extend({
        visual: {
          green: { color: 'green.100' },
          yellow: { color: 'yellow.100' },
        },
        size: {
          lg: { h: '12' },
          xl: { h: '14' },
        },
      })
      .omit('visual')
      .pick('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "lg": {
              "h": "12",
            },
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
            "xl": {
              "h": "14",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        size: {
          sm: { h: string }
          md: { h: string }
          lg: { h: string }
          xl: { h: string }
        }
      }>
    >()
  })

  test('config.extend + config.pick + config.omit', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    })
      .extend({
        visual: {
          green: { color: 'green.100' },
          yellow: { color: 'yellow.100' },
        },
        size: {
          lg: { h: '12' },
          xl: { h: '14' },
        },
      })
      .pick('size')
      .omit('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {},
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<RecipeBuilder<{}>>()

    const keys = {} as keyof NonNullable<(typeof recipe)['variants']>
    expectTypeOf(keys).toMatchTypeOf<never>()
  })

  test('config.extend + config.omit + config.pick + config.extend', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    })
      .extend({
        visual: {
          green: { color: 'green.100' },
          yellow: { color: 'yellow.100' },
        },
        size: {
          lg: { h: '12' },
          xl: { h: '14' },
        },
      })
      .omit('visual')
      .pick('size')
      .extend({
        size: {
          xl: { h: '16' },
          xxl: { h: '18' },
        },
      })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "lg": {
              "h": "12",
            },
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
            "xl": {
              "h": "16",
            },
            "xxl": {
              "h": "18",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        size: {
          sm: { h: string }
          md: { h: string }
          lg: { h: string }
          xl: { h: string }
          xxl: { h: string }
        }
      }>
    >()
  })

  test('compoundVariants pick', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
      compoundVariants: [
        {
          visual: 'red',
          size: 'sm',
          css: {
            color: 'red',
          },
        },
        {
          size: 'md',
          css: {
            color: 'green',
          },
        },
        {
          visual: 'blue',
          css: {
            color: 'yellow',
          },
        },
      ],
    }).pick('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": [
          {
            "css": {
              "color": "red",
            },
            "size": "sm",
            "visual": "red",
          },
          {
            "css": {
              "color": "green",
            },
            "size": "md",
          },
        ],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        size: {
          sm: {
            h: string
          }
          md: {
            h: string
          }
        }
      }>
    >()
  })

  test('compoundVariants omit', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
      compoundVariants: [
        {
          visual: 'red',
          size: 'sm',
          css: {
            color: 'red',
          },
        },
        {
          size: 'md',
          css: {
            color: 'green',
          },
        },
      ],
    }).omit('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": [],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: {
            color: 'blue.100'
          }
          red: {
            color: 'red.100'
          }
        }
      }>
    >()
  })

  test('compoundVariants merge', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
      compoundVariants: [
        {
          visual: 'red',
          size: 'sm',
          css: {
            color: 'red',
          },
        },
        {
          size: 'md',
          css: {
            color: 'green',
          },
        },
      ],
    }).merge({
      className: 'btn',
      compoundVariants: [
        {
          visual: 'blue',
          size: 'sm',
          css: {
            color: 'blue',
          },
        },
        {
          size: 'md',
          css: {
            color: 'yellow',
          },
        },
      ],
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "compoundVariants": [
          {
            "css": {
              "color": "blue",
            },
            "size": "sm",
            "visual": "blue",
          },
          {
            "css": {
              "color": "yellow",
            },
            "size": "md",
          },
        ],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
          },
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: {
            color: 'blue.100'
          }
          red: {
            color: 'red.100'
          }
        }
        size: {
          sm: {
            h: string
          }
          md: {
            h: string
          }
        }
      }>
    >()
  })

  test('defaultVariants merge', () => {
    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      defaultVariants: {
        visual: 'red',
        size: 'sm',
      },
      variants: {
        visual: {
          blue: { color: 'blue.100' },
          red: { color: 'red.100' },
        },
        size: {
          sm: { h: '8' },
          md: { h: '10' },
        },
      },
    }).merge({
      className: 'btn',
      defaultVariants: {
        visual: 'blue',
        size: null,
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "base": {
          "px": "4",
        },
        "cast": [Function],
        "className": "btn",
        "defaultVariants": {
          "size": null,
          "visual": "blue",
        },
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "variants": {
          "size": {
            "md": {
              "h": "10",
            },
            "sm": {
              "h": "8",
            },
          },
          "visual": {
            "blue": {
              "color": "blue.100",
            },
            "red": {
              "color": "red.100",
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      RecipeBuilder<{
        visual: {
          blue: {
            color: 'blue.100'
          }
          red: {
            color: 'red.100'
          }
        }
        size: {
          sm: {
            h: string
          }
          md: {
            h: string
          }
        }
      }>
    >()
  })
})
