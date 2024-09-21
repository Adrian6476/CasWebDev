// week6/MarkVue/src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import { RouteService } from '../services/RouteService';
import { ConfigService } from '../services/ConfigService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Document route with language code
    {
      path: '/:lang/:docId',
      name: 'document',
      component: () => import('../components/DocumentViewer.vue'),
      props: true,
    },
    // Redirect for language-only path
    {
      path: '/:lang',
      redirect: (to) => {
        const lang = to.params.lang;
        return RouteService.getInstance().getLandingPageRoute(lang);
      },
    },
    // Redirect root to default language
    {
      path: '/',
      redirect: () => {
        const defaultLang = RouteService.getInstance().getDefaultLang();
        return `/${defaultLang}`;
      },
    },
    // Not found route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
});

// Navigation guard to handle language selection and storage
router.beforeEach((to, from, next) => {
  const configService = ConfigService.getInstance();
  const languages = configService.languages;
  const defaultLang = configService.defaultLang;

  let lang = to.params.lang as string;

  if (!lang || !languages[lang]) {
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && languages[storedLang]) {
      lang = storedLang;
    } else {
      lang = defaultLang;
    }
    next({ path: `/${lang}/${to.params.docId || configService.landingPage}` });
  } else {
    next();
  }
});

export default router;
