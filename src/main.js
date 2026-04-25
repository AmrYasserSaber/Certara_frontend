import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth.store';

// Globally-registered shared components (most-used primitives)
import BaseButton from '@/components/shared/BaseButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';

// Global styles
import '@/assets/css/main.css';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  // Hydrate auth state BEFORE router navigation so guards see the logged-in user.
  await useAuthStore().boot();

  app.use(router);

  app.component('BaseButton', BaseButton);
  app.component('AppIcon', AppIcon);
  app.component('StatusBadge', StatusBadge);

  app.mount('#app');
}

bootstrap();
