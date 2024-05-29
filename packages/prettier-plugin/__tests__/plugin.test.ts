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
        key={key}
        onClick={onClick}
        m="1"
        px="2"
        {...props}
        py={2}
        fontSize="md"
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
      <NotPanda m="1" py={2} px="2" fontSize="md">
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
      <Box aaaa outline="outline">
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
        onClick={onClick}
        key={key}
        m="1"
        px="2"
        {...props}
        py={2}
        fontSize="md"
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
      <Box onClick={onClick} data-test-id="data-test-id" data-index={1}>
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
        transform="transform"
        resize="resize"
        whiteSpace="whiteSpace"
        pointerEvents="pointerEvents"
        overflowWrap="overflowWrap"
        cursor="cursor"
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
        data-test-id={dataTestId}
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
        ref={ref}
        className={className}
        key={key}
        dangerouslySetInnerHtml={dangerouslySetInnerHtml}
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
        // variant={variant}
        className={className}
        aria-label="aria-label"
        p={p}
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

    expect(await run(code, { pandaFirstProps: [] })).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box ref={ref} className={className} key={key} aria-label="aria-label">
        Hello
      </Box>;
      "
    `)
  })

  test('if pandaLastProps is specified, that must be the last.', async () => {
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

    expect(await run(code, { pandaLastProps: ['onClick', 'aria-label'] })).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      <Box className={className} bg={bg} onClick={onClick} aria-label="aria-label">
        onClick should be the last
      </Box>;
      "
    `)
  })

  test('if same property is set for both pandaFirstProps and pandaLastProps, that of pandaLastProps will be ignored.', async () => {
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
        pandaLastProps: ['onClick', 'aria-label'],
        pandaFirstProps: ['onClick', 'aria-label'],
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

  test('options.pandaIgnoreComponents', async () => {
    const code = `
  import { Box } from "../styled-system/jsx";
  import { DataTable } from "../src/components";

  const App = () => {
    return <>
    <Box
    className={className}
    onClick={onClick}
    bg={bg}
    aria-label="aria-label"
  >
    onClick should be the last
    DataTable shouldnt be sorted
    <DataTable className={className}
    onClick={onClick} columns={columns} data={data} />
  </Box>
    </>
  }
  `

    expect(await run(code, { pandaIgnoreComponents: ['DataTable'] })).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";
      import { DataTable } from "../src/components";

      const App = () => {
        return (
          <>
            <Box
              className={className}
              onClick={onClick}
              aria-label="aria-label"
              bg={bg}
            >
              onClick should be the last DataTable shouldnt be sorted
              <DataTable
                className={className}
                onClick={onClick}
                columns={columns}
                data={data}
              />
            </Box>
          </>
        );
      };
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
      <div className={css({ aaaa: "aaaa", outline: "outline" })}>Hello</div>;
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
          onClick: onClick,
          key: key,
          m: "1",
          px: "2",
          ...props,
          py: "2",
          fontSize: "md",
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
        className={css({ onClick: onClick, dataTestId: dataTestId, dataIndex: 1 })}
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
          transform: "transform",
          resize: "resize",
          whiteSpace: "whiteSpace",
          pointerEvents: "pointerEvents",
          overflowWrap: "overflowWrap",
          cursor: "cursor",
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
          dataTestId: dataTestId,
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
          ref: ref,
          className: className,
          key: key,
          dangerouslySetInnerHTML: dangerouslySetInnerHTML,
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
          className: className,
          ariaLabel: "ariaLabel",
          variant: variant,
          p: p,
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

    expect(await run(code, { pandaFirstProps: [] })).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          ref: ref,
          className: className,
          key: key,
          ariaLabel: "ariaLabel",
        })}
      >
        Hello
      </div>;
      "
    `)
  })

  test('if pandaLastProps is specified, that must be the last.', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ className: className, onClick: onClick, bg: bg, ariaLabel: "ariaLabel" })}>
    onClick should be the last
  </div>
  `

    expect(await run(code, { pandaLastProps: ['onClick', 'ariaLabel'] })).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";
      <div
        className={css({
          className: className,
          bg: bg,
          onClick: onClick,
          ariaLabel: "ariaLabel",
        })}
      >
        onClick should be the last
      </div>;
      "
    `)
  })

  test('if same property is set for both pandaFirstProps and pandaLastProps, that of pandaLastProps will be ignored.', async () => {
    const code = `
  import { css } from "../styled-system/css";
  <div className={css({ onClick: onClick, bg: bg, ariaLabel: "ariaLabel" })}>
    If the same key is given different priorities in option, ignore all but the first.
  </div>
  `

    expect(
      await run(code, {
        pandaLastProps: ['onClick', 'ariaLabel'],
        pandaFirstProps: ['onClick', 'ariaLabel'],
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

  test('custom pandaGroupOrder', async () => {
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

    expect(
      await run(code, {
        pandaGroupOrder: [
          'Padding', // changed
          'System',
          'Container',
          'Display',
          'Visibility',
          'Position',
          'Transform',
          'Flex Layout',
          'Grid Layout',
          'Layout',
          'Border',
          'Border Radius',
          'Background', // changed
          'Margin', // changed
          'Height',
          'Color',
          'Typography',
          'Shadow',
          'Table',
          'List',
          'Scroll',
          'Interactivity',
          'Transition',
          'Effect',
          'Other',
          'Conditions',
          'Arbitrary conditions',
          'Css',
          'Width', // changed
        ],
      }),
    ).toMatchInlineSnapshot(`
      "import { Box } from "../styled-system/jsx";

      const App = ({ onClick }: { onClick: () => void }) => {
        return (
          <Box p="4" bgColor="red" mx="2" mt="4" width="120">
            Hello
          </Box>
        );
      };
      "
    `)
  })

  test('sort arbitrary conditions last', async () => {
    const code = `
    import { css } from '../styled-system/css'

    const styles = css({
      '&[data-disabled]': {
        backgroundColor: 'gray',
        color: 'black',
      },
      color: 'white',
      ...props,
      _hover: {
        backgroundColor: 'darkblue',
      },
      backgroundColor: 'blue',
    });
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const styles = css({
        color: "white",
        "&[data-disabled]": {
          color: "black",
          backgroundColor: "gray",
        },
        ...props,
        backgroundColor: "blue",
        _hover: {
          backgroundColor: "darkblue",
        },
      });
      "
    `)
  })

  test('sort nested objects (conditionals)', async () => {
    const code = `
    import { css } from '../styled-system/css'

    const styles = css({
      '&[data-disabled]': {
        fontSize: '2xl',
        backgroundColor: 'gray',
        color: 'black',
        height: '2rem',
        md: {
          _hover: {
            fontSize: '2xl',
            backgroundColor: 'gray',
            color: 'black',
            height: '2rem',
          },
          color: "white",
        }
      },
      _hover: {
        fontSize: '2xl',
        backgroundColor: 'gray',
        color: 'black',
        height: '2rem',
      },
    });
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { css } from "../styled-system/css";

      const styles = css({
        _hover: {
          height: "2rem",
          color: "black",
          fontSize: "2xl",
          backgroundColor: "gray",
        },
        "&[data-disabled]": {
          height: "2rem",
          color: "black",
          fontSize: "2xl",
          backgroundColor: "gray",
          md: {
            color: "white",
            _hover: {
              height: "2rem",
              color: "black",
              fontSize: "2xl",
              backgroundColor: "gray",
            },
          },
        },
      });
      "
    `)
  })

  test('sort cva', async () => {
    const code = `
    import { cva } from '../styled-system/css'

    const buttonStyle = cva({
      defaultVariants: {
        size: 'md',
        variant: 'solid',
      },
      base: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'inline-flex',
      },
      variants: {
        size: {
          sm: {
            padding: '0 0.5rem',
            height: '2.5rem',
            minWidth: '2.5rem',
            textStyle: 'headline.h1',
          },
          md: {
            padding: '0 0.75rem',
            minWidth: '3rem',
            height: '3rem',
          },
        },
        variant: {
          solid: {
            '&[data-disabled]': {
              backgroundColor: 'gray',
              color: 'black',
            },
            color: 'white',
            _hover: {
              backgroundColor: 'darkblue',
            },
            backgroundColor: 'blue',
          },
          outline: {
            '&:focus': {
              color: 'white',
              fontSize: '2xl',
              height: '2rem',
            },
            border: '1px solid blue',
            color: 'blue',
            '&[data-disabled]': {
              backgroundColor: 'transparent',
              border: '1px solid gray',
              color: 'gray',
            },
            _hover: {
              backgroundColor: 'blue',
              color: 'white',
            },
            '&:disabled': {
              opacity: '0.5',
            },
            backgroundColor: 'transparent',
          },
        },
      },
    })
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import { cva } from "../styled-system/css";

      const buttonStyle = cva({
        base: {
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
        },
        variants: {
          size: {
            sm: {
              textStyle: "headline.h1",
              minWidth: "2.5rem",
              height: "2.5rem",
              padding: "0 0.5rem",
            },
            md: {
              minWidth: "3rem",
              height: "3rem",
              padding: "0 0.75rem",
            },
          },
          variant: {
            solid: {
              color: "white",
              backgroundColor: "blue",
              _hover: {
                backgroundColor: "darkblue",
              },
              "&[data-disabled]": {
                color: "black",
                backgroundColor: "gray",
              },
            },
            outline: {
              border: "1px solid blue",
              color: "blue",
              backgroundColor: "transparent",
              _hover: {
                color: "white",
                backgroundColor: "blue",
              },
              "&:focus": {
                height: "2rem",
                color: "white",
                fontSize: "2xl",
              },
              "&[data-disabled]": {
                border: "1px solid gray",
                color: "gray",
                backgroundColor: "transparent",
              },
              "&:disabled": {
                opacity: "0.5",
              },
            },
          },
        },
        defaultVariants: {
          size: "md",
          variant: "solid",
        },
      });
      "
    `)
  })

  test('sort defineStyles / defineRecipe', async () => {
    const code = `
    import { defineStyles, defineRecipe, defineSlotRecipe as defineSlotRecipeAlias } from '@pandacss/dev'

    const styles = defineStyles({
      '&[data-disabled]': {
        backgroundColor: 'gray',
        color: 'black',
      },
      color: 'white',
      ...props,
      _hover: {
        backgroundColor: 'darkblue',
      },
      backgroundColor: 'blue',
    });

    const recipe = defineRecipe({
      variants: {},
      base: {
        '&[data-disabled]': {
          backgroundColor: 'gray',
          color: 'black',
        },
        color: 'white',
        ...props,
        _hover: {
          backgroundColor: 'darkblue',
        },
        backgroundColor: 'blue',
      }
    });

    const slotRecipe = defineSlotRecipeAlias({
      base: {
        root: {
          '&[data-disabled]': {
            backgroundColor: 'gray',
            color: 'black',
          },
          color: 'white',
          ...props,
          _hover: {
            backgroundColor: 'darkblue',
          },
          backgroundColor: 'blue',
        },
      },
      slots: ['root', 'input', 'icon'],
      variants: {
        variant: {
          solid: {
            root: {
              backgroundColor: 'red',
              fontSize: 'sm',
              color: 'blue',
              display: "flex"
            }
          },
          outline: { root: { color: 'red' } },
        }
      },
    });
  `

    expect(await run(code)).toMatchInlineSnapshot(`
      "import {
        defineStyles,
        defineRecipe,
        defineSlotRecipe as defineSlotRecipeAlias,
      } from "@pandacss/dev";

      const styles = defineStyles({
        color: "white",
        "&[data-disabled]": {
          color: "black",
          backgroundColor: "gray",
        },
        ...props,
        backgroundColor: "blue",
        _hover: {
          backgroundColor: "darkblue",
        },
      });

      const recipe = defineRecipe({
        base: {
          color: "white",
          "&[data-disabled]": {
            color: "black",
            backgroundColor: "gray",
          },
          ...props,
          backgroundColor: "blue",
          _hover: {
            backgroundColor: "darkblue",
          },
        },
        variants: {},
      });

      const slotRecipe = defineSlotRecipeAlias({
        slots: ["root", "input", "icon"],
        base: {
          root: {
            color: "white",
            "&[data-disabled]": {
              color: "black",
              backgroundColor: "gray",
            },
            ...props,
            backgroundColor: "blue",
            _hover: {
              backgroundColor: "darkblue",
            },
          },
        },
        variants: {
          variant: {
            solid: {
              root: {
                display: "flex",
                color: "blue",
                fontSize: "sm",
                backgroundColor: "red",
              },
            },
            outline: { root: { color: "red" } },
          },
        },
      });
      "
    `)
  })
})

test('always sort _conditions after root style props', async () => {
  const code = `
