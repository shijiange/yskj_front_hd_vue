<template>
  <div id="fixedTelephone" :class="'fixedTelephone'+$store.state.service.lang">
    <c-title :hide="false" :text='language.title'></c-title>

    <div class="telep">
      <p>
        <span>固话号码</span>
        <input :placeholder="language.placeTip" v-model.trim="fixedPhone" type="text" ref='isinput'>
      </p>
    </div>

    <div class="content">
      <div class="maleall">
        <label for="male"
               class="males"><span style="margin-right: 10px;">所在省份: </span>
          <van-button
            style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 14rem;"
            plain type="primary" @click="seleRegional">{{regional}}
          </van-button>

        </label>
      </div>
      <div class="maleall">
        <label for="male"
               class="males"><span style="margin-right: 10px;">所在城市: </span>
          <van-button
            style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 14rem;"
            plain type="primary" :disabled="citynull" @click="seleRegional_1">{{regiona2}}
          </van-button>
        </label>
      </div>
      <form action="" method="" class="form">
        <div class="form-group2">
          <ul class="box">
            <li v-for="(item,index) in goods" :key='index'>
              <div class="par" @click="selectStyle($event,item)" :class="{'active':item.itemId==itemId}">
                <b>{{item.price}}{{language.yuan}}</b>
                <p>{{item.itemName1}}-{{item.itemName2}}</p> <i></i>
                <div class="info" :class="{'active':item.itemId==itemId}"></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="form-group" v-if="false">
          <label class="form-help">{{language.money}}</label>
          <input class="form-controler" type="text" :placeholder="language.placeMoney" v-model.lazy="sourceMoney">
        </div>
      </form>
    </div>

    <van-popup
      v-model="popupVisible"
      position="bottom">
      <div class="popUp">
        <div class="title"><span class="left" @click="chooseCompony">{{language.cancle}}</span>{{language.company}}<span
          class="right" @click="chooseCompony">{{language.confirm}}</span></div>
        <!--<ul>
          <li v-for="company in companys">{{company}}</li>
        </ul>-->
        <van-picker :columns="slots" @change="onValuesChange"/>
      </div>

    </van-popup>
    <div class="amount">
      <button type="button" @click='confirm'>{{language.btn}}</button>
    </div>
    <!--<div class="m-footer">
        <p class="subtotal"><span>{{language.subtotal}}</span> <span>{{$i18n.t('money')}}{{sourceMoney}}</span></p>
        <div class="clear"></div>
        <div class="integral">
            <div>
                <b>{{language.score}}</b> <span>{{language.scoreTip1}}{{score}}{{language.scoreTip2}}{{scoreMoney}}{{language.yuan}}</span>
            </div>
        </div>
        <div class="clear"></div>
        <div class="amount" :class="{'disableds':disableds}">
            <span>{{language.total}}<b>{{computedMoney}}</b></span>

                <button type="button">{{language.btn}}</button>

        </div>
    </div>-->
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-picker :columns="columns" @change="onChange" @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar/>
    </van-popup>
    <van-popup v-model="dateshow_2" position="bottom" :overlay="true">
      <van-picker :columns="columns_1" @change="onChange_1" @cancel="onCancelbtn_1" @confirm="onConfirmbtn_1"
                  show-toolbar/>
    </van-popup>
  </div>
</template>

<script>
import fixedTelephone_controller from "./fixedTelephone_controller";

