import {cli} from 'cli-ux'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'

const sortByName = (a: any, b: any) => {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  return 0
}

export default class ProjectList extends BaseCommand {
  static description = 'list projects'

  static flags = {
    ...cli.table.flags()
  }

  async run() {
    const {flags} = this.parse(ProjectList)
    const projectsConfig = ConfigUtils.projectsConfigLoad()
    cli.table(projectsConfig.projects.sort(sortByName), {
      name: {
        minWidth: 7,
      },
      mainConfigLocation: {},
      default: {
        get: row => row.name === projectsConfig.default ? true : ''
      }
    }, {
      printLine: this.log,
      ...flags, // parsed flags
    })
  }
}
