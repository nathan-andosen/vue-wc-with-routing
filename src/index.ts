import "./polyfills/polyfills";
import { Vue } from "vue-property-decorator";
import VueCustomElement from 'vue-custom-element';
import { RegisterComponentService } from './services/register-component.service';
Vue.use(VueCustomElement);

import "./assets/scss/index.scss";

import VueWcSeedComponent from './vue-wc-seed.component.vue';
import { COMPONENT_NAME } from './vue-wc-seed.component';
const component: any = VueWcSeedComponent;

// register our component
const registerComponentSrv = new RegisterComponentService();
registerComponentSrv.register(component, COMPONENT_NAME, (element) => {
  // create your own custom methods on the custum element
  element.prototype.passData = function(data) {
    this.getVueInstance().passData(data);
  };
});