import { css } from "../styled-system/css";

css({
  _hover: {
    color: "white"
  },
  cursor: "pointer",
})
`

  expect(await run(code)).toMatchInlineSnapshot(`
    "import { css } from "../styled-system/css";

    css({
      cursor: "pointer",
      _hover: {
        color: "white",
      },
    });
    "
  `)
})

test('always sort arbitrary conditions after _conditions', async () => {
  const code = `
import { css } from "../styled-system/css";

css({
  ['&:hover']: {
    color: "black"
  },
  _hover: {
    color: "white"
  },
})
`

  expect(await run(code)).toMatchInlineSnapshot(`
    "import { css } from "../styled-system/css";

    css({
      _hover: {
        color: "white",
      },
      ["&:hover"]: {
        color: "black",
      },
    });
    "
  `)
})

test('always sort base first', async () => {
  const code = `
import { css } from "../styled-system/css";

css({
  _hover: {
    color: "white"
  },
  base: {
    color: "red"
  },
  cursor: "pointer",
  color: "black",
})
`

  expect(await run(code)).toMatchInlineSnapshot(`
    "import { css } from "../styled-system/css";

    css({
      base: {
        color: "red",
      },
      color: "black",
      cursor: "pointer",
      _hover: {
        color: "white",
      },
    });
    "
  `)
})

test('sort patterns specific props near their matching property - stack align direction', async () => {
  const code = `
