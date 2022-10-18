<template>
    <div id="orderDetailsPaied">
        <c-title :hide="false" text='订单详情'></c-title>
        <div class="main">
            <div class="title">
                <p>订单号：{{data.numId}}</p>
                <span>{{data.status}}</span>
            </div>
            <div class="top normal">
                <ul>
                    <li>游戏名称<span>{{data.productName}}</span></li>
                    <li>游戏帐号<span>{{data.phoneNum}}</span></li>
                    <li>游戏分区(一级)<span>{{data.place}}</span></li>
                    <li>游戏分区(二级)<span>{{data.place}}</span></li>
                    <li>充值面额<span>{{data.denomination}}元</span></li>
                    <li>数量<span>{{data.denomination}}元</span></li>
                    <li>充值状态<span>{{data.states}}元</span></li>
                </ul>
            </div>
            <div class="middle normal">
                <ul>
                    <li>手机号码<span>{{data.denomination}}元</span></li>
                    <li>卡码<span>{{data.denomination}}元</span></li>
                    <li>密码<span>{{data.denomination}}元</span></li>
                    <li>过期时间<span>{{data.denomination}}元</span></li>
                </ul>
            </div>
            <div class="content normal">
                <ul>
                    <li>商品金额<span>{{$i18n.t('money')}}{{data.money}}</span></li>
                    <li>积分抵付<span>-{{data.scoreDel}}</span></li>
                    <li>支付方式<span>{{data.payMethod}}</span></li>
                </ul>
            </div>
            <div class="bottom">
                <b>需付款：{{$i18n.t('money')}}{{data.payNum}}</b><br />
                <span>下单时间：{{data.date}}</span>
            </div>
            <div class="btn">
                <button type="button" class="rt">取消订单</button>
                <button type="button" class="rt">去支付</button>
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
      data:{
        numId:"12345689",
        status:"待支付",
        productName:"江苏中石化固定面值1000元直充",
        phoneNum:"1234 5678 1234 5678",
        place:"江苏，全国",
        denomination:1000,
        states:"充值中/成功/撤销",
        money:"19.9x2",
        scoreDel:"4.00",
        payMethod:"-----",
        payNum:"30.00",
        date:"2017-05-01 11:00:00"
      }
    };
  },
  methods:{

  }
};
</script>
<style  lang="scss" rel="stylesheet/scss" scoped>
  #orderDetailsPaied {
    .main {
      padding-top: 0.0625rem;
      margin-bottom: 6.25rem;

      .title {
        height: 2.75rem;
        line-height: 2.75rem;
        padding: 0 0.875rem;
        text-align: right;
        background: #fff;
        font-weight: 500;

        p {
          display: inline-block;
          color: #8c8c8c;
          font-size: 14px;
          float: left;
        }

        span {
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }
      }

      .normal {
        padding: 0.875rem;
        background: #fff;
        margin: 0.625rem 0;

        li {
          line-height: 1.875rem;
          text-align: left;

          span {
            display: inline-block;
            float: right;
            color: #333;
          }
        }
      }

      .top {
        li {
          font-size: 14px;
          color: #8c8c8c;
        }
      }

      .middle {
        li {
          font-size: 14px;
          color: #8c8c8c;
          font-weight: 400;

          span {
            color: #333;
          }
        }
      }

      .content {
        li {
          font-size: 14px;
          color: #8c8c8c;
        }
      }

      .bottom {
        background: #fff;
        text-align: right;
        padding: 0.9375rem;
        line-height: 1.625rem;

        b {
          color: #616161;
          font-weight: 500;
        }

        span {
          color: #a5a5a5;
        }
      }

      .btn {
        position: fixed;
        bottom: 0;
        right: 0;
        height: 2.8125rem;
        padding: 0 0.875rem;
        width: 100%;
        background: #fff;

        button {
          margin-left: 0.625rem;
          padding: 0.25rem 0.625rem;
          border-radius: 0.1875rem;
          text-align: center;
          border: 0.0625rem solid #666;
          color: #333;
          background: #fff;
          outline: 0;
          margin-top: 0.625rem;
        }
      }
    }
  }
</style>


