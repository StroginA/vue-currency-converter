import currencies from '../data/countryCurrencies.json';

export function getCurrencyByLanguageCode(language: string): string | null | undefined {
    /* 
    language string may be in format 'en-GB' or 'et', we need the country code which comes second
    currency for a country may be null
    */
    const country = language.length > 2 ?
    language.slice(3).toUpperCase() :
    language.toUpperCase();
    return currencies.find(el => el.country === country)?.currency;
}