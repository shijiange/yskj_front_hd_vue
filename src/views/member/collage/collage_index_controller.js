

import projectItem from "./components/projectItem";
import collageItem1 from "./components/collage_item_1";
import collageItem2 from "./components/collage_item_2";
import collageItem3 from "./components/collage_item_3";
import { Dialog, Toast } from 'vant';
export default {
  components:{collageItem1,collageItem2,collageItem3,projectItem},
  data(){
    return {
      agent:false,
      examine:0,
      bonus:[],
      applyLevelList:[],
      member:{},
      project:{}
    };
  },
  mounted(){
		
  },
  activated(){
    this.getEntrance();
  },
  methods:{
    async getEntrance(){
      let res = await $http
        .get("plugin.collage.api.index.In-formation-data", {
          getEntrance:"getEntrance"
        });
      this.member = res.data.getEntrance.member;
      this.agent = res.data.getEntrance.agent;
      this.examine = res.data.getEntrance.examine;
      this.bonus = res.data.getEntrance.bonus;
      this.project = res.data.getEntrance.project;
      this.applyLevelList = res.data.getEntrance.level.data;
      console.log(res.data.getEntrance.agent);
      console.log(res.data.getEntrance.level.data);
    },
    gotoApply(formId,levelId){
      if(this.examine==1){
        Toast("你已提交，请等待审核");
        return;
      }
      let selectIndex=0;
      this.$router.push(this.fun.getUrl("tacitApply",{},{selectIndex,formId,levelId}));
    },
    gotoCollage(selectIndex){
      this.$router.push(this.fun.getUrl("founderCollage",{fromHome:1},{selectIndex}));
    },
    gotoEchievement(){
      this.$router.push(this.fun.getUrl("founderEchievement"));
    },
    delProject(){
      Dialog.confirm({
        title: '删除拼单',
        message: '该操作不可撤回，是否继续？',
        beforeClose:async (action, done)=>{
          if (action === 'confirm') {
            let res = await $http
              .get("plugin.group-code.api.group-code.deleted-group-code",{
                id:item.id
              });
            this.$dialog.alert({message:res.msg});
            if(res.result !=1) return;

            this.listData.forEach((obj,key)=>{
              if(obj.id == item.id){
                this.listData.splice(key,1);
              }
            });
            done();

          } else {
            done();
          }
        },
      });
    }
  }
};