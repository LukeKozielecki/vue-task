import type { Ref } from "vue";
import { ref, watch } from "vue";
import { debounce } from "../utils.ts";

// TODO (Completed): TASK → avoid recomputing while user is still typing)
export function useDebounceData<T>(data: Ref<T[] | null>, debounceTime = 500) {
    const debouncedData = ref<T[]>([]) as Ref<T[]>;
    const isInitial = ref(true);

    const debouncedUpdate = debounce(() => {
        debouncedData.value = data.value ? data.value.map(item => ({ ...item })) : [];
    }, debounceTime);
    watch(data, () => {
        if (isInitial.value) {
            debouncedData.value = data.value ? data.value.map(item => ({ ...item })) : [];
            isInitial.value = false;
        } else {
            debouncedUpdate();
        }
    }, { deep: true });

    return { debouncedData };
}



