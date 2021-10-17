import type { JSONSchema7 } from 'json-schema'

import type {
	OpenApiSchemaVersion,
	PartialOpenApiSchema,
} from './types'
import { jsonSchemaTypeToOpenApi } from './json-schema-to-openapi'
import { openApiToJsonSchemaType } from './openapi-to-json-schema'


export interface JsonSchemaDocumentToOpenApiOptions
{
	title: string;
	version: string;

	schemaVersion?: OpenApiSchemaVersion;
}

export function decorateOpenApi(
	schema: Partial< PartialOpenApiSchema >,
	{
		title,
		version,
		schemaVersion = '3.0.0',
	}: JsonSchemaDocumentToOpenApiOptions
)
{
	const info: PartialOpenApiSchema[ 'info' ] = { title, version };

	if ( ( schema as JSONSchema7 ).$id )
	{
		info[ 'x-id' ] = ( schema as JSONSchema7 ).$id;
		delete ( schema as JSONSchema7 ).$id;
	}
	if ( ( schema as JSONSchema7 ).$comment )
	{
		info[ 'x-comment' ] = ( schema as JSONSchema7 ).$comment;
		delete ( schema as JSONSchema7 ).$comment;
	}
	delete ( schema as JSONSchema7 ).$schema;

	return {
		openapi: schemaVersion,
		info,
		paths: { },
		...schema,
	}
}

export function jsonSchemaDocumentToOpenApi(
	schema: JSONSchema7,
	options: JsonSchemaDocumentToOpenApiOptions
)
: PartialOpenApiSchema
{
	const { definitions = { }, ...rest } = schema;

	return decorateOpenApi( {
		...rest,
		components: {
			schemas: Object.fromEntries(
				Object.entries( definitions ).map(
					( [ name, schema ] ) =>
						[ name, jsonSchemaTypeToOpenApi( schema ) ]
				)
			),
		},
	}, options );
}

export function openApiToJsonSchema( openApi: any )
{
	const schemas = openApi.components.schemas;
	return {
		definitions: Object.fromEntries(
			Object.keys( schemas ).map( key =>
				[
					key,
					openApiToJsonSchemaType( schemas[ key ] )
				]
			)
		)
	};
}
