/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';
import { VisuallyHidden, Button } from '@wordpress/components';

/**
 * Internal dependencies
 */

const noop = () => {};

export default function Token( {
	value,
	label,
	title,
	isBorderless = false,
	disabled = false,
	onClickRemove = noop,
	onMouseEnter,
	onMouseLeave,
	messages,
	termPosition,
	termsCount,
} ) {
	const instanceId = useInstanceId( Token );
	const tokenClasses = classnames( 'components-form-token-field__token', {
		'is-borderless': isBorderless,
		'is-disabled': disabled,
	} );

	const onClick = () => onClickRemove( { value } );

	const termPositionAndCount = sprintf(
		/* translators: 1: term name, 2: term position in a set of terms, 3: total term set count. */
		__( '%1$s (%2$s of %3$s)' ),
		label,
		termPosition,
		termsCount
	);

	return (
		<span
			className={ tokenClasses }
			onMouseEnter={ onMouseEnter }
			onMouseLeave={ onMouseLeave }
			title={ title }
		>
			<span
				className="components-form-token-field__token-text"
				id={ `components-form-token-field__token-text-${ instanceId }` }
			>
				<VisuallyHidden as="span">
					{ termPositionAndCount }
				</VisuallyHidden>
				<span aria-hidden="true">{ label }</span>
			</span>

			<Button
				className="components-form-token-field__remove-token"
				icon={ closeSmall }
				onClick={ ! disabled && onClick }
				label={ messages.remove }
				aria-describedby={ `components-form-token-field__token-text-${ instanceId }` }
			/>
		</span>
	);
}