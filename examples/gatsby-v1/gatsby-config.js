module.exports = {
  siteMetadata: {
    title: 'Gatsby v2 Mailchimp Plugin Example',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: '', // replace with your own Mailchimp endpoint for testing
      },
    },
  ],
}
