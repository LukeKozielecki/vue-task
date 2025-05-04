import { computed, ref, watch } from "vue";
import { toXml, useExampleData } from "../utils";
import { useDebounceData } from "./useDebounce";
import { useDataGrouping } from "./useDataGrouping";
import { useCurrencyTotals } from "./useCurrencyTotals";
import { useGroupCollapse } from "./useGroupCollapse";

export type Data = {
    category: string;
    amount: string;
    currency: string;
    [key: string]: string;
};

export function useAppLogic() {
    const view = ref<"xml" | "table">("table");

    // Data initialization
    const data = useExampleData<Data>();
    const { debouncedData } = useDebounceData(data);

    const xml = computed(() => toXml(debouncedData.value));

    // Grouping
    const groupBy = ref<"category" | "currency" | "account">("category");
    const { groupedData, headers } = useDataGrouping(debouncedData, groupBy);

    // Group collapse
    const { collapsedGroups, groupToggle, clearGroups } = useGroupCollapse();
    watch(groupBy, clearGroups);

    // Currency totals
    const { groupTotals } = useCurrencyTotals(groupedData, collapsedGroups, groupBy);

    return { view, groupBy, data, xml, groupedData, headers, collapsedGroups, groupToggle, groupTotals };
}