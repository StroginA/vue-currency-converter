<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import { getCurrencyByLanguageCode } from '@/controllers/countryCurrencies';


const convert = (): number | null => {
    if (typeof baseCurrencyAmount.value === "number") {
        return baseCurrencyAmount.value*30
    }
    return null;
}


const baseCurrency = ref(getCurrencyByLanguageCode(navigator.languages[0]) || "USD");
const targetCurrency = ref("USD");
const baseCurrencyAmount = ref("");
const targetCurrencyAmount = computed(() => {
    return convert()
})

const rates = ref(null);
const ratesLoadingError = ref(false);

onMounted(async () => {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
        const json = await res.json();
        rates.value = json.rates;
        console.log(rates.value);
    } else {
        ratesLoadingError.value = true;
    }
})


</script>

<template>
    <div class="converter">
        <label class="label" for="inputFrom">Amount:</label>
        <input class="input" name="inputFrom" v-model.number="baseCurrencyAmount"/>
        <label class="label" for="baseCurrencySelect">From:</label>
        <select class="select" 
        name="baseCurrencySelect"
        v-if="rates"
        v-model="baseCurrency">
            <option v-for="(_, key) in rates" 
            :key="key" 
            :value="key">{{key}}</option>
        </select>
        <label class="label" for="targetCurrencySelect">To:</label>
        <select class="select" 
        name="targetCurrencySelect"
        v-if="rates"
        v-model="targetCurrency">
            <option v-for="(_, key) in rates" 
            :key="key" 
            :value="key">{{key}}</option>
        </select>
        <label class="label" for="inputTo">Result:</label>
        <input class="input" name="inputTo" :value="targetCurrencyAmount" disabled/>
        <p v-if="ratesLoadingError">Error loading exchange rates</p>
        <a href="https://www.exchangerate-api.com">Rates By Exchange Rate API</a>
    </div>
</template>

<style lang="scss" scoped>

</style>