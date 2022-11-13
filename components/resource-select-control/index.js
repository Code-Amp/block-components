/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, BaseControl, __experimentalHStack as HStack, SelectControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

// Styles
import "./style.scss"
import classNames from 'classnames';

const noop = () => {};
export const ResourceSelectControl =
	( {
		onChange = noop,
		onPrimaryAction = noop,
		onSecondaryAction = noop,
		label = '',
		primaryActionLabel = __( 'Edit', 'codeamp-block-components' ),
		secondaryActionLabel = __( 'Add new', 'codeamp-block-components' ),
		loadingLabel = __( 'Loading', 'codeamp-block-components' ),
		showPrimaryAction = true,
		showSecondaryAction = true,
		defaultOption,
		options,
		value,
		help,
		primaryActionProps,
		secondaryActionProps,
		id,
		className,
	} ) => {
		let allResourceOptions = [];
		
		if ( loadingLabel ) {
			allResourceOptions = [
				{
					value: 'loading',
					label: loadingLabel,
				},
			];
		}

		if ( options ) {
			allResourceOptions = [];
			if ( defaultOption ) {
				allResourceOptions.push( defaultOption );
			}
			allResourceOptions.push( ...options );
		}
		let instanceId = useInstanceId( ResourceSelectControl, 'codeamp-components-resource-select-control' );
		if ( id ) {
			instanceId = id;
		}

		return (
			<BaseControl
				id={ instanceId }
				className={ classNames( 'components-base-control codeamp-components-resource-select-control', className ) }
				help={ help }
				label={ label }
			>
				{ showSecondaryAction && (
					<Button
						className={
							'codeamp-components-resource-select-control__add_button'
						}
						onClick={ onSecondaryAction }
						{ ...secondaryActionProps }
					>
						{ secondaryActionProps?.label ?? secondaryActionLabel }
					</Button>
				) }
				<HStack>
					<SelectControl
						id={ instanceId }
						value={ value }
						options={ allResourceOptions }
						className={ 'codeamp-components-resource-select-control__select' }
						onChange={ onChange }
					 />
					{ showPrimaryAction && (
						<Button
							onClick={ onPrimaryAction }
							variant="secondary"
							// disabled={ ! editReady }
							className={
								'codeamp-components-resource-select-control__edit_button'
							}
							{ ...primaryActionProps }
						>
							{ primaryActionProps?.label ?? primaryActionLabel }
						</Button>
					) }
				</HStack>
			</BaseControl>
		);
	}
