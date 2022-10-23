/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce, useInstanceId, usePrevious } from '@wordpress/compose';
import { speak } from '@wordpress/a11y';
import isShallowEqual from '@wordpress/is-shallow-equal';
import { Flex, FlexItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Token from './token';
import TokenInput from './token-input';
import SuggestionsList from './suggestions-list';
// import { StyledLabel } from '../base-control/styles/base-control-styles';

// Styles
import "./style.scss"

function getMatch( optionLabel, options = [] ) {
	if ( optionLabel === '' ) {
		return null;
	}
	const computedOptionLabel = optionLabel ?? '';
	const foundOption = options.find( ( option ) => {
			return option.label.toLocaleLowerCase().indexOf(  computedOptionLabel.trim().toLocaleLowerCase() ) !== -1

		} );
	return foundOption;
}
const noop = () => {};
/**
 * A `FormTokenField` is a field similar to the tags and categories fields in the interim editor chrome,
 * or the "to" field in Mail on OS X. Tokens can be entered by typing them or selecting them from a list of suggested tokens.
 *
 * Up to one hundred suggestions that match what the user has typed so far will be shown from which the user can pick from (auto-complete).
 * Tokens are separated by the "," character. Suggestions can be selected with the up or down arrows and added with the tab or enter key.
 *
 * The `value` property is handled in a manner similar to controlled form components.
 * See [Forms](http://facebook.github.io/react/docs/forms.html) in the React Documentation for more information.
 */
export function MultiselectControl( props ) {
	const {
		autoCapitalize,
		autoComplete,
		maxLength,
		placeholder,
		label = __( 'Add item' ),
		className,
		suggestions = [],
		options = [],
		maxSuggestions = 100,
		value = [],
		onChange = () => {},
		onInputChange = () => {},
		onFocus = undefined,
		isBorderless = false,
		closeSuggestionsOnSelection = false,
		disabled = false,
		messages = {
			added: __( 'Item added.' ),
			removed: __( 'Item removed.' ),
			remove: __( 'Remove item' ),
			__experimentalInvalid: __( 'Invalid item' ),
		},
		__experimentalRenderItem,
		__experimentalAutoSelectFirstMatch = true,
		__experimentalValidateInput = () => true,
		__next36pxDefaultSize = false,
	} = props;

	const instanceId = useInstanceId( MultiselectControl, 'codeamp-components-multiselect-control' );

	// We reset to these initial values again in the onBlur
	const [ incompleteTokenValue, setIncompleteTokenValue ] = useState( '' );
	const [ inputOffsetFromEnd, setInputOffsetFromEnd ] = useState( 0 );
	const [ isActive, setIsActive ] = useState( false );
	const [ isExpanded, setIsExpanded ] = useState( false );
	const [ selectedSuggestionIndex, setSelectedSuggestionIndex ] =
		useState( -1 );
	const [ selectedSuggestionScroll, setSelectedSuggestionScroll ] =
		useState( false );

	const prevSuggestions = usePrevious( suggestions );
	const prevValue = usePrevious( value );

	const input = useRef( null );
	const tokensAndInput = useRef( null );

	const debouncedSpeak = useDebounce( speak, 500 );

	useEffect( () => {
		// Make sure to focus the input when the isActive state is true.
		if ( isActive && ! hasFocus() ) {
			focus();
		}
	}, [ isActive ] );

	useEffect( () => {
		const suggestionsDidUpdate = ! isShallowEqual(
			suggestions,
			prevSuggestions || []
		);

		if ( suggestionsDidUpdate || value !== prevValue ) {
			updateSuggestions( suggestionsDidUpdate );
		}

		// TODO: updateSuggestions() should first be refactored so its actual deps are clearer.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ suggestions, prevSuggestions, value, prevValue ] );

	useEffect( () => {
		updateSuggestions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ incompleteTokenValue ] );

	if ( disabled && isActive ) {
		setIsActive( false );
		setIncompleteTokenValue( '' );
	}

	function focus() {
		input.current?.focus();
	}

	function hasFocus() {
		return input.current === input.current?.ownerDocument.activeElement;
	}

	function onFocusHandler( event ) {
		// If focus is on the input or on the container, set the isActive state to true.
		if ( hasFocus() || event.target === tokensAndInput.current ) {
			setIsActive( true );
			setIsExpanded( true );
		} else {
			/*
			* Otherwise, focus is on one of the token "remove" buttons and we
			* set the isActive state to false to prevent the input to be
			* re-focused, see componentDidUpdate().
			*/
			setIsActive( false );
		}

		if ( 'function' === typeof onFocus ) {
			onFocus( event );
		}
	}

	function onBlur() {
		if ( inputHasValidValue() ) {
			setIsActive( false );
		} else {
			// Reset to initial state
			setIncompleteTokenValue( '' );
			setInputOffsetFromEnd( 0 );
			setIsActive( false );
			setIsExpanded( false );
			setSelectedSuggestionIndex( -1 );
			setSelectedSuggestionScroll( false );
		}
	}

	function onKeyDown( event ) {
		let preventDefault = false;

		if ( event.defaultPrevented ) {
			return;
		}
		switch ( event.code ) {
			case 'Backspace':
				preventDefault = handleDeleteKey( deleteTokenBeforeInput );
				break;
			case 'Enter':
				preventDefault = addCurrentToken();
				break;
			case 'ArrowLeft':
				preventDefault = handleLeftArrowKey();
				break;
			case 'ArrowUp':
				preventDefault = handleUpArrowKey();
				break;
			case 'ArrowRight':
				preventDefault = handleRightArrowKey();
				break;
			case 'ArrowDown':
				preventDefault = handleDownArrowKey();
				break;
			case 'Delete':
				preventDefault = handleDeleteKey( deleteTokenAfterInput );
				break;
			case 'Escape':
				preventDefault = handleEscapeKey( event );
				break;
			case 'Space':
				preventDefault = addCurrentToken();
				break;
			default:
				break;
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	}

	function onKeyPress( event ) {
		let preventDefault = false;
		// TODO: replace to event.code;
		switch ( event.charCode ) {
			case 44: // Comma.
				preventDefault = handleCommaKey();
				break;
			default:
				break;
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	}

	function onContainerTouched( event ) {
		// Prevent clicking/touching the tokensAndInput container from blurring
		// the input and adding the current token.
		if ( event.target === tokensAndInput.current && isActive ) {
			event.preventDefault();
		}
	}

	function onTokenClickRemove( event ) {
		deleteToken( event.value );
		focus();
	}

	function onSuggestionHovered( suggestion ) {
		const index = getMatchingSuggestions().indexOf( suggestion );

		if ( index >= 0 ) {
			setSelectedSuggestionIndex( index );
			setSelectedSuggestionScroll( false );
		}
	}

	function onSuggestionSelected( suggestion ) {
		addNewToken( suggestion );
	}

	function onInputChangeHandler( event ) {
		const text = event.value;

		setIncompleteTokenValue( text );
		setIsExpanded( true );
		onInputChange( text );
	}

	function handleDeleteKey( _deleteToken ) {
		let preventDefault = false;
		if ( hasFocus() && isInputEmpty() ) {
			_deleteToken();
			preventDefault = true;
		}

		return preventDefault;
	}

	function handleLeftArrowKey() {
		let preventDefault = false;
		if ( isInputEmpty() ) {
			moveInputBeforePreviousToken();
			preventDefault = true;
		}

		return preventDefault;
	}

	function handleRightArrowKey() {
		let preventDefault = false;
		if ( isInputEmpty() ) {
			moveInputAfterNextToken();
			preventDefault = true;
		}

		return preventDefault;
	}

	function handleUpArrowKey() {
		if ( ! isExpanded ) {
			setIsExpanded( true );
			setSelectedSuggestionIndex( 0 );
			setSelectedSuggestionScroll( true );
			return true;
		}
		setSelectedSuggestionIndex( ( index ) => {
			return (
				( index === 0
					? getMatchingSuggestions(
							incompleteTokenValue,
							getUnselectedOptions(),
							value,
							maxSuggestions
					).length
					: index ) - 1
			);
		} );
		setSelectedSuggestionScroll( true );

		return true; // PreventDefault.
	}

	function handleDownArrowKey() {
		if ( ! isExpanded ) {
			setIsExpanded( true );
			setSelectedSuggestionIndex( 0 );
			setSelectedSuggestionScroll( true );
			return true;
		}
		setSelectedSuggestionIndex( ( index ) => {
			const matchingSuggestions = getMatchingSuggestions(
				incompleteTokenValue,
				getUnselectedOptions(),
				value,
				maxSuggestions
			);
			const nextIndex = ( index + 1 ) % matchingSuggestions.length;
			return nextIndex;
		} );

		setSelectedSuggestionScroll( true );
		return true; // PreventDefault.
	}

	function handleEscapeKey( event ) {
		if ( event.target instanceof HTMLInputElement ) {
			setIncompleteTokenValue( event.target.value );
			setIsExpanded( false );
			setSelectedSuggestionIndex( -1 );
			setSelectedSuggestionScroll( false );
		}

		return true; // PreventDefault.
	}

	function handleCommaKey() {
		if ( inputHasValidValue() ) {
			addNewToken( incompleteTokenValue );
		}

		return true; // PreventDefault.
	}

	function moveInputToIndex( index ) {
		setInputOffsetFromEnd( value.length - Math.max( index, -1 ) - 1 );
	}

	function moveInputBeforePreviousToken() {
		setInputOffsetFromEnd( ( prevInputOffsetFromEnd ) => {
			return Math.min( prevInputOffsetFromEnd + 1, value.length );
		} );
	}

	function moveInputAfterNextToken() {
		setInputOffsetFromEnd( ( prevInputOffsetFromEnd ) => {
			return Math.max( prevInputOffsetFromEnd - 1, 0 );
		} );
	}

	function deleteTokenBeforeInput() {
		const index = getIndexOfInput() - 1;

		if ( index > -1 ) {
			deleteToken( value[ index ] );
		}
	}

	function deleteTokenAfterInput() {
		const index = getIndexOfInput();

		if ( index < value.length ) {
			deleteToken( value[ index ] );
			// Update input offset since it's the offset from the last token.
			moveInputToIndex( index );
		}
	}
	function addCurrentToken() {
		let preventDefault = false;
		const selectedSuggestion = getSelectedSuggestion();

		if ( selectedSuggestion && isExpanded ) {
			addNewToken( selectedSuggestion );
			preventDefault = true;
		} else if ( inputHasValidValue() && incompleteTokenValue.trim() !== '' ) {
			addNewToken( incompleteTokenValue );
			preventDefault = true;
		}

		return preventDefault;
	}

	function addNewTokens( tokens ) {
		const tokensToAdd = [
			...new Set(
				tokens
					.filter( ( token ) => ! valueContainsToken( token ) )
			),
		];
		if ( tokens.length > 0 ) {
			const newValue = [ ...value ];
			newValue.splice( getIndexOfInput(), 0, ...tokens );
			onChange( newValue );
		}
	}

	function addNewToken( token ) {
		if ( ! __experimentalValidateInput( token.label ) ) {
			speak( messages.__experimentalInvalid, 'assertive' );
			return;
		}
		addNewTokens( [ token.value ] );
		speak( messages.added, 'assertive' );

		setIncompleteTokenValue( '' );
		setSelectedSuggestionScroll( false );
		setSelectedSuggestionIndex( -1 );

		if ( closeSuggestionsOnSelection ) {
			setIsExpanded( false );
		}
		
		if ( isActive ) {
			focus();
		}
	}

	function deleteToken( token ) {
		const newTokens = value.filter( ( item ) => {
			return getTokenValue( item ) !== getTokenValue( token );
		} );
		onChange( newTokens );
		speak( messages.removed, 'assertive' );
	}

	function getTokenValue( token ) {
		if ( 'object' === typeof token ) {
			return token.value;
		}

		return token;
	}
	function getUnselectedOptions() {
		return options.filter( option => value.indexOf( option.value ) === -1) 
	}
	function getMatchingSuggestions(
		searchValue = incompleteTokenValue,
		_suggestions = getUnselectedOptions(),
		_value = value,
		_maxSuggestions = maxSuggestions,
	) {
		if ( searchValue.trim() !== '' ) {
			let startsWithMatch = [];
			let containsMatch = [];
			_suggestions.forEach( ( suggestion ) => {
				const index = suggestion.label.toLocaleLowerCase().indexOf( searchValue.trim().toLocaleLowerCase() );
				if ( index === 0 ) {
					startsWithMatch.push( suggestion );
				} else if ( index > 0 ) {
					containsMatch.push( suggestion );
				}
			} );
			_suggestions = startsWithMatch.concat( containsMatch );
		}
		return _suggestions.slice( 0, _maxSuggestions );
	}

	function getSelectedSuggestion() {
		if ( selectedSuggestionIndex !== -1 ) {
			return getMatchingSuggestions()[ selectedSuggestionIndex ];
		}

		return undefined;
	}

	function valueContainsToken( token ) {
		return value.some( ( item ) => {
			return getTokenValue( token ) === getTokenValue( item );
		} );
	}

	function getIndexOfInput() {
		return value.length - inputOffsetFromEnd;
	}

	function isInputEmpty() {
		return incompleteTokenValue.length === 0;
	}

	function inputHasValidValue() {
		return getMatch( incompleteTokenValue )?.label?.length > 0;
	}

	function updateSuggestions( resetSelectedSuggestion = true ) {
		const matchingSuggestions =
			getMatchingSuggestions( incompleteTokenValue );
		const hasMatchingSuggestions = matchingSuggestions.length > 0;

		if ( resetSelectedSuggestion ) {
			if (
				__experimentalAutoSelectFirstMatch &&
				hasMatchingSuggestions
			) {
				setSelectedSuggestionIndex( 0 );
				setSelectedSuggestionScroll( true );
			} else {
				setSelectedSuggestionIndex( -1 );
				setSelectedSuggestionScroll( false );
			}
		}
	
		/*  setIsExpanded(
				( hasMatchingSuggestions && hasFocus() )
		); */
		
		setSelectedSuggestionIndex( 0 );

		const message = hasMatchingSuggestions
			? sprintf(
					/* translators: %d: number of results. */
					_n(
						'%d result found, use up and down arrow keys to navigate.',
						'%d results found, use up and down arrow keys to navigate.',
						matchingSuggestions.length
					),
					matchingSuggestions.length
			)
			: __( 'No results.' );

		debouncedSpeak( message, 'assertive' );
	}
	function getOptionFromValue( optionValue ) {
		const foundOption = options.find(
			( option ) => option.value === optionValue
		);
		if ( foundOption ) {
			return foundOption;
		}
		return null;
	}
	function renderTokensAndInput() {
		const components = value.map( getOptionFromValue ).map( ( option, index ) => renderToken( { ...option }, index ) );
		components.splice( getIndexOfInput(), 0, renderInput() );

		return components;
	}

	function renderToken( { value: tValue, label, onMouseEnter = noop, onMouseLeave = noop, isBorderless = false }, index ) {
		const _value = tValue;
		const termPosition = index + 1;
		return (
			<FlexItem key={ 'token-' + _value }>
				<Token
					value={ _value }
					label={ label }
					title={
						typeof token !== 'string' ? label : undefined
					}
					onClickRemove={ onTokenClickRemove }
					isBorderless={ isBorderless }
					onMouseEnter={ onMouseEnter }
					onMouseLeave={ onMouseLeave }
					disabled={ disabled }
					messages={ messages }
					termPosition={ termPosition }
					termsCount={ value.length }
				/>
			</FlexItem>
		);
	}

	function renderInput() {
		const inputProps = {
			instanceId,
			autoCapitalize,
			autoComplete,
			placeholder: value.length === 0 ? placeholder : '',
			key: 'input',
			disabled,
			value: incompleteTokenValue,
			onBlur,
			isExpanded,
			selectedSuggestionIndex,
			style: {
				lineHeight: '24px',
			},
			onClick: onFocusHandler,
		};

		return (
			<TokenInput
				{ ...inputProps }
				onChange={
					! ( maxLength && value.length >= maxLength )
						? onInputChangeHandler
						: undefined
				}
				ref={ input }
			/>
		);
	}

	const classes = classnames(
		className,
		'codeamp-components-multiselect-control__input-container',
		{
			'is-active': isActive,
			'is-disabled': disabled,
		}
	);

	let tokenFieldProps = {
		className: 'components-base-control codeamp-components-multiselect-control',
		tabIndex: -1,
	};
	const matchingSuggestions = getMatchingSuggestions();

	if ( ! disabled ) {
		tokenFieldProps = Object.assign( {}, tokenFieldProps, {
			onKeyDown,
			onKeyPress,
			onFocus: onFocusHandler,
		} );
	}

	// Disable reason: There is no appropriate role which describes the
	// input container intended accessible usability.
	// TODO: Refactor click detection to use blur to stop propagation.
	/* eslint-disable jsx-a11y/no-static-element-interactions */
	return (
		<div { ...tokenFieldProps }>
			<label
				htmlFor={ `codeamp-components-multiselect-control-${ instanceId }` }
				className="codeamp-components-multiselect-control__label"
			>
				{ label }
			</label>
			<div
				ref={ tokensAndInput }
				className={ classes }
				tabIndex={ -1 }
				onMouseDown={ onContainerTouched }
				onTouchStart={ onContainerTouched }
			>
				<Flex
					className={ 'codeamp-components-multiselect-control__tokens-container' }
					justify="flex-start"
					align="flex-start"
					gap="4px"
					wrap={ true }
					__next36pxDefaultSize={ __next36pxDefaultSize }
					hasTokens={ !! value.length }
				>
					{ renderTokensAndInput() }
				</Flex>
				{ isExpanded && (
					<SuggestionsList
						instanceId={ instanceId }
						match={ getMatch( incompleteTokenValue, options ) }
						searchValue={ incompleteTokenValue.trim() }
						suggestions={ matchingSuggestions }
						selectedIndex={ selectedSuggestionIndex }
						scrollIntoView={ selectedSuggestionScroll }
						onHover={ onSuggestionHovered }
						onSelect={ onSuggestionSelected }
						__experimentalRenderItem={ __experimentalRenderItem }
					/>
				) }
			</div>
			
		</div>
	);
	/* eslint-enable jsx-a11y/no-static-element-interactions */
}
