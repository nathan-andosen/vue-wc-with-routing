import "./polyfills/polyfills";
import { Vue } from "vue-property-decorator";
import VueCustomElement from 'vue-custom-element';
import { RegisterComponentService } from './services/register-component.service';
Vue.use(VueCustomElement);
import initRouter from './routes';
const router = initRouter();

import "./assets/scss/index.scss";

import VueWcWithRoutingComponent from './vue-wc-with-routing.component.vue';
import { COMPONENT_NAME } from './vue-wc-with-routing.component';
const component: any = VueWcWithRoutingComponent;
// component.router = router;

// register our component
const registerComponentSrv = new RegisterComponentService();
registerComponentSrv.register(component, COMPONENT_NAME, (element) => {
  // create your own custom methods on the custum element
  // element.prototype.passData = function(data) {
  //   this.getVueInstance().passData(data);
  // };
});