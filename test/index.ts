import _Ajv from 'ajv'
import addFormats from "ajv-formats"
import { JSONSchema7Definition } from 'json-schema'

// TODO: Change 6 to 4 when conversion is more complete
import * as draft06 from 'ajv/lib/refs/json-schema-draft-06.json'

import * as openApiSchema from './fixtures/openapi.schema.json'
import type { PartialOpenApiSchema } from '../lib/types.js'
import type { AnySchema } from '../lib/utils.js'

// 🤷‍♂️
const Ajv = (_Ajv as any).default as typeof _Ajv;

export function ensureValidOpenAPI( schema: PartialOpenApiSchema )
{
	const ajv = new Ajv( { strict: false, dynamicRef: false } );
	addFormats( ajv );
	ajv.addMetaSchema( draft06 );
	const validate = ajv.compile( openApiSchema );
	if ( !validate( schema ) )
	{
		validate.errors?.forEach( error =>
		{
			console.error( error );
		} );
		throw new Error( "Invalid OpenAPI schema" + validate.errors );
	}
}

export function ensureValidJSONSchema( schema: JSONSchema7Definition )
{
	const ajv = new Ajv( { strict: false, dynamicRef: false} );
	addFormats( ajv );
	if ( !ajv.validate( "http://json-schema.org/draft-07/schema", schema ) )
	{
		throw new Error( "Invalid OpenAPI schema" );
	}
}

const clone = < T >( t: T ): T => JSON.parse( JSON.stringify( t ) );

export const makeRecursableSchema =
	< T extends AnySchema >( typeData: Partial< T > ): T => clone( {
		type: 'object',
		properties: {
			asArray: {
				items: [ typeData ],
			},
			prop: typeData,
		},
		items: typeData,
		additionalItems: typeData,
		contains: typeData,
		patternProperties: {
			prop: typeData,
		},
		additionalProperties: typeData,
		dependencies: {
			prop: typeData,
		},
		propertyNames: typeData,
		if: typeData,
		then: typeData,
		else: typeData,
		allOf: [ typeData ],
		anyOf: [ typeData ],
		oneOf: [ typeData ],
		not: typeData,
		definitions: {
			prop: typeData,
		},
	} ) as AnySchema as T;
