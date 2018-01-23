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
                        label={ __( 'format' ) }
                        value={ attributes.formFormat }
                        options={ formFormats }
                        onChange={ this.updateImageURL }
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

        const setForm = id => {

            window.fetch( `${wpApiSettings.schema.url}/wp-json/give-api/v1/form/${id}` ).then(
                (response) => {
                    response.json().then(  ( reply ) => {
                        props.setAttributes( { form : reply } );
                    } );
                }
            );
        };

        const onSelectChange = event => {
            props.setAttributes({id: event.target.value});
            setForm(event.target.value);
        };

        const onChangeContent = newContent => {
            props.setAttributes( { content: newContent } );
        };

        const onChangeAlignment = newAlignment => {
            props.setAttributes( { alignment: newAlignment } );
        };

        if (!attributes.id) {

            return (
                <div>
                    <select onChange={onSelectChange}>
                        {
                            attributes.forms.map((form) => {
                                return(
                                    <option value={form.info.id}>{form.info.title}</option>
                                )
                            })
                        }
                    </select>
                </div>
            );
        }

        if ( !attributes.form ) {
            setForm(attributes.id);
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
