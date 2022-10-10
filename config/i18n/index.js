import I18n from 'react-native-i18n';
import enUS from './locales/en-US';
import ptBR from './locales/pt-BR';
import esES from './locales/es-ES';

I18n.fallbacks = true;

I18n.translations = {
  en: enUS,
  'pt-BR': ptBR,
  es_ES: esES,
};

export default I18n;
