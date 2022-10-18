/**
 * Created by win 10 on 2020/7/21.
 */


import { Toast } from 'vant';

export default {
  data(){
    return {
      form:{
        code_name:'',
        code_guide:'',
        customer_service:'',
        customer_service_guide:'',
        recommend:false,
        explain:false,
        explain_content:'',
      },
      temp_customer_service:'',
      qrCodeArr:[],
      photosize: 1024 * 1024 * 6,
      uploadUrl:'',
      selectImgIndex:null,
      auth_recommend:true,    //是否开启推荐
    };
  },
  async activated(){
    await this.getConfigInfo();
    await this.getOldData();
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
      this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      this.form.code_name = "";
      this.form.code_guide = "";
      this.form.customer_service = "";
      this.form.customer_service_guide = "";
      this.form.recommend = false;
      this.form.explain = false;
      this.form.explain_content = "";
      this.temp_customer_service="";
      this.qrCodeArr = [];
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
      // this.$notify('上传图片大小不能超过 2MB!')
    },
    selectIndex(i) {
      this.selectImgIndex = i;
      console.log(this.selectImgIndex);
    },
    async send(){
      if (this.fun.isTextEmpty(this.form.code_name)) return this.tips("请输入活码名称");
      if (this.fun.isTextEmpty(this.form.code_guide)) return this.tips("请输入引导语");
      if (this.fun.isTextEmpty(this.form.customer_service)) return this.tips("请上传客服二维码");
      if (this.fun.isTextEmpty(this.form.customer_service_guide)) return this.tips("请输入客服引导语");
      if (this.fun.isTextEmpty(this.form.explain_content) && this.form.explain) return this.tips("请输入活动说明");
      if (this.qrCodeArr.length==0) return this.tips("请至少上传一张群二维码");

      let recommend = this.form.recommend ? 1 : 0;
      let explain = this.form.explain ? 1 : 0;

      let {code_name,code_guide,explain_content,customer_service,customer_service_guide} = this.form;


      let code_data = [];
      for(let i=0;i<this.qrCodeArr.length;i++){
        let o={};
        o.code_url = this.qrCodeArr[i].img;
        o.upper_limit = this.qrCodeArr[i].num;
        code_data.push(o);
      }
      code_data = JSON.stringify(code_data);
      Toast.loading({
        message: '修改中',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.group-code.update",{
        id:this.$route.query.groupCodeId,
        code_name,code_guide,recommend,explain,explain_content,
        customer_service,customer_service_guide,code_data
      });

      Toast.clear();
      if(res.result !=1 ){
        Toast( res.msg);
        return;
      }
      this.$dialog.alert({message:res.msg});
      this.init();
      this.$router.go(-1);

    },
    /*vant图片上传*/
    onRead(e, flag) {
      console.log(e.file);
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      //this.stopButton = true;
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          Toast.clear();
          var responseData = response.data;
          if (responseData.result === 1) {


            switch (That.selectImgIndex) {
            case 1:
              //门店logo
              if (flag === true) {
                this.temp_customer_service = URL.createObjectURL(e);
              } else {
                this.temp_customer_service = URL.createObjectURL(e.file);
              }
              this.form.customer_service = responseData.data.img;
              break;
            case 2:{
              let o={
                num:0,
                img: responseData.data.img, 
                temp_img:URL.createObjectURL(e.file)
              };
              this.qrCodeArr.push(o);
              break;
            }
            default:
              That.stopButton = false;
              return;
            }
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    delRQCode(key){
      this.qrCodeArr.splice(key,1);
    },
    tips(content){
      Toast(content);
      return false;
    },
    async getOldData(){
      Toast.loading({
        message: '',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.group-code.detail",{
        id:this.$route.query.groupCodeId
      });
      Toast.clear();
      if(res.result != 1){
        this.$dialog.alert({message:res.msg});
        return ;
      }
      console.log(res.data.data);
      let data = res.data.data;
      this.form.code_name = data.code_name;
      this.form.code_guide = data.code_guide;
      this.form.customer_service = data.customer_service;
      this.temp_customer_service = data.customer_service_img;

      this.form.customer_service_guide = data.customer_service_guide;
      this.form.recommend = data.recommend==1 ? true : false;
      this.form.explain = data.explain==1 ? true : false;
      this.form.explain_content = data.explain_content;
      this.form.code_guide = data.code_guide;

      let code_data=[];
      data.has_many_code.forEach((item,key)=>{
        let obj = {};
        obj.temp_img = item.code_url_img;
        obj.img = item.code_url;
        obj.num = item.upper_limit;
        let date = new Date(item.expire);
        let date1 = new Date();
        if(date1.getTime() > date.getTime() ){
          obj.expireFlag = true;
        }else obj.expireFlag = false;

        code_data.push(obj);

      });
      this.qrCodeArr = code_data;

      //this.auth_recommend = res.data.set.auth_recommend=="1" ? true : false;
    },
    async getConfigInfo(){
      Toast.loading({
        message: '',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.set.index");
      Toast.clear();
      console.log(res);
      if(res.result != 1){
        this.$dialog.alert({message:res.msg});
         
        return ;
      }
      this.auth_recommend = res.data.set.auth_recommend=="1" ? true : false;
    }
  }
};
