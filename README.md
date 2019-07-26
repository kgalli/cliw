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

The `init` command supports to manage several services and databases under a project. This way
multiple configurations can be maintained at the same time while `cliw` supports switching
between those when needed. Typical if work is done for several clients or keep private and
business projects separated.

## `cliw db`

The `db` command is a wrapper of several database command line tools e.g. `psql`, `pg_dump`
`pg_restore` and exposes those via a streamlined simplified interface (incl. support of
data sources which can only be accessed via `SSH TUNNEL`). It is also using
`docker` images to provide this tools so that no actual installation of the tools is necessary.

Currently only `Postgres` is supported but `MySQL` is already in development.

## `cliw secret`

The `secret` command is a wrapper of the AWS KMS SDK to encrypt or decrypt string
token e.g. passwords.

## `cliw service`

The `service` command is a wrapper of `docker-compose`. The benefit of using this wrapper
is that you can easily manage e.g. start, stop services in different environments (configuration)
at the same time. It also supports to switch between running a service container from an image
or build the image from source directly.


# Command Reference
<!-- commands -->
* [`cliw config:list`](#cliw-configlist)
* [`cliw config:set KEY VALUE`](#cliw-configset-key-value)
* [`cliw db:console`](#cliw-dbconsole)
* [`cliw db:create`](#cliw-dbcreate)
* [`cliw db:drop`](#cliw-dbdrop)
* [`cliw db:dump`](#cliw-dbdump)
* [`cliw db:restore`](#cliw-dbrestore)
* [`cliw help [COMMAND]`](#cliw-help-command)
* [`cliw init`](#cliw-init)
* [`cliw secret:decrypt`](#cliw-secretdecrypt)
* [`cliw secret:encrypt`](#cliw-secretencrypt)
* [`cliw service:build`](#cliw-servicebuild)
* [`cliw service:exec COMMAND`](#cliw-serviceexec-command)
* [`cliw service:logs`](#cliw-servicelogs)
* [`cliw service:pull`](#cliw-servicepull)
* [`cliw service:restart`](#cliw-servicerestart)
* [`cliw service:run COMMAND`](#cliw-servicerun-command)
* [`cliw service:start`](#cliw-servicestart)
* [`cliw service:status`](#cliw-servicestatus)
* [`cliw service:stop`](#cliw-servicestop)
* [`cliw service:up`](#cliw-serviceup)

## `cliw config:list`

list config options

```
USAGE
  $ cliw config:list

OPTIONS
  -h, --help             show CLI help
  -p, --project=project  (required)
```

_See code: [src/commands/config/list.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/config/list.ts)_

## `cliw config:set KEY VALUE`

Set config options

```
USAGE
  $ cliw config:set KEY VALUE

ARGUMENTS
  KEY    (buildtype) options key to set
  VALUE  (image|src) value of options key to set

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -p, --project=project  (required)
  -s, --service=service  (required)
```

_See code: [src/commands/config/set.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/config/set.ts)_

## `cliw db:console`

run database console

```
USAGE
  $ cliw db:console

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -s, --service=service  (required)
  --dry-run              print shell commands without executing
```

_See code: [src/commands/db/console.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/db/console.ts)_

## `cliw db:create`

create database

```
USAGE
  $ cliw db:create

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -s, --service=service  (required)
  --dry-run              print shell commands without executing
```

_See code: [src/commands/db/create.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/db/create.ts)_

## `cliw db:drop`

create database

```
USAGE
  $ cliw db:drop

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -s, --service=service  (required)
  --dry-run              print shell commands without executing
```

_See code: [src/commands/db/drop.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/db/drop.ts)_

## `cliw db:dump`

create database

```
USAGE
  $ cliw db:dump

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -o, --schema-only      dump schema without data
  -s, --service=service  (required)
  -t, --target=target    (required) dump file location (relative to current directory)
  --dry-run              print shell commands without executing
```

_See code: [src/commands/db/dump.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/db/dump.ts)_

## `cliw db:restore`

restore database

```
USAGE
  $ cliw db:restore

OPTIONS
  -e, --environment=               (required)
  -h, --help                       show CLI help
  -r, --restore-file=restore-file  (required) restore file location (relative to current directory)
  -s, --service=service            (required)
  --dry-run                        print shell commands without executing
```

_See code: [src/commands/db/restore.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/db/restore.ts)_

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
  -h, --help                   show CLI help
  -m, --mainConfig=mainConfig  location of the main-config.json file
  -n, --name=name              name used as identifier for project

DESCRIPTION
  The cli supports the 'orchestration' of multiple projects.
  Therefore it needs to know the location of the corresponding
  main-config.json file. The 'init' command is used to determine
  this location form the user and store it together with the project
  identifier (project name) at: ~/.config/projects-config.json.
```

_See code: [src/commands/init.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/init.ts)_

## `cliw secret:decrypt`

decrypt secret encrypted via AWS KMS

```
USAGE
  $ cliw secret:decrypt

OPTIONS
  -h, --help           show CLI help
  -s, --secret=secret  (required) Secret to decrypt
```

_See code: [src/commands/secret/decrypt.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/secret/decrypt.ts)_

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

_See code: [src/commands/secret/encrypt.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/secret/encrypt.ts)_

## `cliw service:build`

build or rebuild services

```
USAGE
  $ cliw service:build

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/build.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/build.ts)_

## `cliw service:exec COMMAND`

execute a command in a running container

```
USAGE
  $ cliw service:exec COMMAND

ARGUMENTS
  COMMAND  specify command to execute

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -s, --service=service  (required)
  --dry-run              print shell commands without executing
```

_See code: [src/commands/service/exec.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/exec.ts)_

## `cliw service:logs`

show service logs

```
USAGE
  $ cliw service:logs

OPTIONS
  -e, --environment=       (required)
  -f, --follow             follow log output
  -h, --help               show CLI help
  -s, --services=services
  -t, --timestamps         show timestamps
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/logs.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/logs.ts)_

## `cliw service:pull`

pull docker image(s) from registry

```
USAGE
  $ cliw service:pull

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/pull.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/pull.ts)_

## `cliw service:restart`

stop, (re)create and start services in daemon mode

```
USAGE
  $ cliw service:restart

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/restart.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/restart.ts)_

## `cliw service:run COMMAND`

run a one-off command on a service

```
USAGE
  $ cliw service:run COMMAND

ARGUMENTS
  COMMAND  specify command to execute

OPTIONS
  -e, --environment=     (required)
  -h, --help             show CLI help
  -s, --service=service  (required)
  --dry-run              print shell commands without executing
```

_See code: [src/commands/service/run.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/run.ts)_

## `cliw service:start`

(re)create and start services in daemon mode

```
USAGE
  $ cliw service:start

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/start.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/start.ts)_

## `cliw service:status`

show services run status

```
USAGE
  $ cliw service:status

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/status.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/status.ts)_

## `cliw service:stop`

stop services running in daemon mode

```
USAGE
  $ cliw service:stop

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  -t, --timeout=timeout    [default: 10] specify a shutdown timeout in seconds
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/stop.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/stop.ts)_

## `cliw service:up`

build, (re)create, start, and attach to containers

```
USAGE
  $ cliw service:up

OPTIONS
  -e, --environment=       (required)
  -h, --help               show CLI help
  -s, --services=services
  --dry-run                print shell commands without executing
```

_See code: [src/commands/service/up.ts](https://github.com/kgalli/cliw/blob/v0.4.1/src/commands/service/up.ts)_
<!-- commandsstop -->
