import React from 'react';

import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Header from './header';
import './layout.css';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => (
    <siteTitleQueryAndSiteTitleQuery
        query={graphql`
        site {
          siteMetadata {
            title
          }
        }
    `}
        render={data => (
            <>
                <Helmet title={data.site.siteMetadata.title}>
                    <html lang="en" />
                </Helmet>
                <Header siteTitle={data.site.siteMetadata.title} />
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
        )}
    />
);

export default Layout;
