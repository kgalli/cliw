import {Command, flags} from '@oclif/command'

import AwsKmsClient from '../../aws-kms'

export default class Decrypt extends Command {
  static description = 'decrypt secret encrypted via AWS KMS'

  static flags = {
    help: flags.help({char: 'h'}),
    secret: flags.string({char: 's', description: 'Secret to decrypt', required: true}),
  }

  async run() {
    const {flags} = this.parse(Decrypt)

    try {
      const client = new AwsKmsClient({})
      const decryptedValue = await client.decrypt(flags.secret) as string

      this.log(decryptedValue)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
