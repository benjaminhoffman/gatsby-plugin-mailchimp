module.exports = {
    siteMetadata: {
        title: 'Gatsby Default Starter',
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
