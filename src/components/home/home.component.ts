import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: 'home'
})
export default class HomeComponent extends Vue {
  @Prop({default: 'Home page'}) message!: string;

  goToAboutPage() {
    console.log('Go to about page...');
    this.$router.push('/wc/about');
  }
}