// week6/MarkVue/src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { ConfigService } from './services/ConfigService';

const vuetify = createVuetify({
  components,
  directives,
});

async function bootstrap() {
  const configService = ConfigService.getInstance();
  await configService.loadConfig();

  const app = createApp(App);

  app.use(router);
  app.use(vuetify);

  app.mount('#app');
}

bootstrap();
