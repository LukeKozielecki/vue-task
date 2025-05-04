import {onMounted, ref} from "vue";

export function useExampleData<T extends Record<string, any>>() {
  const data = ref<T[] | null>(null);

  onMounted(() => {
    fetch("http://localhost:5173/example_data.csv")
      .then((r) => r.text())
      .then((r) => (data.value = csvToArray<T>(r)));
  });

  return data;
}

export function dataGroup<T extends Record<string, any>, K extends keyof T>(
  input: T[],
  key: K,
) {
  return input.reduce(
    (acc, curr) => {
      const item = { ...curr };
      const groupedValue = item[key];
      delete item[key];

      acc[groupedValue] ??= [];
      acc[groupedValue].push(item);

      return acc;
    },
    {} as Record<T[K], T[]>,
  );
}

function csvToArray<T extends Record<string, any>>(input: string) {
  const lines = input.trim().split("\n");
  const headerLine = lines.shift()!;
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");

    if (values.length !== headers.length) {
      throw Error("values.length !== headers.length");
    }

    return headers.reduce(
      (acc, header, idx) => {
        const value = values[idx];
        acc[header] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }) as T[];
}

// TODO (Completed): TASK → implement exporting to XML
export function toXml(input: Record<string, any>[]): string {
    const xmlItems = input.map(item =>
        `<Transaction>${createXmlFields(item)}</Transaction>`
    ).join('\n');

    return `<Transactions>\n${xmlItems}\n</Transactions>`;
}

export function createXmlFields(item: Record<string, any>): string {
    return Object.entries(item)
        .map(([key, value]) =>`<${key}>${escapeXml(value.toString())}</${key}>`)
        .join('');
}

function escapeXml(unsafe: String) : string {
    return unsafe.replace(/[<>&'"]/g, (char) => {
        switch (char) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return char;
        }
    })
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeoutID: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: any[]) {
        if (timeoutID !== null) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
            fn.apply(this, args);
            timeoutID = null;
        }, delay);
    } as T;
}

export async function plnToCurrency(currency: string): Promise<number> {
    const normalizedCurrency = currency.toLowerCase();
    if (normalizedCurrency === "pln") return 1;

    const res = await fetch(
        `http://localhost:5173/currency/pln-to-${normalizedCurrency}`,
    );
    const text = await res.text();
    return Number(text.trim());
}
