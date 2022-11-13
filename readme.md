# Code Amp Block Components
> React components for the WordPress block editor.

*Inspired by the work in [10up/block-components](https://github.com/10up/block-components)*

## Install

Run `npm install @codeamp/block-components`

## Components

- [MultiSelectControl](https://github.com/Code-Amp/block-components/tree/main/components/multi-select-control)

  A multi-select control for the block editor based on `FormTokenField`.

- [ResourceSelectControl](https://github.com/Code-Amp/block-components/tree/main/components/resource-select-control)

  A select control with actions for creating and editing resources.

## Usage

Use imports to include the components in your project.

```jsx
import { MultiSelectControl, ResourceSelectControl } from '@codeamp/block-components';
```

## Requirements

This project is depends on the WordPress block editor and such it expects those packages to already be installed/aliased.

Ensure you add [@wordpress/dependency-extraction-webpack-plugin](https://www.npmjs.com/package/@wordpress/dependency-extraction-webpack-plugin) to your project or manually install the WordPress packages.

If you use [@wordpress/create-block](https://www.npmjs.com/package/@wordpress/create-block) to create a plugin, this is handled for you automatically.

## Project status

This package is currently published as beta while we continue to setup the repository and add testing, but should be completely usable.

## Contributing

All contributions are welcome, but at this early stage the priority is to setup testing and improve the documentation.

