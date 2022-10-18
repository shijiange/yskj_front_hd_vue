<template>
  <div id="flow"
       :class="'flow'+$store.state.service.lang">
    <c-title :hide="false"
             :text='language.title'
             tolink='flowRechargeRecord'
             :totext='language.record'></c-title>
    <div class="telep">
      <p v-if="tele">
        <b>13450772233</b>
        <span>广东移动</span>
      </p>
      <p v-else>
        <input type="number"
               v-model.trim="MobilePhone"
               :placeholder="language.placeTip"
               ref='isinput'>
        <span>广东移动</span>
      </p>
      <div class="line"></div>
    </div>

    <div class="traffic">
      <ul class="traffic-box">
        <li class="info"
            :class="{'active':Hot_flow == index}"
            v-for="(item,index) in items"
            :key='index'
            @click="selectedStyle($event,index,item)">
          <!--v-if="item.data!=0"-->
          <u></u> <b>{{item.num}}</b> <i></i>
        </li>
      </ul>

      <div class="traffic-money"
           v-if="datas">
        <div class="item"
             @click="selectMoney($event,item.price,n,item.api_goods_id)"
             v-for="(item,n) in datas"
             :key='n'>

          <div class="left">
            <p class="one"><b>{{$i18n.t("money")}}{{item.price}}</b> <span v-show="item.span">{{item.span}}</span></p>
            <p class="two">{{item.des}}</p>
          </div>
          <div class="right"><span :class="{'circle':moneyHotspot != n,'active':moneyHotspot == n}"></span></div>
        </div>
      </div>
    </div>

    <div class="m-footer"
         :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
      <p class="subtotal"><span>{{language.subtotal}}</span> <span>{{$i18n.t("money")}}{{sourceMoney}}</span></p>
      <div class="clear"></div>
      <div class="integral"
           v-show="offDeductible">
        <div>
          <b>{{deductionName}}</b> <span>{{language.scoreTip1}}{{score}}{{language.scoreTip2}}{{scoreMoney}}{{language.yuan}}</span>
        </div>
        <van-switch :class="{rt:$store.state.service.chinese,lf:!$store.state.service.chinese}" v-model="useScore"
                    size="30px" active-color="#f15353" inactive-color="#fff"/>
      </div>
      <!--<p class="poundage">注：手续费为{{poundage}}%</p>-->
      <div class="clear"></div>
      <div class="amount"
           :class="{'disableds':disableds}">
        <span>{{language.total}}<b>{{computedMoney}}</b></span>

        <button type="button" @click="goSubmit">{{language.btn}}
        </button>

      </div>
    </div>
  </div>
</template>

<script>
import flow_controller from "./flow_controller";

