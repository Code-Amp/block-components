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
		onAddNew = noop,
		label = '',
		editLabel = __( 'Edit', 'search-filter' ),
		addNewLabel = __( 'Add new', 'search-filter' ),
		loadingLabel = __( 'Loading', 'search-filter' ),
		canEdit = true,
		canAddNew = true,
		defaultOption,
		options,
		selectedId,
		resourceData,
		help,
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
						value={ selectedId }
						options={ allTemplateOptions }
						className={ 'codeamp-components-resource-select-control__select' }
						onChange={ onChange }
					 />
					{ canEdit && (
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
							{ editLabel }
						</Button>
					) }
				</HStack>
			</BaseControl>
		);
	}
