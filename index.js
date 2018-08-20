'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    return Promise.resolve({
      result: 'error',
      msg: 'The email you entered is not valid.'
    });
  }

  // generate Mailchimp endpoint for jsonp request
  // note, we change `/post` to `/post-json`
  // otherwise, Mailchomp returns an error

  var _ref = window.__GATSBY_PLUGIN_MAILCHIMP__ || {},
      endpoint = _ref.endpoint;

  if (!(typeof endpoint === 'undefined' ? 'undefined' : _typeof(endpoint)) === 'string') {
    return Promise.reject('Mailchimp endpoint required and must be of type string. See repo README for more info.');
  }
  endpoint = endpoint.replace(/\/post/g, '/post-json');

  var queryParams = '&EMAIL=' + emailEncoded + convertListFields(fields);
  var url = '' + endpoint + queryParams;
  return subscribeEmailToMailchimp(url);
};

exports.default = addToMailchimp;