import { Vue } from "vue-property-decorator";
import VueRouter from 'vue-router';
import HomeComponent from './components/home/home.component.vue';
import AboutComponent from './components/about/about.component.vue';

let init = false;
export default function() {
  if(init) return;

  Vue.use(VueRouter);
  const routes: any = [
    { path: '/wc/home', name: 'home', component: HomeComponent },
    { path: '/wc/about', name: 'about', component: AboutComponent }
  ];

  const router = new VueRouter({ 
    routes: routes, 
    // we use abstract so we do not distrupt the parent applications routes
    mode: 'abstract' 
  });
  Vue.mixin({ router: router });
  router.replace('/wc/home');

  init = true;
  return router;
};
