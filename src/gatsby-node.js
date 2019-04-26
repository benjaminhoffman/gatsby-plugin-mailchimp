exports.onCreateWebpackConfig = ({ plugins, actions }, { endpoint }) => {
    const isString = typeof endpoint === 'string';
    if (!isString) {
        throw new Error(
            'Mailchimp endpoint required and must be of type string. See repo README for more info.',
        );
    } else if (endpoint.length < 40) {
        throw new Error(
            'gatsby-plugin-mailchimp: donʼt forget to add your MC endpoint to your gatsby-config file. See README for more info.',
        );
    }

    actions.setWebpackConfig({
        plugins: [
            plugins.define({
                __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__: JSON.stringify(endpoint),
            }),
        ],
    });
};
