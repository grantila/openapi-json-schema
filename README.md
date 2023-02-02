[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]


# openapi-json-schema

Minimalistic OpenAPI 3 ⬌ JSON Schema (draft 7) conversion.

 * This package aims at full conversion support except reference resolution, but isn't there yet. Currently supports:
   * `null`/`nullable` conversion
   * `$ref`'s being converted `#/definitions` <-> `#/components/schemas`
   * `const` ➡ `enum` when converting to OpenAPI
   * `$id`/`$comment` ➡ `info['x-id']`/`info['x-comment']` when converting to OpenAPI
   * *PR's are welcome.*
 * JSON `$ref`s are not resolved.
 * This package has no dependencies, and will continue to have no dependencies - re: minimalistic.


## Versions

 * Since v2 this is a [pure ESM][pure-esm] package, and requires Node.js >=14.13.1. It cannot be used from CommonJS.


# Usage

```ts
import {
    jsonSchemaToOpenApiSchema,
    openApiSchemaToJsonSchema,
} from 'openapi-json-schema'

// JSON Schema to Open API
const openApi = jsonSchemaToOpenApiSchema( jsonSchema );

// Open API to JSON Schema
const jsonSchema = openApiSchemaToJsonSchema( openApi );
```


## Utilities

The library exports utilities; `encodeRefNameJsonSchema`, `decodeRefNameJsonSchema`, `encodeRefNameOpenApi` and `decodeRefNameOpenApi` used to convert to/from references names, and their corresponding encoding in JSON Schema and Open API.


[npm-image]: https://img.shields.io/npm/v/openapi-json-schema.svg
[npm-url]: https://npmjs.org/package/openapi-json-schema
[downloads-image]: https://img.shields.io/npm/dm/openapi-json-schema.svg
[build-image]: https://img.shields.io/github/actions/workflow/status/grantila/openapi-json-schema/master.yml?branch=master
[build-url]: https://github.com/grantila/openapi-json-schema/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/openapi-json-schema/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/openapi-json-schema?branch=master
[pure-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
