import { ensureValidJSONSchema } from '../test'
import { openApiToJsonSchemaType } from './openapi-to-json-schema'
import { OpenApiSchemaTypeDefinition } from './types'


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
} );
