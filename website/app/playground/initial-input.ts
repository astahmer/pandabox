import styled from 'styled-components'

const Link = styled.a`
  background: papayawhip;
  color: #bf4f74;
`

const Icon = styled.svg`
  width: 48px;
  height: 48px;

  ${Link}:hover & {
    fill: rebeccapurple;
  }
`

const TomatoButton = styled(Link)`
  color: tomato;
  border-color: tomato;
`

const Thingy = styled('div')`
  font-size: 1.5em;
`
