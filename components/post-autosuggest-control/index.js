/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ComboboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export function PostAutoSuggestControl( { onChange, value } ) {
	const [ fieldValue, setFieldValue ] = useState( false );
	const isSearching = fieldValue;

	const { items, selectedLabel } = useSelect(
		( select ) => {
			const { searchPosts, getPost } = select(
				'custom-layouts/template'
			);
			/*
			// Perform a search when the field is changed.
			if ( isSearching ) {
				query.search = fieldValue;
			}
			*/
			const post = getPost( value );
			return {
				items: searchPosts( fieldValue ),
				selectedLabel: post?.title,
			};
		},
		[ fieldValue ]
	);

	const pageItems = items || [];

	if ( value && pageItems.length === 0 ) {
		//always prepend the current selected option, so the label can be found
		const foundValueInList = pageItems.find(
			( element ) => element.value === value
		);
		if ( ! foundValueInList ) {
			pageItems.unshift( { value, label: selectedLabel } );
		}
	}

	/**
	 * @param inputValue
	 */
	const handleKeydown = ( inputValue ) => {
		setFieldValue( inputValue );
	};

	return (
		<>
			<ComboboxControl
				className="custom-layouts-combobox-control--post"
				label={ __( 'Find post (all post types)', 'custom-layouts' ) }
				value={ value }
				options={ pageItems }
				onFilterValueChange={ debounce( handleKeydown, 200 ) }
				onChange={ onChange }
			/>
		</>
	);
}

export default PostAutoSuggestControl;
