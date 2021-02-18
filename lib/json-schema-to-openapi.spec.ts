import { JSONSchema7Definition } from 'json-schema'

import { ensureValidOpenAPI } from '../test'
import { decorateOpenApi, /* jsonSchemaDocumentToOpenApi */ } from './'
import { jsonSchemaTypeToOpenApi } from './json-schema-to-openapi'
import { PartialOpenApiSchema, OpenApiSchemaTypeDefinition } from './types'


const decorate = ( type: OpenApiSchemaTypeDefinition ): PartialOpenApiSchema =>
	decorateOpenApi( {
		components: { schemas: { type1: type } }
	}, { title: 'title', version: 'v1' } );

describe( "JSON Schema to OpenAPI", ( ) =>
{
	it( "should convert simple non-nullable type", ( ) =>
	{
		const schema: JSONSchema7Definition = {
			type: [ "string" ],
			description: "Foo",
		};
		const openApiSchema = jsonSchemaTypeToOpenApi( schema );

		expect( openApiSchema ).toStrictEqual( {
			description: 'Foo',
			type: 'string',
		} );

		ensureValidOpenAPI( decorate( openApiSchema ) );
	} );

	it( "should convert simple nullable type", ( ) =>
	{
		const schema: JSONSchema7Definition = {
			type: [ "string", "null" ],
			description: "Foo",
		};
		const openApiSchema = jsonSchemaTypeToOpenApi( schema );

		expect( openApiSchema ).toStrictEqual( {
			description: 'Foo',
			type: 'string',
			nullable: true,
		} );

		ensureValidOpenAPI( decorate( openApiSchema ) );
	} );

	it( "should convert deep nullable type", ( ) =>
	{
		const schema: JSONSchema7Definition = {
			type: [ "object", "null" ],
			properties: {
				"bar": {
					type: "object",
					properties: {
						"baz": { type: [ "string", "null" ] },
					},
				},
			},
			description: "Foo",
		};
		const openApiSchema = jsonSchemaTypeToOpenApi( schema );

		expect( openApiSchema ).toStrictEqual( {
			description: 'Foo',
			type: "object",
			nullable: true,
			properties: {
				"bar": {
					type: "object",
					properties: {
						baz: {
							type: 'string',
							nullable: true,
						},
					},
				},
			},
		} );

		ensureValidOpenAPI( decorate( openApiSchema ) );
	} );
} );
