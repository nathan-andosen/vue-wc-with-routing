import { Vue } from "vue-property-decorator";

/**
 * Register a VueJs component as a custom element
 *
 * @export
 * @class RegisterComponentService
 */
export class RegisterComponentService {

  /**
   * Register the custom element component 
   *
   * @param {*} component
   * @param {string} name
   * @param {(element: Function) => void} [cb]
   * @memberof LoadComponentService
   */
  register(component: any, name: string, cb?: (element: Function) => void) {
    this.loadPolyfill(() => {
      let element: any;
      const comp = new component['components'][name]();
      element = Vue.customElement(name, comp.$options);
      if(cb) cb(element);
    });
  }


  /**
   * Load the polyfill for custom elements if needed
   *
   * @private
   * @param {() => void} cb
   * @memberof LoadComponent
   */
  private loadPolyfill(cb: () => void) {
    if(!window.customElements || !window.customElements.define
    || !window.customElements.get || !window.customElements.whenDefined) {
      if(window.documentRegisterElementScriptPath) {
        // customElements not natively supported, have to download the polyfill
        const fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", window.documentRegisterElementScriptPath);
        fileref.onload = function() {
          cb();
        };
        document.getElementsByTagName("head")[0].appendChild(fileref);
      } else {
        throw new Error('customElements is not supported, please use the ' +
        'document-register-element polyfill');
      }
    } else {
      cb();
    }
  }
}