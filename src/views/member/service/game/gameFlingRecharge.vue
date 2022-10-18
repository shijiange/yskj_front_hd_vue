<template>
    <div id="gameFlingRecharge">
        <c-title :hide="false" text='自动充值'></c-title>
        <ul class="account">
            <li> <span>游戏名称</span> {{data.name}}</li>
            <li> <span>游戏账户</span> <input type="text" name="" placeholder="请输入游戏账户"></li>
            <li><span>游戏服</span> <i class="iconfont icon-right"></i></li>
            <li><span>游戏区</span> <i class="iconfont icon-right"></i></li>
        </ul>
        <div class="content">
            <ul class="box">
                <li class="title">面额</li>
                <li v-for="(item,index) in items" :key='index'>
                    <div class="par">
                        <b>{{item.recharge}}</b> <i></i>
                        <div @click="selectStyle($event,item.money)" class="info"></div>
                    </div>
                </li>
            </ul>
            <ul class="recharge box">
                <li class="title">充值方式</li>
                <li @click="rechargeStyle()"><div class="par" :class="{active:isActive}">
                    自动充值<i></i>
                </div> </li>
            </ul>
            <ul class="count">
                <li class="title">数量</li>
                <li class="addCount">
                    <ul>
                        <li class="add">-</li>
                        <li class="num"><input type="text" value="1"></li>
                        <li class="minus">+</li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="m-footer">
            <p class="subtotal"><span class="lf">商品小计</span> <span class="rt">{{$i18n.t('money')}}{{sourceMoney}}</span></p>
            <div class="clear"></div>
            <div class="integral">
                <div class="lf">
                    <b>积分</b> <span>可用积分&nbsp;<font>600</font>&nbsp;积分,抵扣<font>&nbsp;{{scoreMoney}}&nbsp;</font>元</span>
                </div>
                <van-switch class="rt" v-model="useScore" size="30px" active-color="#f15353" inactive-color="#fff" />              
            </div>
            <div class="clear"></div>
            <div class="amount">
                <span class="lf">合计:{{$i18n.t('money')}}<b>{{computedMoney}}</b></span>
                <router-link :to= "fun.getUrl('rechargePay')">
                    <button class="rt" type="button">提交订单</button>
                </router-link>
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
      useScore:false,
      data:{name:"DNF地下城与勇士"},
      isActive:true,
      items:[
        {recharge:'10元'},
        {recharge:'20元'},
        {recharge:'30元'},
        {recharge:'50元'},
        {recharge:'100元'},
        {recharge:'200元'},
        {recharge:'300元'},
        {recharge:'500元'},
      ]
    };
  },
  methods:{
    selectStyle(e,money){
      var infoA = document.getElementById("gameFlingRecharge").getElementsByClassName("info");
      for(var i=0;i<infoA.length;i++){
        infoA[i].className="info";
        infoA[i].parentNode.className="par";
      }
      e.target.className="info active";
      e.target.parentNode.className="par active";
    },
    rechargeStyle(){
      this.isActive=!this.isActive;
    }
  },
  mounted(){
    var infoA = document.getElementById("gameFlingRecharge").getElementsByClassName("info");
    infoA[0].className="info active";
    infoA[0].parentNode.className="par active";
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* { box-sizing: border-box; }

#gameFlingRecharge {
  .account {
    padding-left: 0.875rem;
    background: #fff;
    font-size: 16px;

    li {
      height: 2.8125rem;
      line-height: 2.8125rem;
      border-bottom: 0.0625rem solid #ebebeb;
      display: flex;
      flex-flow: row;
      color: #8c8c8c;

      span {
        color: #333;
        width: 6.25rem;
        text-align: left;
      }

      i {
        flex: 1;
        text-align: right;
        font-size: 30px;
      }

      input {
        color: #8c8c8c;
        border: 0;
        outline: 0;
      }
    }

    li:last-child {
      border-bottom: 0;
    }
  }

  .content {
    margin: 0.625rem  0 8.75rem;
    overflow: hidden;
    padding: 0 0.9375rem;
    background: #fff;
    padding-bottom: 0.625rem;

    .box {
      li.title {
        margin-top: 0.625rem;
        font-size: 14px;
        color: #8c8c8c;
        height: 2.25rem;
        line-height: 2.25rem;
        text-align: left;
      }

      li:not(.title) {
        width: 33.3%;
        float: left;
        height: 4.25rem;
        margin-bottom: 10px;

        div {
          margin: 0.375rem 0.375rem;
          border: 0.0625rem solid #ebebeb;
          height: 100%;
          border-radius: 0.25rem;
          box-sizing: border-box;
          padding-top: 1.25rem;

          b {
            font-size: 22px;
            color: #666;
          }

          p {
            font-size: 10px;
            color: #999;
          }
        }

        .active {
          border: 0.0625rem solid #f15353;
          position: relative;

          i {
            width: 1.875rem;
            height: 1rem;
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 0;
            background: url(../../../../assets/images/checke.png) no-repeat 0.0625rem 0;
          }
        }

        .par {
          position: relative;

          b {
            font-weight: normal;
          }
        }

        .info {
          width: 100%;
          height: 100%;
          z-index: 100;
          position: absolute;
          top: -0.375rem;
          left: -0.375rem;
        }
      }
    }

    .recharge {
      overflow: hidden;
      width: 100%;
      clear: both;
      font-size: 14px;
      color: #666;

      div {
        border: solid 0.0625rem #f15353;
      }
    }

    .count {
      margin-top: 0.625rem;
      overflow: hidden;
      display: flex;
      justify-content: space-between;

      li.title {
        font-size: 14px;
        color: #8c8c8c;
        height: 2.25rem;
        line-height: 2.25rem;
        text-align: left;
      }

      .addCount {
        ul {
          overflow: hidden;
          height: 2.25rem;
          margin: 0 auto;
          margin-top: 0.25rem;
          li { float: left; }

          li.num {
            font-size: 18px;
            width: 40px;
            height: 1.75rem;
            background-color: #ebebeb;
            border-radius: 0.375rem;

            input {
              color: #666;
              width: 100%;
              height: 100%;
              border: 0;
              outline: 0;
              text-align: center;
            }
          }

          li:nth-child(odd) {
            height: 1.75rem;
            line-height: 1.75rem;
          }

          .add,
          .minus {
            width: 1.75rem;
            height: 1.75rem;
            color: #666;
            font-size: 32px;
          }
        }
      }
    }
  }

  .m-footer {
    box-shadow: 0 0 0.375rem 0 rgba(204, 204, 204, 0.6);
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;

    .subtotal {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.8125rem;
      margin: 0;

      span.lf {
        color: #333;
        font-size: 16px;
      }

      span.rt {
        font-size: 16px;
        color: #f15353;
      }
    }

    .integral {
      border-top: 0.0625rem solid #ebebeb;
      height: 2.8125rem;
      line-height: 2.8125rem;
      margin-left: 0.875rem;
      padding-right: 0.875rem;

      div.lf {
        b {
          color: #333;
          font-size: 16px;
          font-weight: noraml;
          margin-right: 0.625rem;
        }

        span {
          color: #333;
          font-size: 14px;
        }

        font {
          color: #f15353;
        }
      }
    }

    .amount {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0 0 0.875rem;
      margin-bottom: 0;
      box-sizing: border-box;
      border-top: solid 0.0625rem #ebebeb;

      span.lf {
        color: #333;
        font-size: 16px;
      }

      button.rt {
        width: 6.875rem;
        height: 2.8125rem;
        color: #fff;
        font-size: 16px;
        background: #f15353;
        border: 0;
      }
    }
  }

  /deep/.van-switch {
    float: right !important;
    top: 0.5rem;

    .van-switch__node {
      top: -1px;
    }
  }
}
</style>
