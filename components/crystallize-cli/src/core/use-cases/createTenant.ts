import { ClientInterface, createClient } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { PimCredentials, Tenant } from '../../types.js';

async function cleanShapes(apiClient: ClientInterface, tenantId: string, ...shapeIdentifiers: string[]): Promise<any> {
    const mutation = {
        shape: shapeIdentifiers.reduce((memo: Record<string, any>, shapeIdentifier: string) => {
            const camelCaseIdentifier = shapeIdentifier.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return {
                ...memo,
                [camelCaseIdentifier]: {
                    __aliasFor: 'delete',
                    __args: {
                        identifier: shapeIdentifier,
                        tenantId,
                    },
                },
            };
        }, {}),
    };
    const query = jsonToGraphQLQuery({ mutation });
    const result = await apiClient.pimApi(query);
    return result.shape;
}

async function initiateTenantInCrystallize(
    apiClient: ClientInterface,
    input: Tenant,
): Promise<{
    id: string;
    identifier: string;
}> {
    const result = await apiClient.pimApi(
        `mutation CREATE_TENANT ($identifier: String!, $name: String!) {
            tenant {
                create(input: {
                    identifier: $identifier,
                    isActive: true,
                    name: $name,
                    meta: {
                        key: "cli"
                        value: "yes"
                    }
                }) {
                    id
                    identifier
                }
            }
        }`,
        {
            name: input.identifier,
            identifier: input.identifier,
        },
    );
    return result.tenant.create;
}

export default async (tenant: Tenant, credentials: PimCredentials): Promise<void> => {
    const apiClient = createClient({
        tenantIdentifier: tenant.identifier,
        accessTokenId: credentials.ACCESS_TOKEN_ID,
        accessTokenSecret: credentials.ACCESS_TOKEN_SECRET,
    });

    const { id } = await initiateTenantInCrystallize(apiClient, tenant);
    await cleanShapes(apiClient, id, 'default-product', 'default-folder', 'default-document').catch(console.error);
};
