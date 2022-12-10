# convert-postman-jmeter

[![Node.js Publish](https://github.com/sercheo87/convert-postman-jmeter/actions/workflows/npm-publish.yml/badge.svg?event=page_build)](https://github.com/sercheo87/convert-postman-jmeter/actions/workflows/npm-publish.yml)
![GitHub issues](https://img.shields.io/github/issues/sercheo87/convert-postman-jmeter.svg)
![npm](https://img.shields.io/npm/v/3.svg)
![NPM](https://img.shields.io/npm/l/1.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/sercheo87/convert-postman-jmeter.svg)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/sercheo87/convert-postman-jmeter.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=convert-postman-jmeter&metric=alert_status)](https://sonarcloud.io/dashboard?id=convert-postman-jmeter)
[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

- [convert-postman-jmeter](#convert-postman-jmeter)
    - [Introduction](#introduction)
    - [Installation](#installation)
    - [Characteristics](#characteristics)
    - [Usage](#usage)
        - [Options](#options)
    - [Use case](#use-case)
        - [Additional uses from command line](#additional-uses-from-command-line)
    - [Known Issues](#known-issues)

## Introduction

This tool convert projects [Postman](https://www.getpostman.com) to [JMeter](https://jmeter.apache.org)

- [NPM Site](https://www.npmjs.com/package/convert-postman-jmeter)
- [Wiki](https://sercheo87.github.io/convert-postman-jmeter/)

## Installation

```bash
npm i convert-postman-jmeter -g
```

## Characteristics

- Convert Postman Collection to JMeter Test Plan
- Convert Postman Collection with Environment to JMeter Test Plan

## Usage

```bash
$ convert-postman-jmeter
Usage: convert-postman-jmeter -p [file] -j [file]

Options:
  --help                Show help                                       [boolean]
  --version             Show version number                             [boolean]
  -p, --postman         Load project postman                            [required]
  -j, --jmeter          Output project JMeter
  -o, --override        Override project JMeter                         [default: false]
  -b, --batch           Export all projects postman from folder path    [default: ""]
  -e, --environmentFile Load environment file postman                   [default: ""]

Copyright 2022
```

### Options

| Option Sort | Option Complete   | Description                                  | Required | Default |
|-------------|-------------------|----------------------------------------------|----------|---------|
| -p          | --postman         | Load project postman                         | true     |         |
| -j          | --jmeter          | Output project JMeter                        | false    |         |
| -o          | --override        | Override project JMeter                      | false    | false   |
| -b          | --batch           | Export all projects postman from folder path | false    | ""      |
| -e          | --environmentFile | Load environment file postman                | false    | ""      |

## Use case

Open Postman:

![Postman App](screenshot/postman.png)

Export project:

![Postman App](screenshot/postman-export.png)

Save file:

![Postman App](screenshot/postman-location.png)

Convert project exported:

```bash
convert-postman-jmeter -p test-api-without-environments.postman_collection.json
```

```bash
convert-postman-jmeter -b /projects-postman/
```

![Postman App](screenshot/export.png)

Open project generate with JMeter App :

![Postman App](screenshot/jmeter.png)

### Additional uses from command line

Generate project JMeter from project Postman

```bash
convert-postman-jmeter -p ./postman_collection.json -j ./jmeter_test_plan.jmx
```

Generate project JMeter from project Postman with environment

```bash
convert-postman-jmeter -p ./postman_collection.json -j ./jmeter_test_plan.jmx -e ./postman_environment.json
```

## Known Issues

For issues create to find in [issues page](https://github.com/sercheo87/convert-postman-jmeter/issues).
