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

The `init` sub command is used to create the initial `projects.yaml` file. `cliw` supports the management of several
services and databases under a project context. By doing so multiple `cliw` project configurations can be maintained
at the same time while `cliw` supports switching between those when needed. This functionality comes in very handy
when work has to be done for several clients or to keep private and business projects separated.

The default location of the `projects.yaml` file is `$HOME/.config/cliw` and can be overwritten via an environment
variable `CLIW_CONFIG_PATH`.
  
The `init` sub command also requires two parameters to finish its work:
 
* The location (absolute path) of the so called working directory. `cliw` uses this location to be able to utilize the
`service` sub command which is used to manage service containers (e.g.: start, stop, exec ...).
 
* The location of the configuration files. To properly work `cliw` expects the existence of the following files:

  * `docker-compose.yaml`
  * `service-metadata.yaml`
  * `service-parameters.yaml`
  * `service-overrides.yaml` (optional as `cliw` will use fallback strategy)
  * `data-sources.yaml`

  Examples for each of those configuration files can be found
  _[here](https://github.com/kgalli/cliw/blob/master/config-examples)._

## `cliw project`

Once the `init` command was used to setup the first project the `project` command can be used to add new projects
and switch between them when needed.

## `cliw db`

The `db` command is a wrapper for several database command line tools e.g. `psql`, `pg_dump`
`pg_restore` to expose those via a streamlined simplified interface. Furthermore, it is using one centralized
configuration file (`data-sources.yaml`) to be able to connect to different data sources incl. support of data sources
which can only be accessed via `SSH TUNNEL`. To remove the pain of installing all those tools locally official `docker`
images are used.

Currently `Postgres` and `MySQL` are supported.

## `cliw secret`

The `secret` command is a wrapper of the AWS KMS SDK to encrypt or decrypt string
tokens e.g. passwords.

## `cliw service`

The `service` command is a wrapper of `docker-compose`. The benefit of using this wrapper is that you can easily manage
e.g. start, stop services in different environments defined using one centralized configuration. The switch between
running a service container from an image of a registry or build the image from source is supported via `cliw` commands
directly. No change of configuration files is necessary.


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
* [`cliw service:checkout [SERVICES]`](#cliw-servicecheckout-services)
* [`cliw service:config [SERVICES]`](#cliw-serviceconfig-services)
* [`cliw service:exec SERVICE COMMAND`](#cliw-serviceexec-service-command)
* [`cliw service:image:list [SERVICES]`](#cliw-serviceimagelist-services)
* [`cliw service:image:pull [SERVICES]`](#cliw-serviceimagepull-services)
* [`cliw service:image:set-origin SERVICE ORIGIN`](#cliw-serviceimageset-origin-service-origin)
* [`cliw service:logs [SERVICES]`](#cliw-servicelogs-services)
* [`cliw service:run SERVICE COMMAND`](#cliw-servicerun-service-command)
* [`cliw service:start [SERVICES]`](#cliw-servicestart-services)
* [`cliw service:status [SERVICES]`](#cliw-servicestatus-services)
* [`cliw service:stop [SERVICES]`](#cliw-servicestop-services)

## `cliw db:console DATASOURCE`

run database console

```
USAGE
  $ cliw db:console DATASOURCE

ARGUMENTS
  DATASOURCE  (api) data source specified by name

OPTIONS
  -c, --command=command               run only single command (SQL or internal) and exit
  -e, --environment=development|test  (required) [default: development]
  -f, --file=file                     execute commands from file, then exit
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/console.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/db/console.ts)_

## `cliw db:create DATASOURCE`

create database

```
USAGE
  $ cliw db:create DATASOURCE

ARGUMENTS
  DATASOURCE  (api) data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/create.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/db/create.ts)_

## `cliw db:drop DATASOURCE`

create database

```
USAGE
  $ cliw db:drop DATASOURCE

ARGUMENTS
  DATASOURCE  (api) data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/drop.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/db/drop.ts)_

## `cliw db:dump DATASOURCE`

create database

```
USAGE
  $ cliw db:dump DATASOURCE

ARGUMENTS
  DATASOURCE  (api) data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -o, --schema-only                   dump schema without data
  -t, --target=target                 (required) dump file location (relative to current directory)
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/dump.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/db/dump.ts)_

## `cliw db:restore DATASOURCE`

restore database

```
USAGE
  $ cliw db:restore DATASOURCE

ARGUMENTS
  DATASOURCE  (api) data source specified by name

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -r, --restore-file=restore-file     (required) restore file location (relative to current directory)
  --dry-run                           print shell commands without executing
```

_See code: [src/commands/db/restore.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/db/restore.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `cliw init`

Create and setup default project and configuration.

```
USAGE
  $ cliw init

OPTIONS
  -c, --config-directory=config-directory    absolute location of the configuration directory
  -h, --help                                 show CLI help
  -n, --name=name                            project unique identifier (name)
  -w, --working-directory=working-directory  absolute location of the working directory

DESCRIPTION
  [cliw] supports the 'orchestration' of multiple projects.
  Therefore it needs to maintain the path to the configuration directory
  (location of e.g. service-metadata.yaml, service-runtime.yaml
  service-parameters.yaml, docker-compose.yaml and db-parameters) and the
  working directory. The latter is e.g. used as checkout path of the defined
  services.

  Called without options the 'init' command is executed in interactive mode
  to gather the information needed directly from the prompt.

  Data in stored in projects-config.json at: ~/.config/ (default).
```

_See code: [src/commands/init.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/init.ts)_

## `cliw project:add PROJECT`

add project

```
USAGE
  $ cliw project:add PROJECT

ARGUMENTS
  PROJECT  project specified by name

OPTIONS
  -c, --config=config                        (required) absolute path to the configuration files directory
  -h, --help                                 show CLI help
  -w, --working-directory=working-directory  (required) absolute path to the working directory
```

_See code: [src/commands/project/add.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/project/add.ts)_

## `cliw project:list`

list projects

```
USAGE
  $ cliw project:list

OPTIONS
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/project/list.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/project/list.ts)_

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

_See code: [src/commands/project/remove.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/project/remove.ts)_

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

_See code: [src/commands/project/set-default.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/project/set-default.ts)_

## `cliw secret:decrypt`

decrypt secret encrypted via AWS KMS

```
USAGE
  $ cliw secret:decrypt

OPTIONS
  -h, --help           show CLI help
  -s, --secret=secret  (required) Secret to decrypt
```

_See code: [src/commands/secret/decrypt.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/secret/decrypt.ts)_

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

_See code: [src/commands/secret/encrypt.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/secret/encrypt.ts)_

## `cliw service:checkout [SERVICES]`

Checkout service(s) from version control.

```
USAGE
  $ cliw service:checkout [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -s, --services=services
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/checkout.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/checkout.ts)_

## `cliw service:config [SERVICES]`

List, set or validate service(s) configuration.

```
USAGE
  $ cliw service:config [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          Show CLI help.
  -i, --image-origin=source|registry  Set service(s) image origin.
  --list                              List service(s) configuration.
  --validate                          Validate service(s) configuration.
```

_See code: [src/commands/service/config.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/config.ts)_

## `cliw service:exec SERVICE COMMAND`

Execute a command in a running service container.

```
USAGE
  $ cliw service:exec SERVICE COMMAND

ARGUMENTS
  SERVICE  (web|api|db) service name
  COMMAND  specify command to execute

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           Print command(s) to STDOUT without actually executing.
  --no-tty                            Disable pseudo-tty allocation.
```

_See code: [src/commands/service/exec.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/exec.ts)_

## `cliw service:image:list [SERVICES]`

List service(s) origin SOURCE|REGISTRY

```
USAGE
  $ cliw service:image:list [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
```

_See code: [src/commands/service/image/list.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/image/list.ts)_

## `cliw service:image:pull [SERVICES]`

Pull container image(s) from registry

```
USAGE
  $ cliw service:image:pull [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/image/pull.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/image/pull.ts)_

## `cliw service:image:set-origin SERVICE ORIGIN`

Set containers image origin (source|registry)

```
USAGE
  $ cliw service:image:set-origin SERVICE ORIGIN

ARGUMENTS
  SERVICE  (web|api|db) service name
  ORIGIN   (registry|source) origin of the container image

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/image/set-origin.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/image/set-origin.ts)_

## `cliw service:logs [SERVICES]`

Show service(s) logs.

```
USAGE
  $ cliw service:logs [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -f, --follow                        follow log output
  -h, --help                          show CLI help
  -t, --timestamps                    show timestamps
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/logs.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/logs.ts)_

## `cliw service:run SERVICE COMMAND`

Run a one-off command on a service.

```
USAGE
  $ cliw service:run SERVICE COMMAND

ARGUMENTS
  SERVICE  (web|api|db) service name
  COMMAND  specify command to execute

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --dry-run                           Print command(s) to STDOUT without actually executing.
  --entrypoint=entrypoint             Override the entrypoint of the image.
  --no--tty                           Disable pseudo-tty allocation.
```

_See code: [src/commands/service/run.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/run.ts)_

## `cliw service:start [SERVICES]`

Start service(s) in daemon mode.

```
USAGE
  $ cliw service:start [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  --[no-]build                        Build images before starting containers.
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/start.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/start.ts)_

## `cliw service:status [SERVICES]`

Show service(s) run status.

```
USAGE
  $ cliw service:status [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -s, --services=services
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/status.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/status.ts)_

## `cliw service:stop [SERVICES]`

Stop running service(s).

```
USAGE
  $ cliw service:stop [SERVICES]

ARGUMENTS
  SERVICES  (web|api|db) Service name(s) defined in service-runtime.yaml [default: ALL...].

OPTIONS
  -e, --environment=development|test  (required) [default: development]
  -h, --help                          show CLI help
  -t, --timeout=timeout               [default: 10] Specify a shutdown timeout in seconds.
  --dry-run                           Print command(s) to STDOUT without actually executing.
```

_See code: [src/commands/service/stop.ts](https://github.com/kgalli/cliw/blob/v0.12.0/src/commands/service/stop.ts)_
<!-- commandsstop -->
