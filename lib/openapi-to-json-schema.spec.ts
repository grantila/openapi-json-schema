import { JSONSchema7 } from 'json-schema'

import { ensureValidJSONSchema, makeRecursableSchema } from '../test'
import { openApiToJsonSchemaType } from './openapi-to-json-schema'
import { OpenAPISchemaType, OpenApiSchemaTypeDefinition } from './types'


describe( "OpenAPI to JSON Schema", ( ) =>
{
	it( "should convert simple non-nullable type", ( ) =>
	{
		const schema: OpenApiSchemaTypeDefinition = {
			type: "string",
			description: "Foo",
		};
		const jsonSchema = openApiToJsonSchemaType( schema );

		expect( jsonSchema ).toStrictEqual( {
			description: 'Foo',
			type: 'string',
		} );

		ensureValidJSONSchema( jsonSchema );
	} );

	it( "should convert simple nullable type", ( ) =>
	{
		const schema: OpenApiSchemaTypeDefinition = {
			type: 'string',
			nullable: true,
			description: "Foo",
		};
		const jsonSchema = openApiToJsonSchemaType( schema );

		expect( jsonSchema ).toStrictEqual( {
			type: [ "string", "null" ],
			description: 'Foo',
		} );

		ensureValidJSONSchema( jsonSchema );
	} );

	it( "should convert simple nullable type", ( ) =>
	{
		const schema: OpenApiSchemaTypeDefinition = {
			type: 'string',
			nullable: true,
			description: "Foo",
		};
		const jsonSchema = openApiToJsonSchemaType( schema );

		expect( jsonSchema ).toStrictEqual( {
			type: [ "string", "null" ],
			description: 'Foo',
		} );

		ensureValidJSONSchema( jsonSchema );
	} );

	it( "should convert deep nullable type", ( ) =>
	{
		const schema: OpenApiSchemaTypeDefinition = {
			description: "Foo",
			type: "object",
			nullable: true,
			properties: {
				"bar": {
					type: "object",
					properties: {
						"baz": {
							type: 'string',
							nullable: true,
						},
					},
				},
			},
		};
		const jsonSchema = openApiToJsonSchemaType( schema );

		expect( jsonSchema ).toStrictEqual( {
			description: 'Foo',
			type: [ "object", "null" ],
			properties: {
				"bar": {
					type: "object",
					properties: {
						baz: {
							type: [ "string", "null" ],
						},
					},
				},
			},
		} );

		ensureValidJSONSchema( jsonSchema );
	} );

	it( "should convert $ref", ( ) =>
	{
		const schema: OpenApiSchemaTypeDefinition = {
			$ref: '#/components/schema/Foo',
			description: 'Foo description',
		};
		const jsonSchema = openApiToJsonSchemaType( schema );

		expect( jsonSchema ).toStrictEqual( {
			$ref: '#/definitions/Foo',
			description: 'Foo description',
		} );

		ensureValidJSONSchema( jsonSchema );
	} );

	describe( "recursion", ( ) =>
	{
		interface TestType {
			name: string;
			from: Partial< OpenAPISchemaType >;
			to: Partial< JSONSchema7 >;
		}

		const tests: Array< TestType > = [
			{
				name: 'nullable (default = false)',
				from: { type: 'string'},
				to: { type: 'string' },
			},
			{
				name: 'nullable (false)',
				from: { type: 'string', nullable: false },
				to: { type: 'string' },
			},
			{
				name: 'nullable (true)',
				from: { type: 'string', nullable: true },
				to: { type: [ 'string', 'null' ] },
			},
		];

		tests.forEach( ( { name, from, to } ) =>
			it( `should convert ${name}`, ( ) =>
			{
				const schema = makeRecursableSchema( from );
				const jsonSchema = openApiToJsonSchemaType( schema );
				const expected = makeRecursableSchema( to );

				expect( jsonSchema ).toStrictEqual( expected );

				ensureValidJSONSchema( jsonSchema );
			} )
		);
	} );
} );
