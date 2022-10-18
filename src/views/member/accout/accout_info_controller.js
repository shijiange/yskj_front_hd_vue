import { Toast } from 'vant';
import cTitle from 'components/title';

export default {
  data() {
    return {

      userVal: "2",

      cardVal: "",

      customNum: "",

      cardNum: "",

      userName: "",

      legalName: "",

      legalCardNo: "",

      mobile: "",

      telephone: "",

      mail: "",

      address: "",

      other: "",

      btn_applyShow: false,

      btn_alterShow: false,

      userTypeShow: false,

      popupVisible: false,

      action:"",

      msg:""
    };
  },

  activated() {

    this.init();

    this.getData();


  },

  mounted() {



  },
  methods: {
    submit() {

      if (this.fun.isTextEmpty(this.customNum)) {
        Toast('请填写客户号');
        return;
      }

      if (this.fun.isTextEmpty(this.userName)) {
        Toast('请输入用户姓名');
        return;
      }

      if (this.fun.isTextEmpty(this.mobile)) {
        Toast('请输入手机号码');
        return;
      }

      if (this.fun.isMoblie(this.mobile)) {
        Toast('请填写正确的手机号');
        return;
      }

      let json = {
        userType: this.userVal,
        customerCode: this.customNum,
        identityType: this.cardVal,
        identityNo: this.cardNum,
        userName: this.userName,
        legalName: this.legalName,
        legalCardNo: this.legalCardNo,
        mobiePhoneNo: this.mobile,
        telPhoneNo: this.telephone,
        email: this.mail,
        contactAddress: this.address,
        remark: this.other
      };


      $http.post("plugin.huanxun.frontend.controllers.account-apply.accountApply", json, "正在申请中...").then(response => {
        if (response.result == 1) {
          this.popupVisible = true;
          this.action=response.data.link;
          this.msg=response.data.ipsRequest;
        }else{
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },

    init() {
      this.userVal = "2";

      this.cardVal = "";

      this.customNum = "";

      this.cardNum = "";

      this.userName = "";

      this.legalName = "";

      this.legalCardNo = "";

      this.mobile = "";

      this.telephone = "";

      this.mail = "";

      this.address = "";

      this.other = "";

      this.btn_applyShow = false;

      this.btn_alterShow = false;

      this.action="";

      this.msg="";
    },


    getData() {
      $http.get("plugin.huanxun.frontend.controllers.account-apply.getAccount", {}, "获取数据中...").then(response => {
        if (response.result == 1) {

          this.btn_alterShow = true;

          this.userVal = response.data.userType;

          this.cardVal = response.data.identityType;

          this.customNum = response.data.customerCode;

          this.cardNum = response.data.identityNo;

          this.userName = response.data.userName;

          this.legalName = response.data.legalName;

          this.legalCardNo = response.data.legalCardNo;

          this.mobile = response.data.mobiePhoneNo;

          this.telephone = response.data.telPhoneNo;

          this.mail = response.data.email;

          this.address = response.data.contactAddress;

          this.other = response.data.remark;

        }else{
          this.btn_applyShow=true;
        }
      }).catch(error => {
        console.log(error);
      });
    },


    alterData() {
      if (this.fun.isTextEmpty(this.customNum)) {
        Toast('请填写客户号');
        return;
      }

      if (this.fun.isTextEmpty(this.userName)) {
        Toast('请输入用户姓名');
        return;
      }

      if (this.fun.isTextEmpty(this.mobile)) {
        Toast('请输入手机号码');
        return;
      }

      if (this.fun.isMoblie(this.mobile)) {
        Toast('请填写正确的手机号');
        return;
      }

      let json = {
        userType: this.userVal,
        customerCode: this.customNum,
        identityType: this.cardVal,
        identityNo: this.cardNum,
        userName: this.userName,
        legalName: this.legalName,
        legalCardNo: this.legalCardNo,
        mobiePhoneNo: this.mobile,
        telPhoneNo: this.telephone,
        email: this.mail,
        contactAddress: this.address,
        remark: this.other
      };

      $http.post("plugin.huanxun.frontend.controllers.account-apply.editAccount", json, "正在修改中...").then(response => {
        if (response.result == 1) {
          this.$dialog.alert({message:response.msg});
         
        }else{
          this.$dialog.alert({message:response.msg});
         
        }
      }).catch(error => {
        console.log(error);
      });
    },

  },
  components: {
    cTitle
  }
};
