import type { TokenPaths } from '../src/define-theme'

type ExampleInput = {
  blue: {
    500: { value: '#0000ff' }
  }
  primary: {
    value: 'red'
  }
  text: {
    DEFAULT: { value: 'xxx' }
    foreground: { value: 'xxx' }
    background: { value: 'xxx' }
    heading: {
      DEFAULT: { value: 'xxx' }
      subheading: { value: 'xxx' }
      nested: {
        DEFAULT: { value: 'xxx' }
        very: {
          DEFAULT: { value: 'xxx' }
          deep: { value: 'xxx' }
        }
      }
    }
  }
}
type ExamplePaths = TokenPaths<ExampleInput>
//    ^?

// type ExamplePaths = "blue.500" | "primary" | "text.background" | "text.foreground" | "text.heading.subheading" | "text.heading.nested.very.deep"
// type ExamplePaths = "blue" | "blue.500" | "primary" | "text" | "text.background" | "text.foreground" | "text.heading" | "text.heading.subheading" | "text.heading.nested" | "text.heading.nested.very" | "text.heading.nested.very.deep"
// "blue.500" | "primary" | "text" | "text.background" | "text.foreground" | "text.heading" | "text.heading.subheading" | "text.heading.nested" | "text.heading.nested.very" | "text.heading.nested.very.deep"