import { stack } from '../styled-system/patterns'

stack({
  bgColor: "red",
  direction: "column",
  p: "4",
  flexDirection: "row",
  m: "2",
  align: "self",
  width: "120",
  alignItems: "flex-start",
  mt: "4"
})

const App = () => {
  return (
    <Stack
      bgColor="red"
      direction="column"
      p="4"
      flexDirection="row"
      m="2"
      align="self"
      width="120"
      alignItems="flex-start"
      mt="4"
    >
      <span>Hello from Panda</span>
    </Stack>
  )
}
`

  expect(await run(code)).toMatchInlineSnapshot(`
    "import { stack } from "../styled-system/patterns";

    stack({
      direction: "column",
      flexDirection: "row",
      align: "self",
      alignItems: "flex-start",
      width: "120",
      m: "2",
      mt: "4",
      p: "4",
      bgColor: "red",
    });

    const App = () => {
      return (
        <Stack
          direction="column"
          flexDirection="row"
          align="self"
          alignItems="flex-start"
          width="120"
          m="2"
          mt="4"
          p="4"
          bgColor="red"
        >
          <span>Hello from Panda</span>
        </Stack>
      );
    };
    "
  `)
})

test('sort props', async () => {
  const code = `
const App = () => {
  return (
    <IconButton
      title="tw2panda"
      css={{
        borderColor: { base: 'sky.500/25', _hover: 'transparent' },
        borderWidth: '1px',
        w: 'auto',
        px: '2',
        color: { base: 'sky.500', _dark: 'sky.200' },
        colorPalette: 'sky',
      }}
    />
  )
}
`

  expect(await run(code)).toMatchInlineSnapshot(`
    "const App = () => {
      return (
        <IconButton
          title="tw2panda"
          css={{
            colorPalette: "sky",
            borderColor: { base: "sky.500/25", _hover: "transparent" },
            borderWidth: "1px",
            w: "auto",
            px: "2",
            color: { base: "sky.500", _dark: "sky.200" },
          }}
        />
      );
    };
    "
  `)
})

test('pandaStylePropsFirst - true', async () => {
  const code = `
