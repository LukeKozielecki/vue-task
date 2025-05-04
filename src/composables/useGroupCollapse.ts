import { reactive } from "vue";

export function useGroupCollapse() {
    const collapsedGroups = reactive(new Set<string>());

    const groupToggle = (groupKey: string) => {
        collapsedGroups.has(groupKey)
            ? collapsedGroups.delete(groupKey)
            : collapsedGroups.add(groupKey);
    };

    const clearGroups = () => collapsedGroups.clear();

    return { collapsedGroups, groupToggle, clearGroups };
}