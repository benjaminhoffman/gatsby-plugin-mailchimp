import React from "react"

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  setPostBodyComponents([
    React.createElement(
      'script',
      {
        key: "gatsby-plugin-mailchimp",
        dangerouslySetInnerHTML: { __html: `window.__GATSBY_PLUGIN_MAILCHIMP__ = ${JSON.stringify(pluginOptions)};` }
      }
    )
  ])
}
