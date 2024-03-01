import { describe, expect, test } from 'vitest'
import { createUtopia, generateSizes } from '../src/utopia'

test('generateSizes', () => {
  expect(generateSizes(1, 1)).toMatchInlineSnapshot(`
    [
      "xs",
      "sm",
      "md",
    ]
  `)
  expect(generateSizes(2, 2)).toMatchInlineSnapshot(`
    [
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
    ]
  `)
  expect(generateSizes(1, 3)).toMatchInlineSnapshot(`
    [
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
    ]
  `)
  expect(generateSizes(2, 3)).toMatchInlineSnapshot(`
    [
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
    ]
  `)
  expect(generateSizes(3, 3)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
    ]
  `)
  expect(generateSizes(3, 4)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
    ]
  `)
  expect(generateSizes(3, 5)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
    ]
  `)
  expect(generateSizes(3, 6)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
    ]
  `)
  expect(generateSizes(6, 6)).toMatchInlineSnapshot(`
    [
      "6xs",
      "5xs",
      "4xs",
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
    ]
  `)
})

describe('spacing', () => {
  test('1 1', () => {
    expect(generateSizes(1, 1)).toMatchInlineSnapshot(`
    [
      "xs",
      "sm",
      "md",
    ]
  `)

    expect(createUtopia({ space: { negativeSteps: [0.5], positiveSteps: [1.5] } }).theme?.extend?.tokens?.spacing)
      .toMatchInlineSnapshot(`
      {
        "md": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "sm": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "xs": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
      }
    `)
  })

  test('2 2', () => {
    expect(generateSizes(2, 2)).toMatchInlineSnapshot(`
    [
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
    ]
  `)

    expect(
      createUtopia({ space: { negativeSteps: [0.75, 0.5], positiveSteps: [1.5, 2] } }).theme?.extend?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
    {
      "2xs": {
        "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
      },
      "lg": {
        "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
      },
      "md": {
        "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
      },
      "sm": {
        "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
      },
      "xs": {
        "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
      },
    }
  `)
  })

  test('3 3', () => {
    expect(generateSizes(3, 3)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
    ]
  `)

    expect(
      createUtopia({ space: { negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3] } }).theme?.extend?.tokens
        ?.spacing,
    ).toMatchInlineSnapshot(`
    {
      "2xs": {
        "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
      },
      "3xs": {
        "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
      },
      "lg": {
        "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
      },
      "md": {
        "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
      },
      "sm": {
        "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
      },
      "xl": {
        "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
      },
      "xs": {
        "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
      },
    }
  `)
  })

  test('3 4', () => {
    expect(generateSizes(3, 4)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
    ]
  `)

    expect(
      createUtopia({ space: { negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3, 4] } }).theme?.extend?.tokens
        ?.spacing,
    ).toMatchInlineSnapshot(`
    {
      "2xl": {
        "value": "clamp(64px, 60.8px + 1vi, 80px)",
      },
      "2xs": {
        "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
      },
      "3xs": {
        "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
      },
      "lg": {
        "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
      },
      "md": {
        "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
      },
      "sm": {
        "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
      },
      "xl": {
        "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
      },
      "xs": {
        "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
      },
    }
  `)
  })

  test('3 5', () => {
    expect(generateSizes(3, 5)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
    ]
  `)

    expect(
      createUtopia({ space: { negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3, 4, 6] } }).theme?.extend
        ?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
    {
      "2xl": {
        "value": "clamp(64px, 60.8px + 1vi, 80px)",
      },
      "2xs": {
        "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
      },
      "3xl": {
        "value": "clamp(96px, 91.2px + 1.5vi, 120px)",
      },
      "3xs": {
        "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
      },
      "lg": {
        "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
      },
      "md": {
        "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
      },
      "sm": {
        "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
      },
      "xl": {
        "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
      },
      "xs": {
        "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
      },
    }
  `)
  })

  test('3 6', () => {
    expect(generateSizes(3, 6)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
    ]
  `)

    expect(
      createUtopia({ space: { negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3, 4, 6, 8] } }).theme?.extend
        ?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
    {
      "2xl": {
        "value": "clamp(64px, 60.8px + 1vi, 80px)",
      },
      "2xs": {
        "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
      },
      "3xl": {
        "value": "clamp(96px, 91.2px + 1.5vi, 120px)",
      },
      "3xs": {
        "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
      },
      "4xl": {
        "value": "clamp(128px, 121.6px + 2vi, 160px)",
      },
      "lg": {
        "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
      },
      "md": {
        "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
      },
      "sm": {
        "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
      },
      "xl": {
        "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
      },
      "xs": {
        "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
      },
    }
  `)
  })

  test('6 6', () => {
    expect(generateSizes(6, 6)).toMatchInlineSnapshot(`
    [
      "6xs",
      "5xs",
      "4xs",
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
    ]
  `)

    expect(
      createUtopia({
        space: { negativeSteps: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625], positiveSteps: [1.5, 2, 3, 4, 6, 8] },
      }).theme?.extend?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
    {
      "2xl": {
        "value": "clamp(64px, 60.8px + 1vi, 80px)",
      },
      "2xs": {
        "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
      },
      "3xl": {
        "value": "clamp(96px, 91.2px + 1.5vi, 120px)",
      },
      "3xs": {
        "value": "clamp(2px, 1.8px + 0.0625vi, 3px)",
      },
      "4xl": {
        "value": "clamp(128px, 121.6px + 2vi, 160px)",
      },
      "4xs": {
        "value": "clamp(1px, 1px + 0vi, 1px)",
      },
      "5xs": {
        "value": "clamp(1px, 1px + 0vi, 1px)",
      },
      "6xs": {
        "value": "clamp(0px, 0px + 0vi, 0px)",
      },
      "lg": {
        "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
      },
      "md": {
        "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
      },
      "sm": {
        "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
      },
      "xl": {
        "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
      },
      "xs": {
        "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
      },
    }
  `)
  })
})

