# Code Amp Block Components
> React components for the WordPress block editor.

## Install

Run `npm install @codeamp/block-components`

### Project setup

These components contain co-located styles (SASS) and scripts, with styles being imported into the component's JavaScript file.

Eg:

```jsx
import './style.scss';
```

This means your project will need to be setup to handle these types of imports.

For a webpack environment, this usually means adding the something similar to the following to your webpack config:

```js
 {
	test: /\.scss$/,
	use: [
		MiniCssExtractPlugin.loader,
		"css-loader",
		"sass-loader"
	]
},
```

[Additional configuration required, checkout the webpack docs for more info](https://webpack.js.org/plugins/mini-css-extract-plugin/).

# Project status

This package is currently published as beta while we continue to setup the repository and add testing, but should be completely usable.

Expect updates in the near future.

# Contributing

All contributions are welcome, but at this early stage the priority is to setup testing and improve the documentation.

