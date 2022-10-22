/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { isEmpty } from 'lodash';
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
		addNewLabel = __( 'Add new', 'search-filter' ),
		loadingLabel = __( 'Loading', 'search-filter' ),
		showPrimaryAction = true,
		canAddNew = true,
		defaultOption,
		options,
		value,
		help,
		primaryActionProps = null,
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
		const instanceId = useInstanceId( ResourceSelectControl );

		return (
			<BaseControl
				id={ instanceId }
				className={ 'components-base-control codeamp-components-resource-select-control' }
				help={ help }
			>
				<HStack>
					<label
						htmlFor={ instanceId }
						className={
							'codeamp-components-resource-select-control__label'
							}
						>
						{ label }
					</label>
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
							{ primaryActionProps?.label ?? __( 'Edit', 'search-filter' ) }
						</Button>
					) }
				</HStack>
			</BaseControl>
		);
	}
