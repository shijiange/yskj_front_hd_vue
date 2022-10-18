import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      //商户全称
      merchant: "",
      //商户简称
      merAbbre: "",
      //证件类型
      radio1: "CORP_CODE",
      //证件号
      ertificateNmber: "",
      //法人名称
      judicialPerson: "",
      //法人身份证号
      personNumber: "",
      lePerstatusRegex: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
      //商户联系人
      merchantContact: "",
      //联系人手机号
      mobileNumber: "",
      phoneRegex: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
      //联系人邮箱
      corporateMailbox: "",
      boxRegex: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
      //商户分类弹出层
      comtenshow: false,
      comtentext: "请选择商户分类",
      //商户分类下框数据
      comtenIndex: [0, 0],
      comtData_1: [],
      comtData_2: [],
      comtOne: true,
      comtcolumns: [
        {
          values: [],
          className: "column1",
          defaultIndex: 0
        },
        {
          values: [],
          className: "column2",
          defaultIndex: 0
        }
      ],
      comtLoad: true,
      //商户id
      comtID_1: "",
      comtID_2: "",
      //提交接口商户数据
      sort_code_1: "",
      sort_code_2: "",
      //请选择城市数据处理
      cityshow: false,
      citytext: "请选择城市",
      //请选择城市数据处理
      cityIndex: [0, 0, 0],
      citycolumns: [
        {
          values: [],
          className: "citycolumn1",
          defaultIndex: 0
        },
        {
          values: [],
          className: "citycolumn2",
          defaultIndex: 0
        },
        {
          values: [],
          className: "citycolumn3",
          defaultIndex: 0
        }
      ],
      // 请求号参数
      requestNo: '',
      cityOne: true,
      cityData_1: [],
      cityData_2: [],
      cityData_3: [],
      //省市区id
      cityID_1: "",
      cityID_2: "",
      cityID_3: "",
      cityLoad: true,
      //详细地址
      detaAddress: "",
      //税务登记编号
      registNumber: "",
      //开户许可证编号
      accPermitNumber: "",
      //代码证
      codeEvidence: "",
      //代码证是否长期有效
      radio2: false,
      //代码证时间选择
      startTime: "选择证件类型为“营业执照，则必填”",
      dateshow_1: false,
      codeProofTime: "",
      //结算银行卡号
      cardNumber: "",
      //开户行
      bankDepositText: "请选择开户行",
      bankDepositshow: false,
      bankDepositOne: true,
      bankDepositData_1: [],
      //总行编码
      bankno: "",
      bankDepcolumns: [],
      bankDeploading: true,
      bankIndex: [0],
      //开户行省份
      bankprovinceText: "请选择开户行省份",
      bankprovinceShow: false,
      bankprovinceOne: true,
      bankprovinceData: [],
      //银行省份id
      bankprovinceId: "",
      bankprovinceIndex: [0],
      bankprovcolumns: [],
      bankprovloading: true,
      //开户行城市
      bankCityText: "请选择开户行城市",
      bankCityShow: false,
      bankCityOne: true,
      bankcityData: [],
      bankcityId: "",
      bankcitycolumns: [],
      bankcityloading: true,
      bankcityIndex: [0],
      //开户支行
      subbranchText: "请选择开户支行",
      subbranchShow: false,
      subbranchcolumns: [],
      subbranchloading: true,
      subbranchData: [],
      citybankno: "",
      subbranchIndex: [0],
      //上传图片
      uploadUrl: this.fun.getRealUrl("plugin.yop-pro.frontend.yop-apply.pic-upload", {}),
      imageUrl: "",
      imageUrlData: "",
      imageShowUrlData: "",
      imageUrl_1: "",
      imageUrlData_1: "",
      imageShowUrlData_1: "",
      imageUrl_2: "",
      imageUrlData_2: "",
      imageShowUrlData_2: "",
      imageUrl_3: "",
      imageUrlData_3: "",
      imageShowUrlData_3: "",
      imageUrl_4: "",
      imageUrlData_4: "",
      imageShowUrlData_4: "",
      imageUrl_5: "",
      imageUrlData_5: "",
      imageShowUrlData_5: "",
      imageUrl_6: "",
      imageUrlData_6: "",
      imageShowUrlData_6: "",
      imageUrl_7: "",
      imageUrlData_7: "",
      imageShowUrlData_7: "",
      // imageUrl_8: [],
      imageUrlData_8: [],
      imageShowUrlData_8: [],
      //营业执照是否显示
      business: true,
      individualBol: false
    };
  },
  methods: {
    //数据初始化
    init() {
      //商户全称
      this.merchant = "";
      //商户简称
      this.merAbbre = "";
      //证件类型
      this.radio1 = "CORP_CODE";
      //证件号
      this.ertificateNmber = "";
      //法人名称
      this.judicialPerson = "";
      //法人身份证号
      this.personNumber = "";
      //商户联系人
      this.merchantContact = "";
      //联系人手机号
      this.mobileNumber = "";
      //联系人邮箱
      this.corporateMailbox = "";
      //商户分类弹出层
      this.comtenshow = false;
      this.comtentext = "请选择商户分类";
      //商户分类下框数据
      this.comtenIndex = [0, 0];
      this.comtData_1 = [];
      this.comtData_2 = [];
      this.comtOne = true;
      this.comtcolumns = [
        {
          values: [],
          className: "column1",
          defaultIndex: 0
        },
        {
          values: [],
          className: "column2",
          defaultIndex: 0
        }
      ];
      this.comtLoad = true;
      //商户id
      this.comtID_1 = "";
      this.comtID_2 = "";
      //提交接口商户数据
      this.sort_code_1 = "";
      this.sort_code_2 = "";
      //请选择城市数据处理
      this.cityshow = false;
      this.citytext = "请选择城市";
      //请选择城市数据处理
      this.cityIndex = [0, 0, 0];
      this.citycolumns = [
        {
          values: [],
          className: "citycolumn1",
          defaultIndex: 0
        },
        {
          values: [],
          className: "citycolumn2",
          defaultIndex: 0
        },
        {
          values: [],
          className: "citycolumn3",
          defaultIndex: 0
        }
      ];
      this.cityOne = true;
      this.cityData_1 = [];
      this.cityData_2 = [];
      this.cityData_3 = [];
      //省市区id
      this.cityID_1 = "";
      this.cityID_2 = "";
      this.cityID_3 = "";
      this.cityLoad = true;
      //详细地址
      this.detaAddress = "";
      //税务登记编号
      this.registNumber = "";
      //开户许可证编号
      this.accPermitNumber = "";
      //代码证
      this.codeEvidence = "";
      //代码证是否长期有效
      this.radio2 = false;
      //代码证时间选择
      this.startTime = "选择证件类型为“营业执照，则必填”";
      this.dateshow_1 = false;
      this.codeProofTime = "";
      //结算银行卡号
      this.cardNumber = "";
      //开户行
      this.bankDepositText = "请选择开户行";
      this.bankDepositshow = false;
      this.bankDepositOne = true;
      this.bankDepositData_1 = [];
      //总行编码
      this.bankno = "";
      this.bankDepcolumns = [];
      this.bankDeploading = true;
      this.bankIndex = [0];
      //开户行省份
      this.bankprovinceText = "请选择开户行省份";
      this.bankprovinceShow = false;
      this.bankprovinceOne = true;
      this.bankprovinceData = [];
      //银行省份id
      this.bankprovinceId = "";
      this.bankprovinceIndex = [0];
      this.bankprovcolumns = [];
      this.bankprovloading = true;
      //开户行城市
      this.bankCityText = "请选择开户行城市";
      this.bankCityShow = false;
      this.bankCityOne = true;
      this.bankcityData = [];
      this.bankcityId = "";
      this.bankcitycolumns = [];
      this.bankcityloading = true;
      this.bankcityIndex = [0];
      //开户支行
      this.subbranchText = "请选择开户支行";
      this.subbranchShow = false;
      this.subbranchcolumns = [];
      this.subbranchloading = true;
      this.subbranchData = [];
      this.citybankno = "";
      this.subbranchIndex = [0];
      //上传图片
      this.imageUrl = "";
      this.imageUrlData = "";
      this.imageShowUrlData = "";
      this.imageUrl_1 = "";
      this.imageUrlData_1 = "";
      this.imageShowUrlData_1 = "";
      this.imageUrl_2 = "";
      this.imageUrlData_2 = "";
      this.imageShowUrlData_2 = "";
      this.imageUrl_3 = "";
      this.imageUrlData_3 = "";
      this.imageShowUrlData_3 = "";
      this.imageUrl_4 = "";
      this.imageUrlData_4 = "";
      this.imageShowUrlData_4 = "";
      this.imageUrl_5 = "";
      this.imageUrlData_5 = "";
      this.imageShowUrlData_5 = "";
      this.imageUrl_6 = "";
      this.imageUrlData_6 = "";
      this.imageShowUrlData_6 = "";
      this.imageUrl_7 = "";
      this.imageUrlData_7 = "";
      this.imageShowUrlData_7 = "";
      // this.imageUrl_8 = [];
      this.imageUrlData_8 = [];
      this.imageShowUrlData_8 = [];
      //营业执照是否显示
      this.business = true;
      //按钮重复提交静止
      this.individualBol = false;
    },
    //商户分类弹窗
    comtenshowbtn() {
      if (!this.comtOne) {
        this.comtenshow = true;
      }
    },
    getSecondary(id, picker, idex_2) {
      if (!id) {
        return false;
      }
      this.comtLoad = true;
      $http.post("plugin.yop-pro.frontend.yop-data.get-merchant-level", {
        yop_data_type: "two",
        parentid: id
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              merlevel_name: val.merlevel_name,
              id: val.id,
              sort_code: val.sort_code
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.merlevel_name;
          });
          this.comtData_2 = columnsData;
          if (idex_2) {
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.sort_code == idex_2) {
                That.comtcolumns[1].values = columnsData_1;
                That.comtcolumns[1].defaultIndex = index;
                That.comtenIndex[1] = index;
                That.comtID_2 = val.id;
              }
            });
            this.comtentext = this.comtData_1[this.comtenIndex[0]].merlevel_name + "/" + this.comtData_2[this.comtenIndex[1]].merlevel_name;

          } else {
            if (picker) {
              picker.setColumnValues(1, columnsData_1);
            } else {
              this.comtcolumns[1].values = columnsData_1;
            }
          }

          this.comtLoad = false;
        } else {
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getprimary(idex, idex_2) {
      $http.post("plugin.yop-pro.frontend.yop-data.get-merchant-level", {
        yop_data_type: "one"
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              merlevel_name: val.merlevel_name,
              id: val.id,
              sort_code: val.sort_code
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.merlevel_name;
          });
          this.comtData_1 = columnsData;
          if (idex) {
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.sort_code == idex) {
                That.comtcolumns[0].values = columnsData_1;
                That.comtcolumns[0].defaultIndex = index;
                That.comtenIndex[0] = index;
                That.comtID_1 = val.id;
                That.getSecondary(val.id, "", idex_2);
              }
            });
          } else {
            this.comtcolumns[0].values = columnsData_1;
            if (columnsData.length > 0) {
              let oneid = columnsData[0].id;
              this.getSecondary(oneid);
            }
          }
          this.comtOne = false;
        } else {
          this.$dialog.alert({message:response.msg});
        
        }
      }).catch(error => {
        console.log(error);
      });
    },
    comtlistbtn(picker, values, index) {
      var indexArray = picker.getIndexes();
      if (index == 0 && this.comtData_1.length > 0) {
        let indexid = this.comtData_1[indexArray[0]].id;
        this.getSecondary(indexid, picker);
        indexArray.splice(1, 1, 0);
      }
      this.comtenIndex = indexArray;
    },
    comtconbtn(e) {
      this.comtentext = e.join("/");
      this.comtenshow = false;
      if (this.comtData_1.length > 0) {
        this.comtID_1 = this.comtData_1[this.comtenIndex[0]].id;
        this.sort_code_1 = this.comtData_1[this.comtenIndex[0]].sort_code;
      }
      if (this.comtData_2.length > 0) {
        this.comtID_2 = this.comtData_2[this.comtenIndex[1]].id;
        this.sort_code_2 = this.comtData_2[this.comtenIndex[1]].sort_code;
      }
    },
    comtcancelbtn(e) {
      this.comtenshow = false;
    },
    //城市选择
    getprovince(idex, idex_2, idex_3) {
      $http.post("plugin.yop-pro.frontend.yop-data.get-address", {
        yop_data_type: "province"
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              area_name: val.area_name,
              id: val.id
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.area_name;
          });
          this.cityData_1 = columnsData;
          if (idex) {
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.id == idex) {
                That.citycolumns[0].values = columnsData_1;
                That.citycolumns[0].defaultIndex = index;
                That.cityIndex[0] = index;
                That.getcityList(val.id, "", idex_2, idex_3);
              }
            });
          } else {
            this.citycolumns[0].values = columnsData_1;
            if (columnsData.length > 0) {
              let oneid = columnsData[0].id;
              this.getcityList(oneid);
            }
          }

          this.cityOne = false;
        } else {
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },
    cityshowbtn() {
      if (!this.cityOne) {
        this.cityshow = true;
      }
    },
    getcityList(id, picker, idex_2, idex_3) {
      if (!id) {
        return false;
      }
      this.cityLoad = true;
      $http.post("plugin.yop-pro.frontend.yop-data.get-address", {
        yop_data_type: "city",
        parentid: id
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              area_name: val.area_name,
              id: val.id
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.area_name;
          });
          this.cityData_2 = columnsData;
          if (idex_2) {
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.id == idex_2) {
                That.citycolumns[1].values = columnsData_1;
                That.citycolumns[1].defaultIndex = index;
                That.cityIndex[1] = index;
                That.getdistrict(val.id, "", idex_3);
              }
            });
          } else {
            if (picker) {
              picker.setColumnValues(1, columnsData_1);
              if (columnsData.length > 0) {
                let oneid = columnsData[0].id;
                this.getdistrict(oneid, picker);
              }
            } else {
              this.citycolumns[1].values = columnsData_1;
              if (columnsData.length > 0) {
                let oneid = columnsData[0].id;
                this.getdistrict(oneid);
              }
            }
          }


        } else {
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getdistrict(id, picker, idex_3) {
      if (!id) {
        return false;
      }
      this.cityLoad = true;
      $http.post("plugin.yop-pro.frontend.yop-data.get-address", {
        yop_data_type: "district",
        parentid: id
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              area_name: val.area_name,
              id: val.id
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.area_name;
          });
          this.cityData_3 = columnsData;
          if (idex_3) {
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.id == idex_3) {
                That.citycolumns[2].values = columnsData_1;
                That.citycolumns[2].defaultIndex = index;
                That.cityIndex[2] = index;
              }
            });
            this.citytext = this.cityData_1[this.cityIndex[0]].area_name + "/" + this.cityData_2[this.cityIndex[1]].area_name + "/" + this.cityData_3[this.cityIndex[2]].area_name;
          } else {
            if (picker) {
              picker.setColumnValues(2, columnsData_1);
            } else {
              this.citycolumns[2].values = columnsData_1;
            }
          }
          this.cityLoad = false;
        } else {
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },
    citylistbtn(picker, values, index) {
      var indexArray = picker.getIndexes();
      if (index == 0 && this.cityData_1.length > 0) {
        let indexid = this.cityData_1[indexArray[0]].id;
        this.getcityList(indexid, picker);
        indexArray.splice(1, 1, 0);
        indexArray.splice(2, 1, 0);
      }
      if (index == 1 && this.cityData_2.length > 0) {
        let indexid_2 = this.cityData_2[indexArray[1]].id;
        this.getdistrict(indexid_2, picker);
        indexArray.splice(2, 1, 0);
      }
      this.cityIndex = indexArray;
    },
    cityconbtn(e) {
      this.citytext = e.join("/");
      this.cityshow = false;
      if (this.cityData_1.length > 0) {
        this.cityID_1 = this.cityData_1[this.cityIndex[0]].id;
      }
      if (this.cityData_2.length > 0) {
        this.cityID_2 = this.cityData_2[this.cityIndex[1]].id;
      }
      if (this.cityData_3.length > 0) {
        this.cityID_3 = this.cityData_3[this.cityIndex[2]].id;
      }
    },
    citycancelbtn(e) {
      this.comtenshow = false;
    },
    //代码证时间选择
    seleStartTime() {
      this.dateshow_1 = true;
    },
    //时间戳转日期
    format(shijianchuo) {
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    },
    confirmbtn(val) {
      this.dateshow_1 = false;
      var time = new Date(val).getTime();
      var timeData = this.format(time);
      this.startTime = timeData;
      this.codeProofTime = timeData;
    },
    cancelbtn() {
      this.dateshow_1 = false;
    },
    //开户行选择
    bankDepositBtn() {
      if (!this.bankDepositOne) {
        this.bankDepositshow = true;
      }
    },
    getbankDeposit(idex) {
      $http.get("plugin.yop-pro.frontend.yop-data.get-bank", {}).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              bank_name: val.bank_name,
              bank_no: val.bank_no
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.bank_name;
          });
          this.bankDepositData_1 = columnsData;
          this.bankDepcolumns = columnsData_1;
          if (idex) {
            // let banklist_sele = this.$refs.banklist_sele;
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.bank_no == idex) {
                // banklist_sele.setIndexes([index]);
                That.bankIndex[0] = index;
                That.bankDepositText = That.bankDepositData_1[That.bankIndex[0]].bank_name;
              }
            });
          }
          this.bankDepositOne = false;
          this.bankDeploading = false;
        } else {
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },
    bankconbtn(e) {
      this.bankDepositText = e;
      this.bankno = this.bankDepositData_1[this.bankIndex[0]].bank_no;
      this.subbranchText = "请选择开户支行";
      this.citybankno = "";
      this.subbranchIndex = [0];
      this.subbranchData = [];
      if (this.bankno && this.bankprovinceId && this.bankcityId) {
        this.getsubbranch(this.bankno, this.bankprovinceId, this.bankcityId);
      }
      this.bankDepositshow = false;
    },
    bankcancelbtn(e) {
      this.bankDepositshow = false;
    },
    banklistbtn(picker, values, index) {
      var indexArray = picker.getIndexes();
      this.bankIndex = indexArray;
    },
    //开户行省份选择
    bankprovinceBtn() {
      if (!this.bankprovinceOne) {
        this.bankprovinceShow = true;
      }
    },
    getbankprovince(idex, idex2) {
      $http.post("plugin.yop-pro.frontend.yop-data.get-address", {
        yop_data_type: "province"
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              area_name: val.area_name,
              id: val.id
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.area_name;
          });
          this.bankprovinceData = columnsData;
          this.bankprovcolumns = columnsData_1;
          if (idex) {
            // let bankprovince = this.$refs.bankprovince_sele;
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.id == idex) {
                // bankprovince.setIndexes([index]);
                That.bankprovinceIndex[0] = index;
                That.bankprovinceText = That.bankprovinceData[That.bankprovinceIndex[0]].area_name;
              }
            });
            this.getbankCity(idex, idex2);
          }
          this.bankprovinceOne = false;
          this.bankprovloading = false;
        } else {
          this.$dialog.alert({message:response.msg});
         
        }
      }).catch(error => {
        console.log(error);
      });
    },
    bankprovinceconbtn(e) {
      var cityid = "";
      this.bankprovinceText = e;
      this.bankprovinceId = this.bankprovinceData[this.bankprovinceIndex[0]].id;
      this.bankCityText = "请选择开户行城市";
      this.bankcityId = "";
      this.bankcityIndex = [0];
      if (this.bankprovinceData.length > 0) {
        cityid = this.bankprovinceData[this.bankprovinceIndex[0]].id;
        this.getbankCity(cityid);
      }
      this.subbranchText = "请选择开户支行";
      this.citybankno = "";
      this.subbranchIndex = [0];
      this.subbranchData = [];
      this.bankprovinceShow = false;
    },
    bankprovincecancelbtn(e) {
      this.bankprovinceShow = false;
    },
    bankprovincelistbtn(picker, values, index) {
      var indexArray = picker.getIndexes();
      this.bankprovinceIndex = indexArray;
    },
    //开户行城市选择
    bankCityBtn() {
      if (!this.bankprovinceId) {
        Toast("请选择开户行省份");
        return false;
      }
      this.bankCityShow = true;
    },
    getbankCity(id, idex2) {
      if (!id) {
        return false;
      }
      this.bankcityloading = true;
      $http.post("plugin.yop-pro.frontend.yop-data.get-address", {
        yop_data_type: "city",
        parentid: id
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              area_name: val.area_name,
              id: val.id
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.area_name;
          });
          this.bankcityData = columnsData;
          this.bankcitycolumns = columnsData_1;
          if (idex2) {
            // let bankCity = this.$refs.bankCity_sele;
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.id == idex2) {
                // bankCity.setIndexes([index]);
                That.bankcityIndex[0] = index;
                That.bankCityText = That.bankcityData[That.bankcityIndex[0]].area_name;
              }
            });
          }
          this.bankcityloading = false;
        } else {
          this.$dialog.alert({message:response.msg});
         
        }
      }).catch(error => {
        console.log(error);
      });
    },
    bankCitybtn(e) {
      this.bankCityText = e;
      this.bankcityId = this.bankcityData[this.bankcityIndex[0]].id;
      this.subbranchText = "请选择开户支行";
      this.citybankno = "";
      this.subbranchIndex = [0];
      this.subbranchData = [];
      if (this.bankno && this.bankprovinceId && this.bankcityId) {
        this.getsubbranch(this.bankno, this.bankprovinceId, this.bankcityId);
      }
      this.bankCityShow = false;
    },
    bankCitycancelbtn(e) {
      this.bankCityShow = false;
    },
    bankCitylistbtn(picker, values, index) {
      var indexArray = picker.getIndexes();
      this.bankcityIndex = indexArray;
    },
    // 开户支行
    subbranchBtn() {
      if (!this.bankno) {
        Toast("请选择开户行");
        return false;
      }
      if (!this.bankprovinceId) {
        Toast("请选择开户行省份");
        return false;
      }
      if (!this.bankcityId) {
        Toast("请选择开户行城市");
        return false;
      }
      if (this.subbranchcolumns.length <= 0) {
        Toast("该银行支行信息不存在");
        return false;
      }
      this.subbranchShow = true;
    },
    getsubbranch(bankno, bankprovinceId, bankcityId, idex) {
      $http.post("plugin.yop-pro.frontend.yop-data.get-bank-code", {
        headBankCode: bankno,
        bankProvince: bankprovinceId,
        bankCity: bankcityId
      }).then(response => {
        if (response.result == 1) {
          var responseData = response.data.branchBankInfo;
          var columnsData = [];
          var columnsData_1 = [];
          columnsData = responseData.map(function(val, data) {
            return {
              name: val.name,
              code: val.code
            };
          });
          columnsData_1 = columnsData.map(function(val, data) {
            return val.name;
          });
          this.subbranchData = columnsData;
          this.subbranchcolumns = columnsData_1;
          if (idex) {
            // let subbranch = this.$refs.subbranch_sele;
            let That = this;
            columnsData.forEach(function(val, index) {
              if (val.code == idex) {
                // subbranch.setIndexes([index]);
                That.subbranchIndex[0] = index;
                That.subbranchText = That.subbranchData[That.subbranchIndex[0]].name;
              }
            });
          }
          if (responseData.length == 0) {
            Toast("该银行在所属城市没有相关开户支行,请更换其他开户行");
          }
          this.subbranchloading = false;
        } else {
          this.$dialog.alert({message:response.msg});
          
        }
      }).catch(error => {
        console.log(error);
      });
    },
    subbranchbtn(e) {
      this.subbranchText = e;
      this.citybankno = this.subbranchData[this.subbranchIndex[0]].code;
      this.subbranchShow = false;
    },
    subbranchcancelbtn(e) {
      this.subbranchShow = false;
    },
    subbranchlistbtn(picker, values, index) {
      var indexArray = picker.getIndexes();
      this.subbranchIndex = indexArray;
    },
    //上传图片
    onfrontRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl = URL.createObjectURL(e.file);
          That.imageUrlData = responseData.data.thumb;
          That.imageShowUrlData = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    reverseRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_1 = URL.createObjectURL(e.file);
          That.imageUrlData_1 = responseData.data.thumb;
          That.imageShowUrlData_1 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    licenceeRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_2 = URL.createObjectURL(e.file);
          That.imageUrlData_2 = responseData.data.thumb;
          That.imageShowUrlData_2 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    certificateRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_3 = URL.createObjectURL(e.file);
          That.imageUrlData_3 = responseData.data.thumb;
          That.imageShowUrlData_3 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    frameworkRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_4 = URL.createObjectURL(e.file);
          That.imageUrlData_4 = responseData.data.thumb;
          That.imageShowUrlData_4 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    applicationRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_5 = URL.createObjectURL(e.file);
          That.imageUrlData_5 = responseData.data.thumb;
          That.imageShowUrlData_5 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    accountRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_6 = URL.createObjectURL(e.file);
          That.imageUrlData_6 = responseData.data.thumb;
          That.imageShowUrlData_6 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    peopleRead(e) {
      let fd = new FormData();
      fd.append("file", e.file);//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.uploadUrl, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
        var responseData = response.data;
        if (responseData.result == 1) {
          That.imageUrl_7 = URL.createObjectURL(e.file);
          That.imageUrlData_7 = responseData.data.thumb;
          That.imageShowUrlData_7 = responseData.data.local_thumb;
        } else {
          Toast(responseData.msg);
        }
        // this.img.push(res.data.imgpath);
      }).catch(error => {
        console.log(error);
      });
    },
    removeImg_1(delIndex) {
      // this.imageUrl_8.splice(delIndex, 1);
      this.imageUrlData_8.splice(delIndex, 1);
      this.imageShowUrlData_8.splice(delIndex, 1);
    },
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        if (parseInt(this.imageShowUrlData_8.length + e.length) > 5) {
          this.$dialog.alert({message:"其他资质最多上传5张"});
          
          return;
        }
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag);
        }
      } else {
        if (this.imageShowUrlData_8.length > 5) {
          this.$dialog.alert({message:"其他资质最多上传5张"});
          return;
        }
        this.onRead_1(e, flag);
      }
    },
    onRead_1(e) {
      var That = this;
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();
      fd.append("file", e.file);
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            // That.imageUrl_8.push({ url: URL.createObjectURL(e.file) });
            That.imageUrlData_8.push(responseData.data.thumb);
            That.imageShowUrlData_8.push(responseData.data.local_thumb);
            Toast.clear();
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    //提交
    individual() {
      if (this.individualBol) {
        return false;
      }
      var That = this;
      if (!this.merchant) {
        Toast("请填写商户全称");
        return false;
      }
      if (!this.merAbbre) {
        Toast("请填写商户简称");
        return false;
      }
      if (!this.ertificateNmber) {
        Toast("请填写证件号");
        return false;
      }
      if (!this.judicialPerson) {
        Toast("请填写法人名称");
        return false;
      }
      if (!this.personNumber) {
        Toast("请填写法人身份证号");
        return false;
      } else if (!this.lePerstatusRegex.test(this.personNumber)) {
        Toast("请输入正确的法人身份证号");
        return false;
      }
      if (!this.merchantContact) {
        Toast("请填写商户联系人");
        return false;
      }
      if (!this.mobileNumber) {
        Toast("请填写联系人手机号码");
        return false;
      } else if (!this.phoneRegex.test(this.mobileNumber)) {
        Toast("请输入正确的手机号");
        return false;
      }
      if (!this.corporateMailbox) {
        Toast("请输入邮箱");
        return false;
      } else if (!this.boxRegex.test(this.corporateMailbox)) {
        Toast("请输入正确的邮箱");
        return false;
      }
      if (!this.sort_code_1) {
        Toast("请选择商户分类");
        return false;
      }
      if (!this.cityID_1) {
        Toast("请选择城市");
        return false;
      }
      if (!this.detaAddress) {
        Toast("请填写详细地址");
        return false;
      }
      if (this.radio1 == "CORP_CODE" && !this.registNumber) {
        Toast("请填写税务登记编号");
        return false;
      }
      if (!this.accPermitNumber) {
        Toast("请填写开户许可证编号");
        return false;
      }
      if (this.radio1 == "CORP_CODE" && !this.codeEvidence) {
        Toast("请填写代码证");
        return false;
      }
      if (this.radio1 == "CORP_CODE" && (!this.radio2 && !this.codeProofTime)) {
        Toast("请选择代码证有效期");
        return false;
      }
      if (!this.cardNumber) {
        Toast("请填写结算银行账号或银行卡号");
        return false;
      }
      if (!this.bankno) {
        Toast("请选择开户行");
        return false;
      }
      if (!this.bankprovinceId) {
        Toast("请选择开户行省份");
        return false;
      }
      if (!this.bankcityId) {
        Toast("请选择开户行城市");
        return false;
      }
      if (!this.citybankno) {
        Toast("请选择开户支行");
        return false;
      }
      if (!this.imageUrlData) {
        Toast("请上传法人传身份证正面");
        return false;
      }
      if (!this.imageUrlData_1) {
        Toast("请上传法人上传身份证反面");
        return false;
      }
      if (this.radio1 == "CORP_CODE" && !this.imageUrlData_2) {
        Toast("请上传营业执照");
        return false;
      }
      if (!this.imageUrlData_3) {
        Toast("请上传税务登记证");
        return false;
      }
      if (!this.imageUrlData_4) {
        Toast("请上传组织机构代码证");
        return false;
      }
      if (this.radio1 == "UNI_CREDIT_CODE" && !this.imageUrlData_5) {
        Toast("请上传统一社会应用代码证");
        return false;
      }
      if (!this.imageUrlData_6) {
        Toast("请上传银行开户许可证");
        return false;
      }
      if (!this.imageUrlData_7) {
        Toast("请上传法人手持营业执照及身份证");
        return false;
      }

      let url = "";
      this.$route.query.from === "apply" ? url = "plugin.yop-pro.frontend.yop-apply.create" : url = "plugin.yop-pro.frontend.yop-apply.reapply";
      let data = {
        type: 1,
        merShortName: this.merAbbre,
        legalName: this.judicialPerson,
        legalIdCard: this.personNumber,
        merLevel1No: this.sort_code_1,
        merLevel2No: this.sort_code_2,
        merProvince: this.cityID_1,
        merCity: this.cityID_2,
        merDistrict: this.cityID_3,
        merAddress: this.detaAddress,
        cardNo: this.cardNumber,
        headBankCode: this.bankno,
        bankProvince: this.bankprovinceId,
        bankCity: this.bankcityId,
        bankCode: this.citybankno,
        merFullName: this.merchant,
        merCertNo: this.ertificateNmber,
        merCertType: this.radio1,
        merContactName: this.merchantContact,
        merContactPhone: this.mobileNumber,
        merContactEmail: this.corporateMailbox,
        taxRegistCert: this.registNumber,
        accountLicense: this.accPermitNumber,
        orgCode: this.codeEvidence,
        isOrgCodeLong: this.radio2,
        orgCodeExpiry: this.codeProofTime,
        fileInfo: {
          "IDCARD_FRONT": this.imageUrlData,
          "IDCARD_BACK": this.imageUrlData_1,
          "CORP_CODE": this.imageUrlData_2,
          "UNI_CREDIT_CODE": this.imageUrlData_5,
          "TAX_CODE": this.imageUrlData_3,
          "ORG_CODE": this.imageUrlData_4,
          "OP_BANK_CODE": this.imageUrlData_6,
          "HAND_IDCARD": this.imageUrlData_7,
          "OTHER": this.imageUrlData_8
        },
        localFile: {
          "IDCARD_FRONT": this.imageShowUrlData,
          "IDCARD_BACK": this.imageShowUrlData_1,
          "CORP_CODE": this.imageShowUrlData_2,
          "UNI_CREDIT_CODE": this.imageShowUrlData_5,
          "TAX_CODE": this.imageShowUrlData_3,
          "ORG_CODE": this.imageShowUrlData_4,
          "OP_BANK_CODE": this.imageShowUrlData_6,
          "HAND_IDCARD": this.imageShowUrlData_7,
          "OTHER": this.imageShowUrlData_8
        }
      };

      if(this.$route.query.from !== "apply") {
        data.requestNo = this.requestNo;
      }

      this.individualBol = true;
      $http.post(url, {
        data: data
      }, "提交中").then(response => {
        if (response.result == 1) {
          That.$router.push(That.fun.getUrl("info", {}));
        } else {
          That.$dialog.alert({message:response.msg});
        }
        That.individualBol = false;
      }).catch(error => {
        console.log(error);
        That.individualBol = false;
      });
    },
    //证件选择
    documentSelection(c) {
      if (c == "CORP_CODE") {
        this.business = true;
        this.imageUrl_5 = "";
        this.imageUrlData_5 = "";
      } else {
        this.business = false;
        this.imageUrl_2 = "";
        this.imageUrlData_2 = "";
      }
    },
    //写入企业申请数据
    getApplicationdata() {
      $http.get("plugin.yop-pro.frontend.yop-apply.get-merchant", {}).then(response => {
        if (response.result == 1) {
          if(response.data.requestNo) {
            this.requestNo = response.data.requestNo;
          }
          let responseData = response.data.request_parameter;
          this.merchant = responseData.merFullName;
          this.merAbbre = responseData.merShortName;
          this.radio1 = responseData.merCertType;
          this.ertificateNmber = responseData.merCertNo;
          this.judicialPerson = responseData.legalName;
          this.personNumber = responseData.legalIdCard;
          this.merchantContact = responseData.merContactName;
          this.mobileNumber = responseData.merContactPhone;
          this.corporateMailbox = responseData.merContactEmail;
          this.sort_code_1 = responseData.merLevel1No;
          this.sort_code_2 = responseData.merLevel2No;
          this.setClassification(responseData.merLevel1No, responseData.merLevel2No);
          this.cityID_1 = responseData.merProvince;
          this.cityID_2 = responseData.merCity;
          this.cityID_3 = responseData.merDistrict;
          this.setselecity(responseData.merProvince, responseData.merCity, responseData.merDistrict);
          this.detaAddress = responseData.merAddress;
          this.registNumber = responseData.taxRegistCert;
          this.accPermitNumber = responseData.accountLicense;
          this.codeEvidence = responseData.orgCode;
          this.radio2 = responseData.isOrgCodeLong;
          this.codeProofTime = responseData.orgCodeExpiry;
          this.startTime = responseData.orgCodeExpiry;
          this.cardNumber = responseData.cardNo;
          this.bankno = responseData.headBankCode;
          this.setMasterline(responseData.headBankCode);
          this.bankprovinceId = responseData.bankProvince;
          this.bankcityId = responseData.bankCity;
          this.citybankno = responseData.bankCode;
          this.depositProvince(responseData.bankProvince, responseData.bankCity);
          this.setsubbranch(responseData.headBankCode, responseData.bankProvince, responseData.bankCity, responseData.bankCode);
          if(responseData.localFile) {
            this.imageUrl = responseData.localFile.IDCARD_FRONT;
            this.imageShowUrlData = responseData.localFile.IDCARD_FRONT;
            this.imageUrl_1 = responseData.localFile.IDCARD_BACK;
            this.imageShowUrlData_1 = responseData.localFile.IDCARD_BACK;
            this.imageUrl_2 = responseData.localFile.CORP_CODE;
            this.imageShowUrlData_2 = responseData.localFile.CORP_CODE;
            this.imageUrl_3 = responseData.localFile.TAX_CODE;
            this.imageShowUrlData_3 = responseData.localFile.TAX_CODE;
            this.imageUrl_4 = responseData.localFile.ORG_CODE;
            this.imageShowUrlData_4 = responseData.localFile.ORG_CODE;
            this.imageUrl_5 = responseData.localFile.UNI_CREDIT_CODE;
            this.imageShowUrlData_5 = responseData.localFile.UNI_CREDIT_CODE;
            this.imageUrl_6 = responseData.localFile.OP_BANK_CODE;
            this.imageShowUrlData_6 = responseData.localFile.OP_BANK_CODE;
            this.imageUrl_7 = responseData.localFile.HAND_IDCARD;
            this.imageShowUrlData_7 = responseData.localFile.HAND_IDCARD;
            // this.imageUrl_8 = responseData.localFile.OTHER;
            if(responseData.localFile.OTHER) {
              this.imageShowUrlData_8 = responseData.localFile.OTHER;
            }
          }
          if(responseData.fileInfo) {
            this.imageUrlData = responseData.fileInfo.IDCARD_FRONT;
            this.imageUrlData_1 = responseData.fileInfo.IDCARD_BACK;
            this.imageUrlData_2 = responseData.fileInfo.CORP_CODE;
            this.imageUrlData_3 = responseData.fileInfo.TAX_CODE;
            this.imageUrlData_4 = responseData.fileInfo.ORG_CODE;
            this.imageUrlData_5 = responseData.fileInfo.UNI_CREDIT_CODE;
            this.imageUrlData_6 = responseData.fileInfo.OP_BANK_CODE;
            this.imageUrlData_7 = responseData.fileInfo.HAND_IDCARD;
            if(responseData.fileInfo.OTHER) {
              this.imageUrlData_8 = responseData.fileInfo.OTHER;
            }
          }

        } else {
          this.$dialog.alert({message:response.msg});
         
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //设置分类
    setClassification(idex, idex_2) {
      this.getprimary(idex, idex_2);
    },
    //设置城市
    setselecity(idex, idex_2, idex_3) {
      this.getprovince(idex, idex_2, idex_3);
    },
    //设置总行
    setMasterline(idex) {
      this.getbankDeposit(idex);
    },
    //设置开户行省份
    depositProvince(idex, idex_2) {
      this.getbankprovince(idex, idex_2);
    },
    //设置支行
    setsubbranch(bankno, bankprovinceId, bankcityId, idex) {
      this.getsubbranch(bankno, bankprovinceId, bankcityId, idex);
    },
  },
  activated() {
    this.init();
    this.getprimary();
    this.getprovince();
    this.getbankDeposit();
    this.getbankprovince();
    if (this.$route.query.from !== "apply") {
      this.getApplicationdata();
    }
  },
  components: { cTitle }
};
