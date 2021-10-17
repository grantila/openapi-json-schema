import { JSONSchema7, JSONSchema7Definition } from 'json-schema'

import { ensureValidOpenAPI, makeRecursableSchema } from '../test'
import { decorateOpenApi, /* jsonSchemaDocumentToOpenApi */ } from './'
import { jsonSchemaTypeToOpenApi } from './json-schema-to-openapi'
import {
	OpenAPISchemaType,
	PartialOpenApiSchema,
	OpenApiSchemaTypeDefinition,
} from './types'


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

	it( "should convert $ref", ( ) =>
	{
		const schema: JSONSchema7Definition = {
			$ref: '#/definitions/Foo',
			description: 'Foo description',
		};
		const jsonSchema = jsonSchemaTypeToOpenApi( schema );

		expect( jsonSchema ).toStrictEqual( {
			$ref: '#/components/schemas/Foo',
			description: 'Foo description',
		} );
	} );

	it( "should convert const to enum", ( ) =>
	{
		const schema: JSONSchema7Definition = {
			type: 'string',
			description: 'a foo',
			const: 'foo',
		};
		const jsonSchema = jsonSchemaTypeToOpenApi( schema );

		expect( jsonSchema ).toStrictEqual( {
			type: 'string',
			description: 'a foo',
			enum: [ 'foo' ],
		} );
	} );

	describe( "recursion", ( ) =>
	{
		interface TestType {
			name: string;
			from: Partial< JSONSchema7 >;
			to: Partial< OpenAPISchemaType >;
		}

		const tests: Array< TestType > = [
			{
				name: 'nullable (false)',
				from: { type: 'string' },
				to: { type: 'string' },
			},
			{
				name: 'nullable (true)',
				from: { type: [ 'string', 'null' ] },
				to: { type: 'string', nullable: true },
			},
		];

		tests.forEach( ( { name, from, to } ) =>
			it( `should convert ${name}`, ( ) =>
			{
				const schema = makeRecursableSchema( from );
				const jsonSchema = jsonSchemaTypeToOpenApi( schema );
				const expected = makeRecursableSchema( to );

				expect( jsonSchema ).toStrictEqual( expected );
			} )
		);
	} );
} );
