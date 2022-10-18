// import { Toast } from 'vant';
import cTitle from 'components/title';

const DETAIL_URL="plugin.conference.api.conference-activity.get-enrol-data";


export default {
  data() {
    return {
      list:[]
    };
  },

  activated() {
    this.list=[]; 
    this.getData();

  },

  mounted() {

    

  },
  methods: {
    getData(){
      $http.get(DETAIL_URL,{conference_id:this.$route.params.id,member_id:this.$route.params.member_id},"加载中...").then(res =>{
        if(res.result == 1){
          console.log(res);
          this.list=res.data;
        }
      }).catch(error =>{
        console.log(error);
      });
    }
  },
  components: {cTitle}
};