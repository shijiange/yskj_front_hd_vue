// import { Toast } from 'vant';
import cTitle from 'components/title';

const RECORD_URL="plugin.conference.api.conference-enrol.get-enrol";

export default {
  data() {
    return {
      list:[]
    };
  },

  activated() {
    this.initData();
    this.getData();

  },

  mounted() {

    

  },
  methods: {
    routerGo(id,mid){
      this.$router.push(this.fun.getUrl('MeetingIndexDetail',{id:id,member_id:mid}));
    },

    goExtendList(id,mid){
      this.$router.push(this.fun.getUrl('MeetingExtendList',{id:id,member_id:mid}));
    },

    initData(){
      this.list=[];
    },

    getData(){
      $http.get(RECORD_URL,{},"加载中").then(res => {
        if(res.result == 1){
          console.log(res);
          this.list=res.data;
        }
      }).catch(error =>{
        console.log(error);
      });
    },


  },
  components: {cTitle}
};