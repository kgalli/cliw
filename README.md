CLIW
============

A CliW[rapper] to ease day to day command line tasks!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cliw.svg)](https://npmjs.org/package/cliw)
[![Downloads/week](https://img.shields.io/npm/dw/cliw.svg)](https://npmjs.org/package/cliw)
[![License](https://img.shields.io/npm/l/cliw.svg)](https://github.com/kgalli/cliw/blob/master/package.json)

<!-- toc -->
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Command Reference](#command-reference)
<!-- tocstop -->
# Installation

```sh-session
$ npm install -g cliw
```

# Usage

```sh-session
$ cliw COMMAND
running command...

$ cliw (-v|--version|version)
cliw/0.0.0 darwin-x64 node-v10.12.0

$ cliw --help [COMMAND]
USAGE
  $ cliw COMMAND
...
```

# Commands

## `cliw init`

The `init` is used to create the initial projects config file. This is needed because the `cliw` supports
to manage several services and databases under a project. This way multiple `cliw` configurations can be
maintained at the same time while `cliw` supports switching between those when needed. This functionality
comes in very handy when work has to be done for several clients or to keep private and business projects separated.

The location of the projects config file is `$HOME/.config/cliw`. An example for the actual configuration file
which has to be passed to the `cliw init` can be found here:

_config: [config-examples/main-config.yaml](https://github.com/kgalli/cliw/blob/master/config-examples/main-config.yaml)_

## `cliw project`

Once the `init` command was used to setup the first project the `project` command can be used to add new projects
and switch between them when needed.

## `cliw db`

The `db` command is a wrapper for several database command line tools e.g. `psql`, `pg_dump`
`pg_restore` to expose those via a streamlined simplified interface. Furthermore it is using one centralized
configuration file to be able to connect to different data sources incl. support of data sources which can only
be accessed via `SSH TUNNEL`. To remove the pain of installing all those tools locally official `docker`
`docker` images are used.

Currently only `Postgres` is supported but `MySQL` is already in development.

## `cliw secret`

The `secret` command is a wrapper of the AWS KMS SDK to encrypt or decrypt string
tokens e.g. passwords.

## `cliw service`

The `service` command is a wrapper of `docker-compose`. The benefit of using this wrapper
is that you can easily manage e.g. start, stop services in different environments defined using one centralized
configuration. The switch between running a service container from an image of a registry or build the image from
source is supported via `cliw` commands directly. No change of configuration files is necessary.


# Command Reference
<!-- commands -->
* [`cliw db:console DATASOURCE`](#cliw-dbconsole-datasource)
* [`cliw db:create DATASOURCE`](#cliw-dbcreate-datasource)
* [`cliw db:drop DATASOURCE`](#cliw-dbdrop-datasource)
* [`cliw db:dump DATASOURCE`](#cliw-dbdump-datasource)
* [`cliw db:restore DATASOURCE`](#cliw-dbrestore-datasource)
* [`cliw help [COMMAND]`](#cliw-help-command)
* [`cliw init`](#cliw-init)
* [`cliw project:add PROJECT`](#cliw-projectadd-project)
* [`cliw project:list`](#cliw-projectlist)
* [`cliw project:remove PROJECT`](#cliw-projectremove-project)
* [`cliw project:set-default PROJECT`](#cliw-projectset-default-project)
* [`cliw secret:decrypt`](#cliw-secretdecrypt)
* [`cliw secret:encrypt`](#cliw-secretencrypt)
* [`cliw service:build [SERVICES]`](#cliw-servicebuild-services)
* [`cliw service:exec SERVICE COMMAND`](#cliw-serviceexec-service-command)
* [`cliw service:logs [SERVICES]`](#cliw-servicelogs-services)
* [`cliw service:origin:list`](#cliw-serviceoriginlist)
* [`cliw service:origin:set SERVICE VALUE`](#cliw-serviceoriginset-service-value)
* [`cliw service:pull [SERVICES]`](#cliw-servicepull-services)
* [`cliw service:restart [SERVICES]`](#cliw-servicerestart-services)
* [`cliw service:run SERVICE COMMAND`](#cliw-servicerun-service-command)
* [`cliw service:start [SERVICES]`](#cliw-servicestart-services)
* [`cliw service:status [SERVICES]`](#cliw-servicestatus-services)
* [`cliw service:stop [SERVICES]`](#cliw-servicestop-services)
* [`cliw service:up [SERVICES]`](#cliw-serviceup-services)

## `cliw db:console DATASOURCE`

run database console

```
USAGE
  $ cliw db:console DATASOURCE

ARGUMENTS
  DATASOURCE  data source specified by name

OPTIONS
  -c, --command=command               run only single command (SQL or internal) and exit
  -e, --environment=development|test  (required) [default: development]
  -f, --file=file                     execute commands from file, then exit
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/console.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/db/console.ts)_

## `cliw db:create DATASOURCE`

create database

```
USAGE
  $ cliw db:create DATASOURCE

ARGUMENTS
  DATASOURCE  data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/create.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/db/create.ts)_

## `cliw db:drop DATASOURCE`

create database

```
USAGE
  $ cliw db:drop DATASOURCE

ARGUMENTS
  DATASOURCE  data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/drop.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/db/drop.ts)_

## `cliw db:dump DATASOURCE`

create database

```
USAGE
  $ cliw db:dump DATASOURCE

ARGUMENTS
  DATASOURCE  data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -o, --schema-only                   dump schema without data
  -t, --target=target                 (required) dump file location (relative to current directory)
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/dump.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/db/dump.ts)_

## `cliw db:restore DATASOURCE`

restore database

```
USAGE
  $ cliw db:restore DATASOURCE

ARGUMENTS
  DATASOURCE  data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -r, --restore-file=restore-file     (required) restore file location (relative to current directory)
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/restore.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/db/restore.ts)_

## `cliw help [COMMAND]`

display help for cliw

```
USAGE
  $ cliw help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `cliw init`

initialize projects config

```
USAGE
  $ cliw init

OPTIONS
  -c, --config=config                        location of the configuration file (*.json)
  -h, --help                                 show CLI help
  -n, --name=name                            project unique identifier (name)
  -w, --working-directory=working-directory  absolute location of the working directory

DESCRIPTION
  The cli supports the 'orchestration' of multiple projects.
  Therefore it needs to know the location of the corresponding
  main-config.json file. The 'init' command is used to determine
  this location form the user and store it together with the project
  identifier (project name) at: ~/.config/projects-config.json.
```

_See code: [src/commands/init.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/init.ts)_

## `cliw project:add PROJECT`

add project

```
USAGE
  $ cliw project:add PROJECT

ARGUMENTS
  PROJECT  project specified by name

OPTIONS
  -c, --config=config                        (required) location of the configuration file (*.json)
  -h, --help                                 show CLI help
  -w, --working-directory=working-directory  (required) absolute location of the working directory
```

_See code: [src/commands/project/add.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/project/add.ts)_

## `cliw project:list`

list projects

```
USAGE
  $ cliw project:list

OPTIONS
  -x, --extended     show extra columns
  --columns=columns  only show provided columns (comma-separated)
  --csv              output is csv format
  --filter=filter    filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --sort=sort        property to sort by (prepend '-' for descending)
```

_See code: [src/commands/project/list.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/project/list.ts)_

## `cliw project:remove PROJECT`

remove project

```
USAGE
  $ cliw project:remove PROJECT

ARGUMENTS
  PROJECT  project specified by name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/project/remove.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/project/remove.ts)_

## `cliw project:set-default PROJECT`

set default project

```
USAGE
  $ cliw project:set-default PROJECT

ARGUMENTS
  PROJECT  project specified by name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/project/set-default.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/project/set-default.ts)_

## `cliw secret:decrypt`

decrypt secret encrypted via AWS KMS

```
USAGE
  $ cliw secret:decrypt

OPTIONS
  -h, --help           show CLI help
  -s, --secret=secret  (required) Secret to decrypt
```

_See code: [src/commands/secret/decrypt.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/secret/decrypt.ts)_

## `cliw secret:encrypt`

encrypt value via AWS KMS

```
USAGE
  $ cliw secret:encrypt

OPTIONS
  -h, --help         show CLI help
  -k, --keyId=keyId  (required) AWS KMS customer master key id
  -v, --value=value  (required) Value to encrypt
```

_See code: [src/commands/secret/encrypt.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/secret/encrypt.ts)_

## `cliw service:build [SERVICES]`

build or rebuild services

```
USAGE
  $ cliw service:build [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/build.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/build.ts)_

## `cliw service:exec SERVICE COMMAND`

execute a command in a running container

```
USAGE
  $ cliw service:exec SERVICE COMMAND

ARGUMENTS
  SERVICE  service name
  COMMAND  specify command to execute

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/exec.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/exec.ts)_

## `cliw service:logs [SERVICES]`

show service logs

```
USAGE
  $ cliw service:logs [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -f, --follow                        follow log output
  -h, --help                          show CLI help
  -t, --timestamps                    show timestamps
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/logs.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/logs.ts)_

## `cliw service:origin:list`

list service(s) origin SOURCE|REGISTRY

```
USAGE
  $ cliw service:origin:list

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -s, --services=services
```

_See code: [src/commands/service/origin/list.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/origin/list.ts)_

## `cliw service:origin:set SERVICE VALUE`

set service build origin SOURCE|REGISTRY

```
USAGE
  $ cliw service:origin:set SERVICE VALUE

ARGUMENTS
  SERVICE  service name
  VALUE    (registry|source) build origin

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help

EXAMPLE
  $ cliw service:origin:set api source
```

_See code: [src/commands/service/origin/set.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/origin/set.ts)_

## `cliw service:pull [SERVICES]`

pull docker image(s) from registry

```
USAGE
  $ cliw service:pull [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/pull.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/pull.ts)_

## `cliw service:restart [SERVICES]`

stop, (re)create and start services in daemon mode

```
USAGE
  $ cliw service:restart [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/restart.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/restart.ts)_

## `cliw service:run SERVICE COMMAND`

run a one-off command on a service

```
USAGE
  $ cliw service:run SERVICE COMMAND

ARGUMENTS
  SERVICE  service name
  COMMAND  specify command to execute

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/run.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/run.ts)_

## `cliw service:start [SERVICES]`

(re)create and start services in daemon mode

```
USAGE
  $ cliw service:start [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/start.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/start.ts)_

## `cliw service:status [SERVICES]`

show services run status

```
USAGE
  $ cliw service:status [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -s, --services=services
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/status.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/status.ts)_

## `cliw service:stop [SERVICES]`

stop services running in daemon mode

```
USAGE
  $ cliw service:stop [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -t, --timeout=timeout               [default: 10] specify a shutdown timeout in seconds
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/stop.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/stop.ts)_

## `cliw service:up [SERVICES]`

build, (re)create, start, and attach to containers

```
USAGE
  $ cliw service:up [SERVICES]

ARGUMENTS
  SERVICES  list of service names [default: all]

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -s, --services=services
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/service/up.ts](https://github.com/kgalli/cliw/blob/v0.10.0/src/commands/service/up.ts)_
<!-- commandsstop -->
