// import { Toast } from 'vant';
import cTitle from 'components/title';




export default {
  data() {
    return {
      
    };
  },

  activated() {

   

  },

  mounted() {

    

  },
  methods: {
    routerGo(name){
      this.$router.push(this.fun.getUrl(name));
    }
  },
  components: {cTitle}
};