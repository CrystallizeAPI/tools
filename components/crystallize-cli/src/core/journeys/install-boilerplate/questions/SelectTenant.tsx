import { Box, Newline, Text } from 'ink';
import Link from 'ink-link';
import { UncontrolledTextInput } from 'ink-text-input';
import React from 'react';
import { useState } from 'react';
import { colors } from '../../../../config/colors.js';
import { Tenant } from '../../../../types.js';
import { Select } from '../../../components/Select.js';
import { useJourney } from '../context/provider.js';

export const SelectTenant: React.FC = () => {
    const { state, dispatch } = useJourney();
    const [shouldAskForInput, askForInput] = useState(state.bootstrapTenant && !state.tenant);

    return (
        <>
            {!shouldAskForInput && !state.tenant && (
                <>
                    <Text>
                        Please select a Crystallize tenant
                        <Newline />
                        <Text dimColor>
                            Don't have a tenant yet? Create one at {/*@ts-ignore*/}
                            <Link url="https://crystallize.com/signup">https://crystallize.com/signup</Link>
                        </Text>
                    </Text>

                    <Select<
                        Tenant & {
                            boostrap: boolean;
                        }
                    >
                        options={[
                            {
                                label: 'Our demo tenant',
                                value: {
                                    identifier: state.boilerplate?.blueprint!,
                                    boostrap: false,
                                },
                                render: () => (
                                    <>
                                        <Text>Our demo tenant ({state.boilerplate?.blueprint!})</Text>
                                        <Newline />
                                        <Text dimColor>Lots of demo data here already</Text>
                                    </>
                                ),
                            },
                            {
                                label: 'My own existing tenant',
                                value: {
                                    identifier: '',
                                    boostrap: false,
                                },
                                render: () => (
                                    <>
                                        <Text>My own existing tenant</Text>
                                        <Newline />
                                        <Text dimColor>
                                            Of course your tenant content model (shapes, items) must fit the
                                            boilerplate.
                                        </Text>
                                    </>
                                ),
                            },
                            {
                                label: 'Create a new tenant for me',
                                value: {
                                    identifier: '',
                                    boostrap: true,
                                },
                                render: () => (
                                    <>
                                        <Text>Create a new tenant for me</Text>
                                        <Newline />
                                        <Text dimColor>
                                            A tenant will be bootstrapped for you with boilerplate content. (same as
                                            `install -b`)
                                        </Text>
                                    </>
                                ),
                            },
                        ]}
                        onSelect={(
                            answer: Tenant & {
                                boostrap: boolean;
                            },
                        ) => {
                            if (answer.identifier === '') {
                                if (answer.boostrap === true) {
                                    dispatch.setBootstrapTenant();
                                }
                                askForInput(true);
                            } else {
                                dispatch.setTenant(answer);
                            }
                        }}
                    />
                </>
            )}

            {shouldAskForInput && (
                <>
                    <Box>
                        <Box marginRight={1}>
                            <Text>Enter a tenant identifier:</Text>
                        </Box>
                        <UncontrolledTextInput
                            placeholder={state.boilerplate?.blueprint}
                            onSubmit={(tenant) => {
                                dispatch.setTenant({ identifier: tenant });
                                askForInput(false);
                            }}
                        />
                    </Box>
                    {state.bootstrapTenant && (
                        <>
                            <Text dimColor>
                                If this tenant identifier is not available we'll pick a very close name for you.
                            </Text>
                        </>
                    )}
                </>
            )}

            {state.tenant && (
                <Text>
                    Using the Tenant with identifier: <Text color={colors.highlight}>{state.tenant.identifier}</Text>.
                </Text>
            )}
        </>
    );
};
