# react-libre-form

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]

React component for WP Libre Form. Depends on @libreform/libreform, which is NOT bundled with the package, you have to install it yourself.

# Installation

`npm install @libreform/react-libre-form`

# Dependencies

There are no dependencies, except the peer dependency of html-react-parser, which is required to render the HTML WordPress outputs.
If you're already using a HTML parser w/ WP REST API, I suggest that you migrate to html-react-parser, as react-html-parser is massive.

# Usage

Import and configure, render like any other component

```
import LibreForm, { configure } from 'react-libre-form'

configure({
  WordPress: 'https://libreformbuilder.local',
  i18n: {
    loading: 'Custom loading message',
    scriptTimeout: 'Timeout while loading wplf-client.js',
  }
})

class Demo extends Component {
  render() {
    return <div>
      <h1>react-libre-form Demo</h1>
      <LibreForm form="form-slug"
        onSubmitSuccess={(...arg) => console.log(arg, 'success1')}
        onSubmitDenied={(...arg) => console.log(arg, 'denied1')}
        afterLoad={() => console.log("I'll appear after this form has loaded")}
      />
    </div>
  }
}
```

# Gotchas

## Submit button value is dismissed

If you have `<input type="submit" value="Send form" />` in your form HTML, you might notice that the "Send form" is missing in your rendered form. TL;DR explanation on why this happens: React.

`<button type="submit">Send form</button>` is functionally equivalent and works without an issue.

[build-badge]: https://img.shields.io/travis/libreform/react-libre-form/master.png?style=flat-square
[build]: https://travis-ci.org/libreform/react-libre-form
[npm-badge]: https://img.shields.io/npm/v/react-libre-form.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-libre-form
[coveralls-badge]: https://img.shields.io/coveralls/libreform/react-libre-form/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/libreform/react-libre-form
