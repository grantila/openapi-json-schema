import type { JSONSchema4, JSONSchema4TypeName } from 'json-schema'


export interface PartialOpenApiSchema
{
	openapi: OpenApiSchemaVersion;
	info: {
		title: string;
		version: string;

		description?: string;
		termsOfService?: string;
		contact?: OpenApiSchemaContact;
		license?: OpenApiLicenseContact;

		'x-id'?: string;
		'x-comment'?: string;
	},
	paths: Record< string, unknown >;

	servers?: Array< OpenApiSchemaServer >;
	components?: OpenApiSchemaComponents;
}

export interface OpenApiSchemaContact
{
	name?: string;
	url?: string;
	email?: string;
}

export interface OpenApiLicenseContact
{
	name: string;
	url?: string;
}

export interface OpenApiSchemaServer
{
	url: string;
	description?: string;
	variables?: Record< string, OpenApiSchemaServerVariable >;
}

export interface OpenApiSchemaServerVariable
{
	enum?: Array< string >;
	default: string;
	description?: string;
}

export interface OpenApiSchemaReference
{
	$ref: string;
}

export type OpenAPITypeName = JSONSchema4TypeName;

export type OpenAPISchemaType =
	Omit< JSONSchema4, 'type' >
	&
	{
		type?: OpenAPITypeName;
	};

export type OpenApiSchemaTypeDefinition = OpenAPISchemaType | boolean;

export interface OpenApiSchemaComponents
{
	schemas?: Record< string, OpenApiSchemaTypeDefinition >;
	responses?: Record< string, unknown >;
	parameters?: Record< string, unknown >;
	examples?: Record< string, unknown >;
	requestBodies?: Record< string, unknown >;
	headers?: Record< string, unknown >;
	securitySchemes?: Record< string, unknown >;
	links?: Record< string, unknown >;
	callbacks?: Record< string, unknown >;
}

export type OpenApiSchemaVersion =
	| '3.0.3'
	| '3.0.2'
	| '3.0.1'
	| '3.0.0'
	| '3.0.0-rc2'
	| '3.0.0-rc1'
	| '3.0.0-rc0'
	| '2.0'
	| '2.0'
	| '1.2'
	| '1.1'
	| '1.0';
