<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import { getCurrencyByLanguageCode } from '@/controllers/countryCurrencies';


const convert = (): number | null => {
    if (typeof baseCurrencyAmount.value === "number") {
        return (
            (baseCurrencyAmount.value / rates.value[baseCurrency.value])
            * rates.value[targetCurrency.value]
        )
    }
    return null;
}


const baseCurrency = ref(getCurrencyByLanguageCode(navigator.languages[0]) || "USD");
const targetCurrency = ref("USD");
const baseCurrencyAmount = ref("");
const targetCurrencyAmount = computed(() => {
    return convert()?.toFixed(4);
})

// We expect an object with key names matching currency names:
// { USD: 1, RUB: 60, ...}
const rates = ref({} as {[key: string]: number});
const errorLoadingRates = ref(false);

onMounted(async () => {
    /*
    We request rates in USD once so we can convert any currency through USD 
    without requesting every time user changes currencies
    */
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
        const json = await res.json();
        rates.value = json.rates;
    } else {
        errorLoadingRates.value = true;
    }
})


</script>

<template>
    <div class="converter">
        <label class="label converter_label" for="inputFrom">
            Amount:
        </label>

        <input class="input converter_input" 
        name="inputFrom" 
        v-model.number="baseCurrencyAmount"/>

        <label class="label converter_label converter_label__base" 
        for="baseCurrencySelect">
            From:
        </label>

        <select class="select converter_select converter_select__base-currency" 
        name="baseCurrencySelect"
        v-if="rates"
        v-model="baseCurrency">
            <option v-for="(_, key) in rates"
            :key="key" 
            :value="key">
                {{key}}
            </option>
        </select>

        <label class="label converter_label__target" for="targetCurrencySelect">
            To:
        </label>

        <select class="select converter_select converter_select__target-currency" 
        name="targetCurrencySelect"
        v-if="rates"
        v-model="targetCurrency">
            <option v-for="(_, key) in rates" 
            :key="key" 
            :value="key">
                {{key}}
            </option>
        </select>

        <label class="label converter_label" for="inputTo">
            Result:
        </label>

        <input class="input converter_input" 
        name="inputTo" 
        :value="targetCurrencyAmount" />

        <p v-if="errorLoadingRates"
        class="error converter_loading-error">
            Error loading exchange rates
        </p>

        <a class="link converter_api-link"
        href="https://www.exchangerate-api.com">
            Rates By Exchange Rate API
        </a>
    </div>
</template>

<style lang="scss" scoped>
    .converter {
        display: grid;
        column-gap: 1rem;
        &_label {
            grid-column: 1/3;
            &__base {
                grid-column: 1;
            }
            &__target {
                grid-column: 2;
            }
        }
        &_input {
            margin-bottom: 0.5rem;
            grid-column: 1/3;
        }
        &_select {
            grid-column: 1;
            margin-bottom: 0.5rem;
            &__base-currency {
                grid-column: 1;
                grid-row: 4;
            }
            &__target-currency {
                grid-column: 2;
                grid-row: 4;
            }
        }
        &_api-link {
            margin-top: 3rem;
            grid-column: 1/3;
        }
        &_loading-error {
            grid-column: 1/3;
        }
    }
</style>