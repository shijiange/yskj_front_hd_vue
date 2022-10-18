import { Form, Toast } from 'vant';
import emptyImage from "@/assets/images/new_diy/image.png";
// import { mapState, mapMutations } from 'vuex';
// import District from 'src/gov_province_city_area_id'

Date.prototype.Format = function(fmt) {
  // author: meizz
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
};

// let startDate = new Date("1900-01-01")
// let endDate = new Date()

export default {
  data() {
    return {
      emptyImage,
      avatar_image: '',
      nickname: '',
      // startDateInfo: startDate,
      // endDateInfo: endDate,
      // 登录类型,1-代表微信，5-浏览器登录
      type: this.fun.getTyep(),
      toi: this.fun.getKeyByI(),
      // 性别----
      showSex: false,
      fileList: [{url:"", isImage: true}],//头像图片
      // sexItems: [
      //   {
      //     label: '男',
      //     callback: () => {
      //       this.info_form.gender = '1'
      //       this.sexName = '男'
      //     }
      //   },
      //   {
      //     label: '女',
      //     callback: () => {
      //       this.info_form.gender = '0'
      //       this.sexName = '女'
      //     }
      //   }
      // ],
      actions: [{ name: '男' ,gender:1}, { name: '女' ,gender:2}],
      sexName: '',
      // 地区
      showAdd: false,
      district: district,
      districtName: '',
      // 个人信息
      info_form: {
        realname: '', // 用户姓名
        telephone: '', // 联系电话
        mobile: '', // 绑定电话
        wx: '', // 微信
        alipay: '', // 支付宝
        birthday: '', // 生日
        alipay_name: '', // 支付宝名字
        gender: '0', // 性别 0未定义 1男 2女
        avatar: '', // 头像
        province_name: '', // 省
        city_name: '', // 市
        area_name: '', // 区
        province: '', // 省ID
        city: '', // 市ID
        area: '', // 区ID
        address: '', // 详细地址
        nickname:"" //昵称
      },
      change_info:false,
      // 手机 btn
      bind_btn: '',
      // 自定义参数
      is_custom: false,
      custom_title: '', // 自定义title
      custom_value: '', // 自定义值
      // 自定义表单设置
      isForm: false,

      isShowSex: false,
      isShowAddress: false,
      isShowBirthday: false,
      customDatas: [],
      // 余额支付密码是否开启
      isBalancePwd: false,
      isBankRecharge: false,
      // 聚合支付相关数据
      netEntState: '未入网',
      aggreshow: false,
      aggreProshow: false,
      aggreItems: [],
      aggreProItems: [],
      aggregBtnshow: true,
      // 是否开启聚合支付
      yopshow: false,
      yopProshow: false,
      netProEntState: '未入网',
      aggregProBtnshow: true,
      is_open_converge_pay: false, // 判断是否开启汇聚支付
      // 聚合支付相关数据

      dateshow_1: false,
      minDate: new Date(1900, 1, 1),
      currentDate: new Date(),
      cmcShow: false,

      // 自定义字段是否必填
      formOpen: false,
      // 自定义字段是否可编辑
      formEdit: false,
      // 姓名是否显示
      formName:true,

      // 是否开启账号注销功能
      memberCancel: false,
      // 开启姓名必填
      name_must:false
    };
  },

  methods: {
    //头像上传
    afterRead(e){
      let fd = new FormData()
      fd.append("file", e.file);
      let uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      axios
        .post(uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            this.fileList[0].url = responseData.data.img_url;
            this.info_form.avatar = responseData.data.img_url
            Toast(responseData.msg);
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    onSelect(item){
      console.log(item);
      if(item.gender == 1){
        this.info_form.gender = '1';
        this.sexName = '男';
      }else if (item.gender == 2){
        this.info_form.gender = '2';
        this.sexName = '女';
      }
      this.showSex = false;
    },
    // 初始化数据
    init() {
      this.showSex = false;
      this.showAdd = false;
      this.is_custom = false;
      this.isShowSex = false;
      this.isShowAddress = false;
      this.isShowBirthday = false;
      this.isBalancePwd = false;
      this.isForm = false;
      this.customDatas = [];

      this.isBankRecharge = false;

      this.netEntState = '未入网';
      this.aggreshow = false;
      this.aggreProshow = false;
      this.aggreItems = [];
      this.aggreProItems = [];
      this.aggregBtnshow = true;
      // 是否开启聚合支付
      this.yopshow = false;
      this.yopProshow = false;
      this.cmcShow = false;
    },
    // 获取聚合支付是否入网
    entertheNetwork(enterdata) {
      var edata = enterdata;
      var That = this;
      this.yopshow = edata.yop == 1 ? true : false; // 设置是否显示
      if (this.yopshow) {
        $http.get('plugin.yop-pay.api.merchant.get-status', {}).then(
          function(response) {
            if (response.result == 1) {
              let data = response.data;
              That.netEntState = data.message;
              if (data.status == 1) {
                That.aggregBtnshow = false;
              } else {
                That.aggregBtnshow = true;
                That.getProposalForm(data.mode);
              }
            } else {
              That.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            That.$dialog.alert({message:response.msg});
          }
        );
      }
    },
    // 获取易合支付Pro是否入网
    entertheNetworkPro(enterdata) {
      var edata = enterdata;
      var That = this;
      this.yopProshow = edata.yop_pro == 1 ? true : false; // 设置是否显示
      if (this.yopProshow) {
        $http.get('plugin.yop-pro.frontend.yop-apply.get-status', {}).then(
          function(response) {
            if (response.result == 1) {
              let data = response.data;
              That.netProEntState = data.msg;
              if (data.status == 1) {
                That.aggregProBtnshow = false;
              } else {
                That.aggregProBtnshow = true;
                That.getProposalProForm(data.support_type);
              }
            } else {
              That.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            That.$dialog.alert({message:response.msg});
          }
        );
      }
    },
    // 易合支付Pro申请方方式
    getProposalProForm(proposalData) {
      if (proposalData.individual) {
        this.aggreProItems.push({
          name: '个体工商户注册',
          id:0
          // callback: () => {
          //   this.$router.push(this.fun.getUrl('IndividualEdit', {}, { from: 'apply' }))
          // }
        });
      }
      if (proposalData.enterprise) {
        this.aggreProItems.push({
          label: '企业注册',
          id:1
          // callback: () => {
          //   this.$router.push(this.fun.getUrl('CompanyEdit', {}, { from: 'apply' }))
          // }
        });
      }
    },
    onSelectProposalProForm(item){
      if(item.id == 0){
        this.$router.push(this.fun.getUrl('IndividualEdit', {}, { from: 'apply' }));
      }else if(item.id == 1){
        this.$router.push(this.fun.getUrl('CompanyEdit', {}, { from: 'apply' }));
      }
      this.aggreProshow = false;
    },
    onSelectProposalForm(item){
      if(item.id == 0){
        this.$router.push(this.fun.getUrl('AggregateIndReg', {}));
      }else if (item.id == 1){
        this.$router.push(this.fun.getUrl('AggregateMeReg', {}));
      }else if (item.id == 2){
        this.$router.push(this.fun.getUrl('AggregateEntReg', {}));
      }
      this.aggreshow = false;
    },
    // 聚合支付申请方方式
    getProposalForm(proposalData) {
      if (proposalData.person) {
        this.aggreItems.push({
          name: '个人注册',
          id:0
          // callback: () => {
          //   this.$router.push(this.fun.getUrl('AggregateIndReg', {}))
          // }
        });
      }
      if (proposalData.son_merchant) {
        this.aggreItems.push({
          name: '个体工商户注册',
          id:1
          // callback: () => {
          //   this.$router.push(this.fun.getUrl('AggregateMeReg', {}))
          // }
        });
      }
      if (proposalData.enterprise) {
        this.aggreItems.push({
          name: '企业注册',
          id:2
          // callback: () => {
          //   this.$router.push(this.fun.getUrl('AggregateEntReg', {}))
          // }
        });
      }
    },
    updateInfo() {
      $http.get("member.logout.index").then(
        response => {
          if (response.result == 1) {
            window.localStorage.setItem("isWxLogin", -1);
            this.$store.commit("savemodel", {});
            localStorage.setItem("token", "");
            localStorage.setItem("loginUid", "");
            window.firstLogin = 0;
            clearLoginData(); // 方法在index.html
            location.reload();
            // this.$dialog
            //   .alert({ message: response.msg })
            //   .then(() => {
            //     location.reload();
            //   })
            //   .catch(() => {});
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    // 获取信息
    getMemberInfo() {
      var that = this;
      $http.get('member.member.getUserInfo', {}, '').then(
        (response)=> {
          if (response.result == 1) {
            that.change_info = response.data.change_info;
            that.fileList[0].url = response.data.avatar_image
            that.info_form.nickname = response.data.nickname;
            if (response.data.myform && response.data.myform.base) {
              that.formOpen = response.data.myform.base.form_open == "1" ? true : false;
              that.formEdit = response.data.myform.base.form_edit == "1" ? true : false;
              that.formName = response.data.myform.base.name == "1"?true:false;
            }
            that.name_must = response.data.name_must == '1'?true:false;
            if (response.data.is_open_converge_pay == '1') {
              that.is_open_converge_pay = true;
            } else {
              that.is_open_converge_pay = false;
            }
            that.initData(response.data);
          } else {
            // that.$dialog.alert({message:response.msg});
          }
        });
    },

    // 初始化个人信息
    initData(data) {
      this.avatar_image = data.avatar_image;
      this.nickname = data.nickname;
      this.info_form.realname = data.realname;
      this.initSex(data);
      this.info_form.wx = data.wechat;
      this.initAliPay(data);
      this.initDistrict(data, '');
      this.info_form.avatar = data.avatar;
      this.initBirthday(data);
      this.initMobile(data);

      this.initCustomData(data);

      this.initCustomForm(data);

      this.getBalancePawInfo();

      // 判断聚合支付是否入网
      this.entertheNetwork(data);

      // 判断易合支付专业版是否入网
      this.entertheNetworkPro(data);

      this.cmcShow = data.cmc_pay;
      this.memberCancel = data.member_cancel_status;
    },

    // 初始化性别
    initSex(data) {
      console.log(data);
      console.log(data.myform);
      // console.log('1111111111')
      if (data.myform.base) {
        this.isShowSex = data.myform.base.sex == 1 ? true : false; // 设置是否显示
      }
      if(data.gender == 1){
        this.info_form.gender = '1';
        this.sexName = '男';
      }else if(data.gender == 2){
        this.info_form.gender = '2';
        this.sexName = '女';
      } else {
        this.info_form.gender = '0';
        this.sexName = '未定义';
      }
    },

    // 支付宝
    initAliPay(data) {
      this.info_form.alipay = data.alipay;
      this.info_form.alipay_name = data.alipay_name;
    },

    // 初始化城市
    initDistrict(data, district) {
      if (!this.fun.isTextEmpty(data)) {
        if ((this.isShowAddress = data.myform.base)) {
          this.isShowAddress = data.myform.base.address == 1 ? true : false; // 设置是否显示
        }

        this.info_form.province = data.province;
        this.info_form.province_name = data.province_name;

        this.info_form.city = data.city;
        this.info_form.city_name = data.city_name;

        this.info_form.area = data.area;
        this.info_form.area_name = data.area_name;

        if (data.area_name) {
          this.districtName = data.province_name + ' ' + data.city_name + ' ' + data.area_name;
        }

        this.info_form.address = data.address;
        return;
      }

      if (!this.fun.isTextEmpty(district)) {
        this.info_form.province = district.itemValue1;
        this.info_form.province_name = district.itemName1;

        this.info_form.city = district.itemValue2;
        this.info_form.city_name = district.itemName2;

        this.info_form.area = district.itemValue3;
        this.info_form.area_name = district.itemName3;

        this.districtName = district.itemName1 + ' ' + district.itemName2 + ' ' + district.itemName3;
      }
    },

    // 城市结果
    resultAdd(district) {
      console.log(district);
      this.initDistrict('', district);
    },

    // 初始化生日
    initBirthday(data) {
      if (data.myform.base) {
        this.isShowBirthday = data.myform.base.birthday == 1 ? true : false;
      }
      this.info_form.birthday = data.birthday;
    },

    // 初始化手机 绑定 修改 显示
    initMobile(data) {
      this.info_form.mobile = data.mobile;
      if (!this.fun.isTextEmpty(this.info_form.mobile)) {
        this.bind_btn = '修改手机';
      } else {
        this.bind_btn = '绑定手机';
      }
    },

    // 初始化自定义数据
    initCustomData(data) {
      if (!this.fun.isTextEmpty(data.yz_member)) {
        this.custom_value = data.yz_member.custom_value;

        this.getMemberInfo2(this.custom_value); // 获取自定义数据
      }
    },

    // 获取自定义数据
    getMemberInfo2(value) {
      let that = this;
      $http.get('member.member.get-custom-field', {}).then(
        function(response) {
          if (response.result == 1) {
            that.is_custom = response.data.is_custom == '1' ? true : false;
            that.custom_title = response.data.custom_title;
          }
        },
        function(response) {}
      );
    },

    // 初始化自定义表单
    initCustomForm(data) {
      if (this.fun.isTextEmpty(data.myform) || this.fun.isTextEmpty(data.myform.form)) {
        this.isForm = false;
        return;
      }
      if (data.myform.form.length == 0) {
        this.isForm = false;
        return;
      }
      this.isForm = true;
      this.customDatas = data.myform.form;
    },

    // 获取余额支付密码是否设置
    getBalancePawInfo() {
      let that = this;
      $http.get('member.balance-password.is-use', {}).then(
        function(response) {
          if (response.result == 1) {
            that.isBalancePwd = response.data.is_use;
          }
        },
        function(response) {}
      );
    },

    // 提交个人信息
    submitInfo() {
      if (this.formOpen && (this.customDatas instanceof Array)) {
        let result = this.customDatas.every((item) => {return (item.value != "");});
        if (!result) {
          Toast("请先填写自定义信息");
          return;
        }
      }
      this.info_form.customDatas = this.customDatas;
      var that = this;
      $http.post('member.member.updateUserInfo', { data: this.info_form }, '正在提交数据...').then(
        function(response) {
          console.log(response.data);
          if (response.result == 1) {
            zhuge.track('个人设置页面-确认修改');
            that.$dialog.alert({message:response.msg});
            that.$router.go(-1);
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    },

    // 绑定手机
    bindTel() {
      this.$router.push(
        this.fun.getUrl('editmobile', {
          num: this.info_form.mobile,
          myparent: this,
        },{
          is_edit:'1'
        })
      );
      sessionStorage.setItem('isset', 1);
    },

    // 编辑自定义字段
    editCustom() {
      if (this.fun.isTextEmpty(this.custom_value)) {
        // 跳转自定义界面 info_costom
        this.$router.push(this.fun.getUrl('info_costom', {}));
      }
    },

    // 余额支付密码设置
    editBalancePwd() {
      let that = this;
      $http.get('member.balance-password.is-has-password', {}, '').then(
        function(response) {
          if (response.result == 1) {
            if (response.data.is_has) {
              that.$router.push(that.fun.getUrl('balance_password', {}));
            } else {
              that.$router.push(that.fun.getUrl('set_balance_password', {}));
            }
          } else {
            that.$dialog.alert({message:response.msg});
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
        }
      );
    },

    // 银行卡
    editBank() {
      this.$router.push(this.fun.getUrl('memberBank', {}));
    },
    // CMC账号
    editCmc() {
      this.$router.push(this.fun.getUrl('cmcPayInfo', {}));
    },
    // 汇聚账户信息
    editUSer() {
      this.$router.push(this.fun.getUrl('bankCardInformation', {}));
      console.log('汇聚');
    },
    // 显示性别设置
    showSexInfo() {
      this.showSex = true;
    },

    openPicker() {
      this.dateshow_1 = true;
      // this.$refs.picker.open()
    },
    cancelbtn() {
      this.dateshow_1 = false;
    },

    handleConfirm(ret) {
      // console.log("handleConfirm=" + ret)
      // console.log(ret.Format("yyyy-MM-dd"))
      this.info_form.birthday = ret.Format('yyyy-MM-dd');
      this.dateshow_1 = false;
    },

    gotoBankCash() {
      this.$router.push(this.fun.getUrl('AccoutInfo', {}));
    },

    gotoCertified() {
      this.$router.push(this.fun.getUrl('myinfo_overseas', {}));
    },

    // 判断是否开启银行卡提现
    isBankRechargeOpen() {
      $http
        .get('member.member.isOpenHuanxun', {})
        .then(response => {
          if (response.result == 1) {
            if (response.data == 1) {
              this.isBankRecharge = true;
            } else {
              this.isBankRecharge = false;
            }
          } else {
            this.isBankRecharge = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 聚合支付按钮
    aggregBtn() {
      if (this.aggregBtnshow) {
        this.aggreshow = true;
      } else {
        this.$router.push(this.fun.getUrl('AggregateAuditPart', {}));
      }
    },
    aggregProBtn() {
      if (this.aggregProBtnshow) {
        this.aggreProshow = true;
      } else {
        this.$router.push(this.fun.getUrl('ShowApply', {}));
      }
    },
    goMemberCancel () {
      this.$router.push(this.fun.getUrl('MemberCancel', {}));
    },
  },
  activated() {
    zhuge.track('进入个人设置页面');
    // console.log("ccc="+startDate)

    // 初始化
    this.init();
    // 获取信息
    this.getMemberInfo();

    this.isBankRechargeOpen();
  },
  components: { }
};
