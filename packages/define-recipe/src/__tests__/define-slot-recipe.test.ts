import { describe, expect, expectTypeOf, test } from 'vitest'
import { defineSlotRecipe, type SlotRecipeBuilder } from '../define-slot-recipe'
import { defineRecipe } from '../define-recipe'

describe('define-recipe', () => {
  test('identity fn', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'icon' | 'root' | 'input',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('merge', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    }).merge({
      className: 'aaa',
      variants: {
        variant: {
          green: { root: { color: 'green.100' } },
          yellow: { root: { color: 'yellow.100' } },
        },
        size: {
          lg: { root: { h: '12' } },
          xl: { root: { h: '14' } },
        },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "aaa",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "lg": {
              "root": {
                "h": "12",
              },
            },
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
            "xl": {
              "root": {
                "h": "14",
              },
            },
          },
          "variant": {
            "green": {
              "root": {
                "color": "green.100",
              },
            },
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
            "yellow": {
              "root": {
                "color": "yellow.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'icon' | 'root' | 'input',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
            green: { root: { color: 'green.100' } }
            yellow: { root: { color: 'yellow.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
            lg: { root: { h: string } }
            xl: { root: { h: string } }
          }
        }
      >
    >()
  })

  test('omit', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    }).omit('variant')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('omit multiple', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    }).omit('variant', 'size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "border": {
            "dashed": {
              "root": {
                "border": "1px dashed",
              },
            },
            "solid": {
              "root": {
                "border": "1px solid",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          border: {
            solid: { root: { border: '1px solid' } }
            dashed: { root: { border: '1px dashed' } }
          }
        }
      >
    >()
  })

  test('pick', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    }).pick('variant')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
        }
      >
    >()
  })

  test('pick multiple', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    }).pick('variant', 'border')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "border": {
            "dashed": {
              "root": {
                "border": "1px dashed",
              },
            },
            "solid": {
              "root": {
                "border": "1px solid",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
          border: {
            solid: { root: { border: '1px solid' } }
            dashed: { root: { border: '1px dashed' } }
          }
        }
      >
    >()
  })

  test('extend', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    }).extend({
      variant: {
        green: { root: { color: 'green.100' } },
        yellow: { root: { color: 'yellow.100' } },
      },
      size: {
        lg: { root: { h: '12' } },
        xl: { root: { h: '14' } },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "lg": {
              "root": {
                "h": "12",
              },
            },
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
            "xl": {
              "root": {
                "h": "14",
              },
            },
          },
          "variant": {
            "green": {
              "root": {
                "color": "green.100",
              },
            },
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
            "yellow": {
              "root": {
                "color": "yellow.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
            green: { root: { color: 'green.100' } }
            yellow: { root: { color: 'yellow.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
            lg: { root: { h: string } }
            xl: { root: { h: string } }
          }
        }
      >
    >()
  })

  test('extend existing', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    }).extend({
      variant: {
        subtle: { root: { backgroundColor: 'blue.900' } },
        yellow: { root: { color: 'yellow.100' } },
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "backgroundColor": "blue.900",
                "color": "blue.100",
              },
            },
            "yellow": {
              "root": {
                "color": "yellow.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100'; backgroundColor: 'blue.900' } }
            solid: { root: { color: 'blue.100' } }
            yellow: { root: { color: 'yellow.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('extend + omit', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    })
      .extend({
        variant: {
          green: { root: { color: 'green.100' } },
          yellow: { root: { color: 'yellow.100' } },
        },
        size: {
          lg: { root: { h: '12' } },
          xl: { root: { h: '14' } },
        },
      })
      .omit('variant')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "lg": {
              "root": {
                "h": "12",
              },
            },
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
            "xl": {
              "root": {
                "h": "14",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
            lg: { root: { h: string } }
            xl: { root: { h: string } }
          }
        }
      >
    >()
  })

  test('extend + pick', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    })
      .extend({
        variant: {
          green: { root: { color: 'green.100' } },
          yellow: { root: { color: 'yellow.100' } },
        },
        size: {
          lg: { root: { h: '12' } },
          xl: { root: { h: '14' } },
        },
      })
      .pick('variant')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "variant": {
            "green": {
              "root": {
                "color": "green.100",
              },
            },
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
            "yellow": {
              "root": {
                "color": "yellow.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
            green: { root: { color: 'green.100' } }
            yellow: { root: { color: 'yellow.100' } }
          }
        }
      >
    >()
  })

  test('extend + omit + pick', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    })
      .extend({
        variant: {
          green: { root: { color: 'green.100' } },
          yellow: { root: { color: 'yellow.100' } },
        },
        size: {
          lg: { root: { h: '12' } },
          xl: { root: { h: '14' } },
        },
      })
      .omit('variant')
      .pick('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "lg": {
              "root": {
                "h": "12",
              },
            },
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
            "xl": {
              "root": {
                "h": "14",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
            lg: { root: { h: string } }
            xl: { root: { h: string } }
          }
        }
      >
    >()
  })

  test('extend + pick + omit', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    })
      .extend({
        variant: {
          green: { root: { color: 'green.100' } },
          yellow: { root: { color: 'yellow.100' } },
        },
        size: {
          lg: { root: { h: '12' } },
          xl: { root: { h: '14' } },
        },
      })
      .pick('size')
      .omit('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {},
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<SlotRecipeBuilder<'root' | 'input' | 'icon', any>>()
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        Omit<
          {
            size: { sm: { root: { fontSize: 'sm' } }; md: { root: { fontSize: 'md' } } } & {
              lg: { root: { h: string } }
              xl: { root: { h: string } }
            }
          },
          'size'
        >
      >
    >()
  })

  test('extend + omit + pick + extend', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
    })
      .extend({
        variant: {
          green: { root: { color: 'green.100' } },
          yellow: { root: { color: 'yellow.100' } },
        },
        size: {
          lg: { root: { h: '12' } },
          xl: { root: { h: '14' } },
        },
      })
      .omit('variant')
      .pick('size')
      .extend({
        size: {
          xl: { root: { h: '16' } },
          xxl: { root: { h: '18' } },
        },
      })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": undefined,
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "lg": {
              "root": {
                "h": "12",
              },
            },
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
            "xl": {
              "root": {
                "h": "16",
              },
            },
            "xxl": {
              "root": {
                "h": "18",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
            lg: { root: { h: string } }
            xl: { root: { h: string } }
            xxl: { root: { h: string } }
          }
        }
      >
    >()
  })

  test('compoundVariants pick', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
      compoundVariants: [
        {
          variant: 'subtle',
          size: 'sm',
          css: { root: { color: 'red' } },
        },
        {
          size: 'md',
          css: { root: { color: 'green' } },
        },
        {
          variant: 'solid',
          css: { root: { color: 'yellow' } },
        },
      ],
    }).pick('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": [
          {
            "css": {
              "root": {
                "color": "red",
              },
            },
            "size": "sm",
            "variant": "subtle",
          },
          {
            "css": {
              "root": {
                "color": "green",
              },
            },
            "size": "md",
          },
        ],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('compoundVariants omit', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
        border: {
          solid: { root: { border: '1px solid' } },
          dashed: { root: { border: '1px dashed' } },
        },
      },
      compoundVariants: [
        {
          variant: 'subtle',
          size: 'sm',
          css: { root: { color: 'red' } },
        },
        {
          size: 'md',
          css: { root: { color: 'green' } },
        },
        {
          variant: 'solid',
          css: { root: { color: 'yellow' } },
        },
      ],
    }).omit('size')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": [
          {
            "css": {
              "root": {
                "color": "yellow",
              },
            },
            "variant": "solid",
          },
        ],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "border": {
            "dashed": {
              "root": {
                "border": "1px dashed",
              },
            },
            "solid": {
              "root": {
                "border": "1px solid",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
        }
      >
    >()
  })

  test('compoundVariants merge', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
      compoundVariants: [
        {
          variant: 'subtle',
          size: 'sm',
          css: { root: { color: 'red' } },
        },
        {
          size: 'md',
          css: { root: { color: 'green' } },
        },
        {
          variant: 'solid',
          css: { root: { color: 'yellow' } },
        },
      ],
    }).merge({
      className: 'btn',
      compoundVariants: [
        {
          variant: 'subtle',
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
        "cast": [Function],
        "className": "btn",
        "compoundVariants": [
          {
            "css": {
              "color": "blue",
              "root": {
                "color": "red",
              },
            },
            "size": "sm",
            "variant": "subtle",
          },
          {
            "css": {
              "color": "yellow",
              "root": {
                "color": "green",
              },
            },
            "size": "md",
          },
          {
            "css": {
              "root": {
                "color": "yellow",
              },
            },
            "variant": "solid",
          },
        ],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'icon' | 'root' | 'input',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('defaultVariants merge', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      defaultVariants: {
        variant: 'solid',
        size: 'sm',
      },
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
      compoundVariants: [
        {
          variant: 'subtle',
          size: 'sm',
          css: { root: { color: 'red' } },
        },
        {
          size: 'md',
          css: { root: { color: 'green' } },
        },
        {
          variant: 'solid',
          css: { root: { color: 'yellow' } },
        },
      ],
    }).merge({
      className: 'btn',
      defaultVariants: {
        variant: 'subtle',
        size: null,
      },
    })

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "btn",
        "compoundVariants": [
          {
            "css": {
              "root": {
                "color": "red",
              },
            },
            "size": "sm",
            "variant": "subtle",
          },
          {
            "css": {
              "root": {
                "color": "green",
              },
            },
            "size": "md",
          },
          {
            "css": {
              "root": {
                "color": "yellow",
              },
            },
            "variant": "solid",
          },
        ],
        "defaultVariants": {
          "size": null,
          "variant": "subtle",
        },
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'icon' | 'root' | 'input',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('configSlots.add', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { root: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { root: { fontSize: 'md' } },
        },
      },
    }).slot.add('title')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
          "title",
        ],
        "variants": {
          "size": {
            "md": {
              "root": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "solid": {
              "root": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'icon' | 'root' | 'input' | 'title',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { root: { color: 'blue.100' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { root: { fontSize: 'md' } }
          }
        }
      >
    >()
  })

  test('configSlots.pick', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { icon: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { icon: { fontSize: 'md' } },
        },
      },
    }).slot.pick('icon')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": [],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "icon",
        ],
        "variants": {
          "size": {
            "md": {
              "icon": {
                "fontSize": "md",
              },
            },
            "sm": {},
          },
          "variant": {
            "solid": {
              "icon": {
                "color": "blue.100",
              },
            },
            "subtle": {},
          },
        },
      }
    `)
    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'icon',
        {
          variant: {
            subtle: {}
            solid: {
              icon: {
                color: 'blue.100'
              }
            }
          }
          size: {
            sm: {}
            md: {
              icon: {
                fontSize: 'md'
              }
            }
          }
        }
      >
    >()
  })

  test('configSlots.omit', () => {
    const recipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { icon: { color: 'blue.100' } },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { icon: { fontSize: 'md' } },
        },
      },
    }).slot.omit('icon')

    expect(recipe).toMatchInlineSnapshot(`
      {
        "cast": [Function],
        "className": "card",
        "compoundVariants": [],
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
        ],
        "variants": {
          "size": {
            "md": {},
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "solid": {},
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)

    expectTypeOf(recipe).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: {}
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: {}
          }
        }
      >
    >()
  })

  test('configSlots.assignTo', () => {
    const slotRecipe = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      base: { root: { border: 'none' }, input: { margin: '2' } },
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
          solid: { icon: { color: 'blue.100' } },
          outline: { input: { mx: 2 } },
          empty: { input: {} },
        },
        size: {
          sm: { root: { fontSize: 'sm' } },
          md: { icon: { fontSize: 'md' } },
          lg: { input: { fontSize: 'lg' } },
        },
      },
    })

    const recipe = defineRecipe({
      className: 'btn',
      base: { px: '4' },
      variants: {
        variant: {
          outline: { color: 'green.100' },
          empty: { border: 'none' },
        },
        size: {
          lg: { fontSize: 'xl', h: '10' },
        },
      },
    })

    const assigned = slotRecipe.slot.assignTo('input', recipe)
    expect(assigned).toMatchInlineSnapshot(`
      {
        "base": {
          "input": {
            "margin": "2",
            "px": "4",
          },
          "root": {
            "border": "none",
          },
        },
        "cast": [Function],
        "className": "card",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "size": {
            "lg": {
              "input": {
                "fontSize": "xl",
                "h": "10",
              },
            },
            "md": {
              "icon": {
                "fontSize": "md",
              },
            },
            "sm": {
              "root": {
                "fontSize": "sm",
              },
            },
          },
          "variant": {
            "empty": {
              "input": {
                "border": "none",
              },
            },
            "outline": {
              "input": {
                "color": "green.100",
                "mx": 2,
              },
            },
            "solid": {
              "icon": {
                "color": "blue.100",
              },
            },
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)

    expectTypeOf(assigned).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
            solid: { icon: { color: 'blue.100' } }
            outline: { input: { mx: number } | { color: 'green.100' } }
            empty: { input: {} | { border: 'none' } }
          }
          size: {
            sm: { root: { fontSize: 'sm' } }
            md: { icon: { fontSize: 'md' } }
            lg: { input: { fontSize: 'lg' } | { fontSize: 'xl'; h: string } }
          }
        }
      >
    >()
  })

  test("configSlots.assignTo with a variant key that doesn't exist", () => {
    // spoiler: nothing happens

    const button = defineRecipe({
      className: 'btn',
      variants: {
        variant: { primary: { color: 'red' } },
      },
    })

    const card = defineSlotRecipe({
      className: 'card',
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          subtle: { root: { color: 'blue.100' } },
        },
      },
    })

    const assigned = card.slot.assignTo('input', button)
    expect(assigned).toMatchInlineSnapshot(`
      {
        "base": {},
        "cast": [Function],
        "className": "card",
        "extend": [Function],
        "merge": [Function],
        "omit": [Function],
        "pick": [Function],
        "slot": {
          "add": [Function],
          "assignTo": [Function],
          "omit": [Function],
          "pick": [Function],
        },
        "slots": [
          "root",
          "input",
          "icon",
        ],
        "variants": {
          "variant": {
            "subtle": {
              "root": {
                "color": "blue.100",
              },
            },
          },
        },
      }
    `)

    expectTypeOf(assigned).toMatchTypeOf<
      SlotRecipeBuilder<
        'root' | 'input' | 'icon',
        {
          variant: {
            subtle: { root: { color: 'blue.100' } }
          }
        }
      >
    >()
  })
})
