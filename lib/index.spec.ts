import { JSONSchema7 } from 'json-schema'

import { ensureValidOpenAPI } from '../test'
import { jsonSchemaDocumentToOpenApi } from './index'

describe( "JSON Schema document to OpenAPI", ( ) =>
{
	it( "should convert null in document", ( ) =>
	{
		const schema: JSONSchema7 = {
			definitions: {
				foo: { type: [ "string", "null" ], description: "Foo" }
			}
		};
		const openApiSchema = jsonSchemaDocumentToOpenApi( schema, {
			title: "the title",
			version: "the version",
			schemaVersion: "3.0.2",
		} );

		ensureValidOpenAPI( openApiSchema );
	} );

	jsonSchemaDocumentToOpenApi
} );
