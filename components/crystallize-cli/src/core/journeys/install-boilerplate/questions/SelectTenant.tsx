import { Box, Newline, Text } from "ink";
import Link from "ink-link";
import { UncontrolledTextInput } from "ink-text-input";
import { useState } from "react";
import { colors } from "../../../../config/colors.js";
import { Tenant } from "../../../../types.js";
import { Select } from "../../../ui-modules/Select.js";
import { useJourney } from "../context/provider.js";

export const SelectTenant: React.FC = () => {
    const { state, dispatch } = useJourney();
    const [shouldAskForInput, askForInput] = useState(false);
    return <>
        {!shouldAskForInput && !state.tenant && <>
            <Text>
                Please select a Crystallize tenant
                <Newline />
                <Text dimColor>
                    Don't have a tenant yet? Create one at
                    {/*@ts-ignore*/}
                    <Link url="https://crystallize.com/signup">
                        https://crystallize.com/signup
                    </Link>
                </Text>
            </Text>

            <Select<Tenant> options={[
                {
                    label: "Our demo tenant",
                    value: {
                        identifier: state.boilerplate?.blueprint!
                    },
                    render: () => <>
                        <Text>Our demo tenant ({state.boilerplate?.blueprint!})</Text>
                        <Newline />
                        <Text dimColor>Lots of demo data here already</Text>
                    </>
                },
                {
                    label: "My own tenant",
                    value: {
                        identifier: ''
                    },
                    render: () => <>
                        <Text>My own tenant</Text>
                        <Newline />
                    </>
                }

            ]} onSelect={(tenant: Tenant) => {
                if (tenant.identifier === '') {
                    askForInput(true);
                } else {
                    dispatch.setTenant(tenant);
                }
            }} />
        </>}

        {shouldAskForInput && <Box>
            <Box marginRight={1}>
                <Text>Enter your tenant identifier:</Text>
            </Box>
            <UncontrolledTextInput
                placeholder={state.boilerplate?.blueprint}
                onSubmit={(tenant) => {
                    dispatch.setTenant({ identifier: tenant })
                    askForInput(false);
                }}
            />
        </Box>}

        {state.tenant && <Text>
            All right,{' '}
            <Text color={colors.highlight}>{state.tenant.identifier}</Text> it is!
        </Text>}
    </>
}
