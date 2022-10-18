import cTitle from 'components/title';
// import { Toast } from 'vant';

export default {
  data() {
    return {
      title:'',
      content:'',
    };
  },

  mounted () {
    this.getAgreement();
  },
  methods: {
    getAgreement(){
      $http.get('plugin.enter-goods.frontend.agreement.detail.index').then((res)=>{
        console.log(res);
        if(res.result===1){
          this.title=res.data.title;
          this.content=res.data.content;
        }else{
          console.log(res.msg);
        }
      }).catch((error)=>{
        console.log(error);
      });
    }
  },
  components: { cTitle }

};