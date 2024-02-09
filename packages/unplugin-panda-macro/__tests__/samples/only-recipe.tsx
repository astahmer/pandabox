import 'virtual:panda.css'
import { button } from '../styled-system/recipes'

export const App = () => {
  return <div className={button({ visual: 'funky', size: 'lg' })}>Button</div>
}
