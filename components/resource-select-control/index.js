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
		addNewLabel = __( 'Add new', 'codeamp-block-components' ),
		loadingLabel = __( 'Loading', 'codeamp-block-components' ),
		showPrimaryAction = true,
		canAddNew = true,
		defaultOption,
		options,
		value,
		help,
		primaryActionProps = null,
		id,
		className,
	} ) => {
		let allTemplateOptions = [
			{
				value: 'loading',
				label: loadingLabel,
				//disabled: true,
			},
		];

		if ( options ) {
			allTemplateOptions = [];
			if ( defaultOption ) {
				allTemplateOptions.push( defaultOption );
			}
			allTemplateOptions.push( ...options );
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
				{ canAddNew && (
					<Button
						className={
							'codeamp-components-resource-select-control__add_button'
						}
						onClick={ onSecondaryAction }
					>
						{ addNewLabel }
					</Button>
				) }
				<HStack>
					<SelectControl
						id={ instanceId }
						value={ value }
						options={ allTemplateOptions }
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
							{ primaryActionProps?.label ?? __( 'Edit', 'codeamp-block-components' ) }
						</Button>
					) }
				</HStack>
			</BaseControl>
		);
	}
