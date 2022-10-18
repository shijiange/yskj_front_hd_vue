/**
 * Created by win 10 on 2020/7/21.
 */

import { Toast } from 'vant';
import shareCanvas from "./components_share_qrcode.vue";
// import html2canvas from 'html2canvas';
export default {
  components: { shareCanvas },
  data(){
    return {
      explainFlag:false,
      kfFlag:false,
      shareFlag:false,
      groupCodeInfo:{},
      group_code: {},
      shop_log:'',
      qrCodeCanvasSrc:'',
      openAuthData: null,
      showAuthDialog: false,
    };
  },
  activated(){
    this.getGroupCodeShowInfo();
    this.getSharePoster();
  },
  created(){

  },
  mounted(){
    console.log("执行吗1");

  },
  methods:{
    async getGroupCodeShowInfo(){
      Toast.loading({
        message: '加载中',
        forbidClick: true,
      });
      let options = {
        id:this.$route.query.groupCodeId
      };
      if(this.$route.query.groupCodeLabel && !this.fun.isTextEmpty(this.$route.query.groupCodeLabel)){
        options.label = this.$route.query.groupCodeLabel;
      }

      let res = await $http.get("plugin.group-code.api.group-code.get-group-code-data",options);
      Toast.clear();

      // 没有进群权限
      if (res.data && res.data.status) {
        this.openAuthData = res.data.auth_data;
        this.showAuthDialog = true;
        return;
      }

      if (res.result !== 1) {
        this.$toast(res.msg);
        return this.$dialog.alert({
          title: "提示",
          message: res.msg
        }).then(() => {
          if (window.history.length <= 1) {
            this.$router.push(this.fun.getUrl("home", {}));
          } else {
            this.$router.go(-1);
          }
        });
      }

      this.shop_log = res.data.shop_log;
      this.groupCodeInfo = res.data.data;
      this.group_code = this.groupCodeInfo.group_code || {};
      this.fun.setWXTitle(this.group_code.code_name);

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
    },
    onCloseAuthDialog () {
      this.$router.go(-1);
    },

    toPage (routeName, params) {
      this.$router.push(
        this.fun.getUrl(routeName, params)
      );
    },
  },
  computed: {
    levelNames () {
      let nameText = "";
      this.openAuthData.member_level.data.forEach((item,index) => {
        nameText += `[${item.level_name}]`;
        nameText += (index < this.openAuthData.member_level.data.length - 1) ? '、' : ' ';
      });
      return nameText;
    }
  },
  watch:{
    'shareFlag'(newVal,oldVal){
      console.log(newVal,oldVal);
      if(!newVal) return;
      return;
      // this.$nextTick(async function() {
      //   let obj = {groupCodeId:this.$route.query.groupCodeId};
      //   if(this.groupCodeInfo.group_code.auth_visit==0){
      //     obj.scope="base";
      //   }
      //   await this.$refs.share_canvas.createQrc(obj);
      // let canvas2 = document.createElement('canvas'), // 创建canvas
      //     _canvas = document.querySelector('.shareWrapper .divContent'), //此处可换body，或div等 我们一般可以放绘制的元素
      //     w = parseInt(window.getComputedStyle(_canvas).width),
      //     h = parseInt(window.getComputedStyle(_canvas).height);

      // //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      // canvas2.width = w * 2;
      // canvas2.height = h * 2;
      // canvas2.style.width = w + 'px';
      // canvas2.style.height = h + 'px';
      // console.log(canvas2.width,canvas2.height)

      // // let context = canvas2.getContext('2d'),
      // //     rect = _canvas.getBoundingClientRect(); //获取元素相对于视察的偏移量

      // // context.scale(4, 4);
      // // context.translate(-rect.left,-rect.top); //设置context位置，值为相对于视窗的偏移量负值，让图片复位


      // html2canvas(_canvas, {
      //     canvas: canvas2,
      //     useCORS: true, // 允许图片跨域
      //     width: w,  // 绘制图片的宽 2倍
      //     dpi: window.devicePixelRatio * 4, // dpi  如果模糊的话 就把dpi和scale缩放的值调大 dpi越高生成的图片越大
      //     height: h // 绘制图片的高 2倍
      // }).then((canvas)=> {
      //     console.log(canvas.toDataURL());
      //     this.qrCodeCanvasSrc = canvas.toDataURL();
      //     //$('.share-canvas').css('display','block').attr('src', canvas.toDataURL());
      // });

      // });
    }
  },
};
