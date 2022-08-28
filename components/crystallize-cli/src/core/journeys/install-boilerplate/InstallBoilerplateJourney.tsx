import { DownloadProject } from "./actions/DownloadProject.js"
import { SelectBoilerplate } from "./questions/SelectBoilerplate.js"
import { SelectTenant } from "./questions/SelectTenant.js"
import { ContextProvider, useJourney } from "./context/provider.js"
import { Tips } from "../../components/Tips.js"
import { ExecuteRecipes } from "./actions/ExecuteRecipes.js"

export const InstallBoilerplateJourney: React.FC = () => {
    return <ContextProvider>
        <Journey />
    </ContextProvider>
}
const Journey: React.FC = () => {
    const { state } = useJourney();

    return <>
        <SelectBoilerplate />
        {state.boilerplate && <SelectTenant />}
        {state.isWizardFullfilled && <DownloadProject />}
        {state.isDownloaded && <ExecuteRecipes />}
        {!state.isFullfilled && <Tips />}
    </>
}
