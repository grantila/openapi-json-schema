import Ajv from 'ajv'
import addFormats from "ajv-formats"

// TODO: Change 6 to 4 when conversion is more complete
import * as draft06 from "ajv/lib/refs/json-schema-draft-06.json"

import * as openApiSchema from "./fixtures/openapi.schema.json"
import { PartialOpenApiSchema } from "../lib/types"
import { JSONSchema7Definition } from 'json-schema'

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
