<template>
  <div>
    <div class="invoice" v-if="overseas" @click="showOverseas">
      <span style="min-width:30px;display: inline-block">发票</span>
      <div style="position: absolute;right:0">
        <span class="type" style="min-width:30px; text-align: right;">海外购商品暂不支持开国内发票<i class="iconfont icon-fontclass-gantanhao" style="font-size: 12px;position: inherit;"></i></span>
      </div>
    </div>
    <div class="invoice" v-else  @click="showInvoice = true">
      <span style="min-width:30px;">发票</span>
      <span class="type" v-if="invoicename">
        <em class="font">{{ invoicename }}</em>（{{ companyname }}—{{ invoice_list.call }}）
      </span>
      <i class="fa fa-angle-right"></i>
    </div>

    <van-popup v-model="showInvoice" position="bottom" :style="{ height: '80%' }" class="pc_popup">
      <div class="popup_box">
        <h1>发票<i class="iconfont icon-close11" @click="showInvoice = false"></i></h1>
        <p @click="showInvoiceNotice = true">
          <span>发票须知</span>
          <i  class="iconfont icon-tishi1"></i>
        </p>
        <div class="type_box" style="margin-top:0" >
          <h2>发票类型</h2>
            <div class="type">
              <button class="cur">电子普通发票</button>
            </div>
        </div>
        <div class="type_box">
          <h2>发票抬头</h2>
          <div class="type">
            <button type="button" :class="{ cur: invoice_list.invoice_status === 1 }" @click="invoice_title(1)">
              个人
            </button>
            <button type="button" :class="{ cur: invoice_list.invoice_status === 0 }" @click="invoice_title(0)">
              单位
            </button>
          </div>
          <div class="input_box" v-if="invoice_list.invoice_status === 1">
            <van-field placeholder="请输入发票抬头" v-model="invoice_list.call" class="inp-info" :border="false" />

          </div>
          <div class="input_box" v-if="invoice_list.invoice_status === 0">
            <van-field placeholder="请填写单位名称" v-model="invoice_list.call" class="inp-info" :border="false" />
            <van-field placeholder="请添加纳税人识别号" v-model="invoice_list.company_number" class="inp-info" :border="false" />

          </div>
        </div>
        <div class="type_box" >
          <h2>收票人手机号</h2>
          <div class="input_box">
            <van-field placeholder="请输入收票人手机号" type="tel" v-model="invoice_list.phone" class="inp-info" :border="false" />
          </div>
        </div>
        <div class="type_box" style="margin-top:0" >
          <h2>发票内容</h2>
          <div class="type">
            <button class="cur">商品明细</button>
          </div>
          <p  class="invoice_explain">发票内容将显示详细商品名称与价格信息，发票金额为实际支付金额，不含虚拟资产、优惠等扣减金额。</p>
        </div>
        <div class="btn">
          <button type="button" @click="subInvoice">确定</button>
        </div>
      </div>

    </van-popup>
      <!--发票须知 -->
    <van-dialog v-model="showInvoiceNotice"  class="invoicenotice_dialog">
      <p class="invoicenotice_tit">第一章 概述</p>
      <p>1.1目的及依据</P>
      <p>为促进平等、开放、透明的平台生态的搭建，保障益生康健云平台消费者索要发票的合法权益，维护益生康健云平台正常运营秩序，根据《中华人民共和国电子商务法》等相关规定，特制定本规范。
      </P>
      <p>1.2适用范围
      </P>
      <p>本规范适用于益生康健云平台。</p>

      <p class="invoicenotice_tit">第二章 发票申请时限</p>
      <p>2.1若消费者通过“申请开票”流程申请开票，最迟需在交易完成后的90天内发起申请，逾期未申请，发票申请入口将关闭，关闭后消费者的发票需求可与商家协商解决；</p>
      <p> 2.2云平台承诺或双方另行约定发票期限的将不受发票受理时限限制。
      </P>

      <p class="invoicenotice_tit">第三章 发票管理规范</p>
      <p>3.1根据《中华人民共和国电子商务法》第十四条规定，电子商务经营者销售商品或者提供服务应当依法出具纸质发票或者电子发票等购货凭证或者服务单据。电子发票与纸质发票具有同等法律效力。</p>
      <p>3.2云平台开具发票时应按照消费者实际支付的货款金额，并根据消费者该笔订单的实际商品名称填写发票内容（抬头、金额、数量等）进行开具，不得开具统称、不得开具与实际购买商品信息不符的发票，如有疑问可以联系消费者进行确认，避免后期产生不必要的纠纷。</p>
      <p>3.3若云平台在页面承诺或与消费者就开票时间另行约定的，云平台应在页面承诺时间/约定时间内将发票寄出。</p>
      <p>3.4 若消费者通过商品下单环节在线申请发票，云平台需在交易完成(交易完成，是指订单状态显示“交易完成”, 云平台在使用第三方物流的情况下，物流显示已签收即视为交易完成，下同)后的10天内完成开票（针对提供电子发票的商家需在交易完成后的10天内完成线上回传，针对提供纸质发票的商家需在交易完成后的10天内寄出纸质发票并线上填写发票信息及发货单号，商家寄出发票的时间以商家录入快递单号的时间为准）。</p>
      <p>3.5若在交易完成之后在线申请发票，消费者需点击订单上的“申请发票”功能，商家需在申请之日起交易完成后的48小时内完成电子发票线上回传。</p>
      <p>3.6开具电子普通发票的客户在办理退货时，无需退回电子普通发票。如客户申请整单退货，则将原增值税普通发票（电子）做冲红处理（原增值税普通发票（电子）显示无效），如申请部分退货，原增值税普通发票（电子）会通过系统自动冲红（原增值税普通发票（电子）显示无效），并对未发生退货的商品重新开具增值税普通发票（电子）。</p>

    </van-dialog>
  </div>
