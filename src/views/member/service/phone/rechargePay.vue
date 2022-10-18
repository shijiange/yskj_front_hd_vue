<template>
    <div id="rechargePay">

        <c-title :hide="false" text='手机充值'></c-title>
		
        <div class="content">
            <div class="account">
                <p><span class="one">账户余额</span> <span class="two">0.00</span> </p>
                <p><span class="one">支付金额</span> <span class="two">93.00</span> </p>
            </div>
            <div style="height: 0.625rem;"></div>
            <div class="payment">
                <p>请选择支付方式</p>
                <ul class="payStyle">
                    <li class="item" @click="payStyle">
                        <img src="../../../../assets/images/balance.png">
                        <div>
                            <b>余额支付</b> <span></span>
                        </div>
                    </li>
                    <li class="item" @click="payStyle">
                        <img src="../../../../assets/images/weChat.png">
                        <div>
                            <b>微信支付</b> <span class="active"></span>
                        </div>
                    </li>
                    <li class="item" @click="payStyle">
                        <img src="../../../../assets/images/Alipay.png">
                        <div>
                            <b>支付宝支付</b> <span></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import cTitle from 'components/title';

export default{
  components: { cTitle },
  data(){
    return{


    };
  },
  methods:{
    payStyle(e){
      var lis=document.getElementById("rechargePay").getElementsByClassName("item");
      for(var i=0;i<lis.length;i++){
        lis[i].lastElementChild.lastElementChild.className="";
      }
      e.currentTarget.lastElementChild.lastElementChild.className="active";
    },

  },
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  #rechargePay {
    .content {
      margin-top: 0.625rem;

      .account {
        background: #fff;

        p {
          height: 2.75rem;
          line-height: 2.75rem;
          color: #333;
          font-size: 16px;
          margin-left: 0.875rem;
          padding-right: 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          .one { float: left; }
          .two { float: right; }
        }

        p:last-child {
          border: none;
        }
      }

      .payment {
        background: #fff;
        padding: 0 0 0 0.8125rem;

        p {
          height: 2.8125rem;
          line-height: 2.8125rem;
          font-size: 16px;
          color: #505050;
          text-align: left;
        }
        .payChose { text-align: right; padding-right: 0.9375rem; }

        .payStyle {
          .item:last-child {
            div { border-bottom: 0; }
          }

          .item {
            width: 100%;
            display: flex;
            flex-flow: row;
            height: 3.375rem;
            line-height: 3.375rem;
            font-size: 16px;

            img {
              width: 2rem;
              height: 2rem;
              margin-top: 0.4375rem;
            }

            div {
              flex: 1;
              margin-left: 0.625rem;
              line-height: 3.125rem;
              border-bottom: 0.0625rem solid #ebebeb;
              padding-right: 0.8125rem;
              b { font-weight: normal; float: left; }

              span {
                width: 1.25rem;
                height: 1.25rem;
                line-height: 1.25rem;
                text-align: center;
                display: inline-block;
                border: 0.0625rem solid #aaa;
                border-radius: 50%;
                margin-top: 1.0625rem;
                float: right;
              }

              .active {
                border: 0.0625rem solid #f15353;
                background: url(../../../../assets/images/mark-a.png) no-repeat 0.25rem 0.3125rem;
                background-position: center;
              }
            }
          }
        }
      }
    }
  }

</style>
