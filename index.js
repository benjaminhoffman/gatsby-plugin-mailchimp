'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gatsbyConfig = require('../../gatsby-config');

var _gatsbyConfig2 = _interopRequireDefault(_gatsbyConfig);

var _jsonp = require('jsonp');

var _jsonp2 = _interopRequireDefault(_jsonp);

var _emailValidator = require('email-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * make a jsonp request to user's mailchimp list
 * url is a concatenated string of user's gatsby-config.js
 * options, along with any MC list fields as query params
 */

var subscribeEmailToMailchimp = function subscribeEmailToMailchimp(url) {
  return new Promise(function (resolve, reject) {
    // `param` object avoids CORS issues
    return (0, _jsonp2.default)(url, { param: 'c' }, function (err, data) {
      if (err) reject(err);
      if (data) resolve(data);
    });
  });
};

/*
 * parse the plugin options to use in our jsonp request
 */

var getPluginOptions = function getPluginOptions() {
  // find gatsby-mailchimp plugin options (MC list settings)
  var options = _gatsbyConfig2.default.plugins.find(function (plugin) {
    return plugin.resolve === 'gatsby-plugin-mailchimp';
  }).options;

  var isString = typeof options.endpoint === 'string';
  if (!isString) {
    throw 'Mailchimp endpoint required and must be of type string. See repo README for more info.';
  }
  return options;
};

/*
 * build a query string of MC list fields
 * ex: '&KEY1=value1&KEY2=value2'
 * (toUpperCase because that's what MC requires)
 */

var convertListFields = function convertListFields(fields) {
  var queryParams = '';
  for (var field in fields) {
    queryParams = queryParams.concat('&' + field.toUpperCase() + '=' + fields[field]);
  }
  return queryParams;
};

/*
 * accept email (String) and additional, optional
 * Mailchimp list fields (Object)
 * then make jsonp req with data
 */

var addToMailchimp = function addToMailchimp(email, fields) {
  var isEmailValid = (0, _emailValidator.validate)(email);
  var emailEncoded = encodeURIComponent(email);
  if (!isEmailValid) {
    throw 'gatsy-plugin-mailchimp: email must be of type string and a valid email address. See README for more information.';
  }

  // generate Mailchimp endpoint for jsonp request
  // note, we change `/post` to `/post-json`
  // otherwise, Mailchomp returns an error

  var _getPluginOptions = getPluginOptions(),
      endpoint = _getPluginOptions.endpoint;

  endpoint = endpoint.replace(/\/post/g, '/post-json');

  var queryParams = '&EMAIL=' + emailEncoded + convertListFields(fields);
  var url = '' + endpoint + queryParams;
  return subscribeEmailToMailchimp(url);
};

exports.default = addToMailchimp;