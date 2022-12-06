# postman-jmeter
<!--
[![Node.js Publish](https://github.com/sercheo87/convert-postman-jmeter/actions/workflows/npm-publish.yml/badge.svg?event=page_build)](https://github.com/sercheo87/convert-postman-jmeter/actions/workflows/npm-publish.yml)
![GitHub issues](https://img.shields.io/github/issues/sercheo87/convert-postman-jmeter.svg)
![npm](https://img.shields.io/npm/v/3.svg)
![NPM](https://img.shields.io/npm/l/1.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/sercheo87/convert-postman-jmeter.svg)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/sercheo87/convert-postman-jmeter.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=convert-postman-jmeter&metric=alert_status)](https://sonarcloud.io/dashboard?id=convert-postman-jmeter)
-->
This tool convert projects [Postman](https://www.getpostman.com) to [JMeter](https://jmeter.apache.org)

- [NPM Site](https://www.npmjs.com/package/postman-jmeter)
- [Wiki](https://sercheo87.github.io/postman-jmeter/)

## Installation

```bash
npm i postman-jmeter -g
```

## Usage

```bash
$ postman-jmeter
Usage: convert-postman-jmeter -p [file] -j [file] [-o] [-b] [-v=resolve|transform] 
```
||||||
| -- | -- | -- | -- | -- |
| `-help` | Show help | `boolean` | | |
| `--version` | Show version | `boolean` | | |
| `-p, --postman` | Path of postman collection file to process | `file` | `required`|
| `-j, --jmeter` | Path of JMeter test plan (.jmx) | `file` | `required`|
| `-e, --environment` | Path of postman environment file | `string` | `optional`|
| `-o, --overwrite` | Overwrite existing .jmx file | `boolean` | `optional`|
| `-v, --variables` | Variable resolution strategy | `string` | `required`| `transform`, `resolve` |
| `-b, --batch` | Process all collection files (`*.postman_collection.json`) in directory | `boolean` | `optional`|  |

## Variable Resolution Strategy

Postman collection and environment variables are added to the JMeter Test Plan as User Defined Variables.  What appears in the `value` column in the User Defined Variables pane and other parts of the JMeter UI depends on the variable resolution strategy.  

How to handle variables defined at the collection and environment level.  
 - `resolve`: Resolve postman variables into their actual values in the JMX test plan.  Replace references to variables with their actual variables elsewhere, eg in the protocol, Server Name or IP, and/or Path fields:

![image](https://user-images.githubusercontent.com/6423235/205748399-f1ed4e67-dbab-40eb-a70f-7128be84fe10.png)

![image](https://user-images.githubusercontent.com/6423235/205748554-aef7defe-4aec-4f06-9bc8-806c8e4d1cf0.png)

 - `transform`: Resolve values in the User Defined Variables pane, but use JMeter replacement syntax elsewhere.

![image](https://user-images.githubusercontent.com/6423235/205748894-82d1ac6c-df5e-4e3b-894b-675bfe9159cc.png)

`resolve` is the default strategy.

## Automation with GitHub Actions

This utility is designed to enable load-testing via JMeter as part of a CI/CD pipeline.  An example can be found [in this repo](https://github.com/BidnessForB/postman-jmeter/blob/main/.github/workflows/JMeter-load-testing.yaml).  

NOTE: Protocol is always resolved, even if inferred from variable values.  

## Limitations

Body data are not currently processed.  

## Known Issues

For issues create o find in [issues page](https://github.com/bidnessforb/postman-jmeter/issues).
