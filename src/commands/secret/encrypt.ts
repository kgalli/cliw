import {Command, flags} from '@oclif/command'

import AwsKmsClient from '../../aws-kms'

export default class Encrypt extends Command {
  static description = 'encrypt value via AWS KMS'

  static flags = {
    help: flags.help({char: 'h'}),
    value: flags.string({char: 'v', description: 'Value to encrypt', required: true}),
    keyId: flags.string({char: 'k', description: 'AWS KMS customer master key id', required: true}),
  }

  async run() {
    const {flags} = this.parse(Encrypt)

    try {
      const client = new AwsKmsClient({})
      const encryptedValue = await client.encrypt(flags.keyId, flags.value) as string

      this.log(encryptedValue)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
