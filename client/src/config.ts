// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'bkb4udymr5'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
   domain: 'dev-mp8zvicd.auth0.com',            // Auth0 domain
   clientId: '29VL1Eo7qHOjOu7rd2s14tJwu3G1QxEy',          // Auth0 client id
   callbackUrl: 'http://localhost:3000/callback'
}