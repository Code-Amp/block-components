# Code Amp Block Components
> React components for the WordPress block editor.

## Install

Run `npm install @codeamp/block-components`

## Project setup

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

## Components

### [MultiselectControl](https://github.com/Code-Amp/block-components/tree/main/components/multiselect-control)

A multi-select control for the block editor based on `FormTokenField`.

### [ResourceSelectControl](https://github.com/Code-Amp/block-components/tree/main/components/resource-select-control)

A resource select control, allowing for the selection of a resource from a list of resources as well as additional actions (primary + secondary) to be performed on the resource.

## Usage

Use imports to include the components in your project.

```jsx
import { MultiselectControl, ResourceSelectControl } from '@codeamp/block-components';
```

The components are tree-shakeable, so you can import only the components you need.

## Project status

This package is currently published as beta while we continue to setup the repository and add testing, but should be completely usable.

Expect updates in the near future.

## Contributing

All contributions are welcome, but at this early stage the priority is to setup testing and improve the documentation.

