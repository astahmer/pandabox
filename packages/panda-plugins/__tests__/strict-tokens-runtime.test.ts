import { createContext } from '#pandabox/fixtures'
import type { Config } from '@pandacss/types'
import { describe, expect, test } from 'vitest'
import { type StrictTokensScopeOptions } from '../src'
import { transformStrictTokensRuntime, type StrictTokensRuntimeConfig } from '../src/strict-tokens-runtime'

const run = (userConfig: Config, options: StrictTokensScopeOptions, config?: StrictTokensRuntimeConfig) => {
  const ctx = createContext(Object.assign({}, userConfig, config))
  const artifacts = ctx.getArtifacts()

  const updated = transformStrictTokensRuntime({ artifacts, changed: undefined }, options)

  const cssFn = updated.find((art) => art.id === 'css-fn')
  const cssFile = cssFn?.files.find((f) => f.file.includes('css'))

  return cssFile
}

describe('strict-tokens-runtime', () => {
  test('empty', () => {
    expect(run({}, { categories: [], props: [] })).toMatchInlineSnapshot(`
      {
        "code": "import { createCss, createMergeCss, hypenateProperty, withoutSpace } from '../helpers.mjs';
      import { sortConditions, finalizeConditions } from './conditions.mjs';

      const utilities = "aspectRatio:aspect,boxDecorationBreak:decoration,zIndex:z,boxSizing:box,objectPosition:object,objectFit:object,overscrollBehavior:overscroll,overscrollBehaviorX:overscroll-x,overscrollBehaviorY:overscroll-y,position:pos/1,top:top,left:left,insetInline:inset-x/insetX,insetBlock:inset-y/insetY,inset:inset,insetBlockEnd:inset-b,insetBlockStart:inset-t,insetInlineEnd:end/insetEnd/1,insetInlineStart:start/insetStart/1,right:right,bottom:bottom,float:float,visibility:vis,display:d,hideFrom:hide,hideBelow:show,flexBasis:basis,flex:flex,flexDirection:flex/flexDir,flexGrow:grow,flexShrink:shrink,gridTemplateColumns:grid-cols,gridTemplateRows:grid-rows,gridColumn:col-span,gridRow:row-span,gridColumnStart:col-start,gridColumnEnd:col-end,gridAutoFlow:grid-flow,gridAutoColumns:auto-cols,gridAutoRows:auto-rows,gap:gap,gridGap:gap,gridRowGap:gap-x,gridColumnGap:gap-y,rowGap:gap-x,columnGap:gap-y,justifyContent:justify,alignContent:content,alignItems:items,alignSelf:self,padding:p/1,paddingLeft:pl/1,paddingRight:pr/1,paddingTop:pt/1,paddingBottom:pb/1,paddingBlock:py/1/paddingY,paddingBlockEnd:pb,paddingBlockStart:pt,paddingInline:px/paddingX/1,paddingInlineEnd:pe/1/paddingEnd,paddingInlineStart:ps/1/paddingStart,marginLeft:ml/1,marginRight:mr/1,marginTop:mt/1,marginBottom:mb/1,margin:m/1,marginBlock:my/1/marginY,marginBlockEnd:mb,marginBlockStart:mt,marginInline:mx/1/marginX,marginInlineEnd:me/1/marginEnd,marginInlineStart:ms/1/marginStart,outlineWidth:ring/ringWidth,outlineColor:ring/ringColor,outline:ring/1,outlineOffset:ring/ringOffset,divideX:divide-x,divideY:divide-y,divideColor:divide,divideStyle:divide,width:w/1,inlineSize:w,minWidth:min-w/minW,minInlineSize:min-w,maxWidth:max-w/maxW,maxInlineSize:max-w,height:h/1,blockSize:h,minHeight:min-h/minH,minBlockSize:min-h,maxHeight:max-h/maxH,maxBlockSize:max-b,color:text,fontFamily:font,fontSize:fs,fontWeight:font,fontSmoothing:smoothing,fontVariantNumeric:numeric,letterSpacing:tracking,lineHeight:leading,textAlign:text,textDecoration:text-decor,textDecorationColor:text-decor,textEmphasisColor:text-emphasis,textDecorationStyle:decoration,textDecorationThickness:decoration,textUnderlineOffset:underline-offset,textTransform:text,textIndent:indent,textShadow:text-shadow,textShadowColor:text-shadow/textShadowColor,textOverflow:text,verticalAlign:align,wordBreak:break,textWrap:text,truncate:truncate,lineClamp:clamp,listStyleType:list,listStylePosition:list,listStyleImage:list-img,backgroundPosition:bg/bgPosition,backgroundPositionX:bg-x/bgPositionX,backgroundPositionY:bg-y/bgPositionY,backgroundAttachment:bg/bgAttachment,backgroundClip:bg-clip/bgClip,background:bg/1,backgroundColor:bg/bgColor,backgroundOrigin:bg-origin/bgOrigin,backgroundImage:bg-img/bgImage,backgroundRepeat:bg-repeat/bgRepeat,backgroundBlendMode:bg-blend/bgBlendMode,backgroundSize:bg/bgSize,backgroundGradient:bg-gradient/bgGradient,textGradient:text-gradient,gradientFrom:from,gradientTo:to,gradientVia:via,borderRadius:rounded/1,borderTopLeftRadius:rounded-tl/roundedTopLeft,borderTopRightRadius:rounded-tr/roundedTopRight,borderBottomRightRadius:rounded-br/roundedBottomRight,borderBottomLeftRadius:rounded-bl/roundedBottomLeft,borderTopRadius:rounded-t/roundedTop,borderRightRadius:rounded-r/roundedRight,borderBottomRadius:rounded-b/roundedBottom,borderLeftRadius:rounded-l/roundedLeft,borderStartStartRadius:rounded-ss/roundedStartStart,borderStartEndRadius:rounded-se/roundedStartEnd,borderStartRadius:rounded-s/roundedStart,borderEndStartRadius:rounded-es/roundedEndStart,borderEndEndRadius:rounded-ee/roundedEndEnd,borderEndRadius:rounded-e/roundedEnd,border:border,borderWidth:border-w,borderTopWidth:border-tw,borderLeftWidth:border-lw,borderRightWidth:border-rw,borderBottomWidth:border-bw,borderColor:border,borderInline:border-x/borderX,borderInlineWidth:border-x/borderXWidth,borderInlineColor:border-x/borderXColor,borderBlock:border-y/borderY,borderBlockWidth:border-y/borderYWidth,borderBlockColor:border-y/borderYColor,borderLeft:border-l,borderLeftColor:border-l,borderInlineStart:border-s/borderStart,borderInlineStartWidth:border-s/borderStartWidth,borderInlineStartColor:border-s/borderStartColor,borderRight:border-r,borderRightColor:border-r,borderInlineEnd:border-e/borderEnd,borderInlineEndWidth:border-e/borderEndWidth,borderInlineEndColor:border-e/borderEndColor,borderTop:border-t,borderTopColor:border-t,borderBottom:border-b,borderBottomColor:border-b,borderBlockEnd:border-be,borderBlockEndColor:border-be,borderBlockStart:border-bs,borderBlockStartColor:border-bs,boxShadow:shadow/1,boxShadowColor:shadow/shadowColor,mixBlendMode:mix-blend,filter:filter,brightness:brightness,contrast:contrast,grayscale:grayscale,hueRotate:hue-rotate,invert:invert,saturate:saturate,sepia:sepia,dropShadow:drop-shadow,blur:blur,backdropFilter:backdrop,backdropBlur:backdrop-blur,backdropBrightness:backdrop-brightness,backdropContrast:backdrop-contrast,backdropGrayscale:backdrop-grayscale,backdropHueRotate:backdrop-hue-rotate,backdropInvert:backdrop-invert,backdropOpacity:backdrop-opacity,backdropSaturate:backdrop-saturate,backdropSepia:backdrop-sepia,borderCollapse:border,borderSpacing:border-spacing,borderSpacingX:border-spacing-x,borderSpacingY:border-spacing-y,tableLayout:table,transitionTimingFunction:ease,transitionDelay:delay,transitionDuration:duration,transitionProperty:transition-prop,transition:transition,animation:animation,animationName:animation-name,animationDelay:animation-delay,transformOrigin:origin,scale:scale,scaleX:scale-x,scaleY:scale-y,translate:translate,translateX:translate-x/x,translateY:translate-y/y,accentColor:accent,caretColor:caret,scrollBehavior:scroll,scrollbar:scrollbar,scrollMargin:scroll-m,scrollMarginLeft:scroll-ml,scrollMarginRight:scroll-mr,scrollMarginTop:scroll-mt,scrollMarginBottom:scroll-mb,scrollMarginBlock:scroll-my/scrollMarginY,scrollMarginBlockEnd:scroll-mb,scrollMarginBlockStart:scroll-mt,scrollMarginInline:scroll-mx/scrollMarginX,scrollMarginInlineEnd:scroll-me,scrollMarginInlineStart:scroll-ms,scrollPadding:scroll-p,scrollPaddingBlock:scroll-pb/scrollPaddingY,scrollPaddingBlockStart:scroll-pt,scrollPaddingBlockEnd:scroll-pb,scrollPaddingInline:scroll-px/scrollPaddingX,scrollPaddingInlineEnd:scroll-pe,scrollPaddingInlineStart:scroll-ps,scrollPaddingLeft:scroll-pl,scrollPaddingRight:scroll-pr,scrollPaddingTop:scroll-pt,scrollPaddingBottom:scroll-pb,scrollSnapAlign:snap,scrollSnapStop:snap,scrollSnapType:snap,scrollSnapStrictness:strictness,scrollSnapMargin:snap-m,scrollSnapMarginTop:snap-mt,scrollSnapMarginBottom:snap-mb,scrollSnapMarginLeft:snap-ml,scrollSnapMarginRight:snap-mr,touchAction:touch,userSelect:select,fill:fill,stroke:stroke,strokeWidth:stroke-w,srOnly:sr,debug:debug,appearance:appearance,backfaceVisibility:backface,clipPath:clip-path,hyphens:hyphens,mask:mask,maskImage:mask-image,maskSize:mask-size,textSizeAdjust:text-size-adjust,container:cq,containerName:cq-name,containerType:cq-type,textStyle:textStyle"

      const classNameByProp = new Map()
      const shorthands = new Map()
      utilities.split(',').forEach((utility) => {
        const [prop, meta] = utility.split(':')
        const [className, ...shorthandList] = meta.split('/')
        classNameByProp.set(prop, className)
        if (shorthandList.length) {
          shorthandList.forEach((shorthand) => {
            shorthands.set(shorthand === '1' ? className : shorthand, prop)
          })
        }
      })

      const resolveShorthand = (prop) => shorthands.get(prop) || prop

      const context = {
        
        conditions: {
          shift: sortConditions,
          finalize: finalizeConditions,
          breakpoints: { keys: ["base","sm","md","lg","xl","2xl"] }
        },
        utility: {
          
          transform: (prop, value) => {
                    const key = resolveShorthand(prop)
                    const propKey = classNameByProp.get(key) || hypenateProperty(key)
                    return { className: \`\${propKey}_\${withoutSpace(value)}\` }
                  },
          hasShorthand: true,
          toHash: (path, hashFn) => hashFn(path.join(":")),
          resolveShorthand: resolveShorthand,
        }
      }

      const cssFn = createCss(context)
      export const css = (...styles) => cssFn(mergeCss(...styles))
      css.raw = (...styles) => mergeCss(...styles)

      export const { mergeCss, assignCss } = createMergeCss(context)",
        "file": "css.mjs",
      }
    `)
  })

  test('colors', () => {
    expect(run({}, { categories: ['colors'], props: [] })).toMatchInlineSnapshot(`
      {
        "code": "import { createCss, create{

        // Only throw error if the property is in the list of props
        // bound to a token category and the value is not a valid token value for that category

        if (propList.has(prop)) {
          const category = categoryByProp.get(prop)
          if (category) {
            const values = tokenValues[category]
            if (values && !values.includes(value)) {
              throw new Error(\`[super-strict-tokens]: Unknown value:
       { \${prop}: \${value} }
       Valid values in \${category} are: \${values.join(', ')}\`)
            }
          }
        }
      return MergeCss, hypenateProperty, withoutSpace } from '../helpers.mjs';
      import { sortConditions, finalizeConditions } from './conditions.mjs';

      const utilities = "aspectRatio:aspect,boxDecorationBreak:decoration,zIndex:z,boxSizing:box,objectPosition:object,objectFit:object,overscrollBehavior:overscroll,overscrollBehaviorX:overscroll-x,overscrollBehaviorY:overscroll-y,position:pos/1,top:top,left:left,insetInline:inset-x/insetX,insetBlock:inset-y/insetY,inset:inset,insetBlockEnd:inset-b,insetBlockStart:inset-t,insetInlineEnd:end/insetEnd/1,insetInlineStart:start/insetStart/1,right:right,bottom:bottom,float:float,visibility:vis,display:d,hideFrom:hide,hideBelow:show,flexBasis:basis,flex:flex,flexDirection:flex/flexDir,flexGrow:grow,flexShrink:shrink,gridTemplateColumns:grid-cols,gridTemplateRows:grid-rows,gridColumn:col-span,gridRow:row-span,gridColumnStart:col-start,gridColumnEnd:col-end,gridAutoFlow:grid-flow,gridAutoColumns:auto-cols,gridAutoRows:auto-rows,gap:gap,gridGap:gap,gridRowGap:gap-x,gridColumnGap:gap-y,rowGap:gap-x,columnGap:gap-y,justifyContent:justify,alignContent:content,alignItems:items,alignSelf:self,padding:p/1,paddingLeft:pl/1,paddingRight:pr/1,paddingTop:pt/1,paddingBottom:pb/1,paddingBlock:py/1/paddingY,paddingBlockEnd:pb,paddingBlockStart:pt,paddingInline:px/paddingX/1,paddingInlineEnd:pe/1/paddingEnd,paddingInlineStart:ps/1/paddingStart,marginLeft:ml/1,marginRight:mr/1,marginTop:mt/1,marginBottom:mb/1,margin:m/1,marginBlock:my/1/marginY,marginBlockEnd:mb,marginBlockStart:mt,marginInline:mx/1/marginX,marginInlineEnd:me/1/marginEnd,marginInlineStart:ms/1/marginStart,outlineWidth:ring/ringWidth,outlineColor:ring/ringColor,outline:ring/1,outlineOffset:ring/ringOffset,divideX:divide-x,divideY:divide-y,divideColor:divide,divideStyle:divide,width:w/1,inlineSize:w,minWidth:min-w/minW,minInlineSize:min-w,maxWidth:max-w/maxW,maxInlineSize:max-w,height:h/1,blockSize:h,minHeight:min-h/minH,minBlockSize:min-h,maxHeight:max-h/maxH,maxBlockSize:max-b,color:text,fontFamily:font,fontSize:fs,fontWeight:font,fontSmoothing:smoothing,fontVariantNumeric:numeric,letterSpacing:tracking,lineHeight:leading,textAlign:text,textDecoration:text-decor,textDecorationColor:text-decor,textEmphasisColor:text-emphasis,textDecorationStyle:decoration,textDecorationThickness:decoration,textUnderlineOffset:underline-offset,textTransform:text,textIndent:indent,textShadow:text-shadow,textShadowColor:text-shadow/textShadowColor,textOverflow:text,verticalAlign:align,wordBreak:break,textWrap:text,truncate:truncate,lineClamp:clamp,listStyleType:list,listStylePosition:list,listStyleImage:list-img,backgroundPosition:bg/bgPosition,backgroundPositionX:bg-x/bgPositionX,backgroundPositionY:bg-y/bgPositionY,backgroundAttachment:bg/bgAttachment,backgroundClip:bg-clip/bgClip,background:bg/1,backgroundColor:bg/bgColor,backgroundOrigin:bg-origin/bgOrigin,backgroundImage:bg-img/bgImage,backgroundRepeat:bg-repeat/bgRepeat,backgroundBlendMode:bg-blend/bgBlendMode,backgroundSize:bg/bgSize,backgroundGradient:bg-gradient/bgGradient,textGradient:text-gradient,gradientFrom:from,gradientTo:to,gradientVia:via,borderRadius:rounded/1,borderTopLeftRadius:rounded-tl/roundedTopLeft,borderTopRightRadius:rounded-tr/roundedTopRight,borderBottomRightRadius:rounded-br/roundedBottomRight,borderBottomLeftRadius:rounded-bl/roundedBottomLeft,borderTopRadius:rounded-t/roundedTop,borderRightRadius:rounded-r/roundedRight,borderBottomRadius:rounded-b/roundedBottom,borderLeftRadius:rounded-l/roundedLeft,borderStartStartRadius:rounded-ss/roundedStartStart,borderStartEndRadius:rounded-se/roundedStartEnd,borderStartRadius:rounded-s/roundedStart,borderEndStartRadius:rounded-es/roundedEndStart,borderEndEndRadius:rounded-ee/roundedEndEnd,borderEndRadius:rounded-e/roundedEnd,border:border,borderWidth:border-w,borderTopWidth:border-tw,borderLeftWidth:border-lw,borderRightWidth:border-rw,borderBottomWidth:border-bw,borderColor:border,borderInline:border-x/borderX,borderInlineWidth:border-x/borderXWidth,borderInlineColor:border-x/borderXColor,borderBlock:border-y/borderY,borderBlockWidth:border-y/borderYWidth,borderBlockColor:border-y/borderYColor,borderLeft:border-l,borderLeftColor:border-l,borderInlineStart:border-s/borderStart,borderInlineStartWidth:border-s/borderStartWidth,borderInlineStartColor:border-s/borderStartColor,borderRight:border-r,borderRightColor:border-r,borderInlineEnd:border-e/borderEnd,borderInlineEndWidth:border-e/borderEndWidth,borderInlineEndColor:border-e/borderEndColor,borderTop:border-t,borderTopColor:border-t,borderBottom:border-b,borderBottomColor:border-b,borderBlockEnd:border-be,borderBlockEndColor:border-be,borderBlockStart:border-bs,borderBlockStartColor:border-bs,boxShadow:shadow/1,boxShadowColor:shadow/shadowColor,mixBlendMode:mix-blend,filter:filter,brightness:brightness,contrast:contrast,grayscale:grayscale,hueRotate:hue-rotate,invert:invert,saturate:saturate,sepia:sepia,dropShadow:drop-shadow,blur:blur,backdropFilter:backdrop,backdropBlur:backdrop-blur,backdropBrightness:backdrop-brightness,backdropContrast:backdrop-contrast,backdropGrayscale:backdrop-grayscale,backdropHueRotate:backdrop-hue-rotate,backdropInvert:backdrop-invert,backdropOpacity:backdrop-opacity,backdropSaturate:backdrop-saturate,backdropSepia:backdrop-sepia,borderCollapse:border,borderSpacing:border-spacing,borderSpacingX:border-spacing-x,borderSpacingY:border-spacing-y,tableLayout:table,transitionTimingFunction:ease,transitionDelay:delay,transitionDuration:duration,transitionProperty:transition-prop,transition:transition,animation:animation,animationName:animation-name,animationDelay:animation-delay,transformOrigin:origin,scale:scale,scaleX:scale-x,scaleY:scale-y,translate:translate,translateX:translate-x/x,translateY:translate-y/y,accentColor:accent,caretColor:caret,scrollBehavior:scroll,scrollbar:scrollbar,scrollMargin:scroll-m,scrollMarginLeft:scroll-ml,scrollMarginRight:scroll-mr,scrollMarginTop:scroll-mt,scrollMarginBottom:scroll-mb,scrollMarginBlock:scroll-my/scrollMarginY,scrollMarginBlockEnd:scroll-mb,scrollMarginBlockStart:scroll-mt,scrollMarginInline:scroll-mx/scrollMarginX,scrollMarginInlineEnd:scroll-me,scrollMarginInlineStart:scroll-ms,scrollPadding:scroll-p,scrollPaddingBlock:scroll-pb/scrollPaddingY,scrollPaddingBlockStart:scroll-pt,scrollPaddingBlockEnd:scroll-pb,scrollPaddingInline:scroll-px/scrollPaddingX,scrollPaddingInlineEnd:scroll-pe,scrollPaddingInlineStart:scroll-ps,scrollPaddingLeft:scroll-pl,scrollPaddingRight:scroll-pr,scrollPaddingTop:scroll-pt,scrollPaddingBottom:scroll-pb,scrollSnapAlign:snap,scrollSnapStop:snap,scrollSnapType:snap,scrollSnapStrictness:strictness,scrollSnapMargin:snap-m,scrollSnapMarginTop:snap-mt,scrollSnapMarginBottom:snap-mb,scrollSnapMarginLeft:snap-ml,scrollSnapMarginRight:snap-mr,touchAction:touch,userSelect:select,fill:fill,stroke:stroke,strokeWidth:stroke-w,srOnly:sr,debug:debug,appearance:appearance,backfaceVisibility:backface,clipPath:clip-path,hyphens:hyphens,mask:mask,maskImage:mask-image,maskSize:mask-size,textSizeAdjust:text-size-adjust,container:cq,containerName:cq-name,containerType:cq-type,textStyle:textStyle"

      const classNameByProp = new Map()
      const shorthands = new Map()
      utilities.split(',').forEach((utility) => {
        const [prop, meta] = utility.split(':')
        const [className, ...shorthandList] = meta.split('/')
        classNameByProp.set(prop, className)
        if (shorthandList.length) {
          shorthandList.forEach((shorthand) => {
            shorthands.set(shorthand === '1' ? className : shorthand, prop)
          })
        }
      })

      const resolveShorthand = (prop) => shorthands.get(prop) || prop


                const tokenValues = {
        "colors": [
          "current",
          "black",
          "white",
          "transparent",
          "rose.50",
          "rose.100",
          "rose.200",
          "rose.300",
          "rose.400",
          "rose.500",
          "rose.600",
          "rose.700",
          "rose.800",
          "rose.900",
          "rose.950",
          "pink.50",
          "pink.100",
          "pink.200",
          "pink.300",
          "pink.400",
          "pink.500",
          "pink.600",
          "pink.700",
          "pink.800",
          "pink.900",
          "pink.950",
          "fuchsia.50",
          "fuchsia.100",
          "fuchsia.200",
          "fuchsia.300",
          "fuchsia.400",
          "fuchsia.500",
          "fuchsia.600",
          "fuchsia.700",
          "fuchsia.800",
          "fuchsia.900",
          "fuchsia.950",
          "purple.50",
          "purple.100",
          "purple.200",
          "purple.300",
          "purple.400",
          "purple.500",
          "purple.600",
          "purple.700",
          "purple.800",
          "purple.900",
          "purple.950",
          "violet.50",
          "violet.100",
          "violet.200",
          "violet.300",
          "violet.400",
          "violet.500",
          "violet.600",
          "violet.700",
          "violet.800",
          "violet.900",
          "violet.950",
          "indigo.50",
          "indigo.100",
          "indigo.200",
          "indigo.300",
          "indigo.400",
          "indigo.500",
          "indigo.600",
          "indigo.700",
          "indigo.800",
          "indigo.900",
          "indigo.950",
          "blue.50",
          "blue.100",
          "blue.200",
          "blue.300",
          "blue.400",
          "blue.500",
          "blue.600",
          "blue.700",
          "blue.800",
          "blue.900",
          "blue.950",
          "sky.50",
          "sky.100",
          "sky.200",
          "sky.300",
          "sky.400",
          "sky.500",
          "sky.600",
          "sky.700",
          "sky.800",
          "sky.900",
          "sky.950",
          "cyan.50",
          "cyan.100",
          "cyan.200",
          "cyan.300",
          "cyan.400",
          "cyan.500",
          "cyan.600",
          "cyan.700",
          "cyan.800",
          "cyan.900",
          "cyan.950",
          "teal.50",
          "teal.100",
          "teal.200",
          "teal.300",
          "teal.400",
          "teal.500",
          "teal.600",
          "teal.700",
          "teal.800",
          "teal.900",
          "teal.950",
          "emerald.50",
          "emerald.100",
          "emerald.200",
          "emerald.300",
          "emerald.400",
          "emerald.500",
          "emerald.600",
          "emerald.700",
          "emerald.800",
          "emerald.900",
          "emerald.950",
          "green.50",
          "green.100",
          "green.200",
          "green.300",
          "green.400",
          "green.500",
          "green.600",
          "green.700",
          "green.800",
          "green.900",
          "green.950",
          "lime.50",
          "lime.100",
          "lime.200",
          "lime.300",
          "lime.400",
          "lime.500",
          "lime.600",
          "lime.700",
          "lime.800",
          "lime.900",
          "lime.950",
          "yellow.50",
          "yellow.100",
          "yellow.200",
          "yellow.300",
          "yellow.400",
          "yellow.500",
          "yellow.600",
          "yellow.700",
          "yellow.800",
          "yellow.900",
          "yellow.950",
          "amber.50",
          "amber.100",
          "amber.200",
          "amber.300",
          "amber.400",
          "amber.500",
          "amber.600",
          "amber.700",
          "amber.800",
          "amber.900",
          "amber.950",
          "orange.50",
          "orange.100",
          "orange.200",
          "orange.300",
          "orange.400",
          "orange.500",
          "orange.600",
          "orange.700",
          "orange.800",
          "orange.900",
          "orange.950",
          "red.50",
          "red.100",
          "red.200",
          "red.300",
          "red.400",
          "red.500",
          "red.600",
          "red.700",
          "red.800",
          "red.900",
          "red.950",
          "neutral.50",
          "neutral.100",
          "neutral.200",
          "neutral.300",
          "neutral.400",
          "neutral.500",
          "neutral.600",
          "neutral.700",
          "neutral.800",
          "neutral.900",
          "neutral.950",
          "stone.50",
          "stone.100",
          "stone.200",
          "stone.300",
          "stone.400",
          "stone.500",
          "stone.600",
          "stone.700",
          "stone.800",
          "stone.900",
          "stone.950",
          "zinc.50",
          "zinc.100",
          "zinc.200",
          "zinc.300",
          "zinc.400",
          "zinc.500",
          "zinc.600",
          "zinc.700",
          "zinc.800",
          "zinc.900",
          "zinc.950",
          "gray.50",
          "gray.100",
          "gray.200",
          "gray.300",
          "gray.400",
          "gray.500",
          "gray.600",
          "gray.700",
          "gray.800",
          "gray.900",
          "gray.950",
          "slate.50",
          "slate.100",
          "slate.200",
          "slate.300",
          "slate.400",
          "slate.500",
          "slate.600",
          "slate.700",
          "slate.800",
          "slate.900",
          "slate.950",
          "colorPalette",
          "colorPalette.50",
          "colorPalette.100",
          "colorPalette.200",
          "colorPalette.300",
          "colorPalette.400",
          "colorPalette.500",
          "colorPalette.600",
          "colorPalette.700",
          "colorPalette.800",
          "colorPalette.900",
          "colorPalette.950"
        ]
      }
                const propsByCat = {
        "colors": [
          "outlineColor",
          "divideColor",
          "color",
          "textDecorationColor",
          "textEmphasisColor",
          "textShadowColor",
          "background",
          "backgroundColor",
          "gradientFrom",
          "gradientTo",
          "gradientVia",
          "borderColor",
          "borderInlineColor",
          "borderBlockColor",
          "borderLeftColor",
          "borderInlineStartColor",
          "borderRightColor",
          "borderInlineEndColor",
          "borderTopColor",
          "borderBottomColor",
          "borderBlockEndColor",
          "borderBlockStartColor",
          "boxShadowColor",
          "accentColor",
          "caretColor",
          "fill",
          "stroke",
          "ringColor",
          "bg",
          "bgColor",
          "borderXColor",
          "borderYColor",
          "borderStartColor",
          "borderEndColor",
          "shadowColor"
        ]
      }
                const propList = new Set(Object.values(propsByCat).flat())

                const categoryByProp = new Map()
                propList.forEach((prop) => {
                  Object.entries(propsByCat).forEach(([category, list]) => {
                    if (list.includes(prop)) {
                      categoryByProp.set(prop, category)
                    }
                  })
                })

                const context = {
        
        conditions: {
          shift: sortConditions,
          finalize: finalizeConditions,
          breakpoints: { keys: ["base","sm","md","lg","xl","2xl"] }
        },
        utility: {
          
          transform: (prop, value) => {
                    const key = resolveShorthand(prop)
                    const propKey = classNameByProp.get(key) || hypenateProperty(key)
                    return { className: \`\${propKey}_\${withoutSpace(value)}\` }

      }            },
          hasShorthand: true,
          toHash: (path, hashFn) => hashFn(path.join(":")),
          resolveShorthand: resolveShorthand,
        }
      }

      const cssFn = createCss(context)
      export const css = (...styles) => cssFn(mergeCss(...styles))
      css.raw = (...styles) => mergeCss(...styles)

      export const { mergeCss, assignCss } = createMergeCss(context)",
        "file": "css.mjs",
      }
    `)
  })

  test('colors + fontSizes', () => {
    expect(run({}, { categories: ['colors', 'fontSizes'], props: [] })).toMatchInlineSnapshot(`
      {
        "code": "import { createCss, create{

        // Only throw error if the property is in the list of props
        // bound to a token category and the value is not a valid token value for that category

        if (propList.has(prop)) {
          const category = categoryByProp.get(prop)
          if (category) {
            const values = tokenValues[category]
            if (values && !values.includes(value)) {
              throw new Error(\`[super-strict-tokens]: Unknown value:
       { \${prop}: \${value} }
       Valid values in \${category} are: \${values.join(', ')}\`)
            }
          }
        }
      return MergeCss, hypenateProperty, withoutSpace } from '../helpers.mjs';
      import { sortConditions, finalizeConditions } from './conditions.mjs';

      const utilities = "aspectRatio:aspect,boxDecorationBreak:decoration,zIndex:z,boxSizing:box,objectPosition:object,objectFit:object,overscrollBehavior:overscroll,overscrollBehaviorX:overscroll-x,overscrollBehaviorY:overscroll-y,position:pos/1,top:top,left:left,insetInline:inset-x/insetX,insetBlock:inset-y/insetY,inset:inset,insetBlockEnd:inset-b,insetBlockStart:inset-t,insetInlineEnd:end/insetEnd/1,insetInlineStart:start/insetStart/1,right:right,bottom:bottom,float:float,visibility:vis,display:d,hideFrom:hide,hideBelow:show,flexBasis:basis,flex:flex,flexDirection:flex/flexDir,flexGrow:grow,flexShrink:shrink,gridTemplateColumns:grid-cols,gridTemplateRows:grid-rows,gridColumn:col-span,gridRow:row-span,gridColumnStart:col-start,gridColumnEnd:col-end,gridAutoFlow:grid-flow,gridAutoColumns:auto-cols,gridAutoRows:auto-rows,gap:gap,gridGap:gap,gridRowGap:gap-x,gridColumnGap:gap-y,rowGap:gap-x,columnGap:gap-y,justifyContent:justify,alignContent:content,alignItems:items,alignSelf:self,padding:p/1,paddingLeft:pl/1,paddingRight:pr/1,paddingTop:pt/1,paddingBottom:pb/1,paddingBlock:py/1/paddingY,paddingBlockEnd:pb,paddingBlockStart:pt,paddingInline:px/paddingX/1,paddingInlineEnd:pe/1/paddingEnd,paddingInlineStart:ps/1/paddingStart,marginLeft:ml/1,marginRight:mr/1,marginTop:mt/1,marginBottom:mb/1,margin:m/1,marginBlock:my/1/marginY,marginBlockEnd:mb,marginBlockStart:mt,marginInline:mx/1/marginX,marginInlineEnd:me/1/marginEnd,marginInlineStart:ms/1/marginStart,outlineWidth:ring/ringWidth,outlineColor:ring/ringColor,outline:ring/1,outlineOffset:ring/ringOffset,divideX:divide-x,divideY:divide-y,divideColor:divide,divideStyle:divide,width:w/1,inlineSize:w,minWidth:min-w/minW,minInlineSize:min-w,maxWidth:max-w/maxW,maxInlineSize:max-w,height:h/1,blockSize:h,minHeight:min-h/minH,minBlockSize:min-h,maxHeight:max-h/maxH,maxBlockSize:max-b,color:text,fontFamily:font,fontSize:fs,fontWeight:font,fontSmoothing:smoothing,fontVariantNumeric:numeric,letterSpacing:tracking,lineHeight:leading,textAlign:text,textDecoration:text-decor,textDecorationColor:text-decor,textEmphasisColor:text-emphasis,textDecorationStyle:decoration,textDecorationThickness:decoration,textUnderlineOffset:underline-offset,textTransform:text,textIndent:indent,textShadow:text-shadow,textShadowColor:text-shadow/textShadowColor,textOverflow:text,verticalAlign:align,wordBreak:break,textWrap:text,truncate:truncate,lineClamp:clamp,listStyleType:list,listStylePosition:list,listStyleImage:list-img,backgroundPosition:bg/bgPosition,backgroundPositionX:bg-x/bgPositionX,backgroundPositionY:bg-y/bgPositionY,backgroundAttachment:bg/bgAttachment,backgroundClip:bg-clip/bgClip,background:bg/1,backgroundColor:bg/bgColor,backgroundOrigin:bg-origin/bgOrigin,backgroundImage:bg-img/bgImage,backgroundRepeat:bg-repeat/bgRepeat,backgroundBlendMode:bg-blend/bgBlendMode,backgroundSize:bg/bgSize,backgroundGradient:bg-gradient/bgGradient,textGradient:text-gradient,gradientFrom:from,gradientTo:to,gradientVia:via,borderRadius:rounded/1,borderTopLeftRadius:rounded-tl/roundedTopLeft,borderTopRightRadius:rounded-tr/roundedTopRight,borderBottomRightRadius:rounded-br/roundedBottomRight,borderBottomLeftRadius:rounded-bl/roundedBottomLeft,borderTopRadius:rounded-t/roundedTop,borderRightRadius:rounded-r/roundedRight,borderBottomRadius:rounded-b/roundedBottom,borderLeftRadius:rounded-l/roundedLeft,borderStartStartRadius:rounded-ss/roundedStartStart,borderStartEndRadius:rounded-se/roundedStartEnd,borderStartRadius:rounded-s/roundedStart,borderEndStartRadius:rounded-es/roundedEndStart,borderEndEndRadius:rounded-ee/roundedEndEnd,borderEndRadius:rounded-e/roundedEnd,border:border,borderWidth:border-w,borderTopWidth:border-tw,borderLeftWidth:border-lw,borderRightWidth:border-rw,borderBottomWidth:border-bw,borderColor:border,borderInline:border-x/borderX,borderInlineWidth:border-x/borderXWidth,borderInlineColor:border-x/borderXColor,borderBlock:border-y/borderY,borderBlockWidth:border-y/borderYWidth,borderBlockColor:border-y/borderYColor,borderLeft:border-l,borderLeftColor:border-l,borderInlineStart:border-s/borderStart,borderInlineStartWidth:border-s/borderStartWidth,borderInlineStartColor:border-s/borderStartColor,borderRight:border-r,borderRightColor:border-r,borderInlineEnd:border-e/borderEnd,borderInlineEndWidth:border-e/borderEndWidth,borderInlineEndColor:border-e/borderEndColor,borderTop:border-t,borderTopColor:border-t,borderBottom:border-b,borderBottomColor:border-b,borderBlockEnd:border-be,borderBlockEndColor:border-be,borderBlockStart:border-bs,borderBlockStartColor:border-bs,boxShadow:shadow/1,boxShadowColor:shadow/shadowColor,mixBlendMode:mix-blend,filter:filter,brightness:brightness,contrast:contrast,grayscale:grayscale,hueRotate:hue-rotate,invert:invert,saturate:saturate,sepia:sepia,dropShadow:drop-shadow,blur:blur,backdropFilter:backdrop,backdropBlur:backdrop-blur,backdropBrightness:backdrop-brightness,backdropContrast:backdrop-contrast,backdropGrayscale:backdrop-grayscale,backdropHueRotate:backdrop-hue-rotate,backdropInvert:backdrop-invert,backdropOpacity:backdrop-opacity,backdropSaturate:backdrop-saturate,backdropSepia:backdrop-sepia,borderCollapse:border,borderSpacing:border-spacing,borderSpacingX:border-spacing-x,borderSpacingY:border-spacing-y,tableLayout:table,transitionTimingFunction:ease,transitionDelay:delay,transitionDuration:duration,transitionProperty:transition-prop,transition:transition,animation:animation,animationName:animation-name,animationDelay:animation-delay,transformOrigin:origin,scale:scale,scaleX:scale-x,scaleY:scale-y,translate:translate,translateX:translate-x/x,translateY:translate-y/y,accentColor:accent,caretColor:caret,scrollBehavior:scroll,scrollbar:scrollbar,scrollMargin:scroll-m,scrollMarginLeft:scroll-ml,scrollMarginRight:scroll-mr,scrollMarginTop:scroll-mt,scrollMarginBottom:scroll-mb,scrollMarginBlock:scroll-my/scrollMarginY,scrollMarginBlockEnd:scroll-mb,scrollMarginBlockStart:scroll-mt,scrollMarginInline:scroll-mx/scrollMarginX,scrollMarginInlineEnd:scroll-me,scrollMarginInlineStart:scroll-ms,scrollPadding:scroll-p,scrollPaddingBlock:scroll-pb/scrollPaddingY,scrollPaddingBlockStart:scroll-pt,scrollPaddingBlockEnd:scroll-pb,scrollPaddingInline:scroll-px/scrollPaddingX,scrollPaddingInlineEnd:scroll-pe,scrollPaddingInlineStart:scroll-ps,scrollPaddingLeft:scroll-pl,scrollPaddingRight:scroll-pr,scrollPaddingTop:scroll-pt,scrollPaddingBottom:scroll-pb,scrollSnapAlign:snap,scrollSnapStop:snap,scrollSnapType:snap,scrollSnapStrictness:strictness,scrollSnapMargin:snap-m,scrollSnapMarginTop:snap-mt,scrollSnapMarginBottom:snap-mb,scrollSnapMarginLeft:snap-ml,scrollSnapMarginRight:snap-mr,touchAction:touch,userSelect:select,fill:fill,stroke:stroke,strokeWidth:stroke-w,srOnly:sr,debug:debug,appearance:appearance,backfaceVisibility:backface,clipPath:clip-path,hyphens:hyphens,mask:mask,maskImage:mask-image,maskSize:mask-size,textSizeAdjust:text-size-adjust,container:cq,containerName:cq-name,containerType:cq-type,textStyle:textStyle"

      const classNameByProp = new Map()
      const shorthands = new Map()
      utilities.split(',').forEach((utility) => {
        const [prop, meta] = utility.split(':')
        const [className, ...shorthandList] = meta.split('/')
        classNameByProp.set(prop, className)
        if (shorthandList.length) {
          shorthandList.forEach((shorthand) => {
            shorthands.set(shorthand === '1' ? className : shorthand, prop)
          })
        }
      })

      const resolveShorthand = (prop) => shorthands.get(prop) || prop


                const tokenValues = {
        "fontSizes": [
          "2xs",
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4xl",
          "5xl",
          "6xl",
          "7xl",
          "8xl",
          "9xl"
        ],
        "colors": [
          "current",
          "black",
          "white",
          "transparent",
          "rose.50",
          "rose.100",
          "rose.200",
          "rose.300",
          "rose.400",
          "rose.500",
          "rose.600",
          "rose.700",
          "rose.800",
          "rose.900",
          "rose.950",
          "pink.50",
          "pink.100",
          "pink.200",
          "pink.300",
          "pink.400",
          "pink.500",
          "pink.600",
          "pink.700",
          "pink.800",
          "pink.900",
          "pink.950",
          "fuchsia.50",
          "fuchsia.100",
          "fuchsia.200",
          "fuchsia.300",
          "fuchsia.400",
          "fuchsia.500",
          "fuchsia.600",
          "fuchsia.700",
          "fuchsia.800",
          "fuchsia.900",
          "fuchsia.950",
          "purple.50",
          "purple.100",
          "purple.200",
          "purple.300",
          "purple.400",
          "purple.500",
          "purple.600",
          "purple.700",
          "purple.800",
          "purple.900",
          "purple.950",
          "violet.50",
          "violet.100",
          "violet.200",
          "violet.300",
          "violet.400",
          "violet.500",
          "violet.600",
          "violet.700",
          "violet.800",
          "violet.900",
          "violet.950",
          "indigo.50",
          "indigo.100",
          "indigo.200",
          "indigo.300",
          "indigo.400",
          "indigo.500",
          "indigo.600",
          "indigo.700",
          "indigo.800",
          "indigo.900",
          "indigo.950",
          "blue.50",
          "blue.100",
          "blue.200",
          "blue.300",
          "blue.400",
          "blue.500",
          "blue.600",
          "blue.700",
          "blue.800",
          "blue.900",
          "blue.950",
          "sky.50",
          "sky.100",
          "sky.200",
          "sky.300",
          "sky.400",
          "sky.500",
          "sky.600",
          "sky.700",
          "sky.800",
          "sky.900",
          "sky.950",
          "cyan.50",
          "cyan.100",
          "cyan.200",
          "cyan.300",
          "cyan.400",
          "cyan.500",
          "cyan.600",
          "cyan.700",
          "cyan.800",
          "cyan.900",
          "cyan.950",
          "teal.50",
          "teal.100",
          "teal.200",
          "teal.300",
          "teal.400",
          "teal.500",
          "teal.600",
          "teal.700",
          "teal.800",
          "teal.900",
          "teal.950",
          "emerald.50",
          "emerald.100",
          "emerald.200",
          "emerald.300",
          "emerald.400",
          "emerald.500",
          "emerald.600",
          "emerald.700",
          "emerald.800",
          "emerald.900",
          "emerald.950",
          "green.50",
          "green.100",
          "green.200",
          "green.300",
          "green.400",
          "green.500",
          "green.600",
          "green.700",
          "green.800",
          "green.900",
          "green.950",
          "lime.50",
          "lime.100",
          "lime.200",
          "lime.300",
          "lime.400",
          "lime.500",
          "lime.600",
          "lime.700",
          "lime.800",
          "lime.900",
          "lime.950",
          "yellow.50",
          "yellow.100",
          "yellow.200",
          "yellow.300",
          "yellow.400",
          "yellow.500",
          "yellow.600",
          "yellow.700",
          "yellow.800",
          "yellow.900",
          "yellow.950",
          "amber.50",
          "amber.100",
          "amber.200",
          "amber.300",
          "amber.400",
          "amber.500",
          "amber.600",
          "amber.700",
          "amber.800",
          "amber.900",
          "amber.950",
          "orange.50",
          "orange.100",
          "orange.200",
          "orange.300",
          "orange.400",
          "orange.500",
          "orange.600",
          "orange.700",
          "orange.800",
          "orange.900",
          "orange.950",
          "red.50",
          "red.100",
          "red.200",
          "red.300",
          "red.400",
          "red.500",
          "red.600",
          "red.700",
          "red.800",
          "red.900",
          "red.950",
          "neutral.50",
          "neutral.100",
          "neutral.200",
          "neutral.300",
          "neutral.400",
          "neutral.500",
          "neutral.600",
          "neutral.700",
          "neutral.800",
          "neutral.900",
          "neutral.950",
          "stone.50",
          "stone.100",
          "stone.200",
          "stone.300",
          "stone.400",
          "stone.500",
          "stone.600",
          "stone.700",
          "stone.800",
          "stone.900",
          "stone.950",
          "zinc.50",
          "zinc.100",
          "zinc.200",
          "zinc.300",
          "zinc.400",
          "zinc.500",
          "zinc.600",
          "zinc.700",
          "zinc.800",
          "zinc.900",
          "zinc.950",
          "gray.50",
          "gray.100",
          "gray.200",
          "gray.300",
          "gray.400",
          "gray.500",
          "gray.600",
          "gray.700",
          "gray.800",
          "gray.900",
          "gray.950",
          "slate.50",
          "slate.100",
          "slate.200",
          "slate.300",
          "slate.400",
          "slate.500",
          "slate.600",
          "slate.700",
          "slate.800",
          "slate.900",
          "slate.950",
          "colorPalette",
          "colorPalette.50",
          "colorPalette.100",
          "colorPalette.200",
          "colorPalette.300",
          "colorPalette.400",
          "colorPalette.500",
          "colorPalette.600",
          "colorPalette.700",
          "colorPalette.800",
          "colorPalette.900",
          "colorPalette.950"
        ]
      }
                const propsByCat = {
        "colors": [
          "outlineColor",
          "divideColor",
          "color",
          "textDecorationColor",
          "textEmphasisColor",
          "textShadowColor",
          "background",
          "backgroundColor",
          "gradientFrom",
          "gradientTo",
          "gradientVia",
          "borderColor",
          "borderInlineColor",
          "borderBlockColor",
          "borderLeftColor",
          "borderInlineStartColor",
          "borderRightColor",
          "borderInlineEndColor",
          "borderTopColor",
          "borderBottomColor",
          "borderBlockEndColor",
          "borderBlockStartColor",
          "boxShadowColor",
          "accentColor",
          "caretColor",
          "fill",
          "stroke",
          "ringColor",
          "bg",
          "bgColor",
          "borderXColor",
          "borderYColor",
          "borderStartColor",
          "borderEndColor",
          "shadowColor"
        ],
        "fontSizes": [
          "fontSize"
        ]
      }
                const propList = new Set(Object.values(propsByCat).flat())

                const categoryByProp = new Map()
                propList.forEach((prop) => {
                  Object.entries(propsByCat).forEach(([category, list]) => {
                    if (list.includes(prop)) {
                      categoryByProp.set(prop, category)
                    }
                  })
                })

                const context = {
        
        conditions: {
          shift: sortConditions,
          finalize: finalizeConditions,
          breakpoints: { keys: ["base","sm","md","lg","xl","2xl"] }
        },
        utility: {
          
          transform: (prop, value) => {
                    const key = resolveShorthand(prop)
                    const propKey = classNameByProp.get(key) || hypenateProperty(key)
                    return { className: \`\${propKey}_\${withoutSpace(value)}\` }

      }            },
          hasShorthand: true,
          toHash: (path, hashFn) => hashFn(path.join(":")),
          resolveShorthand: resolveShorthand,
        }
      }

      const cssFn = createCss(context)
      export const css = (...styles) => cssFn(mergeCss(...styles))
      css.raw = (...styles) => mergeCss(...styles)

      export const { mergeCss, assignCss } = createMergeCss(context)",
        "file": "css.mjs",
      }
    `)
  })

  test('color prop only', () => {
    expect(run({}, { props: ['color'] })).toMatchInlineSnapshot(`
      {
        "code": "import { createCss, create{

        // Only throw error if the property is in the list of props
        // bound to a token category and the value is not a valid token value for that category

        if (propList.has(prop)) {
          const category = categoryByProp.get(prop)
          if (category) {
            const values = tokenValues[category]
            if (values && !values.includes(value)) {
              throw new Error(\`[super-strict-tokens]: Unknown value:
       { \${prop}: \${value} }
       Valid values in \${category} are: \${values.join(', ')}\`)
            }
          }
        }
      return MergeCss, hypenateProperty, withoutSpace } from '../helpers.mjs';
      import { sortConditions, finalizeConditions } from './conditions.mjs';

      const utilities = "aspectRatio:aspect,boxDecorationBreak:decoration,zIndex:z,boxSizing:box,objectPosition:object,objectFit:object,overscrollBehavior:overscroll,overscrollBehaviorX:overscroll-x,overscrollBehaviorY:overscroll-y,position:pos/1,top:top,left:left,insetInline:inset-x/insetX,insetBlock:inset-y/insetY,inset:inset,insetBlockEnd:inset-b,insetBlockStart:inset-t,insetInlineEnd:end/insetEnd/1,insetInlineStart:start/insetStart/1,right:right,bottom:bottom,float:float,visibility:vis,display:d,hideFrom:hide,hideBelow:show,flexBasis:basis,flex:flex,flexDirection:flex/flexDir,flexGrow:grow,flexShrink:shrink,gridTemplateColumns:grid-cols,gridTemplateRows:grid-rows,gridColumn:col-span,gridRow:row-span,gridColumnStart:col-start,gridColumnEnd:col-end,gridAutoFlow:grid-flow,gridAutoColumns:auto-cols,gridAutoRows:auto-rows,gap:gap,gridGap:gap,gridRowGap:gap-x,gridColumnGap:gap-y,rowGap:gap-x,columnGap:gap-y,justifyContent:justify,alignContent:content,alignItems:items,alignSelf:self,padding:p/1,paddingLeft:pl/1,paddingRight:pr/1,paddingTop:pt/1,paddingBottom:pb/1,paddingBlock:py/1/paddingY,paddingBlockEnd:pb,paddingBlockStart:pt,paddingInline:px/paddingX/1,paddingInlineEnd:pe/1/paddingEnd,paddingInlineStart:ps/1/paddingStart,marginLeft:ml/1,marginRight:mr/1,marginTop:mt/1,marginBottom:mb/1,margin:m/1,marginBlock:my/1/marginY,marginBlockEnd:mb,marginBlockStart:mt,marginInline:mx/1/marginX,marginInlineEnd:me/1/marginEnd,marginInlineStart:ms/1/marginStart,outlineWidth:ring/ringWidth,outlineColor:ring/ringColor,outline:ring/1,outlineOffset:ring/ringOffset,divideX:divide-x,divideY:divide-y,divideColor:divide,divideStyle:divide,width:w/1,inlineSize:w,minWidth:min-w/minW,minInlineSize:min-w,maxWidth:max-w/maxW,maxInlineSize:max-w,height:h/1,blockSize:h,minHeight:min-h/minH,minBlockSize:min-h,maxHeight:max-h/maxH,maxBlockSize:max-b,color:text,fontFamily:font,fontSize:fs,fontWeight:font,fontSmoothing:smoothing,fontVariantNumeric:numeric,letterSpacing:tracking,lineHeight:leading,textAlign:text,textDecoration:text-decor,textDecorationColor:text-decor,textEmphasisColor:text-emphasis,textDecorationStyle:decoration,textDecorationThickness:decoration,textUnderlineOffset:underline-offset,textTransform:text,textIndent:indent,textShadow:text-shadow,textShadowColor:text-shadow/textShadowColor,textOverflow:text,verticalAlign:align,wordBreak:break,textWrap:text,truncate:truncate,lineClamp:clamp,listStyleType:list,listStylePosition:list,listStyleImage:list-img,backgroundPosition:bg/bgPosition,backgroundPositionX:bg-x/bgPositionX,backgroundPositionY:bg-y/bgPositionY,backgroundAttachment:bg/bgAttachment,backgroundClip:bg-clip/bgClip,background:bg/1,backgroundColor:bg/bgColor,backgroundOrigin:bg-origin/bgOrigin,backgroundImage:bg-img/bgImage,backgroundRepeat:bg-repeat/bgRepeat,backgroundBlendMode:bg-blend/bgBlendMode,backgroundSize:bg/bgSize,backgroundGradient:bg-gradient/bgGradient,textGradient:text-gradient,gradientFrom:from,gradientTo:to,gradientVia:via,borderRadius:rounded/1,borderTopLeftRadius:rounded-tl/roundedTopLeft,borderTopRightRadius:rounded-tr/roundedTopRight,borderBottomRightRadius:rounded-br/roundedBottomRight,borderBottomLeftRadius:rounded-bl/roundedBottomLeft,borderTopRadius:rounded-t/roundedTop,borderRightRadius:rounded-r/roundedRight,borderBottomRadius:rounded-b/roundedBottom,borderLeftRadius:rounded-l/roundedLeft,borderStartStartRadius:rounded-ss/roundedStartStart,borderStartEndRadius:rounded-se/roundedStartEnd,borderStartRadius:rounded-s/roundedStart,borderEndStartRadius:rounded-es/roundedEndStart,borderEndEndRadius:rounded-ee/roundedEndEnd,borderEndRadius:rounded-e/roundedEnd,border:border,borderWidth:border-w,borderTopWidth:border-tw,borderLeftWidth:border-lw,borderRightWidth:border-rw,borderBottomWidth:border-bw,borderColor:border,borderInline:border-x/borderX,borderInlineWidth:border-x/borderXWidth,borderInlineColor:border-x/borderXColor,borderBlock:border-y/borderY,borderBlockWidth:border-y/borderYWidth,borderBlockColor:border-y/borderYColor,borderLeft:border-l,borderLeftColor:border-l,borderInlineStart:border-s/borderStart,borderInlineStartWidth:border-s/borderStartWidth,borderInlineStartColor:border-s/borderStartColor,borderRight:border-r,borderRightColor:border-r,borderInlineEnd:border-e/borderEnd,borderInlineEndWidth:border-e/borderEndWidth,borderInlineEndColor:border-e/borderEndColor,borderTop:border-t,borderTopColor:border-t,borderBottom:border-b,borderBottomColor:border-b,borderBlockEnd:border-be,borderBlockEndColor:border-be,borderBlockStart:border-bs,borderBlockStartColor:border-bs,boxShadow:shadow/1,boxShadowColor:shadow/shadowColor,mixBlendMode:mix-blend,filter:filter,brightness:brightness,contrast:contrast,grayscale:grayscale,hueRotate:hue-rotate,invert:invert,saturate:saturate,sepia:sepia,dropShadow:drop-shadow,blur:blur,backdropFilter:backdrop,backdropBlur:backdrop-blur,backdropBrightness:backdrop-brightness,backdropContrast:backdrop-contrast,backdropGrayscale:backdrop-grayscale,backdropHueRotate:backdrop-hue-rotate,backdropInvert:backdrop-invert,backdropOpacity:backdrop-opacity,backdropSaturate:backdrop-saturate,backdropSepia:backdrop-sepia,borderCollapse:border,borderSpacing:border-spacing,borderSpacingX:border-spacing-x,borderSpacingY:border-spacing-y,tableLayout:table,transitionTimingFunction:ease,transitionDelay:delay,transitionDuration:duration,transitionProperty:transition-prop,transition:transition,animation:animation,animationName:animation-name,animationDelay:animation-delay,transformOrigin:origin,scale:scale,scaleX:scale-x,scaleY:scale-y,translate:translate,translateX:translate-x/x,translateY:translate-y/y,accentColor:accent,caretColor:caret,scrollBehavior:scroll,scrollbar:scrollbar,scrollMargin:scroll-m,scrollMarginLeft:scroll-ml,scrollMarginRight:scroll-mr,scrollMarginTop:scroll-mt,scrollMarginBottom:scroll-mb,scrollMarginBlock:scroll-my/scrollMarginY,scrollMarginBlockEnd:scroll-mb,scrollMarginBlockStart:scroll-mt,scrollMarginInline:scroll-mx/scrollMarginX,scrollMarginInlineEnd:scroll-me,scrollMarginInlineStart:scroll-ms,scrollPadding:scroll-p,scrollPaddingBlock:scroll-pb/scrollPaddingY,scrollPaddingBlockStart:scroll-pt,scrollPaddingBlockEnd:scroll-pb,scrollPaddingInline:scroll-px/scrollPaddingX,scrollPaddingInlineEnd:scroll-pe,scrollPaddingInlineStart:scroll-ps,scrollPaddingLeft:scroll-pl,scrollPaddingRight:scroll-pr,scrollPaddingTop:scroll-pt,scrollPaddingBottom:scroll-pb,scrollSnapAlign:snap,scrollSnapStop:snap,scrollSnapType:snap,scrollSnapStrictness:strictness,scrollSnapMargin:snap-m,scrollSnapMarginTop:snap-mt,scrollSnapMarginBottom:snap-mb,scrollSnapMarginLeft:snap-ml,scrollSnapMarginRight:snap-mr,touchAction:touch,userSelect:select,fill:fill,stroke:stroke,strokeWidth:stroke-w,srOnly:sr,debug:debug,appearance:appearance,backfaceVisibility:backface,clipPath:clip-path,hyphens:hyphens,mask:mask,maskImage:mask-image,maskSize:mask-size,textSizeAdjust:text-size-adjust,container:cq,containerName:cq-name,containerType:cq-type,textStyle:textStyle"

      const classNameByProp = new Map()
      const shorthands = new Map()
      utilities.split(',').forEach((utility) => {
        const [prop, meta] = utility.split(':')
        const [className, ...shorthandList] = meta.split('/')
        classNameByProp.set(prop, className)
        if (shorthandList.length) {
          shorthandList.forEach((shorthand) => {
            shorthands.set(shorthand === '1' ? className : shorthand, prop)
          })
        }
      })

      const resolveShorthand = (prop) => shorthands.get(prop) || prop


                const tokenValues = {}
                const propsByCat = {
        "aspectRatios": [],
        "zIndex": [],
        "spacing": [],
        "breakpoints": [],
        "borderWidths": [],
        "colors": [
          "color"
        ],
        "borders": [],
        "fonts": [],
        "fontSizes": [],
        "fontWeights": [],
        "letterSpacings": [],
        "lineHeights": [],
        "shadows": [],
        "assets": [],
        "radii": [],
        "opacity": [],
        "dropShadows": [],
        "blurs": [],
        "easings": [],
        "durations": [],
        "animations": [],
        "animationName": []
      }
                const propList = new Set(Object.values(propsByCat).flat())

                const categoryByProp = new Map()
                propList.forEach((prop) => {
                  Object.entries(propsByCat).forEach(([category, list]) => {
                    if (list.includes(prop)) {
                      categoryByProp.set(prop, category)
                    }
                  })
                })

                const context = {
        
        conditions: {
          shift: sortConditions,
          finalize: finalizeConditions,
          breakpoints: { keys: ["base","sm","md","lg","xl","2xl"] }
        },
        utility: {
          
          transform: (prop, value) => {
                    const key = resolveShorthand(prop)
                    const propKey = classNameByProp.get(key) || hypenateProperty(key)
                    return { className: \`\${propKey}_\${withoutSpace(value)}\` }

      }            },
          hasShorthand: true,
          toHash: (path, hashFn) => hashFn(path.join(":")),
          resolveShorthand: resolveShorthand,
        }
      }

      const cssFn = createCss(context)
      export const css = (...styles) => cssFn(mergeCss(...styles))
      css.raw = (...styles) => mergeCss(...styles)

      export const { mergeCss, assignCss } = createMergeCss(context)",
        "file": "css.mjs",
      }
    `)
  })

  test('spacing', () => {
    expect(run({}, { categories: ['spacing'] })).toMatchInlineSnapshot(`
      {
        "code": "import { createCss, create{

        // Only throw error if the property is in the list of props
        // bound to a token category and the value is not a valid token value for that category

        if (propList.has(prop)) {
          const category = categoryByProp.get(prop)
          if (category) {
            const values = tokenValues[category]
            if (values && !values.includes(value)) {
              throw new Error(\`[super-strict-tokens]: Unknown value:
       { \${prop}: \${value} }
       Valid values in \${category} are: \${values.join(', ')}\`)
            }
          }
        }
      return MergeCss, hypenateProperty, withoutSpace } from '../helpers.mjs';
      import { sortConditions, finalizeConditions } from './conditions.mjs';

      const utilities = "aspectRatio:aspect,boxDecorationBreak:decoration,zIndex:z,boxSizing:box,objectPosition:object,objectFit:object,overscrollBehavior:overscroll,overscrollBehaviorX:overscroll-x,overscrollBehaviorY:overscroll-y,position:pos/1,top:top,left:left,insetInline:inset-x/insetX,insetBlock:inset-y/insetY,inset:inset,insetBlockEnd:inset-b,insetBlockStart:inset-t,insetInlineEnd:end/insetEnd/1,insetInlineStart:start/insetStart/1,right:right,bottom:bottom,float:float,visibility:vis,display:d,hideFrom:hide,hideBelow:show,flexBasis:basis,flex:flex,flexDirection:flex/flexDir,flexGrow:grow,flexShrink:shrink,gridTemplateColumns:grid-cols,gridTemplateRows:grid-rows,gridColumn:col-span,gridRow:row-span,gridColumnStart:col-start,gridColumnEnd:col-end,gridAutoFlow:grid-flow,gridAutoColumns:auto-cols,gridAutoRows:auto-rows,gap:gap,gridGap:gap,gridRowGap:gap-x,gridColumnGap:gap-y,rowGap:gap-x,columnGap:gap-y,justifyContent:justify,alignContent:content,alignItems:items,alignSelf:self,padding:p/1,paddingLeft:pl/1,paddingRight:pr/1,paddingTop:pt/1,paddingBottom:pb/1,paddingBlock:py/1/paddingY,paddingBlockEnd:pb,paddingBlockStart:pt,paddingInline:px/paddingX/1,paddingInlineEnd:pe/1/paddingEnd,paddingInlineStart:ps/1/paddingStart,marginLeft:ml/1,marginRight:mr/1,marginTop:mt/1,marginBottom:mb/1,margin:m/1,marginBlock:my/1/marginY,marginBlockEnd:mb,marginBlockStart:mt,marginInline:mx/1/marginX,marginInlineEnd:me/1/marginEnd,marginInlineStart:ms/1/marginStart,outlineWidth:ring/ringWidth,outlineColor:ring/ringColor,outline:ring/1,outlineOffset:ring/ringOffset,divideX:divide-x,divideY:divide-y,divideColor:divide,divideStyle:divide,width:w/1,inlineSize:w,minWidth:min-w/minW,minInlineSize:min-w,maxWidth:max-w/maxW,maxInlineSize:max-w,height:h/1,blockSize:h,minHeight:min-h/minH,minBlockSize:min-h,maxHeight:max-h/maxH,maxBlockSize:max-b,color:text,fontFamily:font,fontSize:fs,fontWeight:font,fontSmoothing:smoothing,fontVariantNumeric:numeric,letterSpacing:tracking,lineHeight:leading,textAlign:text,textDecoration:text-decor,textDecorationColor:text-decor,textEmphasisColor:text-emphasis,textDecorationStyle:decoration,textDecorationThickness:decoration,textUnderlineOffset:underline-offset,textTransform:text,textIndent:indent,textShadow:text-shadow,textShadowColor:text-shadow/textShadowColor,textOverflow:text,verticalAlign:align,wordBreak:break,textWrap:text,truncate:truncate,lineClamp:clamp,listStyleType:list,listStylePosition:list,listStyleImage:list-img,backgroundPosition:bg/bgPosition,backgroundPositionX:bg-x/bgPositionX,backgroundPositionY:bg-y/bgPositionY,backgroundAttachment:bg/bgAttachment,backgroundClip:bg-clip/bgClip,background:bg/1,backgroundColor:bg/bgColor,backgroundOrigin:bg-origin/bgOrigin,backgroundImage:bg-img/bgImage,backgroundRepeat:bg-repeat/bgRepeat,backgroundBlendMode:bg-blend/bgBlendMode,backgroundSize:bg/bgSize,backgroundGradient:bg-gradient/bgGradient,textGradient:text-gradient,gradientFrom:from,gradientTo:to,gradientVia:via,borderRadius:rounded/1,borderTopLeftRadius:rounded-tl/roundedTopLeft,borderTopRightRadius:rounded-tr/roundedTopRight,borderBottomRightRadius:rounded-br/roundedBottomRight,borderBottomLeftRadius:rounded-bl/roundedBottomLeft,borderTopRadius:rounded-t/roundedTop,borderRightRadius:rounded-r/roundedRight,borderBottomRadius:rounded-b/roundedBottom,borderLeftRadius:rounded-l/roundedLeft,borderStartStartRadius:rounded-ss/roundedStartStart,borderStartEndRadius:rounded-se/roundedStartEnd,borderStartRadius:rounded-s/roundedStart,borderEndStartRadius:rounded-es/roundedEndStart,borderEndEndRadius:rounded-ee/roundedEndEnd,borderEndRadius:rounded-e/roundedEnd,border:border,borderWidth:border-w,borderTopWidth:border-tw,borderLeftWidth:border-lw,borderRightWidth:border-rw,borderBottomWidth:border-bw,borderColor:border,borderInline:border-x/borderX,borderInlineWidth:border-x/borderXWidth,borderInlineColor:border-x/borderXColor,borderBlock:border-y/borderY,borderBlockWidth:border-y/borderYWidth,borderBlockColor:border-y/borderYColor,borderLeft:border-l,borderLeftColor:border-l,borderInlineStart:border-s/borderStart,borderInlineStartWidth:border-s/borderStartWidth,borderInlineStartColor:border-s/borderStartColor,borderRight:border-r,borderRightColor:border-r,borderInlineEnd:border-e/borderEnd,borderInlineEndWidth:border-e/borderEndWidth,borderInlineEndColor:border-e/borderEndColor,borderTop:border-t,borderTopColor:border-t,borderBottom:border-b,borderBottomColor:border-b,borderBlockEnd:border-be,borderBlockEndColor:border-be,borderBlockStart:border-bs,borderBlockStartColor:border-bs,boxShadow:shadow/1,boxShadowColor:shadow/shadowColor,mixBlendMode:mix-blend,filter:filter,brightness:brightness,contrast:contrast,grayscale:grayscale,hueRotate:hue-rotate,invert:invert,saturate:saturate,sepia:sepia,dropShadow:drop-shadow,blur:blur,backdropFilter:backdrop,backdropBlur:backdrop-blur,backdropBrightness:backdrop-brightness,backdropContrast:backdrop-contrast,backdropGrayscale:backdrop-grayscale,backdropHueRotate:backdrop-hue-rotate,backdropInvert:backdrop-invert,backdropOpacity:backdrop-opacity,backdropSaturate:backdrop-saturate,backdropSepia:backdrop-sepia,borderCollapse:border,borderSpacing:border-spacing,borderSpacingX:border-spacing-x,borderSpacingY:border-spacing-y,tableLayout:table,transitionTimingFunction:ease,transitionDelay:delay,transitionDuration:duration,transitionProperty:transition-prop,transition:transition,animation:animation,animationName:animation-name,animationDelay:animation-delay,transformOrigin:origin,scale:scale,scaleX:scale-x,scaleY:scale-y,translate:translate,translateX:translate-x/x,translateY:translate-y/y,accentColor:accent,caretColor:caret,scrollBehavior:scroll,scrollbar:scrollbar,scrollMargin:scroll-m,scrollMarginLeft:scroll-ml,scrollMarginRight:scroll-mr,scrollMarginTop:scroll-mt,scrollMarginBottom:scroll-mb,scrollMarginBlock:scroll-my/scrollMarginY,scrollMarginBlockEnd:scroll-mb,scrollMarginBlockStart:scroll-mt,scrollMarginInline:scroll-mx/scrollMarginX,scrollMarginInlineEnd:scroll-me,scrollMarginInlineStart:scroll-ms,scrollPadding:scroll-p,scrollPaddingBlock:scroll-pb/scrollPaddingY,scrollPaddingBlockStart:scroll-pt,scrollPaddingBlockEnd:scroll-pb,scrollPaddingInline:scroll-px/scrollPaddingX,scrollPaddingInlineEnd:scroll-pe,scrollPaddingInlineStart:scroll-ps,scrollPaddingLeft:scroll-pl,scrollPaddingRight:scroll-pr,scrollPaddingTop:scroll-pt,scrollPaddingBottom:scroll-pb,scrollSnapAlign:snap,scrollSnapStop:snap,scrollSnapType:snap,scrollSnapStrictness:strictness,scrollSnapMargin:snap-m,scrollSnapMarginTop:snap-mt,scrollSnapMarginBottom:snap-mb,scrollSnapMarginLeft:snap-ml,scrollSnapMarginRight:snap-mr,touchAction:touch,userSelect:select,fill:fill,stroke:stroke,strokeWidth:stroke-w,srOnly:sr,debug:debug,appearance:appearance,backfaceVisibility:backface,clipPath:clip-path,hyphens:hyphens,mask:mask,maskImage:mask-image,maskSize:mask-size,textSizeAdjust:text-size-adjust,container:cq,containerName:cq-name,containerType:cq-type,textStyle:textStyle"

      const classNameByProp = new Map()
      const shorthands = new Map()
      utilities.split(',').forEach((utility) => {
        const [prop, meta] = utility.split(':')
        const [className, ...shorthandList] = meta.split('/')
        classNameByProp.set(prop, className)
        if (shorthandList.length) {
          shorthandList.forEach((shorthand) => {
            shorthands.set(shorthand === '1' ? className : shorthand, prop)
          })
        }
      })

      const resolveShorthand = (prop) => shorthands.get(prop) || prop


                const tokenValues = {
        "spacing": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "14",
          "16",
          "20",
          "24",
          "28",
          "32",
          "36",
          "40",
          "44",
          "48",
          "52",
          "56",
          "60",
          "64",
          "72",
          "80",
          "96",
          "0.5",
          "1.5",
          "2.5",
          "3.5",
          "-1",
          "-2",
          "-3",
          "-4",
          "-5",
          "-6",
          "-7",
          "-8",
          "-9",
          "-10",
          "-11",
          "-12",
          "-14",
          "-16",
          "-20",
          "-24",
          "-28",
          "-32",
          "-36",
          "-40",
          "-44",
          "-48",
          "-52",
          "-56",
          "-60",
          "-64",
          "-72",
          "-80",
          "-96",
          "-0.5",
          "-1.5",
          "-2.5",
          "-3.5"
        ]
      }
                const propsByCat = {
        "spacing": [
          "top",
          "left",
          "insetInline",
          "insetBlock",
          "inset",
          "insetBlockEnd",
          "insetBlockStart",
          "insetInlineEnd",
          "insetInlineStart",
          "right",
          "bottom",
          "gap",
          "gridGap",
          "gridRowGap",
          "gridColumnGap",
          "rowGap",
          "columnGap",
          "padding",
          "paddingLeft",
          "paddingRight",
          "paddingTop",
          "paddingBottom",
          "paddingBlock",
          "paddingBlockEnd",
          "paddingBlockStart",
          "paddingInline",
          "paddingInlineEnd",
          "paddingInlineStart",
          "marginLeft",
          "marginRight",
          "marginTop",
          "marginBottom",
          "margin",
          "marginBlock",
          "marginBlockEnd",
          "marginBlockStart",
          "marginInline",
          "marginInlineEnd",
          "marginInlineStart",
          "outlineOffset",
          "textIndent",
          "borderSpacing",
          "borderSpacingX",
          "borderSpacingY",
          "scrollMargin",
          "scrollMarginLeft",
          "scrollMarginRight",
          "scrollMarginTop",
          "scrollMarginBottom",
          "scrollMarginBlock",
          "scrollMarginBlockEnd",
          "scrollMarginBlockStart",
          "scrollMarginInline",
          "scrollMarginInlineEnd",
          "scrollMarginInlineStart",
          "scrollPadding",
          "scrollPaddingBlock",
          "scrollPaddingBlockStart",
          "scrollPaddingBlockEnd",
          "scrollPaddingInline",
          "scrollPaddingInlineEnd",
          "scrollPaddingInlineStart",
          "scrollPaddingLeft",
          "scrollPaddingRight",
          "scrollPaddingTop",
          "scrollPaddingBottom",
          "scrollSnapMargin",
          "scrollSnapMarginTop",
          "scrollSnapMarginBottom",
          "scrollSnapMarginLeft",
          "scrollSnapMarginRight",
          "insetX",
          "insetY",
          "end",
          "start",
          "p",
          "pl",
          "pr",
          "pt",
          "pb",
          "paddingY",
          "px",
          "paddingEnd",
          "paddingStart",
          "ml",
          "mr",
          "mt",
          "mb",
          "m",
          "marginY",
          "marginX",
          "marginEnd",
          "marginStart",
          "ringOffset",
          "scrollMarginY",
          "scrollMarginX",
          "scrollPaddingY",
          "scrollPaddingX"
        ]
      }
                const propList = new Set(Object.values(propsByCat).flat())

                const categoryByProp = new Map()
                propList.forEach((prop) => {
                  Object.entries(propsByCat).forEach(([category, list]) => {
                    if (list.includes(prop)) {
                      categoryByProp.set(prop, category)
                    }
                  })
                })

                const context = {
        
        conditions: {
          shift: sortConditions,
          finalize: finalizeConditions,
          breakpoints: { keys: ["base","sm","md","lg","xl","2xl"] }
        },
        utility: {
          
          transform: (prop, value) => {
                    const key = resolveShorthand(prop)
                    const propKey = classNameByProp.get(key) || hypenateProperty(key)
                    return { className: \`\${propKey}_\${withoutSpace(value)}\` }

      }            },
          hasShorthand: true,
          toHash: (path, hashFn) => hashFn(path.join(":")),
          resolveShorthand: resolveShorthand,
        }
      }

      const cssFn = createCss(context)
      export const css = (...styles) => cssFn(mergeCss(...styles))
      css.raw = (...styles) => mergeCss(...styles)

      export const { mergeCss, assignCss } = createMergeCss(context)",
        "file": "css.mjs",
      }
    `)
  })

  test('with shorthands: false', () => {
    expect(run({}, { categories: ['spacing'] }, { shorthands: false })).toMatchInlineSnapshot(`
      {
        "code": "import { createCss, createMergeCss, hypenateProperty, withoutSpace } from '../helpers.mjs';
      import { sortConditions, finalizeConditions } from './conditions.mjs';

      const utilities = "aspectRatio:aspect,boxDecorationBreak:decoration,zIndex:z,boxSizing:box,objectPosition:object,objectFit:object,overscrollBehavior:overscroll,overscrollBehaviorX:overscroll-x,overscrollBehaviorY:overscroll-y,position:pos,top:top,left:left,insetInline:inset-x,insetBlock:inset-y,inset:inset,insetBlockEnd:inset-b,insetBlockStart:inset-t,insetInlineEnd:end,insetInlineStart:start,right:right,bottom:bottom,float:float,visibility:vis,display:d,hideFrom:hide,hideBelow:show,flexBasis:basis,flex:flex,flexDirection:flex,flexGrow:grow,flexShrink:shrink,gridTemplateColumns:grid-cols,gridTemplateRows:grid-rows,gridColumn:col-span,gridRow:row-span,gridColumnStart:col-start,gridColumnEnd:col-end,gridAutoFlow:grid-flow,gridAutoColumns:auto-cols,gridAutoRows:auto-rows,gap:gap,gridGap:gap,gridRowGap:gap-x,gridColumnGap:gap-y,rowGap:gap-x,columnGap:gap-y,justifyContent:justify,alignContent:content,alignItems:items,alignSelf:self,padding:p,paddingLeft:pl,paddingRight:pr,paddingTop:pt,paddingBottom:pb,paddingBlock:py,paddingBlockEnd:pb,paddingBlockStart:pt,paddingInline:px,paddingInlineEnd:pe,paddingInlineStart:ps,marginLeft:ml,marginRight:mr,marginTop:mt,marginBottom:mb,margin:m,marginBlock:my,marginBlockEnd:mb,marginBlockStart:mt,marginInline:mx,marginInlineEnd:me,marginInlineStart:ms,outlineWidth:ring,outlineColor:ring,outline:ring,outlineOffset:ring,divideX:divide-x,divideY:divide-y,divideColor:divide,divideStyle:divide,width:w,inlineSize:w,minWidth:min-w,minInlineSize:min-w,maxWidth:max-w,maxInlineSize:max-w,height:h,blockSize:h,minHeight:min-h,minBlockSize:min-h,maxHeight:max-h,maxBlockSize:max-b,color:text,fontFamily:font,fontSize:fs,fontWeight:font,fontSmoothing:smoothing,fontVariantNumeric:numeric,letterSpacing:tracking,lineHeight:leading,textAlign:text,textDecoration:text-decor,textDecorationColor:text-decor,textEmphasisColor:text-emphasis,textDecorationStyle:decoration,textDecorationThickness:decoration,textUnderlineOffset:underline-offset,textTransform:text,textIndent:indent,textShadow:text-shadow,textShadowColor:text-shadow,textOverflow:text,verticalAlign:align,wordBreak:break,textWrap:text,truncate:truncate,lineClamp:clamp,listStyleType:list,listStylePosition:list,listStyleImage:list-img,backgroundPosition:bg,backgroundPositionX:bg-x,backgroundPositionY:bg-y,backgroundAttachment:bg,backgroundClip:bg-clip,background:bg,backgroundColor:bg,backgroundOrigin:bg-origin,backgroundImage:bg-img,backgroundRepeat:bg-repeat,backgroundBlendMode:bg-blend,backgroundSize:bg,backgroundGradient:bg-gradient,textGradient:text-gradient,gradientFrom:from,gradientTo:to,gradientVia:via,borderRadius:rounded,borderTopLeftRadius:rounded-tl,borderTopRightRadius:rounded-tr,borderBottomRightRadius:rounded-br,borderBottomLeftRadius:rounded-bl,borderTopRadius:rounded-t,borderRightRadius:rounded-r,borderBottomRadius:rounded-b,borderLeftRadius:rounded-l,borderStartStartRadius:rounded-ss,borderStartEndRadius:rounded-se,borderStartRadius:rounded-s,borderEndStartRadius:rounded-es,borderEndEndRadius:rounded-ee,borderEndRadius:rounded-e,border:border,borderWidth:border-w,borderTopWidth:border-tw,borderLeftWidth:border-lw,borderRightWidth:border-rw,borderBottomWidth:border-bw,borderColor:border,borderInline:border-x,borderInlineWidth:border-x,borderInlineColor:border-x,borderBlock:border-y,borderBlockWidth:border-y,borderBlockColor:border-y,borderLeft:border-l,borderLeftColor:border-l,borderInlineStart:border-s,borderInlineStartWidth:border-s,borderInlineStartColor:border-s,borderRight:border-r,borderRightColor:border-r,borderInlineEnd:border-e,borderInlineEndWidth:border-e,borderInlineEndColor:border-e,borderTop:border-t,borderTopColor:border-t,borderBottom:border-b,borderBottomColor:border-b,borderBlockEnd:border-be,borderBlockEndColor:border-be,borderBlockStart:border-bs,borderBlockStartColor:border-bs,boxShadow:shadow,boxShadowColor:shadow,mixBlendMode:mix-blend,filter:filter,brightness:brightness,contrast:contrast,grayscale:grayscale,hueRotate:hue-rotate,invert:invert,saturate:saturate,sepia:sepia,dropShadow:drop-shadow,blur:blur,backdropFilter:backdrop,backdropBlur:backdrop-blur,backdropBrightness:backdrop-brightness,backdropContrast:backdrop-contrast,backdropGrayscale:backdrop-grayscale,backdropHueRotate:backdrop-hue-rotate,backdropInvert:backdrop-invert,backdropOpacity:backdrop-opacity,backdropSaturate:backdrop-saturate,backdropSepia:backdrop-sepia,borderCollapse:border,borderSpacing:border-spacing,borderSpacingX:border-spacing-x,borderSpacingY:border-spacing-y,tableLayout:table,transitionTimingFunction:ease,transitionDelay:delay,transitionDuration:duration,transitionProperty:transition-prop,transition:transition,animation:animation,animationName:animation-name,animationDelay:animation-delay,transformOrigin:origin,scale:scale,scaleX:scale-x,scaleY:scale-y,translate:translate,translateX:translate-x,translateY:translate-y,accentColor:accent,caretColor:caret,scrollBehavior:scroll,scrollbar:scrollbar,scrollMargin:scroll-m,scrollMarginLeft:scroll-ml,scrollMarginRight:scroll-mr,scrollMarginTop:scroll-mt,scrollMarginBottom:scroll-mb,scrollMarginBlock:scroll-my,scrollMarginBlockEnd:scroll-mb,scrollMarginBlockStart:scroll-mt,scrollMarginInline:scroll-mx,scrollMarginInlineEnd:scroll-me,scrollMarginInlineStart:scroll-ms,scrollPadding:scroll-p,scrollPaddingBlock:scroll-pb,scrollPaddingBlockStart:scroll-pt,scrollPaddingBlockEnd:scroll-pb,scrollPaddingInline:scroll-px,scrollPaddingInlineEnd:scroll-pe,scrollPaddingInlineStart:scroll-ps,scrollPaddingLeft:scroll-pl,scrollPaddingRight:scroll-pr,scrollPaddingTop:scroll-pt,scrollPaddingBottom:scroll-pb,scrollSnapAlign:snap,scrollSnapStop:snap,scrollSnapType:snap,scrollSnapStrictness:strictness,scrollSnapMargin:snap-m,scrollSnapMarginTop:snap-mt,scrollSnapMarginBottom:snap-mb,scrollSnapMarginLeft:snap-ml,scrollSnapMarginRight:snap-mr,touchAction:touch,userSelect:select,fill:fill,stroke:stroke,strokeWidth:stroke-w,srOnly:sr,debug:debug,appearance:appearance,backfaceVisibility:backface,clipPath:clip-path,hyphens:hyphens,mask:mask,maskImage:mask-image,maskSize:mask-size,textSizeAdjust:text-size-adjust,container:cq,containerName:cq-name,containerType:cq-type,textStyle:textStyle"

      const classNameByProp = new Map()
      utilities.split(',').forEach((utility) => {
        const [prop, className] = utility.split(':')
        classNameByProp.set(prop, className)
      })


                const tokenValues = {
        "spacing": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "14",
          "16",
          "20",
          "24",
          "28",
          "32",
          "36",
          "40",
          "44",
          "48",
          "52",
          "56",
          "60",
          "64",
          "72",
          "80",
          "96",
          "0.5",
          "1.5",
          "2.5",
          "3.5",
          "-1",
          "-2",
          "-3",
          "-4",
          "-5",
          "-6",
          "-7",
          "-8",
          "-9",
          "-10",
          "-11",
          "-12",
          "-14",
          "-16",
          "-20",
          "-24",
          "-28",
          "-32",
          "-36",
          "-40",
          "-44",
          "-48",
          "-52",
          "-56",
          "-60",
          "-64",
          "-72",
          "-80",
          "-96",
          "-0.5",
          "-1.5",
          "-2.5",
          "-3.5"
        ]
      }
                const propsByCat = {
        "spacing": [
          "top",
          "left",
          "insetInline",
          "insetBlock",
          "inset",
          "insetBlockEnd",
          "insetBlockStart",
          "insetInlineEnd",
          "insetInlineStart",
          "right",
          "bottom",
          "gap",
          "gridGap",
          "gridRowGap",
          "gridColumnGap",
          "rowGap",
          "columnGap",
          "padding",
          "paddingLeft",
          "paddingRight",
          "paddingTop",
          "paddingBottom",
          "paddingBlock",
          "paddingBlockEnd",
          "paddingBlockStart",
          "paddingInline",
          "paddingInlineEnd",
          "paddingInlineStart",
          "marginLeft",
          "marginRight",
          "marginTop",
          "marginBottom",
          "margin",
          "marginBlock",
          "marginBlockEnd",
          "marginBlockStart",
          "marginInline",
          "marginInlineEnd",
          "marginInlineStart",
          "outlineOffset",
          "textIndent",
          "borderSpacing",
          "borderSpacingX",
          "borderSpacingY",
          "scrollMargin",
          "scrollMarginLeft",
          "scrollMarginRight",
          "scrollMarginTop",
          "scrollMarginBottom",
          "scrollMarginBlock",
          "scrollMarginBlockEnd",
          "scrollMarginBlockStart",
          "scrollMarginInline",
          "scrollMarginInlineEnd",
          "scrollMarginInlineStart",
          "scrollPadding",
          "scrollPaddingBlock",
          "scrollPaddingBlockStart",
          "scrollPaddingBlockEnd",
          "scrollPaddingInline",
          "scrollPaddingInlineEnd",
          "scrollPaddingInlineStart",
          "scrollPaddingLeft",
          "scrollPaddingRight",
          "scrollPaddingTop",
          "scrollPaddingBottom",
          "scrollSnapMargin",
          "scrollSnapMarginTop",
          "scrollSnapMarginBottom",
          "scrollSnapMarginLeft",
          "scrollSnapMarginRight"
        ]
      }
                const propList = new Set(Object.values(propsByCat).flat())

                const categoryByProp = new Map()
                propList.forEach((prop) => {
                  Object.entries(propsByCat).forEach(([category, list]) => {
                    if (list.includes(prop)) {
                      categoryByProp.set(prop, category)
                    }
                  })
                })

                const context = {
        
        conditions: {
          shift: sortConditions,
          finalize: finalizeConditions,
          breakpoints: { keys: ["base","sm","md","lg","xl","2xl"] }
        },
        utility: {
          
          transform: (key, value) => {

        // Only throw error if the property is in the list of props
        // bound to a token category and the value is not a valid token value for that category

        if (propList.has(prop)) {
          const category = categoryByProp.get(prop)
          if (category) {
            const values = tokenValues[category]
            if (values && !values.includes(value)) {
              throw new Error(\`[super-strict-tokens]: Unknown value:
       { \${prop}: \${value} }
       Valid values in \${category} are: \${values.join(', ')}\`)
            }
          }
        }
      return ({ className: \`\${classNameByProp.get(key) || hypenateProperty(key)}_\${withoutSpace(value)}\` })
      },
          
          toHash: (path, hashFn) => hashFn(path.join(":")),
          resolveShorthand: prop => prop,
        }
      }

      const cssFn = createCss(context)
      export const css = (...styles) => cssFn(mergeCss(...styles))
      css.raw = (...styles) => mergeCss(...styles)

      export const { mergeCss, assignCss } = createMergeCss(context)",
        "file": "css.mjs",
      }
    `)
  })
})
