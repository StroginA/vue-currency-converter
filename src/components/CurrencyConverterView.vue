<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const convert = (): number | null => {
    if (typeof baseCurrencyAmount.value === "number") {
        return baseCurrencyAmount.value*30
    }
    return null;
}

const baseCurrencyAmount = ref("");
const targetCurrencyAmount = computed(() => {
    return convert()
})


</script>

<template>
    <div class="converter">
        <label class="label" for="inputFrom">Amount:</label>
        <input class="input" name="inputFrom" v-model.number="baseCurrencyAmount"/>
        <label class="label" for="baseCurrencySelect">From:</label>
        <select class="select" name="baseCurrencySelect"></select>
        <label class="label" for="targetCurrencySelect">To:</label>
        <select class="select" name="targetCurrencySelect"></select>
        <label class="label" for="inputTo">Result:</label>
        <input class="input" name="inputTo" :value="targetCurrencyAmount" disabled/>
    </div>
</template>

<style lang="scss" scoped>

</style>