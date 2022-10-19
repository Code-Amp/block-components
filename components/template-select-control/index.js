/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { isEmpty } from 'lodash';
import { __ } from '@wordpress/i18n';
import { Button, BaseControl } from '@wordpress/components';
import { dispatch, withSelect } from '@wordpress/data';

const TemplateSelectControl = withSelect( ( select, props ) => {
	const templateInfo = select( 'custom-layouts/templateEditor' ).getTemplateInfo();
	let language;
	if ( templateInfo?.lang ) {
		language = templateInfo.lang;
	}
	return {
		templateData: select( 'custom-layouts' ).getTemplateData(
			props.templateId
		),
		templates: select( 'custom-layouts' ).getTemplates( language ),
		savedTemplateId: select( 'custom-layouts' ).getSavedTemplateId(),
	};
} )(
	( {
		onChange,
		templates,
		templateId,
		templateData,
		savedTemplateId,
		templateWidth,
	} ) => {
		let allTemplateOptions = [
			{
				value: 'loading',
				label: __( 'Loading', 'custom-layouts' ),
				//disabled: true,
			},
		];

		useEffect( () => {
			if ( savedTemplateId && savedTemplateId !== 0 ) {
				//grab its value, and set to it ( this should only happen when a new template is created via the modal )
				onChange( savedTemplateId );
				dispatch( 'custom-layouts' ).setSavedTemplateId( 0 ); //unset it in the store
			}
		}, [ savedTemplateId ] );

		if ( templates ) {
			allTemplateOptions = [
				{
					value: 'default',
					label: __( 'Default', 'custom-layouts' ),
				},
				...templates,
			];
		}

		const editTemplateModal = () => {

			const foundTemplate = templates.find( ( templateOption ) => {
				return (
					parseInt( templateOption.value ) === parseInt( templateId )
				);
			} );

			const templateTitle = foundTemplate?.label
				? foundTemplate.label
				: '';

			const editorData = {
				title: templateTitle,
				editorId: templateId,
				isDirty: false,
			};
			if ( templateWidth && templateWidth > 0 ) {
				editorData.canvasWidth = templateWidth;
			}

			dispatch( 'custom-layouts' ).setEditor( 'template', editorData );
			dispatch( 'custom-layouts/modal' ).openModal( 'template', {} );
		};
		const newTemplateModal = () => {
			const editorData = {
				title: '',
				editorId: 0,
				isDirty: false,
			};
			if ( templateWidth && templateWidth > 0 ) {
				editorData.canvasWidth = templateWidth;
			}

			dispatch( 'custom-layouts' ).setEditor( 'template', editorData );
			dispatch( 'custom-layouts/modal' ).openModal( 'template', {
				templateId: 0, // probably don't need
			} );
		};

		const postTemplateInputId = 'custom-layouts__post-template-1';
		const templateLoaded =
			templateId &&
			! isEmpty( templateData.template ) &&
			! isEmpty( templateData.instances );

		return (
			<BaseControl
				id={ postTemplateInputId }
				label={ __( 'Post Template', 'custom-layouts' ) }
				className={ 'components-base-post-template-control__field' }
			>
				<Button
					className={
						'components-base-post-template-control__button'
					}
					onClick={ newTemplateModal }
				>
					{ __( 'Add New', 'custom-layouts' ) }
				</Button>
				<div className="custom-layouts-attributes__control-row">
					<select
						id={ postTemplateInputId }
						value={ templateId }
						className={ 'components-select-control__input' }
						onChange={ ( e ) => {
							onChange( e.target.value );
						} }
						onBlur={ () => {
							//this.props.onChange( e.target.value );
						} }
					>
						{ allTemplateOptions.map( ( option, index ) => {
							return (
								<option key={ index } value={ option.value }>
									{ option.label }
								</option>
							);
						} ) }
					</select>
					<Button
						onClick={ editTemplateModal }
						isSecondary
						disabled={
							templateId === 'default' || ! templateLoaded
								? true
								: false
						}
					>
						{ __( 'Edit', 'custom-layouts' ) }
					</Button>
				</div>
			</BaseControl>
		);
	}
);

export default TemplateSelectControl;
