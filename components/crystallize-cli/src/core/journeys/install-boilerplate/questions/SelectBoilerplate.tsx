import { Text } from 'ink';
import React from 'react';
import { boilerplates } from '../../../../config/boilerplates.js';
import { colors } from '../../../../config/colors.js';
import { Boilerplate } from '../../../../types.js';
import { BoilerplateChoice } from '../../../components/BoilerplateChoice.js';
import { Select } from '../../../components/Select.js';
import { useJourney } from '../context/provider.js';

export const SelectBoilerplate: React.FC = () => {
    const { state, dispatch } = useJourney();
    return (
        <>
            {!state.boilerplate && <Text>Please select a boilerplate for your project</Text>}
            {!state.boilerplate && (
                <Select<Boilerplate>
                    options={boilerplates.map((boilerplate: Boilerplate) => {
                        return {
                            label: boilerplate.name,
                            value: boilerplate,
                            render: () => <BoilerplateChoice boilerplate={boilerplate} />,
                        };
                    })}
                    onSelect={(boilerplate: Boilerplate) => {
                        dispatch.setBoilerplate(boilerplate);
                    }}
                />
            )}

            {!state.boilerplate && <Text>New Next 13 boilerplate coming soon!</Text>}

            {state.boilerplate && (
                <Text>
                    You are going to install the <Text color={colors.highlight}>{state.boilerplate.name}</Text>{' '}
                    boilerplate.
                </Text>
            )}
        </>
    );
};
