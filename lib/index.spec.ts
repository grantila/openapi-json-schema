import { JSONSchema7 } from 'json-schema'

import { ensureValidOpenAPI } from '../test/index.js'
import { jsonSchemaDocumentToOpenApi, openApiToJsonSchema } from './index.js'
import { PartialOpenApiSchema } from './types.js'

describe( "JSON Schema document to OpenAPI", ( ) =>
{
	it( "should convert null in document", ( ) =>
	{
		const schema: JSONSchema7 = {
			$id: 'the id',
			$comment: 'the comment',
			definitions: {
				foo: { type: [ "string", "null" ], description: "Foo" }
			}
		};
		const openApiSchema = jsonSchemaDocumentToOpenApi( schema, {
			title: "the title",
			version: "the version",
			schemaVersion: "3.0.2",
		} );

		ensureValidOpenAPI( openApiSchema );

		expect( openApiSchema ).toStrictEqual( {
			info: {
				"title": "the title",
				"version": "the version",
				'x-id': 'the id',
				'x-comment': 'the comment',
			},
			openapi: "3.0.2",
			paths: { },
			components: {
				schemas: {
					foo: {
						type: "string",
						nullable: true,
						description: "Foo",
					}
				},
			},
		} );
	} );
} );

describe( "OpenAPI Schema to JSON Schema document", ( ) =>
{
	it( "should convert null in document", ( ) =>
	{
		const schema: PartialOpenApiSchema = {
			info: {
				title: "the title",
				version: "the version",
			},
			openapi: "3.0.0",
			paths: { },
			components: {
				schemas: {
					foo: {
						type: "string",
						nullable: true,
						description: "Foo",
					}
				}
			},
		};
		const jsonSchema = openApiToJsonSchema( schema );

		expect( jsonSchema ).toStrictEqual( {
			definitions: {
				foo: { type: [ "string", "null" ], description: "Foo" }
			}
		} );
	} );
} );
