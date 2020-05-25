## Subscribe emails to your Mailchimp list

This Gatsby plugin helps you subscribe new email addresses to a Mailchimp email list. Mailchimp does
not provide much direction on making clientside requests so the setup to achieve this with a static
website (i.e. Gatsby) can be cumbersome.

## 🍾 We now support multiple Mailchimp lists! 🎉

See below for details.

## How It Works Under The Hood

First we scan your `gatsby-config` for your MC endpoint. Then, once you import and invoke the
`addToMailchimp` method in your React component, it makes a jsonp request to your endpoint with the
email, attributes, and any group fields you include in the request.

## Getting Started

There are three steps involved to getting started:

1. add this plugin to your repo

    - In the root directory of your Gatsby project, run the following command in your terminal:

    ```
    # npm
    $ npm install gatsby-plugin-mailchimp

    # yarn
    $ yarn add gatsby-plugin-mailchimp
    ```

2. add your Mailchimp endpoint to your `gatsby-config.js` file (see below for instructions)
3. import & invoke the `addToMailchimp` method exported by this plugin

## Using Gatsby v1?

If you are still on Gatsby v1.x, you need to use an old version of this plugin. There were a lot of
changes made in Gatsby v2 that will cause this plugin to break so make sure to use the correct
version of this plugin if you are still on Gatsby v1.

We no longer maintain this version.

Simply update your `package.json` to:

    ```
    # npm
    $ npm install https://github.com/benjaminhoffman/gatsby-plugin-mailchimp.git#gatsby-v1

    # yarn
    $ yarn add https://github.com/benjaminhoffman/gatsby-plugin-mailchimp.git#gatsby-v1
    ```

## Gatsby Config Instructions

You need to provide this plugin with your Mailchimp account and list details in order for it to know
which endpoint to save the email address to. Follow these directions:

In your `gatsby-config.js` file, add the following code to the plugin section:

```javascript
plugins: [
    ...{
        resolve: 'gatsby-plugin-mailchimp',
        options: {
            endpoint: '', // string; add your MC list endpoint here; see instructions below
            timeout: 3500, // number; the amount of time, in milliseconds, that you want to allow mailchimp to respond to your request before timing out. defaults to 3500
        },
    },
];
```

### Mailchimp Endpoint

Your Mailchimp endpoint will look something like this:
_https://example.us10.list-manage.com/subscribe/post?u=b9ef2fdd3edofhec04ba9b930&amp;id=3l948gkt1d_

Here is how you can locate your Mailchimp endpoint.

1. Login to your Mailchimp account
2. Click "Lists" tab at the top
3. Locate the Mailchimp list you want to save email addresses to
4. Click that list
5. Click the subtab "Signup forms"
6. Click "Embedded forms"

