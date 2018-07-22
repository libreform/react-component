import React, { Fragment } from 'react'
import Parser from 'html-react-parser'

const parseHTML = (str, opts = {}) => {
  const { replace } = opts

  return Parser(str, {
    replace,
  })
}

// eslint-disable-next-line react/prop-types
const HTML = ({ children, options = {} }) => <Fragment>{parseHTML(children, options)}</Fragment>

export default HTML
export { parseHTML }
