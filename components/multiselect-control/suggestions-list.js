/**
 * External dependencies
 */
import scrollView from 'dom-scroll-into-view';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';

/**
 * Internal dependencies
 */

const handleMouseDown = ( e ) => {
	// By preventing default here, we will not lose focus of <input> when clicking a suggestion.
	e.preventDefault();
};

export function SuggestionsList( {
	selectedIndex,
	scrollIntoView,
	match,
	searchValue,
	onHover,
	onSelect,
	suggestions = [],
	instanceId,
	__experimentalRenderItem,
} ) {
	const [ scrollingIntoView, setScrollingIntoView ] = useState( false );
	const listRef = useRefEffect(
		( listNode ) => {
			// only have to worry about scrolling selected suggestion into view
			// when already expanded.
			let rafId;
			if (
				selectedIndex > -1 &&
				scrollIntoView &&
				listNode.children[ selectedIndex ]
			) {
				setScrollingIntoView( true );
				scrollView(
					listNode.children[ selectedIndex ],
					listNode,
					{
						onlyScrollIfNeeded: true,
					}
				);
				rafId = requestAnimationFrame( () => {
					setScrollingIntoView( false );
				} );
			}

			return () => {
				if ( rafId !== undefined ) {
					cancelAnimationFrame( rafId );
				}
			};
		},
		[ selectedIndex, scrollIntoView ]
	);

	const handleHover = ( suggestion ) => {
		return () => {
			if ( ! scrollingIntoView ) {
				onHover?.( suggestion );
			}
		};
	};

	const handleClick = ( suggestion ) => {
		return () => {
			onSelect?.( suggestion );
		};
	};

	const computeSuggestionMatch = ( suggestion ) => {
	
		const indexOfMatch = suggestion.label
			.toLocaleLowerCase()
			.indexOf( searchValue );

		return {
			suggestionBeforeMatch: suggestion.label.substring(
				0,
				indexOfMatch
			),
			suggestionMatch: suggestion.label.substring(
				indexOfMatch,
				indexOfMatch + searchValue.length
			),
			suggestionAfterMatch: suggestion.label.substring(
				indexOfMatch + searchValue.length
			),
		};
	};
	console.log(suggestions);
	return (
		<ul
			ref={ listRef }
			className="codeamp-components-multiselect-control__suggestions-list"
			id={ `codeamp-components-multiselect-suggestions-${ instanceId }` }
			role="listbox"
		>
			{ suggestions.map( ( suggestion, index ) => {
				const matchText = computeSuggestionMatch( suggestion );
				const className = classnames(
					'codeamp-components-multiselect-control__suggestion',
					{
						'is-selected': index === selectedIndex,
					}
				);

				let output;

				if ( typeof __experimentalRenderItem === 'function' ) {
					output = __experimentalRenderItem( { item: suggestion } );
				} else if ( matchText ) {
					output = (
						<span aria-label={ suggestion.label }>
							{ matchText.suggestionBeforeMatch }
							<strong className="codeamp-components-multiselect-control__suggestion-match">
								{ matchText.suggestionMatch }
							</strong>
							{ matchText.suggestionAfterMatch }
						</span>
					);
				} else {
					output = suggestion.label;
				}

				/* eslint-disable jsx-a11y/click-events-have-key-events */
				return (
					<li
						id={ `codeamp-components-multiselect-suggestions-${ instanceId }-${ index }` }
						role="option"
						className={ className }
						key={
							suggestion.value
						}
						onMouseDown={ handleMouseDown }
						onClick={ handleClick( suggestion ) }
						onMouseEnter={ handleHover( suggestion ) }
						aria-selected={ index === selectedIndex }
					>
						{ output }
					</li>
				);
				/* eslint-enable jsx-a11y/click-events-have-key-events */
			} ) }
		</ul>
	);
}

export default SuggestionsList;