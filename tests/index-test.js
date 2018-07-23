import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import LibreForm, { configure } from 'src/index.js'

configure({
  WordPress: '127.0.0.1:8089',
  scriptLocation: '/script',
})

describe('Component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('renders succesfully', () => {
    // While the component loads pretty much instantly due to the mock server,
    // it's still async and has to wait. TODO: Proper tests maybe.

    render(<LibreForm form="react" />, node, async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      expect(node.innerHTML).toContain('Tests will complete!')
    })
  })
})
