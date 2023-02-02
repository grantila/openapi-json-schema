import {
	encodeRefNameJsonSchema,
	decodeRefNameJsonSchema,
	encodeRefNameOpenApi,
	decodeRefNameOpenApi,
} from './utils.js'


describe( "utils", ( ) =>
{
	describe( "encodeRefNameJsonSchema", ( ) =>
	{
		it( "should encode correctly", ( ) =>
		{
			expect( encodeRefNameJsonSchema( "Foo" ) )
				.toBe( "#/definitions/Foo" );
		} );
	} );

	describe( "decodeRefNameJsonSchema", ( ) =>
	{
		it( "should decode correctly", ( ) =>
		{
			expect( decodeRefNameJsonSchema( "#/definitions/Foo" ) )
				.toBe( "Foo" );
		} );

		it( "should fallback decoding to the string itself", ( ) =>
		{
			expect( decodeRefNameJsonSchema( "Foo" ) ).toBe( "Foo" );
		} );
	} );

	describe( "encodeRefNameOpenApi", ( ) =>
	{
		it( "should encode correctly", ( ) =>
		{
			expect( encodeRefNameOpenApi( "Foo" ) )
				.toBe( "#/components/schemas/Foo" );
		} );
	} );

	describe( "decodeRefNameOpenApi", ( ) =>
	{
		it( "should decode correctly", ( ) =>
		{
			expect( decodeRefNameOpenApi( "#/components/schemas/Foo" ) )
				.toBe( "Foo" );
		} );

		it( "should fallback decoding to the string itself", ( ) =>
		{
			expect( decodeRefNameOpenApi( "Foo" ) ).toBe( "Foo" );
		} );
	} );
} );