export default fixedTelephone_controller;
</script>
<style type="text/css">
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #8c8c8c;
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #8c8c8c;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #8c8c8c;
  }

  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #8c8c8c;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  .fixedTelephonech {
    .box {
      margin: 0.4375rem;
      overflow: hidden;

      li {
        width: 33.3%;
        float: left;
        height: 5rem;
        margin-bottom: 0.625rem;

        div {
          margin: 0.375rem 0.375rem;
          border: 0.0625rem solid #ccc;
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
          border: 0.0625rem solid #36d2b6;
          position: relative;

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

        .par {
          position: relative;
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

    .amount.disableds {
      button {
        background: #ccc;
      }
    }

    .amount {
      padding: 0 0 0 0;
      margin-bottom: 0;
      box-sizing: border-box;

      span {
        color: #333;
        font-size: 16px;
        float: left;
      }

      button {
        width: 90%;
        height: 2.875rem;
        color: #fff;
        font-size: 16px;
        background: #f15353;
        border: 0;
        border-radius: 0.375rem;
        margin-top: 1.25rem;
      }
    }

    .maleall span {
      font-size: 14px;
      vertical-align: middle;
      width: auto;
      margin-left: -0.9375rem;
      -webkit-box-flex: 0;
      -ms-flex: none;
      flex: none;
      line-height: 3.125rem;
    }

    .telep {
      margin-top: 0.625rem;
      margin-bottom: 0.625rem;
      padding: 0.625rem 0.875rem;
      background: #fff;

      p {
        input {
          padding-bottom: 0.625rem;
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          color: #333;
          font-size: 24px;
          border-bottom: solid 0.0625rem #ebebeb;
        }

        span {
          display: block;
          line-height: 1.875rem;
          text-align: left;
          font-size: 14px;
        }
      }
    }

    .content {
      background: #fff;

      .form {
        .form-group {
          padding: 0 0.9375rem;
          height: 2.8125rem;
          border-top: 0.0625rem solid #ccc;
          display: -webkit-flex; /* Safari */
          display: flex;
          flex-flow: row;

          .form-help {
            width: 5rem;
            height: 2.8125rem;
            line-height: 2.8125rem;
            text-align: left;
          }

          .form-controler {
            flex: 1;
            height: 2.8125rem;
            line-height: 2.8125rem;
            float: left;
            border: 0;
            outline: 0;
            text-align: left;

            i {
              font-size: 23px;
              float: right;
            }
          }
        }
      }
    }

    .popUp {
      width: 100%;
      background: #fff;

      .title {
        height: 2.8125rem;
        line-height: 2.8125rem;
        border-bottom: 0.0625rem solid #f3f5f7;
        padding: 0 0.9375rem;

        .left {
          float: left;
        }

        .right {
          float: right;
          color: #1bba9e;
        }
      }

      ul {
        li {
          height: 1.875rem;
          line-height: 1.875rem;
          border-top: 0.0625rem solid #ccc;
          text-align: left;
          margin: 0 0.9375rem;
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
        padding: 0 0.8125rem;
        border-bottom: 0.0625rem solid #ccc;
        margin: 0;

        span:first-child {
          color: #333;
          font-size: 16px;
          float: left;
        }

        span:last-child {
          color: 12px;
          color: #333;
          float: right;
        }
      }

      .integral {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.8125rem;

        div {
          float: left;

          b {
            color: #333;
            font-size: 16px;
            font-weight: noraml;
          }

          span {
            color: #333;
            font-size: 12px;
          }
        }
      }
    }
  }

  .fixedTelephonewei {
    .telep {
      height: 2.8125rem;
      padding: 0 0.8125rem;
      background: #fff;

      p {
        height: 2.8125rem;

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

    .popUp {
      width: 100%;
      background: #fff;

      .title {
        height: 2.8125rem;
        line-height: 2.8125rem;
        border-bottom: 0.0625rem solid #f3f5f7;
        padding: 0 0.9375rem;

        .left {
          float: right;
        }

        .right {
          float: left;
          color: #1bba9e;
        }
      }
    }

    .content {
      background: #fff;

      .form {
        .form-group {
          padding: 0 0.9375rem;
          height: 2.8125rem;
          border-top: 0.0625rem solid #ccc;
          display: -webkit-flex; /* Safari */
          display: flex;
          flex-flow: row;

          .form-help {
            order: 2;
            width: 5rem;
            height: 2.8125rem;
            line-height: 2.8125rem;
            text-align: right;
          }

          .form-controler {
            flex: 1;
            height: 2.8125rem;
            line-height: 2.8125rem;
            float: left;
            border: 0;
            outline: 0;
            text-align: right;

            i {
              font-size: 23px;
              float: left;
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
        padding: 0 0.8125rem;
        border-bottom: 0.0625rem solid #ccc;
        margin: 0;

        span:first-child {
          color: #333;
          font-size: 16px;
          float: right;
        }

        span:last-child {
          color: 12px;
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
</style>
