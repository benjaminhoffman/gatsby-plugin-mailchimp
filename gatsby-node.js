'use strict';

var _require = require('webpack'),
    DefinePlugin = _require.DefinePlugin;

exports.modifyWebpackConfig = function (_ref, _ref2) {
  var config = _ref.config,
      stage = _ref.stage;
  var endpoint = _ref2.endpoint;

  var isString = typeof endpoint === 'string';
  if (!isString) {
    throw 'Mailchimp endpoint required and must be of type string. See repo README for more info.';
  } else if (endpoint.length < 40) {
    throw 'gatsby-plugin-mailchimp: donʼt forget to add your MC endpoint to your gatsby-config file. See README for more info.';
  }

  config.plugin('Mailchimp', DefinePlugin, [{ __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__: JSON.stringify(endpoint) }]);
  return config;
};