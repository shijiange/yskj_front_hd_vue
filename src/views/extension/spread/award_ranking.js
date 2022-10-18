import cTitle from 'components/title';
export default{
  components: { cTitle },
  data(){
    return{

    };
  },
  methods:{
    previousPage(){
      this.$router.push(this.fun.getUrl("ExtensionPage"));
    }
  }
};