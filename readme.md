# Code Amp Block Componentts
> React components for the WordPress block editor.

## Install

Run `npm install`

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
