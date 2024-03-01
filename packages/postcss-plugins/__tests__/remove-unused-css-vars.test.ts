import { expect, test } from 'vitest'
import postcss from 'postcss'
import { removeUnusedCssVars } from '../src/remove-unused-css-vars'

import { readFileSync } from 'node:fs'
import path from 'node:path'

const sampleCss = readFileSync(path.join(__dirname, './sample.css'), 'utf8')

test('remove-unused-css-vars', () => {
  expect(postcss([removeUnusedCssVars]).process(sampleCss).toString()).toMatchInlineSnapshot(`
    "@layer reset, base, tokens, recipes, utilities;

    @layer reset{
      html {
        --font-fallback: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -moz-tab-size: 4;
        tab-size: 4;
        line-height: 1.5;
        font-family: var(--global-font-body, var(--font-fallback));
    }

      * {
        margin: 0px;
        padding: 0px;
        font: inherit;
    }

      *,*::before,*::after {
        box-sizing: border-box;
        border-width: 0px;
        border-style: solid;
        border-color: var(--global-color-border, currentColor);
    }

      hr {
        height: 0px;
        color: inherit;
        border-top-width: 1px;
    }

      body {
        height: 100%;
    }

      img {
        border-style: none;
    }

      img,svg,video,canvas,audio,iframe,embed,object {
        display: block;
        vertical-align: middle;
    }

      img,video {
        max-width: 100%;
        height: auto;
    }

      p,h1,h2,h3,h4,h5,h6 {
        overflow-wrap: break-word;
    }

      ol,ul {
        list-style: none;
    }

      code,kbd,pre,samp {
        font-size: 1em;
    }

      button,[type='button'],[type='reset'],[type='submit'] {
        -webkit-appearance: button;
        background-color: var(--colors-transparent);
        background-image: none;
    }

      button,input,optgroup,select,textarea {
        color: inherit;
    }

      button,select {
        text-transform: none;
    }

      table {
        text-indent: 0px;
        border-collapse: collapse;
        border-color: inherit;
    }

      input::placeholder,textarea::placeholder {
        opacity: 1;
        color: var(--global-color-placeholder, #9ca3af);
    }

      textarea {
        resize: vertical;
    }

      summary {
        display: list-item;
    }

      small {
        font-size: 80%;
    }

      sub,sup {
        position: relative;
        vertical-align: baseline;
        font-size: 75%;
        line-height: 0;
    }

      sub {
        bottom: -0.25em;
    }

      sup {
        top: -0.5em;
    }

      dialog {
        padding: 0px;
    }

      a {
        color: inherit;
        text-decoration: inherit;
    }

      abbr:where([title]) {
        text-decoration: underline dotted;
    }

      b,strong {
        font-weight: bolder;
    }

      code,kbd,samp,pre {
        --font-mono-fallback: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New';
        font-size: 1em;
        font-family: var(--global-font-mono, var(--font-mono-fallback));
    }

      input[type="text"],input[type="email"],input[type="search"],input[type="password"] {
        -webkit-appearance: none;
        -moz-appearance: none;
    }

      input[type='search'] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
    }

      ::-webkit-search-decoration,::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

      ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
    }

      input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button {
        height: auto;
    }

      input[type='number'] {
        -moz-appearance: textfield;
    }

      :-moz-ui-invalid {
        box-shadow: none;
    }

      :-moz-focusring {
        outline: auto;
    }

      [hidden] {
        display: none !important;
    }
    }

    @layer base{
      :root {
        --made-with-panda: '🐼';
    }

      * {
        min-height: var(--sizes-0);
    }

      html,body {
        height: var(--sizes-full);
        color: var(--colors-text\\.main);
        background-color: var(--colors-bg\\.main);
    }
    }

    @layer tokens{
      :where(:root, :host) {
        --borders-none: none;
        --radii-sm: 0.25rem;
        --radii-md: 0.375rem;
        --radii-lg: 0.5rem;
        --font-weights-semibold: 600;
        --font-weights-bold: 700;
        --sizes-0: 0rem;
        --sizes-4: 1rem;
        --sizes-8xl: 90rem;
        --sizes-full: 100%;
        --font-sizes-md: clamp(1.2rem, 1.1068rem + 0.4663vi, 1.6663rem);
        --font-sizes-sm: clamp(1rem, 0.95rem + 0.25vi, 1.25rem);
        --font-sizes-xs: clamp(0.8333rem, 0.8125rem + 0.1044vi, 0.9377rem);
        --colors-black: #000;
        --colors-white: #fff;
        --colors-transparent: rgb(0 0 0 / 0);
        --colors-purple-200: #e9d5ff;
        --colors-purple-300: #d8b4fe;
        --colors-purple-400: #c084fc;
        --colors-purple-600: #9333ea;
        --colors-blue-100: #dbeafe;
        --colors-blue-200: #bfdbfe;
        --colors-blue-300: #93c5fd;
        --colors-blue-400: #60a5fa;
        --colors-blue-500: #3b82f6;
        --colors-blue-600: #2563eb;
        --colors-blue-700: #1d4ed8;
        --colors-sky-200: #bae6fd;
        --colors-sky-300: #7dd3fc;
        --colors-sky-400: #38bdf8;
        --colors-sky-500: #0ea5e9;
        --colors-sky-600: #0284c7;
        --colors-yellow-200: #fef08a;
        --colors-yellow-400: #facc15;
        --colors-yellow-500: #eab308;
        --colors-yellow-600: #ca8a04;
        --colors-gray-100: #f3f4f6;
        --colors-gray-200: #e5e7eb;
        --colors-gray-300: #d1d5db;
        --colors-gray-400: #9ca3af;
        --colors-gray-500: #6b7280;
        --colors-gray-600: #4b5563;
        --colors-gray-700: #374151;
        --colors-whiteish: rgba(255, 255, 255, 0.87);
        --colors-blackish: #242424;
        --spacing-2: 0.5rem;
        --spacing-3: 0.75rem;
        --spacing-4: 1rem;
        --spacing-5: 1.25rem;
        --spacing-6: 1.5rem;
        --spacing-8: 2rem;
        --colors-text\\.main: var(--colors-blackish);
        --colors-bg\\.main: var(--colors-whiteish);
    }

      :where(.dark, [data-theme="dark"]) {
        --colors-text\\.main: var(--colors-whiteish);
        --colors-bg\\.main: var(--colors-blackish)
    }

      @keyframes spin {
        to {
          transform: rotate(360deg);
    }
    }

      @keyframes ping {
        75%,100% {
          transform: scale(2);
          opacity: 0;
    }
    }

      @keyframes pulse {
        50% {
          opacity: 0.5;
    }
    }

      @keyframes bounce {
        0%,100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8,0,1,1);
    }

        50% {
          transform: none;
          animation-timing-function: cubic-bezier(0,0,0.2,1);
    }
    }
    }

    @layer utilities{
      @layer compositions{

        .textStyle_3xl {
          font-size: clamp(2.4883rem, 1.9338rem + 2.7726vi, 5.2609rem);
          line-height: 1.05;
    }

        .textStyle_xl {
          font-size: clamp(1.728rem, 1.4815rem + 1.2327vi, 2.9607rem);
          line-height: 1.05;
    }

        .textStyle_md {
          font-size: clamp(1.2rem, 1.1068rem + 0.4663vi, 1.6663rem);
          line-height: 1.05;
    }
    }

      .color-palette_yellow {
        --colors-color-palette-200: var(--colors-yellow-200);
        --colors-color-palette-400: var(--colors-yellow-400);
        --colors-color-palette-500: var(--colors-yellow-500);
        --colors-color-palette-600: var(--colors-yellow-600);
    }

      .pointer-events_none {
        pointer-events: none;
    }

      .transition_colors {
        transition-property: var(--transition-prop, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke);
        transition-timing-function: var(--transition-easing, cubic-bezier(0.4, 0, 0.2, 1));
        transition-duration: var(--transition-duration, 150ms);
    }

      .color-palette_gray {
        --colors-color-palette-200: var(--colors-gray-200);
        --colors-color-palette-400: var(--colors-gray-400);
        --colors-color-palette-500: var(--colors-gray-500);
        --colors-color-palette-600: var(--colors-gray-600);
    }

      .pos_relative {
        position: relative;
    }

      .d_flex {
        display: flex;
    }

      .cursor_pointer {
        cursor: pointer;
    }

      .w_40px {
        width: 40px;
    }

      .h_40px {
        height: 40px;
    }

      .rounded_md {
        border-radius: var(--radii-md);
    }

      .bg_gray\\.100 {
        background: var(--colors-gray-100);
    }

      .w_100\\% {
        width: 100%;
    }

      .max-w_100vw {
        max-width: 100vw;
    }

      .h_100vh {
        height: 100vh;
    }

      .max-h_100vh {
        max-height: 100vh;
    }

      .text_text\\.main {
        color: var(--colors-text\\.main);
    }

      .bg_white\\/6 {
        --mix-background: color-mix(in srgb, var(--colors-white) 6%, transparent);
        background: var(--mix-background, var(--colors-white));
    }

      .p_3 {
        padding: var(--spacing-3);
    }

      .gap_10px {
        gap: 10px;
    }

      .h_100\\% {
        height: 100%;
    }

      .color-palette_blue {
        --colors-color-palette-200: var(--colors-blue-200);
        --colors-color-palette-400: var(--colors-blue-400);
        --colors-color-palette-500: var(--colors-blue-500);
        --colors-color-palette-600: var(--colors-blue-600);
    }

      .text_colorPalette\\.500 {
        color: var(--colors-color-palette-500);
    }

      .px_2 {
        padding-inline: var(--spacing-2);
    }

      .w_auto {
        width: auto;
    }

      .color-palette_sky {
        --colors-color-palette-200: var(--colors-sky-200);
        --colors-color-palette-400: var(--colors-sky-400);
        --colors-color-palette-500: var(--colors-sky-500);
        --colors-color-palette-600: var(--colors-sky-600);
    }

      .text_sky\\.500 {
        color: var(--colors-sky-500);
    }

      .color-palette_purple {
        --colors-color-palette-200: var(--colors-purple-200);
        --colors-color-palette-400: var(--colors-purple-400);
        --colors-color-palette-500: var(--colors-purple-500);
        --colors-color-palette-600: var(--colors-purple-600);
    }

      .box-size_full {
        width: var(--sizes-full);
        height: var(--sizes-full);
    }

      .px_4 {
        padding-inline: var(--spacing-4);
    }

      .direction_vertical {
        direction: vertical;
    }

      .direction_horizontal {
        direction: horizontal;
    }

      .text_black {
        color: var(--colors-black);
    }

      .overflow_hidden {
        overflow: hidden;
    }

      .ring_none {
        outline: var(--borders-none);
    }

      .box-size_4 {
        width: var(--sizes-4);
        height: var(--sizes-4);
    }

      .rounded_sm {
        border-radius: var(--radii-sm);
    }

      .flex_1 {
        flex: 1 1 0%;
    }

      .gap_6 {
        gap: var(--spacing-6);
    }

      .gap_5 {
        gap: var(--spacing-5);
    }

      .rounded_lg {
        border-radius: var(--radii-lg);
    }

      .p_4 {
        padding: var(--spacing-4);
    }

      .min-h_initial {
        min-height: initial;
    }

      .text_gray\\.500 {
        color: var(--colors-gray-500);
    }

      .d_grid {
        display: grid;
    }

      .gap_4 {
        gap: var(--spacing-4);
    }

      .max-w_8xl {
        max-width: var(--sizes-8xl);
    }

      .mx_auto {
        margin-inline: auto;
    }

      .text_muted {
        color: muted;
    }

      .duration_100ms {
        --transition-duration: 100ms;
        transition-duration: 100ms;
    }

      .justify_center {
        justify-content: center;
    }

      .items_center {
        align-items: center;
    }

      .font_Inter {
        font-family: Inter;
    }

      .pt_2 {
        padding-top: var(--spacing-2);
    }

      .flex_column {
        flex-direction: column;
    }

      .flex_row {
        flex-direction: row;
    }

      .ml_auto {
        margin-left: auto;
    }

      .border-w_1px {
        border-width: 1px;
    }

      .border_sky\\.500\\/25 {
        --mix-borderColor: color-mix(in srgb, var(--colors-sky-500) 25%, transparent);
        border-color: var(--mix-borderColor, var(--colors-sky-500));
    }

      .bg_colorPalette\\.200\\/70 {
        --mix-backgroundColor: color-mix(in srgb, var(--colors-color-palette-200) 70%, transparent);
        background-color: var(--mix-backgroundColor, var(--colors-color-palette-200));
    }

      .border_purple\\.300\\/25 {
        --mix-borderColor: color-mix(in srgb, var(--colors-purple-300) 25%, transparent);
        border-color: var(--mix-borderColor, var(--colors-purple-300));
    }

      .items_stretch {
        align-items: stretch;
    }

      .bg_gray\\.100 {
        background-color: var(--colors-gray-100);
    }

      .pt_8 {
        padding-top: var(--spacing-8);
    }

      .justify_space-between {
        justify-content: space-between;
    }

      .font_bold {
        font-weight: var(--font-weights-bold);
    }

      .grid-cols_repeat\\(1\\,_minmax\\(0\\,_1fr\\)\\) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }

      .mt_4 {
        margin-top: var(--spacing-4);
    }

      .fs_sm {
        font-size: var(--font-sizes-sm);
    }

      .font_semibold {
        font-weight: var(--font-weights-semibold);
    }

      .fs_xs {
        font-size: var(--font-sizes-xs);
    }

      .fs_md {
        font-size: var(--font-sizes-md);
    }

      .dark .dark\\:bg_gray\\.700,[data-theme="dark"] .dark\\:bg_gray\\.700 {
        background: var(--colors-gray-700);
    }

      .dark .dark\\:bg_white\\/8,[data-theme="dark"] .dark\\:bg_white\\/8 {
        --mix-background: color-mix(in srgb, var(--colors-white) 8%, transparent);
        background: var(--mix-background, var(--colors-white));
    }

      .light .light\\:bg_gray\\.100,[data-theme="light"] .light\\:bg_gray\\.100 {
        background: var(--colors-gray-100);
    }

      .dark .dark\\:text_colorPalette\\.200,[data-theme="dark"] .dark\\:text_colorPalette\\.200 {
        color: var(--colors-color-palette-200);
    }

      .dark .dark\\:text_sky\\.200,[data-theme="dark"] .dark\\:text_sky\\.200 {
        color: var(--colors-sky-200);
    }

      [data-resize-handle-active] .resizeHandleActive\\:d_none,[data-panel-group-direction="vertical"] .panelVerticalActive\\:d_none,[data-panel-group-direction="horizontal"] .panelHorizontalActive\\:d_none {
        display: none;
    }

      .light .light\\:text_blue\\.500,[data-theme="light"] .light\\:text_blue\\.500 {
        color: var(--colors-blue-500);
    }

      .dark .dark\\:text_blue\\.400,[data-theme="dark"] .dark\\:text_blue\\.400 {
        color: var(--colors-blue-400);
    }

      .dark .dark\\:text_gray\\.300,[data-theme="dark"] .dark\\:text_gray\\.300 {
        color: var(--colors-gray-300);
    }

      .dark .dark\\:text_sky\\.300,[data-theme="dark"] .dark\\:text_sky\\.300 {
        color: var(--colors-sky-300);
    }

      .hover\\:bg_colorPalette\\.400:is(:hover, [data-hover]) {
        background: var(--colors-color-palette-400);
    }

      .hover\\:text_white:is(:hover, [data-hover]) {
        color: var(--colors-white);
    }

      .hover\\:border_transparent:is(:hover, [data-hover]) {
        border-color: var(--colors-transparent);
    }

      .group:is(:hover, [data-hover]) .light .light\\:groupHover\\:text_blue\\.700,.group:is(:hover, [data-hover]) [data-theme="light"] .light\\:groupHover\\:text_blue\\.700 {
        color: var(--colors-blue-700);
    }

      .dark .hover\\:dark\\:bg_colorPalette\\.600:is(:hover, [data-hover]),[data-theme="dark"] .hover\\:dark\\:bg_colorPalette\\.600:is(:hover, [data-hover]) {
        background: var(--colors-color-palette-600);
    }

      .dark .hover\\:dark\\:text_blue\\.300:is(:hover, [data-hover]),[data-theme="dark"] .hover\\:dark\\:text_blue\\.300:is(:hover, [data-hover]) {
        color: var(--colors-blue-300);
    }

      .light .hover\\:light\\:text_blue\\.500:is(:hover, [data-hover]),[data-theme="light"] .hover\\:light\\:text_blue\\.500:is(:hover, [data-hover]) {
        color: var(--colors-blue-500);
    }

      .dark .group:is(:hover, [data-hover]) .groupHover\\:dark\\:text_blue\\.100,[data-theme="dark"] .group:is(:hover, [data-hover]) .groupHover\\:dark\\:text_blue\\.100 {
        color: var(--colors-blue-100);
    }

      @media screen and (min-width: 40rem) {
        .sm\\:mt_8 {
          margin-top: var(--spacing-8);
    }
        .sm\\:grid-cols_repeat\\(2\\,_minmax\\(0\\,_1fr\\)\\) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    }

      @media screen and (min-width: 48rem) {
        .md\\:gap_6 {
          gap: var(--spacing-6);
    }
        .md\\:p_6 {
          padding: var(--spacing-6);
    }
        .md\\:px_6 {
          padding-inline: var(--spacing-6);
    }
        .md\\:flex_row {
          flex-direction: row;
    }
        .md\\:grid-cols_repeat\\(3\\,_minmax\\(0\\,_1fr\\)\\) {
          grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    }

      @media screen and (min-width: 64rem) {
        .lg\\:px_8 {
          padding-inline: var(--spacing-8);
    }
    }

      @media screen and (max-width: 47.9975rem) {
        .show_md {
          display: none;
    }
    }
    }"
  `)
})
