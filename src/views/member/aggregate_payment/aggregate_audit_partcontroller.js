import cTitle from 'components/title';
export default {
  data() {
    return {
      subquotient:'',
      legalpersonName:'',
      idNumber:'',
      handset:'',
      cardNumber:'',
      networktype:'',
      auditRemarks:'',
      btnStatusText:'',
      protocolBtnshow:false,
      bankCardbtnshow:false,
      reapplyBtnshow:false,
      //入网申请状态
      mer_type:'',
      show2:false,
      beizhushow:false,
      //协议内容
      protocol_content:''
    };
  },
  methods:
        {
          getAccessDetails:function () {
            $http.get("plugin.yop-pay.api.merchant.chooseFront", {}).then(response => {
              if (response.result == 1) {
                let requestData=response.data.request;
                let mark=response.data.mark;
                this.subquotient=requestData.merchantNo;
                this.legalpersonName=requestData.legalName;
                this.idNumber=requestData.legalIdCard;
                this.handset=requestData.merLegalPhone;
                this.cardNumber=requestData.cardNo;
                this.mer_type=requestData.mer_type;
                if(requestData.mer_type==1){
                  this.protocolBtnshow=false;
                  this.networktype='企业 ';
                }else if(requestData.mer_type==2){
                  this.protocolBtnshow=true;
                  this.networktype='个体商户 ';
                }else if(requestData.mer_type==3){
                  this.protocolBtnshow=true;
                  this.networktype='个人 ';
                }
                this.auditRemarks =requestData.remark;
                this.btnStatusText=requestData.status_name;
                if(mark==1){
                  this.reapplyBtnshow=false;
                  this.bankCardbtnshow=false;
                }else if(mark==2){
                  this.reapplyBtnshow=false;
                  this.bankCardbtnshow=true;
                }else if(mark==3){
                  this.protocolBtnshow=false;
                  this.beizhushow=true;
                  this.reapplyBtnshow=true;
                  this.bankCardbtnshow=false;
                }
              }else{
                this.$dialog.alert({message:response.msg});
                        
              }
            }).catch(error => {
              console.log(error);
            });
          },
          //数据初始化
          init:function () {
            this.subquotient='';
            this.legalpersonName='';
            this.idNumber=''; 
            this.handset=''; 
            this.cardNumber='';
            this.networktype='';
            this.auditRemarks='';
            this.btnStatusText='';
            this.protocolBtnshow=false;
            this.bankCardbtnshow=false; 
            this.reapplyBtnshow=false;
            //入网申请状态
            this.mer_type='';
            this.show2=false;
          },
          //重新申请
          reapplyBtn:function () {
            if(this.mer_type==1){
              this.$router.push(this.fun.getUrl('AggregateEntRegEdit', {}));
            }else if(this.mer_type==2){
              this.$router.push(this.fun.getUrl('AggregateMeRegEdit', {}));
            }else if(this.mer_type==3){
              this.$router.push(this.fun.getUrl('AggregateIndRegEdit', {}));
            }
          },
          //修改结算银行卡
          bankCardbtn:function () {
            this.$router.push(this.fun.getUrl('AggregateBankCardSet', {}));
          },
          //协议内容
          protocolBtn:function () {
            $http.get("plugin.yop-pay.api.merchant.agreementContent", {},'数据加载中').then(response => {
              if (response.result == 1) {
                let responseData=response.data;
                this.protocol_content=responseData;
              }else{
                this.$dialog.alert({message:response.msg});
                        
              }
            }).catch(error => {
              console.log(error);
            });
            this.show2=true;
          },
          //
          popClose(){
            this.show2=false;
          },
        },
  activated() {
    this.init();
    this.getAccessDetails();
  },
  components: { cTitle }
};