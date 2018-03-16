This Gatsby plugin helps you add email addresses to your Mailchimp list much easier than re-writing the code yourself.  Mailchimp frowns upon adding emails to your list on the client and makes it difficult to do so.  I've extrapolated all that logic into one nice, neat, lightweight plugin!

### Features
This plugin accepts yoru Mailchimp account and list settings via your `gatsby-config` file and allows you to pass in an email address and any additional attributes you'd like to save with the user.

For success and error messages, we simply forward whatever is returned from mailchimp.


### Get Started
To use, simply follow these steps:

`$ yarn add gatsby-plugin-mailchimp`

Then in your `gatsby-config.js` file, add the following code to the plugin section:

```javascript
 plugins: [
    ...
    {
      resolve: 'gatsby-plugin-my-cool-plugin',
      options: {
        endpoint: '', // see instructions below
      },
    },
```

### Instructions


### To do
- MC is returning a random error yet it still adds the user to the MC email list
- remove `console.log`
- ensure MC endpoint is valid
- create basic MC field form (name, email, submit button)
- fix `src/index.js` to use `async/await`
- README TODO
  - explain how to get the MC endpoint
  - explain how emails should be standard bc we do the encoding herein
  - explain how to capture MC list fields and pass them in correctly
- publish to npm
