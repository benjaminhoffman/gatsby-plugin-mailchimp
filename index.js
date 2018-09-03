'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    // timeout to 3.5s so user isn't waiting forever
    // usually occurs w/ privacy plugins enabled
    // 3.5s is a bit longer than the time it would take on a Slow 3G connection
    return (0, _jsonp2.default)(url, { param: 'c', timeout: 3500 }, function (err, data) {
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
  var endpoint = __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__.replace(/\/post/g, '/post-json');

  var queryParams = '&EMAIL=' + emailEncoded + convertListFields(fields);
  var url = '' + endpoint + queryParams;
  return subscribeEmailToMailchimp(url);
};

exports.default = addToMailchimp;