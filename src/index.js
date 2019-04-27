import jsonp from 'jsonp';
import { validate } from 'email-validator';

/*
 * make a jsonp request to user's mailchimp list
 * url is a concatenated string of user's gatsby-config.js
 * options, along with any MC list fields as query params
 */

// `param` object avoids CORS issues
// timeout to 3.5s so user isn't waiting forever
// usually occurs w/ privacy plugins enabled
// 3.5s is a bit longer than the time it would take on a Slow 3G connection
const subscribeEmailToMailchimp = url =>
    new Promise((resolve, reject) =>
        jsonp(url, { param: 'c', timeout: 3500 }, (err, data) => {
            if (err) reject(err);
            if (data) resolve(data);
        }),
    );

/*
 * build a query string of MC list fields
 * ex: '&KEY1=value1&KEY2=value2'
 * FIELDS: toUpperCase because that's what MC requires)
 * GROUPS: keep as lowercase (ex: MC uses group field names as `group[21269]`)
 */

const convertListFields = fields => {
    let queryParams = '';
    for (const field in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, field)) {
            // If this is a list group, not user field then keep lowercase, as per MC reqs
            // https://github.com/benjaminhoffman/gatsby-plugin-mailchimp/blob/master/README.md#groups
            const fieldTransformed = field.substring(0, 6) ? field : field.toUpperCase();
            queryParams = queryParams.concat(`&${fieldTransformed}=${fields[field]}`);
        }
    }
    return queryParams;
};

/*
 * accept email (String) and additional, optional
 * Mailchimp list fields (Object)
 * then make jsonp req with data
 */

const addToMailchimp = (email, fields) => {
    const isEmailValid = validate(email);
    const emailEncoded = encodeURIComponent(email);
    if (!isEmailValid) {
        return Promise.resolve({
            result: 'error',
            msg: 'The email you entered is not valid.',
        });
    }

    // generate Mailchimp endpoint for jsonp request
    // note, we change `/post` to `/post-json`
    // otherwise, Mailchomp returns an error
    // eslint-disable-next-line no-undef
    const endpoint = __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__.replace(/\/post/g, '/post-json');

    const queryParams = `&EMAIL=${emailEncoded}${convertListFields(fields)}`;
    const url = `${endpoint}${queryParams}`;
    return subscribeEmailToMailchimp(url);
};

export default addToMailchimp;
