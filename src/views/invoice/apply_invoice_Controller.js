import { Toast } from 'vant';
export default {
  data() {
    return {
      showInvoice: false,
      showInvoiceNotice:false,  
      invoice_list: {
        call: "",
        company_number: "",        
        invoice_type: 0,
        invoice_status: 1,
        phone:"",
        invoice_content:"商品明细"
      }
    };
  },
  activated() {
    this.initDownload();
    this.initDownload_history(1);
  },
  methods: {   
    invoice_title(str) {
      this.invoice_list.invoice_status = str;
      // 清空填写
      this.invoice_list.call = "";
      this.invoice_list.company_number = "";
      this.invoice_list.phone = "";
     // this.$emit('subInvoice', this.invoice_list);
     let rise_type = 1;
      if( str == 0 ){
        rise_type = 0;
      }
       this.initDownload_history(rise_type);
    },
    subInvoice() {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      var callTrim = this.invoice_list.call;
      if (this.fun.isTextEmpty(callTrim.trim())) {
        this.$dialog.alert({ message: "请填写抬头" });
        return;
      }else{
        //alert(callTrim.trim().length );
        if(callTrim.trim().length <2 || callTrim.trim().length >50){
            this.$dialog.alert({ message: "发票抬头长度需要在2-50字之间！" });            
            return;
          }
      }
      

      if (this.invoice_list.invoice_status == 0) {
        if(this.fun.isTextEmpty(this.invoice_list.company_number)){
         this.$dialog.alert({ message: "请添加纳税人识别号" });
         return;
        }else{
           //alert('纳税人识别号不为空');
          $http
                .get(
                  "order.invoicetitle.invoicetitlepost",
                  {
                    keyword: this.invoice_list.call
                  },
                  "加载中.."
                )
                .then(res => {
                    if (res.msg.data.length == 0) {
                      this.$dialog.alert({ message: "纳税人识别号和单位不符" });
                      return;
                    }else{
                      let call_list = res.msg.data;
                      let  flag = 0;
                      let  flag_no =0;
                      for(let i=0;i<call_list.length;i++){
                        if(call_list[i].customername == this.invoice_list.call){
                          flag = 1;
                          flag_no = i;
                        }  
                      }  
                      let  company_number_trim= this.invoice_list.company_number;
                      //先判断flag=1时返回的数据里有用户填写的公司名称
                      if(flag == 1){
                            if(call_list[flag_no].customertaxno == company_number_trim.trim()){
                              if (!this.fun.isTextEmpty(this.invoice_list.phone)) {
                               if (!reg.test(this.invoice_list.phone)) {
                                this.$dialog.alert({ message: "手机号格式不正确" });
                                return;
                               }
                              }
                            
                                  $http.post(
                                            "order.rise.sendInvoice",
                                            {
                                              order_id: this.$route.params.order_id,
                                              invoice_list:this.invoice_list
                                            },
                                            "加载中.."
                                          )
                                        .then(res => {
                                          if (res.result === 1) {
                                             this.$dialog.alert({
                                              message: '提交成功！',
                                            }).then(() => {
                                              this.$router.go(-1);//返回上一层
                                            });
                                          }else{
                                            this.$dialog.alert({message:res.msg});
                                          }
                                        })
                                        .catch(err => {
                                          console.log(err);
                                        });
                          }else{
                            this.$dialog.alert({ message: "纳税人识别号和单位不符" });
                            return;
                          }


                      }else{//返回的公司名称里没有客户填写的名称
                            this.$dialog.alert({ message: "纳税人识别号和单位不符" });
                            return;
                      }
                    }
                });
        }

      }else{

          if(this.invoice_list.phone !== '') {                 
            if (!reg.test(this.invoice_list.phone)) {
               this.$dialog.alert({ message: "手机号格式不正确" });
               return;
            }
          }
           $http.post(
                   "order.rise.sendInvoice",
                    {
                      order_id: this.$route.params.order_id,
                      invoice_list:this.invoice_list
                    },
                    "加载中.."
               )
               .then(res => {
                  if (res.result === 1) {
                      this.$dialog.alert({
                       message: '提交成功！',
                      }).then(() => {
                        this.$router.go(-1);//返回上一层
                      });
                  }else{
                      this.$dialog.alert({message:res.msg});
                  }
               })
               .catch(err => {
                  console.log(err);
                });
      }
            
    },
    initDownload(){
      $http
        .get(
          "order.orderinvoice.getorder",
          {
            order_id: this.$route.params.order_id
          },
          "加载中.."
        )
        .then(res => {
            //console.log('res.data.isinvoice:'+ res.data.isinvoice);
            if (res.data.isinvoice === 0) {
            //如果订单签收超过30天，提示不能开发票
              this.$dialog.alert({
                message: res.data.msg,
              }).then(() => {
                this.$router.go(-1);//返回上一层
              }); 
          }
        });
    },
     initDownload_history(rise_type){
      //历史记录
       $http
        .get(
          "order.invoicetitle.getinvoicetitleone",
          {
            rise_type: rise_type
          },
          "加载中.."
        )
        .then(res => {
            if (res.data.invoice !=='' || res.data.invoice !== []) {
                 if(rise_type == 0){
                    this.invoice_list.company_number = res.data.invoice.company_number;
                 }

                 this.invoice_list.call = res.data.invoice.call;
                 this.invoice_list.phone = res.data.invoice.phone;
            }
        });
    }


  }
};