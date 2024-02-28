import { format } from 'prettier'
import { test, expect, describe } from 'vitest'
import * as pandaPlugin from '../src/plugin'
import type { PluginOptions } from '../src/options'

const run = (code: string, options?: Partial<PluginOptions>) =>
  format(code.trim(), {
    ...options,
    pandaCwd: __dirname,
    //
    parser: 'typescript',
    plugins: [pandaPlugin],
  })

describe('JSX style props', () => {
  test('sort style props', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";

  const App = ({ onClick }: { onClick: () => void }) => {
    return (
      <Box bgColor="red" p="4" mx="2" width="120" mt="4">
        Hello
      </Box>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          <Box width="120" mx="2" mt="4" p="4" bgColor="red">
            Hello
          </Box>
        );
      };
      "
    `)
  })

  test('sort style props inside css', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";

  const App = ({ onClick }: { onClick: () => void }) => {
    return (
      <Box css={{ bgColor: "red", p: "4", mx: "2", width: "120", mt: "4" }}>
        Hello
      </Box>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          <Box css={{ width: "120", mx: "2", mt: "4", p: "4", bgColor: "red" }}>
            Hello
          </Box>
        );
      };
      "
    `)
  })

  test('leave spread where they are', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";

  const App = (props) => {
    return (
      <Box bgColor="red" {...props} p="4" mx="2" width="120" mt="4">
        Hello
      </Box>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";

      const App = (props) => {
        return (
          <Box bgColor="red" {...props} width="120" mx="2" mt="4" p="4">
            Hello
          </Box>
        );
      };
      "
    `)
  })

  test('// prettier-ignore', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";

  const App = ({ onClick }: { onClick: () => void }) => {
    return (
      // prettier-ignore
      <Box bgColor="red" p="4" mx="2" width="120" mt="4">
        Hello
      </Box>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          // prettier-ignore
          <Box bgColor="red" p="4" mx="2" width="120" mt="4">
              Hello
            </Box>
        );
      };
      "
    `)
  })

  test('Sorted style props', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";

  <Box key={key} as="div" m="1" px="2" onClick={onClick} {...props} py={2} fontSize="md">Hello</Box>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";

      <Box
        as="div"
        m="1"
        py={2}
        px="2"
        fontSize="md"
        key={key}
        onClick={onClick}
        {...props}
      >
        Hello
      </Box>;
      "
    `)
  })

  test('Not panda element', async () => {
    const code = `
  import { NotPanda } from "not-panda";
  <NotPanda m="1" fontSize="md" px="2" py={2}>Hello</NotPanda>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { NotPanda } from "not-panda";
      <NotPanda m="1" fontSize="md" px="2" py={2}>
        Hello
      </NotPanda>;
      "
    `)
  })

  test('Spreading should not be sorted', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box py="2" {...props} as="div">Hello</Box>;
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box py="2" {...props} as="div">
        Hello
      </Box>;
      "
    `)
  })

  test('Last priority of style props should be placed before `other props`', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box outline='outline' aaaa>Hello</Box>;
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box outline="outline" aaaa>
        Hello
      </Box>;
      "
    `)
  })

  test('Not sorted', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box px="2" as="div" onClick={onClick} m="1" key={key} {...props} fontSize="md" py={2}>Hello</Box>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box
        as="div"
        m="1"
        py={2}
        px="2"
        fontSize="md"
        key={key}
        onClick={onClick}
        {...props}
      >
        Hello
      </Box>;
      "
    `)
  })

  test('Multiple lines must not be concatenated', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    px="2"
    as="div"
    fontSize="md"
    py={2}
  >
    Hello
  </Box>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box as="div" py={2} px="2" fontSize="md">
        Hello
      </Box>;
      "
    `)
  })

  test('`Other Props` should be sorted in alphabetical order', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box onClick={onClick} data-test-id="data-test-id" data-index={1}>Hello</Box>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box data-index={1} data-test-id="data-test-id" onClick={onClick}>
        Hello
      </Box>;
      "
    `)
  })

  test('`Style Props` of same group should be sorted in defined order, not alphabetical', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box css={css} textStyle={textStyle} layerStyle={layerStyle} as={as}>Hello</Box>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box as={as} layerStyle={layerStyle} textStyle={textStyle} css={css}>
        Hello
      </Box>;
      "
    `)
  })

  test('`Style Props` of same group should be sorted in defined order, not alphabetical', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    animation="animation"
    appearance="appearance"
    transform="transform"
    visibility="visibility"
    resize="resize"
    whiteSpace="whiteSpace"
    pointerEvents="pointerEvents"
    wordBreak="wordBreak"
    overflowWrap="overflowWrap"
    textOverflow="textOverflow"
    boxSizing="boxSizing"
    transformOrigin="transformOrigin"
    cursor="cursor"
    transition="transition"
    objectFit="objectFit"
    userSelect="userSelect"
    objectPosition="objectPosition"
    float="float"
    outline="outline"
  >
    Same priority should be sorted in defined order
  </Box>;
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box
        boxSizing="boxSizing"
        visibility="visibility"
        appearance="appearance"
        float="float"
        transformOrigin="transformOrigin"
        objectPosition="objectPosition"
        objectFit="objectFit"
        outline="outline"
        textOverflow="textOverflow"
        wordBreak="wordBreak"
        userSelect="userSelect"
        transition="transition"
        animation="animation"
        cursor="cursor"
        overflowWrap="overflowWrap"
        pointerEvents="pointerEvents"
        resize="resize"
        transform="transform"
        whiteSpace="whiteSpace"
      >
        Same priority should be sorted in defined order
      </Box>;
      "
    `)
  })

  test('Different priorities should be sorted by priorities', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    as={as}
    _hover={_hover}
    position={position}
    shadow={shadow}
    animation={animation}
    m={m}
    data-test-id={dataTestId}
    flex={flex}
    color={color}
    fontFamily={fontFamily}
    bg={bg}
    w={w}
    h={h}
    display={display}
    borderRadius={borderRadius}
    p={p}
    gridGap={gridGap}
  >
    Hello
  </Box>;
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box
        as={as}
        display={display}
        position={position}
        flex={flex}
        gridGap={gridGap}
        borderRadius={borderRadius}
        w={w}
        h={h}
        m={m}
        p={p}
        color={color}
        fontFamily={fontFamily}
        bg={bg}
        shadow={shadow}
        animation={animation}
        _hover={_hover}
        data-test-id={dataTestId}
      >
        Hello
      </Box>;
      "
    `)
  })

  test('Default reservedProps should be sorted', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    key={key}
    className={className}
    dangerouslySetInnerHtml={dangerouslySetInnerHtml}
    ref={ref}
  >
    Hello
  </Box>;
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box
        className={className}
        dangerouslySetInnerHtml={dangerouslySetInnerHtml}
        key={key}
        ref={ref}
      >
        Hello
      </Box>;
      "
    `)
  })

  test('Different type of props should be sorted in order, except componentSpecificProps', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    aria-label="aria-label"
    // variant={variant}
    className={className}
    p={p}
  >
    Hello
  </Box>;
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box
        p={p}
        aria-label="aria-label"
        // variant={variant}
        className={className}
      >
        Hello
      </Box>;
      "
    `)
  })

  test('if keys are `Other Props`, they should be sorted in alphabetical order', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    className={className}
    key={key}
    ref={ref}
    aria-label="aria-label"
  >
    Hello
  </Box>;
  `

    expect(await run(code, { firstProps: [] })).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box aria-label="aria-label" className={className} key={key} ref={ref}>
        Hello
      </Box>;
      "
    `)
  })

  test('if lastProps is specified, that must be the last.', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    className={className}
    onClick={onClick}
    bg={bg}
    aria-label="aria-label"
  >
    onClick should be the last
  </Box>;
  `

    expect(await run(code, { lastProps: ['onClick', 'aria-label'] })).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box bg={bg} className={className} onClick={onClick} aria-label="aria-label">
        onClick should be the last
      </Box>;
      "
    `)
  })

  test('if same property is set for both firstProps and lastProps, that of lastProps will be ignored.', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  <Box
    onClick={onClick}
    bg={bg}
    aria-label="aria-label"
  >
    If the same key is given different priorities in option, ignore all but the first.
  </Box>;
  `

    expect(
      await run(code, {
        lastProps: ['onClick', 'aria-label'],
        firstProps: ['onClick', 'aria-label'],
      }),
    ).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box onClick={onClick} aria-label="aria-label" bg={bg}>
        If the same key is given different priorities in option, ignore all but the
        first.
      </Box>;
      "
    `)
  })
})

describe('Call Expression css(xxx) arguments', () => {
  test('sort style props', async () => {
    const code = `
  import { css } from '../styled-system/css'

  const App = () => {
    return (
      <div className={css({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })} />
    )
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const App = () => {
        return (
          <div
            className={css({ width: "120", m: "2", mt: "4", p: "4", bgColor: "red" })}
          />
        );
      };
      "
    `)
  })

  test('leave spread where they are', async () => {
    const code = `
    import { css } from '../styled-system/css'

  const App = (props) => {
    return (
      <div className={css({ bgColor: "red", ...props, p: "4", mx: "2", width: "120", mt: "4" })}>
        Hello
      </div>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const App = (props) => {
        return (
          <div
            className={css({
              bgColor: "red",
              ...props,
              width: "120",
              mx: "2",
              mt: "4",
              p: "4",
            })}
          >
            Hello
          </div>
        );
      };
      "
    `)
  })

  test('// prettier-ignore', async () => {
    const code = `
  import { css } from "../styled-system/css";

  const App = ({ onClick }: { onClick: () => void }) => {
    return (
      // prettier-ignore
      <div className={css({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })}>
        Hello
      </div>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          // prettier-ignore
          <div className={css({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })}>
              Hello
            </div>
        );
      };
      "
    `)
  })

  test('Sorted style props', async () => {
    const code = `
  import { css } from '../styled-system/css'

  const App = () => {
    return (
      <div key={key} className={(css({ m: "1", px: "2", py: "2", fontSize: "md" }))}>
        Hello
      </div>
    )
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const App = () => {
        return (
          <div
            key={key}
            className={css({ m: "1", py: "2", px: "2", fontSize: "md" })}
          >
            Hello
          </div>
        );
      };
      "
    `)
  })

  test('Not panda fn', async () => {
    const code = `
  import { css } from "not-panda";
  <div className={css({ m: "1", fontSize: "md", px: "2", py: "2" })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "not-panda";
      <div className={css({ m: "1", fontSize: "md", px: "2", py: "2" })}>Hello</div>;
      "
    `)
  })

  test('Spreading should not be sorted', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ py: "2", ...props, as: "div" })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div className={css({ py: "2", ...props, as: "div" })}>Hello</div>;
      "
    `)
  })

  test('Last priority of style props should be placed before `other props`', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ outline: "outline", aaaa: "aaaa" })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div className={css({ outline: "outline", aaaa: "aaaa" })}>Hello</div>;
      "
    `)
  })

  test('Not sorted', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ px: "2", as: "div", onClick: onClick, m: "1", key: key, ...props, fontSize: "md", py: "2" })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          as: "div",
          m: "1",
          py: "2",
          px: "2",
          fontSize: "md",
          key: key,
          onClick: onClick,
          ...props,
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('Multiple lines must not be concatenated', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ px: "2", fontSize: "md", py: "2" })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div className={css({ py: "2", px: "2", fontSize: "md" })}>Hello</div>;
      "
    `)
  })

  test('`Other Props` should be sorted in alphabetical order', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ onClick: onClick, dataTestId: dataTestId, dataIndex: 1, })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({ dataIndex: 1, dataTestId: dataTestId, onClick: onClick })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('`Style Props` of same group should be sorted in defined order, not alphabetical', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ css: css, textStyle: textStyle, layerStyle: layerStyle, as: as })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          as: as,
          layerStyle: layerStyle,
          textStyle: textStyle,
          css: css,
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('`Style Props` of same group should be sorted in defined order, not alphabetical', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ animation: "animation", appearance: "appearance", transform: "transform", visibility: "visibility", resize: "resize", whiteSpace: "whiteSpace", pointerEvents: "pointerEvents", wordBreak: "wordBreak", overflowWrap: "overflowWrap", textOverflow: "textOverflow", boxSizing: "boxSizing", transformOrigin: "transformOrigin", cursor: "cursor", transition: "transition", objectFit: "objectFit", userSelect: "userSelect", objectPosition: "objectPosition", float: "float", outline: "outline" })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          boxSizing: "boxSizing",
          visibility: "visibility",
          appearance: "appearance",
          float: "float",
          transformOrigin: "transformOrigin",
          objectPosition: "objectPosition",
          objectFit: "objectFit",
          outline: "outline",
          textOverflow: "textOverflow",
          wordBreak: "wordBreak",
          userSelect: "userSelect",
          transition: "transition",
          animation: "animation",
          cursor: "cursor",
          overflowWrap: "overflowWrap",
          pointerEvents: "pointerEvents",
          resize: "resize",
          transform: "transform",
          whiteSpace: "whiteSpace",
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('Different priorities should be sorted by priorities', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ as: as, _hover: _hover, position: position, shadow: shadow, animation: animation, m: m, dataTestId: dataTestId, flex: flex, color: color, fontFamily: fontFamily, bg: bg, w: w, h: h, display: display, borderRadius: borderRadius, p: p, gridGap: gridGap })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          as: as,
          display: display,
          position: position,
          flex: flex,
          gridGap: gridGap,
          borderRadius: borderRadius,
          w: w,
          h: h,
          m: m,
          p: p,
          color: color,
          fontFamily: fontFamily,
          bg: bg,
          shadow: shadow,
          animation: animation,
          _hover: _hover,
          dataTestId: dataTestId,
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('Default reservedProps should be sorted', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ key: key, className: className, dangerouslySetInnerHTML: dangerouslySetInnerHTML, ref: ref })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          className: className,
          dangerouslySetInnerHTML: dangerouslySetInnerHTML,
          key: key,
          ref: ref,
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('Different type of props should be sorted in order, except componentSpecificProps', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ ariaLabel: "ariaLabel", variant: variant, className: className, p: p })}>
    Hello
  </div>
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          p: p,
          ariaLabel: "ariaLabel",
          className: className,
          variant: variant,
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('if keys are `Other Props`, they should be sorted in alphabetical order', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ className: className, key: key, ref: ref, ariaLabel: "ariaLabel" })}>
    Hello
  </div>
  `

    expect(await run(code, { firstProps: [] })).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          ariaLabel: "ariaLabel",
          className: className,
          key: key,
          ref: ref,
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('if lastProps is specified, that must be the last.', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ className: className, onClick: onClick, bg: bg, ariaLabel: "ariaLabel" })}>
    onClick should be the last
  </div>
  `

    expect(await run(code, { lastProps: ['onClick', 'ariaLabel'] })).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          bg: bg,
          className: className,
          onClick: onClick,
          ariaLabel: "ariaLabel",
        })}
      >
        onClick should be the last
      </div>;
      "
    `)
  })

  test('if same property is set for both firstProps and lastProps, that of lastProps will be ignored.', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ onClick: onClick, bg: bg, ariaLabel: "ariaLabel" })}>
    If the same key is given different priorities in option, ignore all but the first.
  </div>
  `

    expect(
      await run(code, {
        lastProps: ['onClick', 'ariaLabel'],
        firstProps: ['onClick', 'ariaLabel'],
      }),
    ).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div className={css({ onClick: onClick, ariaLabel: "ariaLabel", bg: bg })}>
        If the same key is given different priorities in option, ignore all but the
        first.
      </div>;
      "
    `)
  })
})

describe('jsx specifics', () => {
  test('styled factory', async () => {
    const code = `
  import { styled } from "../styled-system/jsx";

  const App = ({ onClick }: { onClick: () => void }) => {
    return (
      <styled.div bgColor="red" p="4" mx="2" width="120" mt="4">
        Hello
      </styled.div>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { styled } from "../styled-system/jsx";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          <styled.div width="120" mx="2" mt="4" p="4" bgColor="red">
            Hello
          </styled.div>
        );
      };
      "
    `)
  })

  test('styled factory aliased', async () => {
    const code = `
  import { styled as panda } from "../styled-system/jsx";

  const App = ({ onClick }: { onClick: () => void }) => {
    return (
      <panda.div bgColor="red" p="4" mx="2" width="120" mt="4">
        Hello
      </panda.div>
    );
  }
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { styled as panda } from "../styled-system/jsx";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          <panda.div width="120" mx="2" mt="4" p="4" bgColor="red">
            Hello
          </panda.div>
        );
      };
      "
    `)
  })
})

describe('call expression specifics', () => {
  test('sort style props for css.raw', async () => {
    const code = `
  import { css } from '../styled-system/css'

  const styles = css.raw({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const styles = css.raw({
        width: "120",
        m: "2",
        mt: "4",
        p: "4",
        bgColor: "red",
      });
      "
    `)
  })

  test('patterns - stack / stack.raw', async () => {
    const code = `
  import { stack } from '../styled-system/patterns'

  const styles = stack.raw({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })
  const className = stack({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { stack } from "../styled-system/patterns";

      const styles = stack.raw({
        width: "120",
        m: "2",
        mt: "4",
        p: "4",
        bgColor: "red",
      });
      const className = stack({
        width: "120",
        m: "2",
        mt: "4",
        p: "4",
        bgColor: "red",
      });
      "
    `)
  })

  test('ignore invalid pattern', async () => {
    const code = `
  import { stack } from 'not-panda'

  const styles = stack.raw({ bgColor: "red", p: "4", m: "2", width: "120", mt: "4" })
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { stack } from "not-panda";

      const styles = stack.raw({
        bgColor: "red",
        p: "4",
        m: "2",
        width: "120",
        mt: "4",
      });
      "
    `)
  })
})
