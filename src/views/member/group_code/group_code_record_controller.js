/**
 * Created by win 10 on 2020/7/21.
 */
import { Toast } from 'vant';
import { Dialog } from 'vant';

import shareCanvas from "./components_share_qrcode.vue";
import { scrollMixin } from "../../../utils/mixin";

Dialog.setDefaultOptions({
  confirmButtonColor:'#00b075'
});

export default {
  mixins: [scrollMixin], //加载更多
  components: { shareCanvas },
  data(){
    return {
      shareFlag:false,
      shareInfo:{},
      listData:[],
      shop_log:'',

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      qrCodeCanvasSrc:''
    };
  },
  activated(){
    this.initData();
    this.getListData();
  },
  mounted(){
    this.$nextTick(function() {
      canvas = document.getElementById('group_code_record_canvas');
    });
  },
  methods:{
    initData(){
      this.shareFlag=false;
      this.page = 1;
      this.isLoadMore=true;
      this.total_page=0;
    },
    async getListData(){
      Toast.loading({
        message: '加载中',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.group-code.my-group-code");
      Toast.clear();

      if(res.result !==1){
        Toast( res.msg);
        return;
      }

      this.listData = res.data.list.data;
      this.shop_log = res.data.shop_log;
      this.isLoadMore = true;
      this.total_page = res.data.list.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

    },
    //加载更多数据
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.group-code.api.group-code.my-group-code",{
            page:this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.list.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    openShare(item){
      console.log(item);
      this.shareFlag = true;
      this.shareInfo = item;
      this.getSharePoster();
  
      this.$nextTick(function() {
        let obj = {groupCodeId:item.id};
        if(item.auth_visit==0){
          obj.scope="base";
        }
        this.$refs.share_canvas.createQrc(obj);
      });
    },
    gotoGroupCodeData(item){
      this.$router.push(
        this.fun.getUrl("groupCodeData",{},{groupCodeId:item.id})
      );
    },
    gotoGroupCodeEdit(item){
      this.$router.push(
        this.fun.getUrl("groupCodeEdit",{},{groupCodeId:item.id})
      );
    },
    gotoGroupCodeLabel(item){
      this.$router.push(
        this.fun.getUrl("groupCodeLabel",{},{groupCodeId:item.id})
      );
    },
    delGroupCode(item){
      let that=this;
      console.log(item);
      Dialog.confirm({
        title: '删除活码',
        message: '该操作不可撤回，是否继续？',
        beforeClose:async (action, done)=>{
          if (action === 'confirm') {
            let res = await $http
              .get("plugin.group-code.api.group-code.deleted-group-code",{
                id:item.id
              });
            that.$dialog.alert({message:res.msg});
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
    },
    async getSharePoster(){
      let res = await $http.get("plugin.group-code.api.group-code.get-share-poster",{
        id:this.shareInfo.id
      });
      if(res.result==1){
        //this.qrCodeCanvasSrc =res.data.image_url;
      }else {
        Toast( res.msg);
      }
    }
  }
};
