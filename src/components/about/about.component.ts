import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: 'about'
})
export default class AboutComponent extends Vue {
  @Prop({default: 'About page'}) message!: string;
}