import React from 'react'

import Helmet from 'react-helmet'

import Header from './header'
import './layout.css'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => (
    <>
        <Helmet title="Test your Mailchimp setup here! | gatsby-plugin-mailchimp">
            <html lang="en" />
        </Helmet>
        <Header siteTitle="Test your Mailchimp setup here! | gatsby-plugin-mailchimp" />
        <div
            style={{
                margin: '0 auto',
                maxWidth: 960,
                padding: '0px 1.0875rem 1.45rem',
                paddingTop: 0,
            }}
        >
            {children}
        </div>
    </>
)

export default Layout
