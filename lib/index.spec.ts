import { JSONSchema7 } from 'json-schema'

import { ensureValidOpenAPI } from '../test'
import { jsonSchemaDocumentToOpenApi, openApiToJsonSchema } from './index'
import { PartialOpenApiSchema } from './types'

describe( "JSON Schema document to OpenAPI", ( ) =>
{
	it( "should convert null in document", ( ) =>
	{
		const schema: JSONSchema7 = {
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