const App = () => {
  return (
    <IconButton
      aria-label="tw2panda"
      title="tw2panda"
      color="red.300"
    />
  )
}
`

  expect(await run(code, { pandaStylePropsFirst: true })).toMatchInlineSnapshot(`
    "const App = () => {
      return <IconButton color="red.300" aria-label="tw2panda" title="tw2panda" />;
    };
    "
  `)
})

test('pandaStylePropsFirst - false', async () => {
  const code = `
const App = () => {
  return (
    <IconButton
      aria-label="tw2panda"
      title="tw2panda"
      color="red.300"
    />
  )
}
`

  expect(await run(code, { pandaStylePropsFirst: false })).toMatchInlineSnapshot(`
    "const App = () => {
      return <IconButton aria-label="tw2panda" title="tw2panda" color="red.300" />;
    };
    "
  `)
})

test('pandaSortOtherProps - true', async () => {
  const code = `
const App = () => {
  return (
    <IconButton
      title="tw2panda"
      aria-label="tw2panda"
      color="red.300"
    />
  )
}
`

  expect(await run(code, { pandaSortOtherProps: true })).toMatchInlineSnapshot(`
    "const App = () => {
      return <IconButton aria-label="tw2panda" title="tw2panda" color="red.300" />;
    };
    "
  `)
})

test('pandaSortOtherProps - false', async () => {
  const code = `
