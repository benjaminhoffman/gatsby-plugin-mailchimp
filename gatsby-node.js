'use strict';

exports.onCreateWebpackConfig = function(_ref, _ref2) {
    var plugins = _ref.plugins,
        actions = _ref.actions;
    var endpoint = _ref2.endpoint,
        _ref2$timeout = _ref2.timeout,
        timeout = _ref2$timeout === void 0 ? 3500 : _ref2$timeout;
    var isString = typeof endpoint === 'string';

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
                __GATSBY_PLUGIN_MAILCHIMP_TIMEOUT__: Number(timeout),
            }),
        ],
    });
};
