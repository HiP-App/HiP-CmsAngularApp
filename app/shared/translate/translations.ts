import { OpaqueToken, provide } from '@angular/core';

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_DE_NAME, LANG_DE_TRANS } from './lang-de';

// translation token
export const TRANSLATIONS = new OpaqueToken('translations');

// all translations
const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_DE_NAME]: LANG_DE_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
    provide(TRANSLATIONS, { useValue: dictionary }),
];