import { createRoot } from 'react-dom/client'
import LinkedinSearchFilter from './LinkedinSearchFilter'
import { timer } from '../../utils/timer';

(() => {
  const addFilter = () => {
    const container = document.querySelector('.scaffold-layout')
    if (container) {
      const div = container.querySelector('#react-filter')
      if (div) div.remove()

      const app = document.createElement('div')
      app.id = 'react-filter'
      app.setAttribute('style', 'position: absolute; top: 150px; left: 10px')

      container.appendChild(app)

      const root = createRoot(app)
      root.render(<LinkedinSearchFilter/>)
    }
  }

  timer(3000).then(() => addFilter())
})()
