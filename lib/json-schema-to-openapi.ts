import type {
	JSONSchema4TypeName,
	JSONSchema7,
	JSONSchema7TypeName,
	JSONSchema7Definition,
} from "json-schema"

import type { OpenAPISchemaType, OpenApiSchemaTypeDefinition } from "./types"
import {
	decodeRefNameJsonSchema,
	encodeRefNameOpenApi,
	recurseSchema,
} from "./utils"


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

function jsonSchemaToOpenApi7Ref< T extends OpenAPISchemaType | JSONSchema7 >(
	node: T
)
: T
{
	if ( node.$ref )
		return {
			...node,
			$ref: encodeRefNameOpenApi( decodeRefNameJsonSchema( node.$ref ) ),
		};
	return node;
}

export function jsonSchemaTypeToOpenApi( schema: JSONSchema7Definition )
: OpenApiSchemaTypeDefinition
{
	if ( typeof schema === 'boolean' )
		return schema;

	schema = jsonSchemaTypeToOpenApiConvertType( schema as JSONSchema7 );

	schema = jsonSchemaToOpenApi7Ref( schema );

	// TODO: Proper draft 7-to-4 conversion
	return recurseSchema( schema, jsonSchemaTypeToOpenApi );
}
