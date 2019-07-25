CLIW
============

A CliW[rapper] to ease day to day command line tasks!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/orchestrator.svg)](https://npmjs.org/package/cliw)
[![Downloads/week](https://img.shields.io/npm/dw/orchestrator.svg)](https://npmjs.org/package/cliw)
[![License](https://img.shields.io/npm/l/orchestrator.svg)](https://github.com/kgalli/cliw/blob/master/package.json)

<!-- toc -->
* [Installation](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Installation
<!-- install -->
```sh-session
$ npm install -g cliw
```

# Usage
<!-- usage -->
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
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cliw db`](#cliw-db)
* [`cliw help`](#cliw-help-command)
* [`cliw init`](#cliw-init)
* [`cliw secret`](#cliw-secret)
* [`cliw service`](#cliw-service)

## `cliw db`

The `db` command is a wrapper of several database command line tools e.g. `psql`, `pg_dump`
`pg_restore` and exposes those via a streamlined simplified interface (incl. support of
data sources which can only be accessed via `SSH TUNNEL`). It is also using
`docker` images to provide this tools so that no actual installation of the tools is necessary.

Currently only `Postgres` is supported but `MySQL` is already in development.

```
dump, restore or run a database console

USAGE
  $ cliw db:COMMAND

COMMANDS
  db:console  run database console
  db:create   create database
  db:drop     create database
  db:dump     create database
  db:restore  restore database
```

_See example code: [src/commands/db/console.ts](https://github.com/kgalli/orchestrator/blob/v0.0.0/src/commands/db/console.ts)_

## `cliw help [COMMAND]`

The `help` command 

```
USAGE
  $ cliw help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `cliw init`

The `init` command supports to manage several services and databases under a project. This way
multiple configurations can be maintained at the same time while `cliw` supports switching
between those when needed. Typical if work is done for several clients or keep private and
business projects separated.

```
initialize projects config

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

_See example code: [src/commands/db/console.ts](https://github.com/kgalli/orchestrator/blob/v0.0.0/src/commands/db/console.ts)_

## `cliw secret`

The `secret` command is a wrapper of the AWS KMS SDK to encrypt or decrypt string
token e.g. passwords.

```
encrypt, decrypt secret via AWS KMS

USAGE
  $ cliw secret:COMMAND

COMMANDS
  secret:decrypt  decrypt secret encrypted via AWS KMS
  secret:encrypt  encrypt value via AWS KMS
```

_See example code: [src/commands/db/encrypt.ts](https://github.com/kgalli/orchestrator/blob/v0.0.0/src/commands/db/encrypt.ts)_

## `cliw service`

The `service` command is a wrapper of `docker-compose`. The benefit of using this wrapper
is that you can easily manage e.g. start, stop services in different environments (configuration)
at the same time. It also supports to switch between running a service container from an image
or build the image from source directly.

```
manage services to run as docker containers

USAGE
  $ cliw service:COMMAND

COMMANDS
  service:build    build or rebuild services
  service:exec     execute a command in a running container
  service:logs     show service logs
  service:pull     pull docker image(s) from registry
  service:restart  stop, (re)create and start services in daemon mode
  service:run      run a one-off command on a service
  service:start    (re)create and start services in daemon mode
  service:status   show services run status
  service:stop     stop services running in daemon mode
  service:up       build, (re)create, start, and attach to containers
```

_See example code: [src/commands/service/run.ts](https://github.com/kgalli/orchestrator/blob/v0.0.0/src/commands/service/run.ts)_

<!-- commandsstop -->
