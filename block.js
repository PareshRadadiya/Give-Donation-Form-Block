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
       },
       title: {
           type: 'string'
       }
    },

    edit: props => {

        const attributes = props.attributes;

        if (!attributes.id && !attributes.forms) {

            window.fetch( wpApiSettings.schema.url + '/give-api/forms/?key=fbfd55270e2bdb393abec254fd4cd873&token=6aa9c6a36fc2027f69640296b64a1414' ).then(
                (response) => {
                    response.json().then(  ( reply ) => {
                        props.setAttributes( { forms : reply.forms } );
                    } );
                }
            );

            return "loading !";
        }
        if (!attributes.form_id && attributes.forms.length === 0) {
            return "No forms";
        }
        const onSelectChange = event => {
            props.setAttributes({id: event.target.value});
        };

        if (!attributes.form_id) {
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

        return (
            <div id={ `give-form-${attributes.id}`}>
                <h1>{attributes.title}</h1>
            </div>
        );
    },

    save: props => {
        return null;
    },
} );