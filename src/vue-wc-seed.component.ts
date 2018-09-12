import { Vue, Component, Prop } from "vue-property-decorator";

// the name of the component, this is also the name of the custom element
export const COMPONENT_NAME = 'vue-wc-seed';

@Component({
  name: COMPONENT_NAME
})
export default class VueWcSeedComponent extends Vue {
  @Prop({default: 'Welcome!'}) welcomeMessage!: string;

  /**
   * This function will be exposed onto the custom element
   *
   * @private
   * @param {any} data
   */
  private passData(data: any) {
    // this method can be called from the custom element that gets created
  }
}