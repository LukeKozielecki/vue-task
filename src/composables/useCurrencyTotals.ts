import type { Ref } from "vue";
import { reactive, watch } from "vue";
import { plnToCurrency } from "../utils.ts";
import type { Data } from "./useApp.ts";

// TODO (Completed): TASK → handle different currencies. Use `plnToCurrency` function to get the rates
export function useCurrencyTotals(
    groupedData: Ref<Record<string, Data[]>>,
    collapsedGroups: Set<string>,
    groupBy: Ref<string>
) {
    const groupTotals = reactive<Record<string, number>>({});

    const updateTotals = async () => {
        try {
            for (const [groupKey, items] of Object.entries(groupedData.value)) {
                if (shouldProcessGroup(groupKey, items)) {
                    groupTotals[groupKey] = await calculateGroupTotal(items, groupKey);
                }
            }
        } catch (error) {
            console.error('Error updating totals:', error);
        }
    };

    const shouldProcessGroup = (groupKey: string, items: Data[]): boolean => {
        return !collapsedGroups.has(groupKey) && items.length > 1;
    };

    const calculateGroupTotal = async (items: Data[], groupKey: string): Promise<number> => {
        const conversions = await Promise.all(
            items.map(item => convertItemAmount(item, groupKey))
        );
        return conversions.reduce((sum, val) => sum + val, 0);
    };

    const convertItemAmount = async (item: Data, groupKey: string): Promise<number> => {
        try {
            const amountNumber = Number(item.amount);
            const currency = groupBy.value === 'currency' ? groupKey : item.currency;
            const rate = await plnToCurrency(currency);
            return amountNumber / rate;
        } catch (error) {
            console.error(`Error converting item amount:`, error);
            return 0;
        }
    };

    watch(
        groupedData,
        () => updateTotals(),
        { deep: true, immediate: true }
    );

    return { groupTotals, updateTotals };
}