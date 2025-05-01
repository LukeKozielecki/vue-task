<template>
  <div>
    <label>xml<input type="radio" value="xml" v-model="view" /></label>
    <label>table<input type="radio" value="table" v-model="view" /> </label>
  </div>

  <template v-if="view === 'xml'">
    <h2>XML</h2>
    <pre> {{ xml }} </pre>
  </template>

  <template v-else>
    <h2>Grouped table</h2>
    <table>
      <thead>
        <tr class="header">
          <td v-for="header in headers" :key="header">
            {{ header }}
          </td>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="([key, value], idx) in Object.entries(groupedData)"
          :key="idx"
        >
          <tr @click="groupToggle(key)" class="group">
            <td>
              <div style="display: flex; justify-content: space-between">
                <span>{{ key }}</span>
              </div>
            </td>
          </tr>

          <template v-if="!hidden.has(key)">
            <tr v-for="(row, idx) in value" :key="idx">
              <td v-for="(cellValue, cellKey) in row" :key="cellKey">
                {{ cellValue }}
              </td>
            </tr>

            <tr v-if="value.length > 1">
              <td style="text-align: right">
                <span v-if="value.length > 1">
                  total: {{ totalGet(value) }}PLN
                </span>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </template>

  <table>
    <tr v-for="(item, idx) in data" :key="idx">
      <td v-for="(_, key) in item" :key="key">
        <input type="text" v-model="item[key]" />
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { dataGroup, toXml, useExampleData } from "./utils";

const view = ref<"xml" | "table">("table");

type Data = {
  category: string;
  amount: string;
  currency: string;
  [key: string]: string;
};

const data = useExampleData<Data>();

// TODO: TASK → avoid recomputing while user is still typing
const xml = computed(() => toXml(data.value ?? []));

// TODO: TASK → let the user also group by currency and account
const groupedData = computed(() =>
  data.value //
    ? dataGroup(data.value, "category")
    : [],
);
const headers = computed(() =>
  Object.keys(data.value?.[0] ?? {}).filter((i) => i !== "category"),
);

const hidden = reactive(new Set<string>());
function groupToggle(groupKey: string) {
  hidden.has(groupKey) //
    ? hidden.delete(groupKey)
    : hidden.add(groupKey);
}

// TODO: TASK → handle different currencies. Use `plnToCurrency` function to get the rates
function totalGet(items: { amount: string | number; currency: string }[]) {
  return items.reduce((acc, curr) => acc + Number(curr.amount), 0);
}

// @ts-ignore
async function plnToCurrency(curr: string) {
  if (curr === "pln") return 1;

  const res = await fetch(
    `http://localhost:5173/currency/pln-to-${curr.toLowerCase()}`,
  );
  const text = await res.text();
  return Number(text.trim());
}
</script>

<style scoped>
pre {
  text-align: left;
}
</style>
