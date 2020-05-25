## Version History

**5.2.0**

-   Make timeout configurable (#68)

**5.1.0**

-   Adds ability to override default Mailchimp endpoint with a custom one

**5.0.1**

-   Adds eslint and prettier

**5.0.0**

-   Adds support for Mailchimp Groups. See README.md for more details on how to implement.

**4.0.0**

-   Gatsby v2 is now default. See README.md for upgrade details.

**3.0.0**

-   uses `gatsby-node` and [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/) to
    extract your Mailchimp API key during _compile time only_, set it to global, then use it to make
    the http request. Previously, we were importing your entire `gatsby-config` file

**2.0.0**

-   return a promise, not string, from an error'd http request

## To do

-   ensure MC endpoint is valid
-   create basic MC field form (name, email, submit button)
-   spec
