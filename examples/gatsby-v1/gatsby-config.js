module.exports = {
  siteMetadata: {
    title: 'Gatsby v2 Mailchimp Plugin Example',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: 'https://LAcolon.us6.list-manage.com/subscribe/post?u=46b9f89ed6c3b91c8caf11b40&amp;id=dc7ff0b690',
      },
    },
  ],
}