const App = () => {
  return (
    <IconButton
      title="tw2panda"
      aria-label="tw2panda"
      color="red.300"
    />
  )
}
`

  expect(await run(code, { pandaSortOtherProps: false })).toMatchInlineSnapshot(`
    "const App = () => {
      return <IconButton title="tw2panda" aria-label="tw2panda" color="red.300" />;
    };
    "
  `)
})

test('options.pandaFunctions', async () => {
  const code = `
  import { define } from '@weliihq/styled-system/dev';

  export const textarea = define.recipe({
    base: {
      _disabled: {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
      focusRingOffsetColor: 'ui-kit.background',
      border: 'ui-kit.input',
      bgColor: '[transparent]',
      borderRadius: 'ui-kit.md',
      minH: '[80px]',
      px: 'ui-kit.3',

      display: 'flex',
      _placeholder: {
        color: 'ui-kit.muted.foreground',
      },
      w: 'ui-kit.full',

      py: 'ui-kit.2',
      textStyle: 'ui-kit.sm',
      _focusVisible: {
        outline: '[2px solid transparent]',
        outlineOffset: '[2px]',
        focusRingWidth: '2',
        focusRingColor: 'ui-kit.ring',
        focusRingOffsetWidth: '2',
      },
    },
    description: 'Styles for the Textarea component',
    className: 'textarea',
  });

`

  expect(await run(code, { pandaFunctions: ['define.recipe'] })).toMatchInlineSnapshot(`
    "import { define } from "@weliihq/styled-system/dev";

    export const textarea = define.recipe({
      className: "textarea",
      description: "Styles for the Textarea component",
      base: {
        textStyle: "ui-kit.sm",
        focusRingOffsetColor: "ui-kit.background",
        display: "flex",
        border: "ui-kit.input",
        borderRadius: "ui-kit.md",
        w: "ui-kit.full",

        minH: "[80px]",
        py: "ui-kit.2",
        px: "ui-kit.3",

        bgColor: "[transparent]",
        _disabled: {
          opacity: "0.5",
          cursor: "not-allowed",
        },
        _placeholder: {
          color: "ui-kit.muted.foreground",
        },
        _focusVisible: {
          focusRingWidth: "2",
          focusRingColor: "ui-kit.ring",
          focusRingOffsetWidth: "2",
          outline: "[2px solid transparent]",
          outlineOffset: "[2px]",
        },
      },
    });
    "
  `)
})