</template>

<script>
export default {
  props: {
    invoiceData: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    overseas: Object
  },
  data() {
    return {
      showInvoice: false,
      invoicename: '',
      companyname: '',
      showInvoiceNotice:false,
      invoice_list: {//展示的数据
        call: "",
        company_number: "",
        invoice_type: 0,
        invoice_status: 1,  //单位： 0    个人：1
        phone:"",
        invoice_content:"商品明细"
      },
      invoice_list_send:{//传递的数据
        call: "",
        company_number: "",
        invoice_type: 0,
        invoice_status: 1,  //单位： 0    个人：1
        phone:"",
        invoice_content:"商品明细"
      }
    };
  },
  mounted() {
    this.initDownload_history(1);
  },
  methods: {
    showOverseas(){
      this.$dialog.alert({
        title:'说明',
        message:'根据国家跨境监管政策规定，跨境海外商品无法开具国内发票。'
      });
    },
    invoice_title(str) {
      this.invoice_list.invoice_status = str;
      // 清空填写
      this.invoice_list.call = "";
      this.invoice_list.company_number = "";
      this.invoice_list.phone = "";
      let rise_type = 1;
      if( str == 0 ){
        rise_type = 0;
      }
      this.initDownload_history(rise_type);
      //this.$emit('subInvoice', this.invoice_list);
    },
    clearInput(ele){
      this.invoicename =  "" ;
      ele.invoice_type = 0;
      ele.invoice_status = 1;
      ele.call = "";
      ele.company_number = "";
      ele.phone = "";
    },
    subInvoice() {
      var that = this;
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      var callTrim = that.invoice_list.call;
      if (that.fun.isTextEmpty(callTrim.trim())) {
        that.$dialog.alert({ message: "请填写抬头" });
        that.invoicename = "" ;
        that.invoice_list_send.invoice_type = 0;
        that.invoice_list_send.invoice_status = 1;
        that.invoice_list_send.call = "";
        that.invoice_list_send.company_number = "";
        that.invoice_list_send.phone = "";
        return;
      }else{

          if(callTrim.trim().length <2 || callTrim.trim().length >50){
            that.$dialog.alert({ message: "发票抬头长度需要在2-50字之间！" });
            that.invoicename = "" ;
            that.invoice_list_send.invoice_type = 0;
            that.invoice_list_send.invoice_status = 1;
            that.invoice_list_send.call = "";
            that.invoice_list_send.company_number = "";
            that.invoice_list_send.phone = "";
            return;
          }
      }

      if (that.invoice_list.invoice_status == 0) {
        if(that.fun.isTextEmpty(that.invoice_list.company_number)){
          that.$dialog.alert({ message: "请添加纳税人识别号" });
          that.invoicename = "" ;
          that.invoice_list_send.invoice_type = 0;
          that.invoice_list_send.invoice_status = 1;
          that.invoice_list_send.call = "";
          that.invoice_list_send.company_number = "";
          that.invoice_list_send.phone = "";
         return;
        }else{
          //alert('纳税人识别号不为空');
          $http
                .get(
                  "order.invoicetitle.invoicetitlepost",
                  {
                    keyword: that.invoice_list.call
                  },
                  "加载中.."
                )
                .then(res => {
                    if (res.msg.data.length == 0) {
                      that.$dialog.alert({ message: "纳税人识别号和单位不符" });
                        that.invoicename = "" ;
                        that.invoice_list_send.invoice_type = 0;
                        that.invoice_list_send.invoice_status = 1;
                        that.invoice_list_send.call = "";
                        that.invoice_list_send.company_number = "";
                        that.invoice_list_send.phone = "";
                      return;
                    }else{
                      let call_list = res.msg.data;
                      let  flag = 0;
                      let  flag_no =0;
                      for(let i=0;i<call_list.length;i++){
                        if(call_list[i].customername == that.invoice_list.call){
                          flag = 1;
                          flag_no = i;
                        }
                      }
                      let company_number_trim = that.invoice_list.company_number;
                      //先判断flag=1时返回的数据里有用户填写的公司名称
                      if(flag == 1){
                            if(call_list[flag_no].customertaxno == company_number_trim.trim()){
                              if (!that.fun.isTextEmpty(that.invoice_list.phone)) {
                               if (!reg.test(that.invoice_list.phone)) {
                                that.$dialog.alert({ message: "手机号格式不正确" });
                                 that.invoicename = "" ;
                                  that.invoice_list_send.invoice_type = 0;
                                  that.invoice_list_send.invoice_status = 1;
                                  that.invoice_list_send.call = "";
                                  that.invoice_list_send.company_number = "";
                                  that.invoice_list_send.phone = "";
                                return;
                               }
                              }

                                  that.invoicename =  "电子" ;
                                  that.companyname = that.invoice_list.invoice_status === 1 ? "个人" : "单位";
                                  //提交后台并关闭弹框层

                                  that.invoice_list_send.call = that.invoice_list.call;
                                  that.invoice_list_send.company_number = that.invoice_list.company_number;
                                  that.invoice_list_send.invoice_type = that.invoice_list.invoice_type;
                                  that.invoice_list_send.invoice_status = that.invoice_list.invoice_status;
                                  that.invoice_list_send.phone = that.invoice_list.phone;
                                  that.invoice_list_send.invoice_content = that.invoice_list.invoice_content;

                                  that.$emit('subInvoice', that.invoice_list_send);
                                  that.showInvoice = false;
                          }else{
                            that.$dialog.alert({ message: "纳税人识别号和单位不符" });

                            that.invoicename = "" ;
                            that.invoice_list_send.invoice_type = 0;
                            that.invoice_list_send.invoice_status = 1;
                            that.invoice_list_send.call = "";
                            that.invoice_list_send.company_number = "";
                            that.invoice_list_send.phone = "";
                            return;
                          }


                      }else{//返回的公司名称里没有客户填写的名称
                            that.$dialog.alert({ message: "纳税人识别号和单位不符" });
                             that.invoicename = "" ;
                            that.invoice_list_send.invoice_type = 0;
                            that.invoice_list_send.invoice_status = 1;
                            that.invoice_list_send.call = "";
                            that.invoice_list_send.company_number = "";
                            that.invoice_list_send.phone = "";
                            return;
                      }
                    }
                });
        }

      }else{
           if (!that.fun.isTextEmpty(that.invoice_list.phone)) {
                             if (!reg.test(that.invoice_list.phone)) {
                              that.$dialog.alert({ message: "手机号格式不正确" });
                               that.invoicename = "" ;
                              that.invoice_list_send.invoice_type = 0;
                              that.invoice_list_send.invoice_status = 1;
                              that.invoice_list_send.call = "";
                              that.invoice_list_send.company_number = "";
                              that.invoice_list_send.phone = "";
                              return;
                            }
           }
         // 页面回显
                                that.invoicename =  "电子" ;
                                that.companyname = that.invoice_list.invoice_status === 1 ? "个人" : "单位";
                                //提交后台并关闭弹框层
                                that.invoice_list_send.call = that.invoice_list.call;
                                  that.invoice_list_send.company_number = that.invoice_list.company_number;
                                  that.invoice_list_send.invoice_type = that.invoice_list.invoice_type;
                                  that.invoice_list_send.invoice_status = that.invoice_list.invoice_status;
                                  that.invoice_list_send.phone = that.invoice_list.phone;
                                  that.invoice_list_send.invoice_content = that.invoice_list.invoice_content;
                                that.$emit('subInvoice', that.invoice_list_send);
                                that.showInvoice = false;
      }


    },
    initDownload_history(rise_type_1){
      //历史记录
       $http
        .get(
          "order.invoicetitle.getinvoicetitleone",
          {
            rise_type: rise_type_1
          },
          "加载中.."
        )
        .then(res => {
            if (res.data.invoice !=='' || res.data.invoice !== []) {
                 if(rise_type_1 == 0){
                    this.invoice_list.company_number = res.data.invoice.company_number;
                 }

                 this.invoice_list.call = res.data.invoice.call;
                 this.invoice_list.phone = res.data.invoice.phone;
            }
        });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .invoice {
    background: #fff;
    margin-top: 0.625rem;
    height: 2.8125rem;
    line-height: 2.8125rem;
    font-size: 15px;
    display: flex;
    padding: 0 0.875rem;
    border-top: solid 0.0625rem #ebebeb;
    border-bottom: solid 0.0625rem #ebebeb;
    position: relative;
    overflow:hidden;

    span {
      margin-right: 1.25rem;

      .font {
        color: #f15353;
      }
    }

    .type {
      font-size: 12px;
      color: #8c8c8c;
    }

    i {
      position: absolute;
      right: 0.875rem;
      font-size: 24px;
      color: #c9c9c9;
      line-height: 2.8125rem;
    }
  }

  .popup_box {
    background: #fff;
    min-height: 33.375rem;

    padding-bottom: 4.375rem;

    h1 {
      width: 100%;
      background: #fff;
      font-size: 18px;
      height: 3.125rem;
      line-height: 3.125rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.875rem;

      i {
        font-size: 1rem;
        color: #c9c9c9;
      }
    }

    p {
      padding: 0.375rem 0.875rem;
      background: rgb(240, 249, 255);
      border-top: solid 0.0625rem #91d5ff;
      border-bottom: solid 0.0625rem #91d5ff;
      font-size: 14px;
      text-align: left;
      color: #8c8c8c;
      display: flex;

      i {
        font-size: 1.125rem;
        color: #91d5ff;
        margin-right: 0.25rem;
      }
    }

    .type_box {
      margin-top: 0.625rem;

      h2 {
        font-size: 15px;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: left;
        padding: 0 0.875rem;
      }

      .type {
        display: flex;
        padding: 0 0.875rem;

        button {
          background: #fff;
          border: solid 0.0625rem #ebebeb;
          font-size: 0.875rem;
          width: 6rem;
          height: 1.75rem;
          border-radius: 1rem;
          margin-right: 1.25rem;
          color: #666;
        }

        .cur {
          background: #f15353;
          color: #fff;
          border: none;
        }

      }

      .input_box {
        margin-top: 1.25rem;
        padding: 0 0.875rem;

        /deep/input {
          padding: 0 0.625rem;
          width: 100%;
          height: 2.25rem;
          background: #f5f5f5;
          border-radius: 1rem;
          margin-bottom: 0.75rem;
        }
      }
       .invoice_explain{
          padding:0.375rem 0.875rem;
          color:#8c8c8c;
        }
    }

    .btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 0.625rem 0.875rem;
      background: #fff;

      button {
        width: 100%;
        height: 2.625rem;
        border-radius: 2rem;
        background: #f15353;
        color: #fff;
        font-size: 18px;
        border: none;
      }
    }
  }

  .inp-info {
    padding: 0;

    /deep/input {
      padding: 0 0.625rem;
      width: 100%;
      height: 2.25rem;
      background: #f5f5f5;
      border-radius: 1rem;
      color: #333;
    }

    /deep/input::placeholder {
      color: #555;
    }
  }
  .pc_popup  .popup_box  p{
    background:none;
    border:0;
    display:block;
    padding-top:0;
  }
  .invoicenotice_dialog{
    padding:0.375rem;
    text-align:left;
    height:70%;
    max-height:70%;
    overflow-y: auto;


    p{
      text-indent:2em;
    }
    .invoicenotice_tit{
      font-weight:700;
      text-indent:0em;
    }
  }

</style>
