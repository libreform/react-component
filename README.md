# react-libre-form

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

React component for WP Libre Form. Give it the location of your WordPress instance and the form slug and it handles the rest.

And if that's not good enough for you, it's rather flexible and can be customized.

The "API" may change until 1.0.0 is reached, after which semantic versioning will be used.

# Installation

`npm install react-libre-form`

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
        afterLoad={() => console.log('wtf')}
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