export default flow_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  .flowch {
    .poundage {
      color: red;
      font-size: 12px;
    }

    .telep {
      margin-top: 0.625rem;
      padding: 0.625rem 0.875rem;
      background: #fff;

      p {
        line-height: 1.875rem;

        b {
          font-size: 24px;
          color: #333;
          font-weight: normal;
        }

        span {
          display: block;
          line-height: 24px;
          text-align: left;
          font-size: 12px;
          color: #8c8c8c;
        }

        input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          color: #333;
          font-size: 24px;
        }
      }

      .line {
        margin-top: 0.625rem;
        border-bottom: solid 0.0625rem #ebebeb;
      }
    }

    .traffic {
      background: #fff;
      margin-bottom: 0.4375rem;

      .traffic-box {
        padding: 1.25rem 0;
        margin: 0 0.875rem;
        justify-content: space-around;
        flex-flow: row;
        flex-direction: row;
        display: flex;

        li {
          width: 30%;
          height: 4.625rem;
          border: 0.125rem solid #ebebeb;
          border-radius: 0.25rem;
          font-size: 22px;
          color: #666;
          padding-top: 1.25rem;

          b {
            font-weight: normal;
          }
        }

        li.active {
          position: relative;
          border: 0.125rem solid #f15353;

          u {
            position: absolute;
            width: 3.125rem;
            height: 1.875rem;
            display: inline-block;
            top: 0;
            left: 0;
            background: url(../../../../assets/images/favourablE.png) no-repeat 0 0;
          }

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
      }

      .traffic-money {
        .item {
          padding: 0.8125rem 1.25rem;
          overflow: hidden;

          div.left {
            width: 80%;
            float: left;

            p {
              clear: both;
            }

            .one {
              line-height: 2.5rem;

              b {
                font-size: 22px;
                color: #333;
                font-weight: normal;
                float: left;
              }

              span {
                padding: 0.1875rem 0.5rem;
                background: #36d2b6;
                color: #fff;
                border-radius: 0.375rem;
                font-size: 10px;
              }
            }

            .two {
              font-size: 12px;
              color: #666;
              text-align: left;
              line-height: 1.125rem;
            }
          }

          div.right {
            width: 20%;
            float: right;

            span {
              width: 1.25rem;
              height: 1.25rem;
              display: inline-block;
              border: 0.0625rem solid #aaa;
              border-radius: 50%;
              float: right;
              margin-top: 50%;
            }

            .active {
              border: 0.0625rem solid #f15353;
              background: url(../../../../assets/images/mark-a.png) no-repeat 0.1875rem 0.1875rem;
            }
          }
        }
      }
    }

    .m-footer {
      width: 100%;
      background: #fff;
      position: fixed;
      bottom: 0;

      .subtotal {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.875rem;
        margin: 0;

        span:first-child {
          color: #333;
          font-size: 16px;
          float: left;
        }

        span:last-child {
          font-size: 16px;
          color: #f15353;
          float: right;
        }
      }

      .integral {
        border-top: 0.0625rem solid #ebebeb;
        height: 2.8125rem;
        line-height: 2.8125rem;
        margin-left: 0.875rem;
        padding-right: 0.875rem;

        div {
          float: left;

          b {
            color: #333;
            font-size: 16px;
            margin-right: 0.625rem;
            font-weight: normal;
          }

          span {
            color: #333;
            font-size: 12px;
          }
        }
      }

      .amount.disableds {
        button {
          background: #ccc;
        }
      }

      .amount {
        border-top: solid 0.0625rem #e2e2e2;
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0 0 0.875rem;
        margin-bottom: 0;
        box-sizing: border-box;

        span {
          color: #333;
          font-size: 16px;
          float: left;
        }

        button {
          width: 6.875rem;
          height: 2.8125rem;
          color: #fff;
          font-size: 16px;
          background: #f15353;
          border: 0;
          float: right;
        }
      }
    }
  }

  .flowwei {
    .telep {
      height: 2.8125rem;
      padding: 0 0.8125rem;
      background: #fff;

      p {
        height: 2.8125rem;

        b {
          font-size: 22px;
          color: #1bba9e;
          font-weight: normal;
          float: left;
        }

        span {
          font-size: 12px;
          color: #666;
          float: right;
        }

        input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          color: #1bba9e;
          font-size: 18px;
        }
      }
    }

    .traffic {
      background: #fff;
      margin-bottom: 0.4375rem;

      .traffic-box {
        padding-top: 0.625rem;
        margin: 0.4375rem;
        justify-content: space-around;
        flex-flow: row;
        flex-direction: row;
        display: flex;

        li {
          width: 30%;
          height: 4.375rem;
          border: 0.0625rem solid #ebebeb;
          border-radius: 0.25rem;
          font-size: 22px;
          color: #666;
          padding-top: 1.25rem;
        }

        li.active {
          position: relative;
          border: 0.0625rem solid #36d2b6;

          u {
            position: absolute;
            width: 3.125rem;
            height: 1.875rem;
            display: inline-block;
            top: 0;
            left: 0;
            background: url(../../../../assets/images/favourablE.png) no-repeat 0 0;
          }

          i {
            width: 1.875rem;
            height: 1rem;
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 0;
            background: url(../../../../assets/images/checkeD.png) no-repeat 0.0625rem 0;
          }
        }
      }

      .traffic-money {
        .item {
          padding: 0.8125rem 1.25rem;
          overflow: hidden;

          div.left {
            width: 80%;
            float: right;

            p {
              clear: both;
            }

            .one {
              line-height: 2.5rem;

              b {
                font-size: 22px;
                color: #333;
                font-weight: normal;
                float: right;
              }

              span {
                padding: 0.1875rem 0.5rem;
                background: #36d2b6;
                color: #fff;
                border-radius: 0.375rem;
                font-size: 10px;
                text-align: right;
              }
            }

            .two {
              font-size: 12px;
              color: #666;
              text-align: right;
              line-height: 1.125rem;
            }
          }

          div.right {
            width: 20%;
            float: left;

            span {
              width: 1.25rem;
              height: 1.25rem;
              display: inline-block;
              border: 0.0625rem solid #aaa;
              border-radius: 50%;
              float: left;
              margin-top: 50%;
            }

            .active {
              border: 0.0625rem solid #36d2b6;
              background: url(../../../../assets/images/mark.png) no-repeat 0.1875rem 0.1875rem;
            }
          }
        }
      }
    }

    .m-footer {
      width: 100%;
      background: #fff;

      .subtotal {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.8125rem;
        border-bottom: 0.0625rem solid #ebebeb;
        margin: 0;

        span:first-child {
          color: #333;
          font-size: 16px;
          float: right;
        }

        span:last-child {
          color: 16px;
          color: #333;
          float: left;
        }
      }

      .integral {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.8125rem;

        div {
          float: right;

          b {
            color: #333;
            font-size: 16px;
            font-weight: noraml;
            float: right;
          }

          span {
            color: #333;
            font-size: 12px;
          }
        }
      }

      .amount {
        height: 3.125rem;
        line-height: 3.125rem;
        padding: 0 0 0 0.8125rem;
        margin-bottom: 0;
        box-sizing: border-box;

        span {
          color: #333;
          font-size: 16px;
          float: left;
        }

        button {
          width: 6.5625rem;
          height: 2.5rem;
          color: #fff;
          font-size: 16px;
          background: #ff951b;
          border: 0;
          border-radius: 0.1875rem;
          margin-top: 0.5625rem;
          float: right;
        }
      }
    }
  }

  /deep/ .van-switch {
    float: right !important;
    top: 0.5rem;

    .van-switch__node {
      top: -1px;
    }
  }

</style>