![screenshot of how to locate your Mailchimp `u` settings](https://raw.githubusercontent.com/benjaminhoffman/gatsby-plugin-mailchimp/master/img/mailchimp_list.png)

7. Scroll down to the section with all the HTML code
8. Locate the HTML form element. Copy the entire URL listed under the form "action" attribute\*
9. Paste that URL into your `gatsby-config`ʼs `option.endpoint` field

![screenshot of how to copy/paste your list settings URL](https://raw.githubusercontent.com/benjaminhoffman/gatsby-plugin-mailchimp/master/img/mailchimp_form_action.png)

... that's all!

## Gatsby Import Plugin Instructions

This plugin exports one method -- `addToMailchimp` -- that accepts one required argument (`email`)
and two optional fields (`fields` and `endpointOverride`).

-   `email` is a valid email string
-   `fields` is an object of attributes youʼd like to save with the email address. More detailed
    instructions below.
-   `endpointOverride` is if you want to pass in a custom MC endpoint (one that is different than
    the one listed in your config file. See below for details)

Navigate to the file where you collect email addresses (ie, the file you want to import this plugin
into). When a user submits a form and includes at least their email address, invoke the
`addToMailchimp` method like you would any other method. Here is an example:

```javascript
import addToMailchimp from 'gatsby-plugin-mailchimp'
...

export default class MyGatsbyComponent extends React.Component {
  // Since `addToMailchimp` returns a promise, you
  // can handle the response in two different ways:

  // Note that you need to send an email & optionally, listFields
  // these values can be pulled from React state, form fields,
  // or wherever.  (Personally, I recommend storing in state).

  // 1. via `.then`
  _handleSubmit = e => {
    e.preventDefault();
    addToMailchimp(email, listFields) // listFields are optional if you are only capturing the email address.
    .then(data => {
      // I recommend setting data to React state
      // but you can do whatever you want (including ignoring this `then()` altogether)
      console.log(data)
    })
    .catch(() => {
      // unnecessary because Mailchimp only ever
      // returns a 200 status code
      // see below for how to handle errors
    })
  }

  // 2. via `async/await`
  _handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addToMailchimp(email, listFields)
    // I recommend setting `result` to React state
    // but you can do whatever you want
  }

  render () {
    return (
      <form onSubmit={this._handleSubmit(email, {listFields})}>
        ...
      </form>
    )
  }
}
```

## Returns

This plugin returns a promise that resolves to the object that is returned by Mailchimpʼs API. The
Mailchimp API will always return a status of 200. In order to know if your submission was a success
or error, you must read the returned object, which has a `result` and `msg` property:

```javascript
{
    result: string; // either `success` or `error` (helpful to use this key to update your state)
    msg: string; // a user-friendly message indicating details of your submissions (usually something like "thanks for subscribing!" or "this email has already been added")
}
```

## Mailchimp List Fields

Sometimes you want to send to Mailchimp more than just an email address. Itʼs very common to also
send a first name, last name, pathname, etc. Honestly, you can send whatever you want to store
alongside the email address. Instructions below on how to create new list fields but once youʼve set
them up in Mailchimp, you send them alongside the email like this:

```javascript
addToMailchimp('email@example.com', {
  PATHNAME: '/blog-post-1',
  FNAME: 'Ben',
  LNAME: 'Coder'
  ...
})
```

## Mailchimp Groups

Mailchimp offers the concept of list groups. It's a bit tricky to implement here because you _must_
use the exact key and value as defined in your MC Embedded Form for those fields.

To add these you must go back to your "Embedded Forms" (where you got your endpoint from) and find
the form field that represents the group you want to add this user to. Next, copy the name and use
that as your key in the `addToMailchimp` field param. The name field will have weird values like
`group[21265][2]` or `group[21269]`.

Similarly, the `input` field `value` must also be the same as you see. This means you must either
set the name and value fields manually in your form or keep a mapping in your JS file.

Why do we need to use these weird structure for name and value field? Because this is what Mailchimp
expects. 🤷🏽‍♂️

For example, here is a screenshot of what this looks like:

![screenshot of Mailchimp Groups](https://raw.githubusercontent.com/benjaminhoffman/gatsby-plugin-mailchimp/master/img/mc_groups.png)

And the code would be:

```
# HTML
/*
  Here we chose to name the input field the same as what's in
  our embedded form.  But you can name it whatever you want and keep
  a field name map in your JS. Mailchimp expects the name and value
  to match what's in its Embedded Form
*/
<input value="2" name="group[21265][2]">

# JS
addToMailchimp('email@example.com', {
  PATHNAME: '/blog-post-1',
  FNAME: 'Ben',
  LNAME: 'Coder',
  'group[21265][2]': '2',
  ...
})
```

See here for [thread](https://github.com/benjaminhoffman/gatsby-plugin-mailchimp/pull/31).

## Multiple Mailchimp lists

Many people asked for the ability to send users to different Mailchimp lists. We added that
capability! How we added this capability without a breaking change is by allowing you to _override_
the endpoint that's listed in your `gatsby-config.js` file. When you invoke `addToMailchimp`, pass
in a third argument of the list you'd like to subscribe this email address to. That will override
the default one listed in your config.

```javascript
addToMailchimp(
    'ben@gatsby-plugin-mailchimp.com',
    {
        /* list fields here*/
    },
    'https://example.us10.list-manage.com/subscribe/post?u=b9ef2fdd3ed',
);
```

## Example

See directory in this repo called `/examples`.

## Gotchas

1. _email address_: pass in the email as normal (ie, `you@gmail.com`). Do _not_ encode or transform
   the email, as our plugin will do that for you!

2. _listFields_: many times you want to collect more than just an email address (first/last name,
   birthday, page pathname). I like to store this info in React state and pass it in as list fields.
   See below.

3. I like to save the returned data to React state so I can then display a success/error message to
   the user.

4. There is a
   [current known issue (#15)](https://github.com/benjaminhoffman/gatsby-plugin-mailchimp/issues/15)
   where this plugin does _not work_ if the Mailchimp List has
   [reCAPTCHA enabled](https://mailchimp.com/help/about-recaptcha-for-signup-forms/#Enable-reCAPTCHA/).
   This setting should be turned off for everything to function properly.

### Create, Remove, or Edit Mailchimp List Fields

To setup or modify Mailchimp list fields, navigate to your MC list, click "Settings", then click
"List fields". Then add, remove, or edit fields as you wish. Make sure to update your
`addToMailchimp` listFields object after youʼve made changes in Mailchimp.

![screenshot of Mailchimp list fields settings screen](https://raw.githubusercontent.com/benjaminhoffman/gatsby-plugin-mailchimp/master/img/mailchimp_list_fields.png)

## Contributing

If you'd like to contribute, simply open a PR or open an issue!
