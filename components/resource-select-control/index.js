/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, BaseControl, __experimentalHStack as HStack, SelectControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

// Styles
import "./style.scss"

const noop = () => {};
export const ResourceSelectControl =
	( {
		onChange = noop,
		onPrimaryAction = noop,
		onAddNew = noop,
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
				className={ 'components-base-control codeamp-components-resource-select-control' }
				help={ help }
			>
				<HStack>
					{ label && (
						<label
							htmlFor={ instanceId }
							className={
								'codeamp-components-resource-select-control__label'
								}
							>
							{ label }
						</label>
					) }
					{ canAddNew && (
						<Button
							className={
								'codeamp-components-resource-select-control__add_button'
							}
							onClick={ onAddNew }
						>
							{ addNewLabel }
						</Button>
					) }
				</HStack>
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
