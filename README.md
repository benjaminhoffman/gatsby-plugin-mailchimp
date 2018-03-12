send in email, user attributes to add a user to your mailchimp list

add your mailchimp endpoint via your `gatsby-config.js` file

TODO:
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

```javascript
 plugins: [
    ...
    {
      resolve: 'gatsby-plugin-my-cool-plugin',
      options: {
        endpoint: '',
      },
    },
```