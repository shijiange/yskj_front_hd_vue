import cTitle from 'components/title';
import { Toast } from 'vant';
// import fun from "../../../fun";
export default {
  data() {
    return {
      //结算银行卡号
      cardNumber:'',
      //开户行
      bankDepositText:'请选择开户行',
      bankDepositshow:false,
      bankDepositOne:true,
      bankDepositData_1:[],
      //总行编码
      bankno:'',
      bankDepcolumns: [],
      bankDeploading:true,
      bankIndex:[0],
      //开户行省份
      bankprovinceText:'请选择开户行省份',
      bankprovinceShow:false,
      bankprovinceOne:true,
      bankprovinceData:[],
      //银行省份id
      bankprovinceId:'',
      bankprovinceIndex:[0],
      bankprovcolumns: [],
      bankprovloading:true,
      //开户行城市
      bankCityText:'请选择开户行城市',
      bankCityShow:false,
      bankCityOne:true,
      bankcityData:[],
      bankcityId:'',
      bankcitycolumns:[],
      bankcityloading:true,
      bankcityIndex:[0],
      //开户支行
      subbranchText:'请选择开户支行',
      subbranchShow:false,
      subbranchcolumns:[],
      subbranchloading:true,
      subbranchData:[],
      citybankno:'',
      subbranchIndex:[0],
      //手机号
      // cellhoneNumberP:'',
      //验证码
      identifyingCode:'',
      //验证码倒计时
      start1: false,
      btnBg:'#ffb400',
      btnText:'获取短信验证码',
      btnTag:false,
      timer: null,
      count:'',
    };
  },
  methods:
        {
          //数据初始化
          init:function () {
            //结算银行卡号
            this.cardNumber='';
            //开户行
            this.bankDepositText='请选择开户行';
            this.bankDepositshow=false;
            this.bankDepositOne=true;
            this.bankDepositData_1=[];
            //总行编码
            this.bankno='';
            this.bankDepcolumns= [];
            this.bankDeploading=true;
            this.bankIndex=[0];
            //开户行省份
            this.bankprovinceText='请选择开户行省份';
            this.bankprovinceShow=false;
            this.bankprovinceOne=true;
            this.bankprovinceData=[];
            //银行省份id
            this.bankprovinceId='';
            this.bankprovinceIndex=[0];
            this.bankprovcolumns= [];
            this.bankprovloading=true;
            //开户行城市
            this.bankCityText='请选择开户行城市';
            this.bankCityShow=false;
            this.bankCityOne=true;
            this.bankcityData=[];
            this.bankcityId='';
            this.bankcitycolumns=[];
            this.bankcityloading=true;
            this.bankcityIndex=[0];
            //开户支行
            this.subbranchText='请选择开户支行';
            this.subbranchShow=false;
            this.subbranchcolumns=[];
            this.subbranchloading=true;
            this.subbranchData=[];
            this.citybankno='';
            this.subbranchIndex=[0];
            //手机号
            // this.cellhoneNumberP='';
            //验证码
            this.identifyingCode='';
            //验证码倒计时
            this.start1= false;
          },
          //开户行选择
          bankDepositBtn:function () {
            if(!this.bankDepositOne){
              this.bankDepositshow=true;
            }
          },
          getbankDeposit:function (idex) {
            $http.get("plugin.yop-pay.api.yop-helper.get-bank",{}, ).then(response => {
              if (response.result == 1) {
                var responseData=response.data;
                var columnsData=[];
                var columnsData_1=[];
                columnsData=responseData.map(function (val,data) {
                  return {
                    bank_name:val.bank_name,
                    bank_no:val.bank_no
                  };
                });
                columnsData_1=columnsData.map(function (val,data) {
                  return val.bank_name;
                });
                this.bankDepositData_1=columnsData;
                this.bankDepcolumns=columnsData_1;
                if(idex){
                  let banklist_sele=this.$refs.banklist_sele;
                  let That=this;
                  columnsData.forEach(function (val,index) {
                    if(val.bank_no==idex){
                      banklist_sele.setIndexes([index]);
                      That.bankIndex[0]=index;
                      That.bankDepositText=That.bankDepositData_1[That.bankIndex[0]].bank_name;
                    }
                  });
                }
                this.bankDepositOne=false;
                this.bankDeploading=false;
              }else{
                this.$dialog.alert({message:response.msg});
                       
              }
            }).catch(error => {
              console.log(error);
            });
          },
          bankconbtn:function (e) {
            this.bankDepositText=e;
            this.bankno=this.bankDepositData_1[this.bankIndex[0]].bank_no;
            this.subbranchText='请选择开户支行';
            this.citybankno='';
            this.subbranchIndex=[0];
            this.subbranchData=[];
            if(this.bankno&&this.bankprovinceId&&this.bankcityId){
              this.getsubbranch(this.bankno,this.bankprovinceId,this.bankcityId);
            }
            this.bankDepositshow=false;
          },
          bankcancelbtn:function (e) {
            this.bankDepositshow=false;
          },
          banklistbtn:function (picker, values,index) {
            var  indexArray=picker.getIndexes();
            this.bankIndex=indexArray;
          },
          //开户行省份选择
          bankprovinceBtn:function () {
            if(!this.bankprovinceOne){
              this.bankprovinceShow=true;
            }
          },
          getbankprovince:function (idex,idex2) {
            $http.post("plugin.yop-pay.api.yop-helper.getAddress", {
              yop_helper_type:'province'
            }, ).then(response => {
              if (response.result == 1) {
                var responseData=response.data;
                var columnsData=[];
                var columnsData_1=[];
                columnsData=responseData.map(function (val,data) {
                  return {
                    area_name:val.area_name,
                    id:val.id
                  };
                });
                columnsData_1=columnsData.map(function (val,data) {
                  return val.area_name;
                });
                this.bankprovinceData=columnsData;
                this.bankprovcolumns=columnsData_1;
                if(idex){
                  let bankprovince=this.$refs.bankprovince_sele;
                  let That=this;
                  columnsData.forEach(function (val,index) {
                    if(val.id==idex){
                      bankprovince.setIndexes([index]);
                      That.bankprovinceIndex[0]=index;
                      That.bankprovinceText=That.bankprovinceData[That.bankprovinceIndex[0]].area_name;
                    }
                  });
                  this.getbankCity(idex,idex2);
                }
                this.bankprovinceOne=false;
                this.bankprovloading=false;
              }else{
                this.$dialog.alert({message:response.msg});
                        
              }
            }).catch(error => {
              console.log(error);
            });
          },
          bankprovinceconbtn:function (e) {
            var cityid='';
            this.bankprovinceText=e;
            this.bankprovinceId=this.bankprovinceData[this.bankprovinceIndex[0]].id;
            this.bankCityText='请选择开户行城市';
            this.bankcityId='';
            this.bankcityIndex=[0];
            if(this.bankprovinceData.length>0){
              cityid=this.bankprovinceData[this.bankprovinceIndex[0]].id;
              this.getbankCity(cityid);
            }
            this.subbranchText='请选择开户支行';
            this.citybankno='';
            this.subbranchIndex=[0];
            this.subbranchData=[];
            this.bankprovinceShow=false;
          },
          bankprovincecancelbtn:function (e) {
            this.bankprovinceShow=false;
          },
          bankprovincelistbtn:function (picker, values,index) {
            var  indexArray=picker.getIndexes();
            this.bankprovinceIndex=indexArray;
          },
          //开户行城市选择
          bankCityBtn:function () {
            if(!this.bankprovinceId){
              Toast("请选择开户行省份");
              return false;
            }
            this.bankCityShow=true;
          },
          getbankCity:function (id,idex2) {
            if(!id){
              return false;
            }
            this.bankcityloading=true;
            $http.post("plugin.yop-pay.api.yop-helper.getAddress", {
              yop_helper_type:'city',
              parentid:id,
            }, ).then(response => {
              if (response.result == 1) {
                var responseData=response.data;
                var columnsData=[];
                var columnsData_1=[];
                columnsData=responseData.map(function (val,data) {
                  return {
                    area_name:val.area_name,
                    id:val.id
                  };
                });
                columnsData_1=columnsData.map(function (val,data) {
                  return val.area_name;
                });
                this.bankcityData=columnsData;
                this.bankcitycolumns=columnsData_1;
                if(idex2){
                  let bankCity=this.$refs.bankCity_sele;
                  let That=this;
                  columnsData.forEach(function (val,index) {
                    if(val.id==idex2){
                      bankCity.setIndexes([index]);
                      That.bankcityIndex[0]=index;
                      That.bankCityText=That.bankcityData[That.bankcityIndex[0]].area_name;
                    }
                  });
                }
                this.bankcityloading=false;
              }else{
                this.$dialog.alert({message:response.msg});
                       
              }
            }).catch(error => {
              console.log(error);
            });
          },
          bankCitybtn:function (e) {
            this.bankCityText=e;
            this.bankcityId=this.bankcityData[this.bankcityIndex[0]].id;
            this.subbranchText='请选择开户支行';
            this.citybankno='';
            this.subbranchIndex=[0];
            this.subbranchData=[];
            if(this.bankno&&this.bankprovinceId&&this.bankcityId){
              this.getsubbranch(this.bankno,this.bankprovinceId,this.bankcityId);
            }
            this.bankCityShow=false;
          },
          bankCitycancelbtn:function (e) {
            this.bankCityShow=false;
          },
          bankCitylistbtn:function (picker, values,index) {
            var  indexArray=picker.getIndexes();
            this.bankcityIndex=indexArray;
          },
          // 开户支行
          subbranchBtn:function () {
            if(!this.bankno){
              Toast("请选择开户行");
              return false;
            }
            if(!this.bankprovinceId){
              Toast("请选择开户行省份");
              return false;
            }
            if(!this.bankcityId){
              Toast("请选择开户行城市");
              return false;
            }
            if(this.subbranchcolumns.length<=0){
              Toast("该银行支行信息不存在");
              return false;
            }
            this.subbranchShow=true;
          },
          getsubbranch:function (bankno,bankprovinceId,bankcityId,idex) {
            $http.post("plugin.yop-pay.api.yop-helper.getBankCode",{
              headBankCode:bankno,
              bankProvince:bankprovinceId,
              bankCity:bankcityId
            }, ).then(response => {
              if (response.result == 1) {
                console.log(response);
                var responseData=response.data.branchBankInfo;
                var columnsData=[];
                var columnsData_1=[];
                columnsData=responseData.map(function (val,data) {
                  return {
                    name:val.name,
                    code:val.code
                  };
                });
                columnsData_1=columnsData.map(function (val,data) {
                  return val.name;
                });
                this.subbranchData=columnsData;
                this.subbranchcolumns=columnsData_1;
                if(idex){
                  let subbranch=this.$refs.subbranch_sele;
                  let That=this;
                  columnsData.forEach(function (val,index) {
                    if(val.code==idex){
                      subbranch.setIndexes([index]);
                      That.subbranchIndex[0]=index;
                      That.subbranchText=That.subbranchData[That.subbranchIndex[0]].name;
                    }
                  });
                }
                if(responseData.length==0){
                  Toast("该银行在所属城市没有相关开户支行,请更换其他开户行");
                }
                this.subbranchloading=false;
              }else{
                this.$dialog.alert({message:response.msg});
                       
              }
            }).catch(error => {
              console.log(error);
            });
          },
          subbranchbtn:function (e) {
            this.subbranchText=e;
            this.citybankno=this.subbranchData[this.subbranchIndex[0]].code;
            this.subbranchShow=false;
          },
          subbranchcancelbtn:function (e) {
            this.subbranchShow=false;
          },
          subbranchlistbtn:function (picker, values,index) {
            var  indexArray=picker.getIndexes();
            this.subbranchIndex=indexArray;
          },
          //确认修改
          confirmBtn:function () {
            var That=this;
            if(!this.cardNumber){
              Toast('请填写结算银行账号或银行卡号');
              return false;
            }
            if(!this.bankno){
              Toast('请选择开户行');
              return false;
            }
            if(!this.bankprovinceId){
              Toast('请选择开户行省份');
              return false;
            }
            if(!this.bankcityId){
              Toast('请选择开户行城市');
              return false;
            }
            if(!this.citybankno){
              Toast('请选择开户支行');
              return false;
            }
            if(!this.identifyingCode){
              Toast('请填写验证码');
              return false;
            }
            $http.post("plugin.yop-pay.api.merchant.settleUpd", {
              data:{
                bankcardNo:this.cardNumber,
                headBankCode:this.bankno,
                bankProvince: this.bankprovinceId,
                bankCity: this.bankcityId,
                bankCode:this.citybankno,
                authorizenum:this.identifyingCode
              },
            }, ).then(response => {
              if (response.result == 1) {
                Toast('修改成功');
                That.$router.push(That.fun.getUrl('info', {}));
              }else{
                That.$dialog.alert({message:response.msg});
                       
              }
            }).catch(error => {
              console.log(error);
            });
          },
          //入网详情
          detailsBtn:function () {
            this.$router.push(this.fun.getUrl('AggregateAuditPart', {}));
          },
          //发送验证码
          verificationCode() {
            Toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: '发送中',
            });
            //发送获取验证码的请求
            let that=this;
            $http.get('plugin.yop-pay.api.yop-helper.getVali', {}).then((response) => {
              console.log(response);
              Toast.clear();
              if (response.result == 1) {
                that.sendCodeAnimation();
              } else {
                that.$dialog.alert({message:response.msg});
                       
              }
            }, (response) => {
              console.log(error);
            });

          },
          //发送验证码 倒计时
          sendCodeAnimation() {
            const TIME_COUNT = 60;
            if (!this.timer) {
              this.count = TIME_COUNT;
              Toast.success('验证码已发送');
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                  this.btnText = this.count + "s后重新获取";
                  this.btnTag = true;
                  this.btnBg = '#999';
                } else {
                  this.btnTag = false;
                  this.btnBg = '#ef4f4f',
                  this.btnText = "获取短信验证码";
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          },

        },
  activated() {
    this.init();
    this.getbankDeposit();
    this.getbankprovince();
  },
  components: { cTitle }
};
