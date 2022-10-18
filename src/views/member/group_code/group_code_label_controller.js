


import { Toast } from 'vant';

import shareCanvas from "./components_share_qrcode.vue";

export default {
  components: {shareCanvas },
  data(){
    return {
      explainFlag:false,
      shareFlag:false,
      groupCodeInfoObj:{},
      shop_log:'',
      label_title:"标签进群",
      qrCodeCanvasSrc:'',
      isLoadingEnd:false
    };
  },
  async activated(){
    this.initData();
    await this.getGroupCodeLabelInfo();
    await this.getSharePoster();
    console.log("执行");
  },
  created(){
    //console.log(this.$route.query.groupCodeId)

  },
  mounted(){

  },
  methods:{
    getGroupCodeLabelInfo(){
      Toast.loading({
        message: '加载中',
        forbidClick: true,
      });
      $http
        .get("plugin.group-code.api.group-code.get-group-code",{
          id:this.$route.query.groupCodeId
        })
        .then(res => {
          Toast.clear();
          console.log(res.data.data);
          if (res.result === 1) {
            this.isLoadingEnd = true;
            if(res.data.data == null){
              this.$router.replace(this.fun.getUrl("groupCodeShow",{},{groupCodeId:this.$route.query.groupCodeId}));
            }else {
              this.groupCodeInfoObj = res.data.data;
              this.shop_log = res.data.shop_log;
              this.label_title = this.groupCodeInfoObj.code_name;
              this.fun.setWXTitle(this.label_title);
            }
            //this.status = res.data.status;
          } else {
            Toast( res.msg);
            setTimeout(()=>this.$router.go(-1),1000)
          }
        });
    },
    initData(){
      this.explainFlag=false;
      this.shareFlag=false;
    },
    selectedLabel(item,key){
      this.$router.push(this.fun.getUrl("groupCodeShow",{},{groupCodeId:this.$route.query.groupCodeId,groupCodeLabel:item}));
    },
    openShare(){
      this.shareFlag = true;
      return;
      // this.$nextTick(function() {
      //   console.log(this.groupCodeInfoObj);
      //   let obj = {groupCodeId:this.$route.query.groupCodeId};
      //   if(this.groupCodeInfoObj.auth_visit==0){
      //     obj.scope="base";
      //   }
      //   this.$refs.share_canvas.createQrc(obj);
      // });
    },
    async getSharePoster(){
      let res = await $http.get("plugin.group-code.api.group-code.get-share-poster",{
        id:this.$route.query.groupCodeId
      });
      if(res.result==1){
        this.qrCodeCanvasSrc =res.data.image_url;
      }else {
        Toast( res.msg);
      }
    }
  }
};
