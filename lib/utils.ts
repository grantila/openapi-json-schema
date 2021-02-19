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
	return `#/components/schema/${encodePathPart( name )}`;
}

export function decodeRefNameOpenApi( name: string ): string
{
	if ( name.startsWith( "#/components/schema/" ) )
		return decodePathPart( name.slice( 20 ) );
	return decodePathPart( name );
}
