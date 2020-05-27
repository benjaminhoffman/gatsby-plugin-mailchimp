declare module 'gatsby-plugin-mailchimp' {
  export default function addToMailchimp(
    email: string,
    fields: object,
    endpointOverride: string
  ): Promise<object>;
}
