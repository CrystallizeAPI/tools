import { Text } from "ink"
import { useEffect } from "react";
import { colors } from "../../../../config/colors.js"
import { useJourney } from "../context/provider.js";
import { FullfilledState } from "../context/types.js";

export const ExecuteRecipes: React.FC = () => {
    const { state, dispatch } = useJourney<FullfilledState>();

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch.recipesDone();
        }, 5000);
        return () => clearTimeout(timeout);
    }, []);

    if (state.isFullfilled) {
        return <>
            <Text>
                All right,{' '}
                <Text color={colors.highlight}>Done</Text>
            </Text>
        </>
    }

    return <Text>
        Executing stuff
    </Text>;
}
