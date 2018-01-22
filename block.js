const { __ } = wp.i18n;
const {
    registerBlockType
} = wp.blocks;
const { withAPIData } = wp.components;

registerBlockType( 'give/donation-form-block', {

    title: __( 'Give Donation Form' ),

    category: 'common',

    attributes: {
       id: {
           type: 'number'
       }
    },

    edit: props => {

        const attributes = props.attributes;

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
            <div id={ `give-form-${attributes.id}`}>
                <h2 class="give-form-title">{attributes.form.title}</h2>
            </div>
        );
    },

    save: props => {
        return null;
    },
} );
