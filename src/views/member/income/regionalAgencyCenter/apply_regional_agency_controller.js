import { Toast } from 'vant';

let searchMerchantsUserHandler=null;
export default {
  data() {
    return {

      apply: "-1",//状态值


      provicevalue: "",
      cityvalue: "",
      regionvalue: "",
      selectLevel: "",
      streetvalue: "",

      level: [],
      provinceoptions: [],
      cityoptions: [],
      regionoptions: [],
      stroptions: [],

      proviceObject: "",
      cityObject: "",
      regionObject: "",

      districtObject: "",

      //省市区弹窗显示隐藏

      proshow: false,

      cityshow: false,

      regshow: false,

      strshow: false,

      //代理等级显示

      selshow: false,

      prozoneshow: false,

      cityzoneshow: false,

      regzoneshow: false,

      streetshow: false,

      username: "",

      password: "",

      income_name_text: "",

      is_open_agreement:'0',

      apply_background:'',
      is_agreement:false,

      show2:false,

      protocol_content:'',//申请协议
      upload_flag:true,
      //* 招商专员
      merchantsCommissioner:{
        uid:null,
        member:null,
        turnOn:false,
        fieldName:"招商专员"
      },
      plugin_title: "区域代理"
    };
  },

  mounted() {

  },

  activated() {
    this.apply = "-1";
    this.show2 = false;
    this.getStatus();//获取当前状态
    this.customizeIncome();
  },

  methods: {
    //获取状态
    getStatus() {
      let that = this;
      let json = {
        basic_info: 1,
        validate_page: 1
      };
      $http.get('plugin.area-dividend.api.area-dividend.apply-status', json, '').then(function (response) {
        if (response.result == 1) {
          that.apply = response.data.apply;
          that.tipMsg = response.msg;
          that.is_open_agreement = response.data.is_open;
          that.protocol_content = response.data.agreement;
          that.setLogic(that.apply);
          that.merchantsCommissioner.turnOn=response.basic_info.globalParameter.invest_people_open;
          response.data.apply_background=='' ? (that.upload_flag = false) : (that.apply_background = response.data.apply_background)
          if(response.basic_info.globalParameter.invest_people_open){
            if(response.basic_info.globalParameter.invest_people_open===true){
              that.merchantsCommissioner.fieldName=response.basic_info.globalParameter.invest_people_name;
            }
          }
        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, function (response) {
        that.$dialog.alert({message:response.msg});
      });
    },
    //* 获取招商专员信息
    inputMerchantsCommissionerUid() {
      let userId=Number(this.merchantsCommissioner.uid);
      if(isNaN(userId)){
        Toast("请输入正确的用户ID");
        return;
      }
      if (searchMerchantsUserHandler) {
        clearTimeout(searchMerchantsUserHandler);
      }
      searchMerchantsUserHandler = setTimeout(() => {
        $http
          .get("plugin.invest-people.frontend.index.search-by-member", {
            mer_uid: this.merchantsCommissioner.uid
          })
          .then(({ data }) => {
            if(data===null){
              Toast("会员不存在");
              this.merchantsCommissioner.member=null;
              return;
            }
            this.merchantsCommissioner.member=data;
          });
      }, 500);
    },


    //分配逻辑
    setLogic(key) {
      switch (key) {
      case "0":
        break;
      case "1"://可申请
        //this.initLevel();//初始化等级数据
        //this.initData();//初始化数据
        this.initLevel().then(() => {

          this.initData();
        });

        break;
      case "2"://重新申请
        //this.initLevel();//初始化等级数据
        // this.initData();//初始化数据

        this.initLevel().then(() => {

          this.initData();
        });
        break;
      default:
        break;
      }
    },
    //去商城
    goHome() {
      this.$router.push(this.fun.getUrl('home'));
    },

    //再次提交审核  老方法
    submitAgain() {
      let that = this;
      let json = {"data": JSON.stringify(this.assembleJson())};
      if(this.merchantsCommissioner.turnOn===true){
        if(!this.merchantsCommissioner['uid']){
          Toast("请填写招商专员ID");
          return;
        }
        if(!this.merchantsCommissioner.member){
          Toast("招商专员不存在");
          return;
        }
        json['investor_uid']=this.merchantsCommissioner.uid;
      }
      $http.get('plugin.area-dividend.api.area-dividend.apply-again', json, '提交中').then(function (response) {
        if (response.result == 1) {
          Toast(response.msg);
          that.$router.go(-1);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },

    goAgreement() {
      this.show2 = true;
    },


    //初始化等级数据
    initLevel() {
      //this.level = [{ "name": "省级代理", "tag": 0 }, { "name": "市级代理", "tag": 1 }, { "name": "区/县级代理", "tag": 2 }, { "name": "街道/乡镇代理", "tag": 3 }];

      //this.level = [{ "name": "省级代理", "tag": 0 }, { "name": "市级代理", "tag": 1 }, { "name": "区/县级代理", "tag": 2 }, { "name": "街道代理", "tag": 3 }];


      let p = $http.get('plugin.area-dividend.api.area-dividend.can-apply-agent-level', {}).then(response => {
        if (response.result == 1) {
          console.log(response);
          this.level = response.data;
          console.log(1);
        }
      }).catch(error => {
        console.log(error);
      });

      return p;


    },


    //初始化数据
    initData() {
      console.log(22);
      var province = localStorage.getItem("province");
      if (this.fun.isTextEmpty(province)) {
        this.getAddressDataInfo();//获取地址json数据
      } else {
        this.initProvice();
      }
    },

    //初始化省数据
    initProvice() {
      var province = localStorage.getItem("province");
      var provinces = [];
      provinces = JSON.parse(province);
      this.provinceoptions = provinces;
    },

    //选择省份的响应方法
    selectProviceHandle(value) {
      //初始化一些默认值 避免逻辑错误
      this.cityoptions = [];
      this.regionoptions = [];
      this.cityvalue = '';
      this.regionvalue = '';


      this.proviceObject = value;
      this.cityoptions = [];
      var citys = JSON.parse(localStorage.getItem("city"));
      for (let i = 0; i < citys.length; i++) {
        if (citys[i].parentid == value.id) {
          this.cityoptions.push(citys[i]);
        }
      }

      this.provicevalue = value.areaname;

      this.proshow = false;
    },

    //选择市的响应方法
    selectCityHandle(value) {
      this.cityObject = value;
      console.log("selectCityHandle", value);
      this.regionoptions = [];
      var districts = JSON.parse(localStorage.getItem("district"));
      for (let i = 0; i < districts.length; i++) {
        if (districts[i].parentid == value.id) {
          this.regionoptions.push(districts[i]);
        }
      }

      this.cityvalue = value.areaname;

      this.cityshow = false;
    },

    //选择市辖区的响应方法
    selectRegionHandle(value) {
      console.log(value);
      this.regionObject = value;

      this.regionvalue = value.areaname;

      this.regshow = false;

      this.stroptions = [];

      this.isStreetShow(value.id);
    },


    //获取地址信息
    getAddressDataInfo() {
      let that = this;
      $http.get('member.member-address.address', {
        "i": this.fun.getKeyByI(),
        "type": this.fun.getTyep()
      }, '').then(function (response) {
        if (response.result == 1) {
          var province = JSON.stringify(response.data.province);
          var city = JSON.stringify(response.data.city);
          var district = JSON.stringify(response.data.district);
          localStorage.setItem("province", province);
          localStorage.setItem("city", city);
          localStorage.setItem("district", district);

          //初始化数据
          that.initProvice();

        } else {
          that.popAddressClose();
          that.$dialog.alert({message:response.msg});
        }
      }, function (response) {
        that.popAddressClose();
        that.$dialog.alert({message:response.msg});


      });
    },

    //提交 isAgain是否再次申请
    submit(isAgain) {
      if (this.fun.isTextEmpty(this.name)) {
        Toast("请填写姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.phone)) {
        Toast("请填写手机号");
        return;
      }


      if (this.fun.isMoblie(this.phone)) {
        Toast("请输入正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.selectLevel)) {
        Toast("请选择代理类型");
        return;
      }


      switch (this.selectLevel.tag) {
      case 0:
        if (this.fun.isTextEmpty(this.proviceObject)) {
          Toast("请选择省级区域");
          return;
        }
        break;
      case 1:
        if (this.fun.isTextEmpty(this.proviceObject)) {
          Toast("请选择省级区域");
          return;
        }

        if (this.fun.isTextEmpty(this.cityObject)) {
          Toast("请选择市级区域");
          return;
        }
        break;
      case 2:
        if (this.fun.isTextEmpty(this.proviceObject)) {
          Toast("请选择省级区域");
          return;
        }

        if (this.fun.isTextEmpty(this.cityObject)) {
          Toast("请选择市级区域");
          return;
        }

        if (this.fun.isTextEmpty(this.regionObject)) {
          Toast("请选择区/县级区域");
          return;
        }
        break;
      case 3:
        if (this.fun.isTextEmpty(this.proviceObject)) {
          Toast("请选择省级区域");
          return;
        }

        if (this.fun.isTextEmpty(this.cityObject)) {
          Toast("请选择市级区域");
          return;
        }

        if (this.fun.isTextEmpty(this.regionObject)) {
          Toast("请选择区/县级区域");
          return;
        }

        if (this.fun.isTextEmpty(this.districtObject)) {
          Toast("请填写街道/乡镇区域");
          return;
        }
        break;

      default:
        break;
      }
      if(this.is_open_agreement == 1) {
        if (this.is_agreement == false) {
          Toast("请同意申请协议");
          return;
        }
      }

      //提交数据
      let that = this;
      let json = {"data": JSON.stringify(this.assembleJson())};
      $http.get(isAgain ? "plugin.area-dividend.api.area-dividend.apply-again" : "plugin.area-dividend.api.area-dividend.set-agent-apply", json, '提交中').then(function (response) {
        if (response.result == 1) {
          Toast(response.msg);
          that.$router.go(-1);
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },

    //组装json
    assembleJson() {
      let json = {"real_name": this.name, "mobile": this.phone, "username": this.username, "password": this.password};
      if(this.merchantsCommissioner.turnOn===true){
        if(this.merchantsCommissioner['uid']){
          if(!this.merchantsCommissioner.member){
            Toast("招商专员不存在");
            return;
          }
          json['investor_uid']=this.merchantsCommissioner.uid;
        }
      }

      switch (this.selectLevel.tag) {
      case 0:
        json.province_id = this.proviceObject.id;
        break;
      case 1:
        json.province_id = this.proviceObject.id;
        json.city_id = this.cityObject.id;
        break;
      case 2:
        json.province_id = this.proviceObject.id;
        json.city_id = this.cityObject.id;
        json.district_id = this.regionObject.id;
        break;
      case 3:
        json.province_id = this.proviceObject.id;
        json.city_id = this.cityObject.id;
        json.district_id = this.regionObject.id;
        json.street_id = this.districtObject.id;
        break;

      default:
        break;
      }

      return json;
    },


    //弹窗显示省 市 区数据

    selConfirm(value) {

      this.selectLevel = "";

      this.selshow = false;

      this.selectLevel = value;

      console.log(this.selectLevel);


      switch (this.selectLevel.tag) {
      case 0:
        this.prozoneshow = true;
        this.cityzoneshow = false;
        this.regzoneshow = false;
        this.strshow = false;
        break;
      case 1:
        this.prozoneshow = true;
        this.cityzoneshow = true;
        this.regzoneshow = false;
        this.strshow = false;
        break;
      case 2:
        this.prozoneshow = true;
        this.cityzoneshow = true;
        this.regzoneshow = true;
        this.strshow = false;
        break;
      case 3:
        this.prozoneshow = true;
        this.cityzoneshow = true;
        this.regzoneshow = true;
        this.strshow = false;
        break;
      default:
        break;
      }
    },

    showCity() {
      if (this.fun.isTextEmpty(this.provicevalue)) {
        Toast("请选择省级区域");
        return;
      }

      this.cityshow = true;
    },

    showReg() {
      if (this.fun.isTextEmpty(this.provicevalue)) {
        Toast("请选择省级区域");
        return;
      }

      if (this.fun.isTextEmpty(this.cityvalue)) {
        Toast("请选择市级区域");
        return;
      }

      this.regshow = true;
    },


    showStr() {
      if (this.fun.isTextEmpty(this.provicevalue)) {
        Toast("请选择省级区域");
        return;
      }

      if (this.fun.isTextEmpty(this.cityvalue)) {
        Toast("请选择市级区域");
        return;
      }


      if (this.fun.isTextEmpty(this.regionvalue)) {
        Toast("请选择区/县级区域");
        return;
      }

      this.streetshow = true;
    },


    //判断是否开启街道
    isStreetShow(value) {
      if (this.selectLevel.tag != 3) {
        return;
      }
      $http.get('member.memberAddress.street', {district_id: value}).then(response => {
        console.log(response);
        if (response.result == 1) {

          if (!this.fun.isTextEmpty(response.data) && response.data.length > 0) {
            this.stroptions = response.data;
            this.strshow = true;
          } else {
            this.strshow = false;
            Toast("暂无街道数据");
            return;

          }
        } else {
          this.strshow = false;
          Toast("尚未开启街道");
        }

      }).catch(error => {
        console.log(error);
      });
    },


    selectStrionHandle(value) {
      this.districtObject = value;

      this.streetvalue = value.areaname;

      this.streetshow = false;
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
      this.plugin_title = mailLanguage.area_dividend.title; //自定义区域代理字段
    }
  }


};