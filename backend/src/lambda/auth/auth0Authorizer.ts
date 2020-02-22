import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJCzM0CpeoMLyGMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1tcDh6dmljZC5hdXRoMC5jb20wHhcNMjAwMjIxMDE1MzA3WhcNMzMx
MDMwMDE1MzA3WjAhMR8wHQYDVQQDExZkZXYtbXA4enZpY2QuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw2zXyZWAiZWVkZw26L9VuxXf
F3udI3FSy5iSmlNvvTiQjxUEdwo6uNdDfQx+s600DjpzuGwZkTT3yhawMQ9SrQa1
Pw6150G25jtRCecTpJEQ1VIjw6bgVI/AoPETFJT7h3slTUpgNoop2pi+CHrEOPTO
3Sop2YRrzw1iBivEcx8ZxyrWwbcU5gnYuI/pei6BZsmmXnpMC2HiFUAR9mUuPYLF
fTf1TC1SQimYic4XarN+MEVLNWsxQEG7zM/KqzqVBW/VhiEK/J75rafQFr92os+E
h0Q5fKvY7DNI0tmeYep3Wz0plSuwiyXTD8d7PkooM+1+ACZ+LiL161QMO0Ij3QID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBS3q2bphrPy6HXgAFOj
HT+BpSPuVzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAFc/tY0l
MoChVWhgIn+B0vI3r0iSn9gi7djZ4Uq85lraJSp+D2TBfO8zl/dDCJZot2mmU+Eg
hBicSWZ28kLF8TUk4euB4S8njqwmnDMYQHV6xvpbyL2T8/TLUbC1+LStRNEPAxY0
kPzC2Zjeyy3aTwaBB81JT4D0hwv3Z2xsAb3l5mSGgJZQOoRheGhVpW0qYwsw7ShY
U1FTbY3vrmkzPKEyql7X0DPtloQcvJef4lcvEloHvI3OMbYbzZ7qswU1VQVUQi91
eK49zkIE7VXQTiKmvtF1pjCDCz1V/3CEn7R+sLxDDOm2nNHV+nd/VHEIlat9+esR
6RyerHl1c/CJqbU=
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  console.log(jwt, Axios, verify, jwt)

  return verify(token, cert,  { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
