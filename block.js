const { __ } = wp.i18n;
const {
    registerBlockType,
    InspectorControls,
} = wp.blocks;
const { ToggleControl, SelectControl } = InspectorControls;
const { PanelBody } = wp.components;

registerBlockType( 'give/donation-form-block', {

    title: __( 'Give Donation Form' ),

    category: 'common',

    attributes: {
        id: {
           type: 'number'
        },
        formFormat: {
            type: 'string'
        },
        formTitle: {
            type: 'boolean',
            default: false
        },
        formGoal: {
            type: 'boolean',
            default: false
        },
        formContent: {
            type: 'boolean',
            default: false
        }
    },

    edit: props => {

        const attributes = props.attributes;

        const formFormats = [
            { value: 'full-form', label: 'Full Form' },
            { value: 'modal', label: 'Modal' },
            { value: 'reveal', label: 'Reveal' },
            { value: 'one-button-launch', label: 'One-button Launch' }
        ];

        const loadFormData = id => {

            window.fetch( `${wpApiSettings.schema.url}/wp-json/give-api/v1/form/${id}` ).then(
                (response) => {
                    response.json().then(  ( reply ) => {
                        props.setAttributes( { form : reply } );
                    } );
                }
            );
        };

        const getFormOptions = () => {
            return attributes.forms.map((form) => {
                return {
                    value: form.info.id,
                    label: form.info.title
                }
            });
        };

        const setFormIdTo = event => {
            props.setAttributes({id: event.target.value});
            loadFormData(event.target.value);
        };

        const setFormFormatTo = event => {
            props.setAttributes({formFormat: event.target.value});
        };

        const toggleFormTitle = () => {
            props.setAttributes( { formTitle: ! attributes.formTitle } );
        };

       const toggleFormGoal = () => {
            props.setAttributes( { formGoal: ! attributes.formGoal } );
        };

       const toggleFormContent = () => {
            props.setAttributes( { formContent: ! attributes.formContent } );
        };

        const inspectorControls = (
            <InspectorControls key="inspector">
                <h3>{ __( 'Donation Form Settings' ) }</h3>
                <PanelBody title={ __( 'Presentation' ) }>
                    <SelectControl
                        label={ __( 'Format' ) }
                        value={ attributes.formFormat }
                        options={ formFormats }
                        onChange={ setFormFormatTo }
                    />
                </PanelBody>
                <PanelBody title={ __( 'Form Components' ) }>
                    <ToggleControl
                        label={ __( 'Form Title' ) }
                        checked={ !! attributes.formTitle }
                        onChange={ toggleFormTitle }
                    />
                    <ToggleControl
                        label={ __( 'Form Goal' ) }
                        checked={ !! attributes.formGoal }
                        onChange={ toggleFormGoal }
                    />
                    <ToggleControl
                        label={ __( 'Form Content' ) }
                        checked={ !! attributes.formContent }
                        onChange={ toggleFormContent }
                    />
                </PanelBody>
            </InspectorControls>
        );

        if (!attributes.id && !attributes.forms) {

            window.fetch( `${wpApiSettings.schema.url}/give-api/forms/?key=${giveBlocksVars.key}&token=${giveBlocksVars.token}` ).then(
                (response) => {
                    response.json().then(  ( reply ) => {
                        props.setAttributes( { forms : reply.forms } );
                    } );
                }
            );

            return "loading !";
        }

        if (!attributes.id && attributes.forms.length === 0) {
            return "No forms";
        }

        if (!attributes.id) {

            return (
                <div>
                    <SelectControl
                        label={ __( 'Give Donation Form' ) }
                        options={ getFormOptions() }
                        onChange={ setFormIdTo }
                    />
                </div>
            );
        }

        if ( !attributes.form ) {
            loadFormData(attributes.id);
            return "loading !";
        }

        return (
            <div>
                { !!props.focus && inspectorControls }
                <div id={ `give-form-${attributes.id}`}>
                    <h2 class="give-form-title">{attributes.form.title}</h2>
                </div>
            </div>
        );
    },

    save: props => {
        return null;
    },
} );
