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
	return {
		openapi: schemaVersion,
		info: { title, version },
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
	return openApiToJsonSchemaType( openApi.components.schemas );
}

// OpenApiSchemaComponents
