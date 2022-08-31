export type Boilerplate = {
    identifier: string;
    name: string;
    baseline: string;
    description: string;
    demo: string;
    blueprint: string;
    git: string;
};

export type Tenant = {
    identifier: string;
};

export type Tip = {
    title: string;
    url: string;
    type: string;
};

export type PimCredentials = {
    ACCESS_TOKEN_ID: string;
    ACCESS_TOKEN_SECRET: string;
};

export type PimAuthenticatedUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    tenants: {
        tenant: {
            id: string;
            identifier: string;
            name: string;
        };
    }[];
};
