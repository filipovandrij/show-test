import { createRoot } from 'react-dom/client'
import { timer } from '../../utils/timer'
import GoogleSearchFilter from './GoogleSearchFilter';

(async () => {
  const addFilter = () => {
    const container = document.querySelector('#rcnt')
    if (container) {
      container.setAttribute('style', 'flex-wrap: nowrap; margin-left: 10px')
      const div = container.querySelector('#react-filter')
      if (div) div.remove()

      const app = document.createElement('div')
      app.id = 'react-filter'

      container.prepend(app)

      const root = createRoot(app)
      root.render(<GoogleSearchFilter/>)
    }
  }

  timer(3000).then(() => addFilter())
})()