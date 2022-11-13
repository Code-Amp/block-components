# MultiSelectControl

![Demo](_resources/multi-select-control.gif)

A multi-select control in the style of Gutenberg components.

This is a modified version of `FormTokenField` - behaving more like a multiselect.

The main differences:
- Takes an array of value/label pairs for populating the options/suggestions
- Options are immediately shown on keyboard interaction or click event (rather than waiting for 2 characters to be entered before display)
- There is no ability to create new tokens (i.e., create a new tag from within the control itself) - you can only select from the options supplied to the control

See [Form Token Field](https://github.com/WordPress/gutenberg/tree/master/packages/components/src/form-token-field) in the Gutenberg Documentation for more information.

## Keyboard Accessibility

- `left arrow` - if input field is empty, move insertion point before previous token
- `right arrow` - if input field is empty, move insertion point after next token
- `up arrow` - select previous suggestion
- `down arrow` - open the suggestions or select next suggestion

## Properties

- `value` - An array of strings representing the options selected, as values
```javascript
[ 'post', 'page', 'product' ]
```
- `options` - An array of objects with value/label pairs
```javascript
[
	{
		value: 'post',
		label: 'Post',
	},
	{
		value: 'page',
		label: 'Page',
	},
 	{
		value: 'product',
		label: 'Product',
	},
]
```
Should support most of the properties from [Form Token Field](https://github.com/WordPress/gutenberg/tree/master/packages/components/src/form-token-field)

## Usage

```jsx
import { MultiselectControl } from '@codeamp/block-components';
import { withState } from '@wordpress/compose';

const MyMultiSelectControl = withState( {
	value: [],
	options: [
		{
			value: 'africa',
			label: 'Africa',
		},
		{
			value: 'america',
			label: 'America',
		},
		{
			value: 'asia',
			label: 'Asia',
		},
		{
			value: 'europe',
			label: 'Europe',
		},
		{
			value: 'oceania',
			label: 'Oceania',
		},
	],
} )( ( { value, options, setState } ) => ( 
	<MultiSelectControl 
		value={ value } 
		options={ options } 
		onChange={ value => setState( { value } ) }
	/>
) );
```
Then add:
```jsx
<MyMultiSelectControl />
```
To your render method.
