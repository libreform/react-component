import React, {Component} from 'react'
import {render} from 'react-dom'

import LibreForm, { configure } from '../../src'

configure({
  WordPress: 'https://libreformbuilder.local',
})

class Demo extends Component {
  render() {
    return <div>
      <h1>react-libre-form Demo</h1>
      <LibreForm form="react"
        onSubmitSuccess={(...arg) => console.log(arg, 'success1')}
        onSubmitDenied={(...arg) => console.log(arg, 'denied1')}
        afterLoad={() => console.log('wtf')}
      />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
