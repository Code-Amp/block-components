/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, BaseControl, __experimentalHStack as HStack, SelectControl, DropdownMenu } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { moreVertical } from '@wordpress/icons';

// Styles
import "./style.scss"
import classNames from 'classnames';

const noop = () => {};
export const ResourceSelectControl =
	( {
		onChange = noop,
		label = '',
		loadingLabel = __( 'Loading', 'codeamp-block-components' ),
		showActions = true,
		dropdownProps,
		dropdownToggleProps,
		disabled = false,
		defaultOption,
		options,
		value,
		help,
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
				__nextHasNoMarginBottom={ true }
			>
				<HStack>
					<SelectControl
						id={ instanceId }
						value={ value }
						options={ allResourceOptions }
						className={ 'codeamp-components-resource-select-control__select' }
						onChange={ onChange }
						disabled={ disabled }
						__nextHasNoMarginBottom={ true }
						__next40pxDefaultSize={ true }
					 />
					 { showActions && (
						<DropdownMenu
							icon={ moreVertical }
							toggleProps={ {
								className: 'codeamp-components-resource-select-control__menu_button',
								iconSize: 26,
								...dropdownToggleProps,
								__next40pxDefaultSize: true,
							} }
							{ ...dropdownProps }
						/>
					) }
				</HStack>
			</BaseControl>
		);
	}