describe('spacing - index', () => {
  const format = 'index'

  test('1 1', () => {
    expect(generateSizes(1, 1)).toMatchInlineSnapshot(`
    [
      "xs",
      "sm",
      "md",
    ]
  `)

    expect(
      createUtopia({ space: { format, negativeSteps: [0.5], positiveSteps: [1.5] } }).theme?.extend?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "2": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "3": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
      }
    `)
  })

  test('2 2', () => {
    expect(generateSizes(2, 2)).toMatchInlineSnapshot(`
    [
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
    ]
  `)

    expect(
      createUtopia({ space: { format, negativeSteps: [0.75, 0.5], positiveSteps: [1.5, 2] } }).theme?.extend?.tokens
        ?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "2": {
          "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
        },
        "3": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "4": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "5": {
          "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
        },
      }
    `)
  })

  test('3 3', () => {
    expect(generateSizes(3, 3)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
    ]
  `)

    expect(
      createUtopia({ space: { format, negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3] } }).theme?.extend
        ?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
        },
        "2": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "3": {
          "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
        },
        "4": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "5": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "6": {
          "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
        },
        "7": {
          "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
        },
      }
    `)
  })

  test('3 4', () => {
    expect(generateSizes(3, 4)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
    ]
  `)

    expect(
      createUtopia({ space: { format, negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3, 4] } }).theme?.extend
        ?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
        },
        "2": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "3": {
          "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
        },
        "4": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "5": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "6": {
          "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
        },
        "7": {
          "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
        },
        "8": {
          "value": "clamp(64px, 60.8px + 1vi, 80px)",
        },
      }
    `)
  })

  test('3 5', () => {
    expect(generateSizes(3, 5)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
    ]
  `)

    expect(
      createUtopia({ space: { format, negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3, 4, 6] } }).theme
        ?.extend?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
        },
        "2": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "3": {
          "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
        },
        "4": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "5": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "6": {
          "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
        },
        "7": {
          "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
        },
        "8": {
          "value": "clamp(64px, 60.8px + 1vi, 80px)",
        },
        "9": {
          "value": "clamp(96px, 91.2px + 1.5vi, 120px)",
        },
      }
    `)
  })

  test('3 6', () => {
    expect(generateSizes(3, 6)).toMatchInlineSnapshot(`
    [
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
    ]
  `)

    expect(
      createUtopia({ space: { format, negativeSteps: [0.75, 0.5, 0.25], positiveSteps: [1.5, 2, 3, 4, 6, 8] } }).theme
        ?.extend?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
        },
        "10": {
          "value": "clamp(128px, 121.6px + 2vi, 160px)",
        },
        "2": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "3": {
          "value": "clamp(12px, 11.4px + 0.1875vi, 15px)",
        },
        "4": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "5": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "6": {
          "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
        },
        "7": {
          "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
        },
        "8": {
          "value": "clamp(64px, 60.8px + 1vi, 80px)",
        },
        "9": {
          "value": "clamp(96px, 91.2px + 1.5vi, 120px)",
        },
      }
    `)
  })

  test('6 6', () => {
    expect(generateSizes(6, 6)).toMatchInlineSnapshot(`
    [
      "6xs",
      "5xs",
      "4xs",
      "3xs",
      "2xs",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
    ]
  `)

    expect(
      createUtopia({
        space: {
          format,
          negativeSteps: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625],
          positiveSteps: [1.5, 2, 3, 4, 6, 8],
        },
      }).theme?.extend?.tokens?.spacing,
    ).toMatchInlineSnapshot(`
      {
        "1": {
          "value": "clamp(0px, 0px + 0vi, 0px)",
        },
        "10": {
          "value": "clamp(48px, 45.6px + 0.75vi, 60px)",
        },
        "11": {
          "value": "clamp(64px, 60.8px + 1vi, 80px)",
        },
        "12": {
          "value": "clamp(96px, 91.2px + 1.5vi, 120px)",
        },
        "13": {
          "value": "clamp(128px, 121.6px + 2vi, 160px)",
        },
        "2": {
          "value": "clamp(1px, 1px + 0vi, 1px)",
        },
        "3": {
          "value": "clamp(1px, 1px + 0vi, 1px)",
        },
        "4": {
          "value": "clamp(2px, 1.8px + 0.0625vi, 3px)",
        },
        "5": {
          "value": "clamp(4px, 3.8px + 0.0625vi, 5px)",
        },
        "6": {
          "value": "clamp(8px, 7.6px + 0.125vi, 10px)",
        },
        "7": {
          "value": "clamp(16px, 15.2px + 0.25vi, 20px)",
        },
        "8": {
          "value": "clamp(24px, 22.8px + 0.375vi, 30px)",
        },
        "9": {
          "value": "clamp(32px, 30.4px + 0.5vi, 40px)",
        },
      }
    `)
  })
})
