import type {
	JSONSchema4,
	JSONSchema4TypeName,
	JSONSchema7,
	JSONSchema7TypeName,
	JSONSchema7Definition,
} from "json-schema"

import type { OpenApiSchemaTypeDefinition } from "./types"


type LooseJSONSchemaType = JSONSchema4TypeName | JSONSchema7TypeName;

function jsonSchemaTypeToOpenApiConvertType( schema: JSONSchema7 )
: JSONSchema7
{
	if ( schema.type === undefined )
		return schema;

	const { type: _type, ...rest } = schema;
	const nullable =
		Array.isArray( _type )
		? _type.includes( 'null' )
		: _type === 'null';
	const type =
		Array.isArray( _type )
		? _type.filter( val => val !== 'null' )
		: _type === 'null'
		? undefined
		: _type;

	const decorateType =
		< T >( t: T, type: LooseJSONSchemaType | undefined ): T =>
			( type === "any" || !type ) ? t : ( { ...t, type } );

	const decorateNullable = < T >( t: T ): T =>
		nullable ? ( { ...t, nullable } ) : t;

	if ( Array.isArray( type ) )
	{
		if ( type.length === 0 )
			return decorateNullable( rest );
		else if ( type.length === 1 )
			return decorateType( decorateNullable( rest ), type[ 0 ] );
		else {
			return {
				...decorateNullable( rest ),
				anyOf: type.map( type => decorateType( { }, type ) ),
			};
		}
	}

	return decorateType( decorateNullable( rest ), type );
}

export function jsonSchemaTypeToOpenApi( schema: JSONSchema7Definition )
: OpenApiSchemaTypeDefinition
{
	if ( typeof schema === 'boolean' )
		return schema;

	schema = jsonSchemaTypeToOpenApiConvertType( schema as JSONSchema7 );

	schema = recurse( schema );

	// TODO: Proper draft 7-to-4 conversion instead of whishful cast
	//       Look at json-schema-to-openapi-schema
	return schema as OpenApiSchemaTypeDefinition;
}

// Recurse properties, items, etc
function recurse< T extends JSONSchema7 >( schema: T ): T
{
	if ( schema.properties && Object.keys( schema.properties ) )
		schema = {
			...schema,
			properties: Object.fromEntries(
				Object.keys( schema.properties )
				.map( key =>
					[
						key,
						jsonSchemaTypeToOpenApi(
							( schema as JSONSchema7 ).properties?.[ key ] as
								JSONSchema7Definition
						) as JSONSchema4
					]
				)
			) as JSONSchema7[ 'properties' ],
		};

	return schema as T;
}
