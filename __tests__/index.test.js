import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import WPLF from '@libreform/libreform'
import LibreForm from '../src/index.tsx'

// WPLF.findFormsById(123)

describe('Component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('renders succesfully', () => {
    // While the component loads pretty much instantly due to the mock server,it's still async and has to wait.

    const node = React.createElement(LibreForm, { form: 215 })

    render(node, node, async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (node.innerHTML.indexOf('John Doe')) {
        // all is fine
      } else {
        throw new Error('John Doe was missing, form failed to render!')
      }
    })
  })
})
