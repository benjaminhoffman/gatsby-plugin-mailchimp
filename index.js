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
 * url is a concatenated string of user's gatsby.config
 * options, along with any MC list fields as query params
 */

var makeMailchimpRequest = function makeMailchimpRequest(url) {
  return new Promise(function (resolve, reject) {
    return (0, _jsonp2.default)(url, { param: 'c' }, function (err, data) {
      console.log('1', err);
      if (err) resolve(err);
      console.log('2', data);
      if (data) reject(data);
    });
  });
};

/*
 * parse the plugin options to use in our jsonp request
 */

var getPluginOptions = function getPluginOptions() {
  var options = _gatsbyConfig2.default.plugins.find(function (plugin) {
    return plugin.resolve === 'gatsby-plugin-my-cool-plugin';
  }).options;

  var isString = typeof options.endpoint === 'string';
  if (!isString) {
    throw 'Mailchimp endpoint required and must be of type string. See repo README for more info.';
  }
  return options;
};

/*
 * convert fields object into a query string
 * ex: '&KEY1=value1&KEY2=value2'
 * toUpperCase because that's what MC requires
 */

var convertListFields = function convertListFields(fields) {
  var queryParams = '';
  for (var field in fields) {
    queryParams = queryParams.concat('&' + field.toUpperCase() + '=' + fields[field]);
  }
  return queryParams;
};

/*
 * accept email (String) and additional
 * and optional Mailchimp list fields (Object)
 * then make jsonp req with data
 */

var addToMailchimp = function addToMailchimp(email, fields) {
  var isEmailValid = (0, _emailValidator.validate)(email);
  var emailEncoded = encodeURIComponent(email);
  if (!isEmailValid) {
    throw 'gatsy-plugin-mailchimp: email must be of type string and a valid email address. See README for more information.';
  }

  var endpoint = '';
  try {
    endpoint = getPluginOptions().endpoint;
  } catch (e) {
    throw e;
  }

  var queryParams = '&EMAIL=' + emailEncoded + convertListFields(fields);
  var url = '' + endpoint + queryParams;
  makeMailchimpRequest(url).then(function (data) {
    return data;
  }).catch(function (err) {
    console.log("ERR", err);
  });
};

exports.default = addToMailchimp;