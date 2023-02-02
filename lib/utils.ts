import type { JSONSchema7Definition } from 'json-schema'

import type { OpenApiSchemaTypeDefinition } from './types.js'


export function encodePathPart( part: string ): string
{
	return encodeURIComponent( part );
}

export function decodePathPart( part: string ): string
{
	return decodeURIComponent( part );
}

export function encodeRefNameJsonSchema( name: string ): string
{
	return `#/definitions/${encodePathPart( name )}`;
}

export function decodeRefNameJsonSchema( name: string ): string
{
	if ( name.startsWith( "#/definitions/" ) )
		return decodePathPart( name.slice( 14 ) );
	return decodePathPart( name );
}

export function encodeRefNameOpenApi( name: string ): string
{
	return `#/components/schemas/${encodePathPart( name )}`;
}

export function decodeRefNameOpenApi( name: string ): string
{
	if ( name.startsWith( "#/components/schemas/" ) )
		return decodePathPart( name.slice( 21 ) );
	return decodePathPart( name );
}

export type AnySchema = JSONSchema7Definition | OpenApiSchemaTypeDefinition;

function hasProperties< T extends Record< any, unknown > >( t: T ): boolean
{
	return t && Object.keys( t ).length > 0;
}

export function recurseSchema< T extends AnySchema, U extends AnySchema >(
	t: T,
	convert: ( t: T ) => U
)
: U
{
	if ( typeof t !== 'object' )
		return t as AnySchema as U;

	const schema = t as Exclude< typeof t, boolean >;

	return {
		...( schema ),
		...(
			typeof schema.items !== 'object' ? { }
			: Array.isArray( schema.items )
			? { items: schema.items.map( item => convert( item ) ) }
			: { items: convert( schema.items ) }
		),
		...(
			typeof schema.additionalItems !== 'object' ? { }
			: { additionalItems: convert( schema.additionalItems ) }
		),
		...(
			typeof schema.contains !== 'object' ? { }
			: { contains: convert( schema.contains ) }
		),
		...(
			!hasProperties( schema.properties ) ? { } :
			{
				properties: Object.fromEntries(
					Object.keys( schema.properties )
					.map( key =>
						[ key, convert( schema.properties?.[ key ] ) ]
					)
				),
			}
		),
		...(
			!hasProperties( schema.patternProperties ) ? { } :
			{
				patternProperties: Object.fromEntries(
					Object.keys( schema.patternProperties )
					.map( key =>
						[ key, convert( schema.patternProperties?.[ key ] ) ]
					)
				),
			}
		),
		...(
			typeof schema.additionalProperties !== 'object' ? { }
			: { additionalProperties: convert( schema.additionalProperties ) }
		),
		...(
			!hasProperties( schema.dependencies ) ? { } :
			{
				dependencies: Object.fromEntries(
					Object.keys( schema.dependencies )
					.map( key =>
						[ key, convert( schema.dependencies?.[ key ] ) ]
					)
				),
			}
		),
		...(
			typeof schema.propertyNames !== 'object' ? { }
			: { propertyNames: convert( schema.propertyNames ) }
		),
		...(
			typeof schema.if !== 'object' ? { }
			: { if: convert( schema.if ) }
		),
		...(
			typeof schema.then !== 'object' ? { }
			: { then: convert( schema.then ) }
		),
		...(
			typeof schema.else !== 'object' ? { }
			: { else: convert( schema.else ) }
		),
		...(
			( typeof schema.allOf !== 'object' || !schema.allOf.length ) ? { }
			: { allOf: schema.allOf.map( ( item: T ) => convert( item ) ) }
		),
		...(
			( typeof schema.anyOf !== 'object' || !schema.anyOf.length ) ? { }
			: { anyOf: schema.anyOf.map( ( item: T ) => convert( item ) ) }
		),
		...(
			( typeof schema.oneOf !== 'object' || !schema.oneOf.length ) ? { }
			: { oneOf: schema.oneOf.map( ( item: T ) => convert( item ) ) }
		),
		...(
			typeof schema.not !== 'object' ? { }
			: { not: convert( schema.not ) }
		),
		...(
			!hasProperties( schema.definitions ) ? { } :
			{
				definitions: Object.fromEntries(
					Object.keys( schema.definitions )
					.map( key =>
						[ key, convert( schema.definitions?.[ key ] ) ]
					)
				),
			}
		),
	} as AnySchema as U;
}
