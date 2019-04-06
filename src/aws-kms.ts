import * as AWS from 'aws-sdk'

const defaultOptions = {
  region: 'eu-central-1'
}

export default class AwsKmsClient {
  client: AWS.KMS

  constructor(options: any) {
    const clientOptions = {...defaultOptions, options}
    this.client = new AWS.KMS(clientOptions)
  }

  async decrypt(secret: string) {
    const secretBuffer = Buffer.from(secret.replace('aws:kms:', ''), 'base64')
    const params = {CiphertextBlob: secretBuffer}
    const response = await this.client.decrypt(params).promise()

    return response.Plaintext ? response.Plaintext.toString() : new Error('Empty result')
  }

  async encrypt(keyId: string, value: string) {
    const params = {KeyId: keyId, Plaintext: value}
    const result = await this.client.encrypt(params).promise()

    return result.CiphertextBlob ? result.CiphertextBlob.toString('base64') : new Error('Empty result')
  }
}
