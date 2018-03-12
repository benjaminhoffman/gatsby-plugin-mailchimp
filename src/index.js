import gatsbyConfig from '../../gatsby-config'
import jsonp from 'jsonp'
import { validate } from 'email-validator'

/*
 * make a jsonp request to user's mailchimp list
 * url is a concatenated string of user's gatsby.config
 * options, along with any MC list fields as query params
 */

const makeMailchimpRequest = url => {
  return new Promise((resolve, reject) => {
    return jsonp(url, { param: 'c' }, (err, data) => {
      console.log('1', err)
      if (err) resolve(err)
      console.log('2', data)
      if (data) reject(data)
    })
  })
}

/*
 * parse the plugin options to use in our jsonp request
 */

const getPluginOptions = () => {
  const options = gatsbyConfig.plugins.find(
    plugin => plugin.resolve === 'gatsby-plugin-my-cool-plugin'
  ).options

  const isString = typeof options.endpoint === 'string'
  if (!isString) {
    throw `Mailchimp endpoint required and must be of type string. See repo README for more info.`
  }
  return options
}

/*
 * convert fields object into a query string
 * ex: '&KEY1=value1&KEY2=value2'
 * toUpperCase because that's what MC requires
 */

const convertListFields = fields => {
  let queryParams = ''
  for (const field in fields) {
    queryParams = queryParams.concat(`&${field.toUpperCase()}=${fields[field]}`)
  }
  return queryParams
}

/*
 * accept email (String) and additional
 * and optional Mailchimp list fields (Object)
 * then make jsonp req with data
 */

const addToMailchimp = (email, fields) => {
  const isEmailValid = validate(email)
  const emailEncoded = encodeURIComponent(email)
  if (!isEmailValid) {
    throw 'gatsy-plugin-mailchimp: email must be of type string and a valid email address. See README for more information.'
  }

  let endpoint = ''
  try {
    endpoint = getPluginOptions().endpoint
  } catch (e) {
    throw e
  }

  const queryParams = `&EMAIL=${emailEncoded}${convertListFields(fields)}`
  const url = `${endpoint}${queryParams}`
  makeMailchimpRequest(url)
  .then(data => {
    return data
  })
  .catch(err => {
    console.log("ERR", err)
  })
}

export default addToMailchimp
