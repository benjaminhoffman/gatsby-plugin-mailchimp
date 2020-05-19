const { onCreateWebpackConfig } = require('../gatsby-node');

describe('gatsby-node > onCreateWebpackConfig', () => {
    const plugins = {};
    const actions = {};

    beforeEach(() => {
        plugins.define = jest.fn();
        actions.setWebpackConfig = jest.fn();
    });

    it('Throws an error when endpoint is not a string', () => {
        const endpoint = 123;
        expect(() => onCreateWebpackConfig({ plugins, actions }, { endpoint })).toThrow(Error);
        expect(actions.setWebpackConfig).not.toHaveBeenCalled();
        expect(plugins.define).not.toHaveBeenCalled();
    });

    it('Throws an error when endpoint is length is lesser than 40 chars', () => {
        const endpoint = 'https://my-endpoint';
        expect(() => onCreateWebpackConfig({ plugins, actions }, { endpoint })).toThrow(Error);
        expect(actions.setWebpackConfig).not.toHaveBeenCalled();
        expect(plugins.define).not.toHaveBeenCalled();
    });

    describe('Options -> calls set setWebpackConfig and define variables correctly', () => {
        it('with default values', () => {
            const endpoint = `https://my-endpoint-with-more-than-40-chars.com`;

            expect(actions.setWebpackConfig).not.toHaveBeenCalled();
            expect(plugins.define).not.toHaveBeenCalled();

            onCreateWebpackConfig({ plugins, actions }, { endpoint });

            expect(actions.setWebpackConfig).toHaveBeenCalledTimes(1);
            expect(plugins.define).toHaveBeenCalledTimes(1);
            expect(plugins.define).toHaveBeenCalledWith(
                expect.objectContaining({
                    __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__: expect.any(String),
                    __GATSBY_PLUGIN_MAILCHIMP_TIMEOUT__: 3500,
                }),
            );
        });

        it('with timeout value', () => {
            const endpoint = `https://my-endpoint-with-more-than-40-chars.com`;
            const timeout = 10000;

            expect(actions.setWebpackConfig).not.toHaveBeenCalled();
            expect(plugins.define).not.toHaveBeenCalled();

            onCreateWebpackConfig({ plugins, actions }, { endpoint, timeout });

            expect(actions.setWebpackConfig).toHaveBeenCalledTimes(1);
            expect(plugins.define).toHaveBeenCalledTimes(1);
            expect(plugins.define).toHaveBeenCalledWith(
                expect.objectContaining({
                    __GATSBY_PLUGIN_MAILCHIMP_ADDRESS__: expect.any(String),
                    __GATSBY_PLUGIN_MAILCHIMP_TIMEOUT__: timeout,
                }),
            );
        });
    });
});
