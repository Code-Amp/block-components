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
		onEdit = noop,
		onNew = noop,
		label = '',
		defaultOption,
		options,
		selectedId,
		resourceData,
		help,
	} ) => {
		let allTemplateOptions = [
			{
				value: 'loading',
				label: __( 'Loading', 'custom-layouts' ),
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

		const templateLoaded =
			selectedId &&
			! isEmpty( resourceData.template ) &&
			! isEmpty( resourceData.instances );

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
					<Button
						className={
							'codeamp-components-resource-select-control__add_button'
						}
						onClick={ onNew }
					>
						{ __( 'Add New', 'custom-layouts' ) }
					</Button>
				</HStack>
				<HStack>
					<SelectControl
						id={ instanceId }
						value={ selectedId }
						options={ allTemplateOptions }
						className={ 'codeamp-components-resource-select-control__select' }
						onChange={ onChange }
					 />
					<Button
						onClick={ onEdit }
						isSecondary
						disabled={
							selectedId === 'default' || ! templateLoaded
								? true
								: false
						}
						className={
							'codeamp-components-resource-select-control__edit_button'
						}
					>
						{ __( 'Edit', 'custom-layouts' ) }
					</Button>
				</HStack>
			</BaseControl>
		);
	}
