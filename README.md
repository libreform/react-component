# React component for WP Libre Form

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]

React component for WP Libre Form. Depends on @libreform/libreform, which is NOT bundled with the package, you have to install it yourself.

# Installation

`npm install @libreform/react-component-libre-form`

# Usage

Like any other component. Should work just like WPLF works without React. If you need access to the dom node, you can create a ref with `useRef()` and pass it into the component as property.

```
import LibreForm from '@libreform/react-component'

function Demo() {
  const ref = useRef(null)

  return <div>
    <h1>Demo</h1>
    <LibreForm form="form-slug" ref={ref} className="myClassName" IfErrors={YourErrorComponent} WhileLoading{YourLoadingComponent} />
  </div>
}

```

# Gotchas

This is just a dangerouslySetInnerHTML wrapper & bindings for WPLF. There's no sanitation. You should know the risks of unrestricted HTML.

[build-badge]: https://img.shields.io/travis/libreform/react-component/master.png?style=flat-square
[build]: https://travis-ci.org/libreform/react-component
[npm-badge]: https://img.shields.io/npm/v/react-component.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-component
[coveralls-badge]: https://img.shields.io/coveralls/libreform/react-component/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/libreform/react-component
