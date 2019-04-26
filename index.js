'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true,
});

var _jsonp = require('jsonp');

var _jsonp2 = _interopRequireDefault(_jsonp);

var _emailValidator = require('email-validator');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Make a jsonp request to user's mailchimp list
 *  `param` object avoids CORS issues
 *  timeout to 3.5s so user isn't waiting forever
 *  usually occurs w/ privacy plugins enabled
 *  3.5s is a bit longer than the time it would take on a Slow 3G connection
 *
 * @param {String} url - concatenated string of user's gatsby-config.js
 *  options, along with any MC list fields as query params.
 *
 * @return {Promise} - a promise that resolves a data object
 *  or rejects an error object
 */

var subscribeEmailToMailchimp = function subscribeEmailToMailchimp(url) {
    return new Promise(function(resolve, reject) {
        return (0, _jsonp2.default)(url, { param: 'c', timeout: 3500 }, function(err, data) {
            if (err) reject(err);
            if (data) resolve(data);
        });
    });
};

/**
 * Build a query string of MC list fields
 *
 * @param {Object} fields - a list of mailchimp audience field labels
 *  and their values. We uppercase because that's what MC requires.
 *  NOTE: GROUPS stay as lowercase (ex: MC uses group field names as `group[21269]`)
 *
 * @return {String} - `&FIELD1=value1&FIELD2=value2&group[21265][2]=group1`
 */
var convertListFields = function convertListFields(fields) {
    var queryParams = '';
    for (var field in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, field)) {
            // If this is a list group, not user field then keep lowercase, as per MC reqs
            // https://github.com/benjaminhoffman/gatsby-plugin-mailchimp/blob/master/README.md#groups
            var fieldTransformed = field.substring(0, 6) ? field : field.toUpperCase();
            queryParams = queryParams.concat('&' + fieldTransformed + '=' + fields[field]);
        }
    }
    return queryParams;
};

/**
 * Subscribe an email address to a Mailchimp email list.
 * We use ES5 function syntax (instead of arrow) because we need `arguments.length`
 *
 * @param {String} email - required; the email address you want to subscribe
 * @param {Object} fields - optional; add'l info (columns) you want included w/ this subscriber
 * @param {String} endpointOverride - optional; if you want to override the default MC mailing list
 *  that's listed in your gatsby-config, pass the list in here
 *
 * @return {Object} -
 *  {
 *    result: <String>(`success` || `error`)
 *    msg: <String>(`Thank you for subscribing!` || `The email you entered is not valid.`),
 *  }
 */
var addToMailchimp = function addToMailchimp(email, fields, endpointOverride) {
    var isEmailValid = (0, _emailValidator.validate)(email);
    var emailEncoded = encodeURIComponent(email);
    if (!isEmailValid) {
        return Promise.resolve({
            result: 'error',
            msg: 'The email you entered is not valid.',
        });
    }

    // eslint-disable-next-line no-undef
    var endpoint = __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__;

    // The following tests for whether you passed in a `fields` object. If
    // there are only two params and the second is a string, then we can safely
    // assume the second param is a MC mailing list, and not a fields object.
    if (arguments.length < 3 && typeof fields === 'string') {
        endpoint = fields;
    } else if (typeof endpointOverride === 'string') {
        endpoint = endpointOverride;
    }

    // Generates MC endpoint for our jsonp request. We have to
    // change `/post` to `/post-json` otherwise, MC returns an error
    endpoint = endpoint.replace(/\/post/g, '/post-json');
    var queryParams = '&EMAIL=' + emailEncoded + convertListFields(fields);
    var url = '' + endpoint + queryParams;

    return subscribeEmailToMailchimp(url);
};

exports.default = addToMailchimp;
