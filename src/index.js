import gatsbyConfig from '../../gatsby-config'
import jsonp from 'jsonp'
import { validate } from 'email-validator'

/*
 * make a jsonp request to user's mailchimp list
 * url is a concatenated string of user's gatsby-config.js
 * options, along with any MC list fields as query params
 */

const subscribeEmailToMailchimp = url => (
  new Promise((resolve, reject) => {
    // `param` object avoids CORS issues
    return jsonp(url, { param: 'c' }, (err, data) => {
      if (err) reject(err)
      if (data) resolve(data)
    })
  })
)

/*
 * parse the plugin options to use in our jsonp request
 */

const getPluginOptions = () => {
  // find gatsby-mailchimp plugin options (MC list settings)
  const options = gatsbyConfig.plugins.find(
    plugin => plugin.resolve === 'gatsby-plugin-mailchimp'
  ).options

  const isString = typeof options.endpoint === 'string'
  if (!isString) {
    throw `Mailchimp endpoint required and must be of type string. See repo README for more info.`
  }
  return options
};

/*
 * build a query string of MC list fields
 * ex: '&KEY1=value1&KEY2=value2'
 * (toUpperCase because that's what MC requires)
 */

const convertListFields = fields => {
  let queryParams = ''
  for (const field in fields) {
    queryParams = queryParams.concat(`&${field.toUpperCase()}=${fields[field]}`)
  }
  return queryParams
}

/*
 * accept email (String) and additional, optional
 * Mailchimp list fields (Object)
 * then make jsonp req with data
 */

const addToMailchimp = (email, fields) => {
  const isEmailValid = validate(email)
  const emailEncoded = encodeURIComponent(email)
  if (!isEmailValid) {
    throw 'gatsy-plugin-mailchimp: email must be of type string and a valid email address. See README for more information.'
  }

  // generate Mailchimp endpoint for jsonp request
  // note, we change `/post` to `/post-json`
  // otherwise, Mailchomp returns an error
  let {endpoint} = getPluginOptions()
  endpoint = endpoint.replace(/\/post/g, '/post-json')

  const queryParams = `&EMAIL=${emailEncoded}${convertListFields(fields)}`
  const url = `${endpoint}${queryParams}`
  return subscribeEmailToMailchimp(url)
}

export default addToMailchimp
