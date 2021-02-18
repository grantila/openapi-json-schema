import type { JSONSchema7, JSONSchema7Definition} from "json-schema"

import type { OpenAPISchemaType, OpenApiSchemaTypeDefinition } from "./types"


function openApiTypeToJsonSchema7Type(
	type: OpenAPISchemaType[ 'type' ],
	nullable: boolean
)
: JSONSchema7[ 'type' ]
{
	if ( typeof type === "undefined" || type === "any" )
		return undefined; // Any-type includes null

	else if ( !Array.isArray( type ) )
		return ( type === "null" || !nullable )
			? type
			: [ type, "null" ];

	else
	{
		if ( type.includes( "any" ) )
			return undefined; // Any-type includes null

		if ( !type.includes( "null" ) && nullable )
			type.push( "null" );

		if ( type.length === 1 )
			return type[ 0 ] as JSONSchema7[ 'type' ];

		return type as JSONSchema7[ 'type' ];
	}
}

export function openApiToJsonSchemaType( schema: OpenApiSchemaTypeDefinition )
: JSONSchema7Definition
{
	if ( typeof schema === 'boolean' )
		return schema;

	const { type: _type, nullable, ...rest } = schema;

	const type = openApiTypeToJsonSchema7Type( _type, nullable );

	// TODO: Proper draft 7-to-4 conversion instead of whishful cast
	//       Look at json-schema-to-openapi-schema
	type TODO = any;
	let output = { ...( rest as TODO ), ...( type ? { type } : { } ) };

	output = recurse( output );

	return output;
}

// Recurse properties, items, etc
function recurse( schema: OpenAPISchemaType ): JSONSchema7Definition
{
	if ( schema.properties && Object.keys( schema.properties ) )
		schema = {
			...schema,
			properties: Object.fromEntries(
				Object.keys( schema.properties )
				.map( key =>
					[
						key,
						openApiToJsonSchemaType(
							( schema as JSONSchema7 ).properties?.[ key ] as
								OpenAPISchemaType
						) as JSONSchema7Definition
					]
				)
			) as JSONSchema7[ 'properties' ],
		};

	return schema as JSONSchema7Definition;
}
