<template>
  <div>
    <label>Group by:
      <select v-model="groupBy">
        <option value="category">Category</option>
        <option value="currency">Currency</option>
        <option value="account">Account</option>
      </select>
    </label>
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

          <template v-if="!collapsedGroups.has(key)">
            <tr v-for="(row, idx) in value" :key="idx">
              <td v-for="(cellValue, cellKey) in row" :key="cellKey">
                {{ cellValue }}
              </td>
            </tr>

            <tr v-if="value.length > 1">
              <td style="text-align: right">
                <span v-if="value.length > 1">
                  total: {{ groupTotals[key] }}PLN
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
import { useAppLogic } from "./composables/useApp";

const {
  view,
  groupBy,
  data,
  xml,
  groupedData,
  headers,
  collapsedGroups,
  groupToggle,
  groupTotals,
} = useAppLogic();
</script>

<style scoped>
pre {
  text-align: left;
}
</style>
