import type { Ref } from "vue";
import { computed } from "vue";
import { dataGroup } from "../utils.ts";
import type { Data } from "./useApp.ts";

// TODO(Completed): TASK → let the user also group by currency and account
export function useDataGrouping(
    debouncedData: Ref<Data[]>,
    groupBy: Ref<string>
) {
    const groupedData = computed(() =>
        dataGroup(debouncedData.value as Data[], groupBy.value)
    );

    const headers = computed(() =>
        Object.keys(debouncedData.value?.[0] ?? {}).filter((i) => i !== groupBy.value)
    );

    return { groupedData, headers };
}