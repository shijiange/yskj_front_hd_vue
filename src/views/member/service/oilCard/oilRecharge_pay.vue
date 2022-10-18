<template>
    <div id="electricity" :class="'electricity'+$store.state.service.lang">
        <c-title :hide="false" :text='language.title'></c-title>

        <template>
            <div v-for="(item,i) in order_data" id="isSubtotal" :key='i'>
                <div v-for="(g,i) in item.order.order_goods" :key='i'>
                    <p class="subtotal">
                        <span>{{language.subtotal}}</span>
                        <span>{{$i18n.t('money')}}{{g.goods_price}}</span>
                    </p>
                </div>
                <div class="clear"></div>
                <div class="integral" v-show="deduction" v-for="(d,i) in deduction" :key='i'>
                    <div>
                        {{d.value}}{{d.name}}
                        <span>{{d.price}}{{language.yuan}}</span>
                    </div>
                    <van-switch :class="{rt:$store.state.service.lang=='ch',lf:!$store.state.service.lang=='wei'}" v-model="d.checked" @change="discountHandle(item,d)"  active-color="#f15353" inactive-color="#fff" />
                </div>
                <div class="clear"></div>
            </div>
        </template>

        <div class="m-footer">
            <div class="amount">
                <span>{{language.total}}
                    <b>{{price}}</b>
                </span>
                <button type="button" @click='submit'>{{language.btn}}</button>
            </div>
        </div>

    </div>
</template>

<script>
import oilRecharge_pay_controller from './oilRecharge_pay_controller';
export default oilRecharge_pay_controller;
</script>
<style type="text/css">
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #1bba9e;
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #1bba9e;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #1bba9e;
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #1bba9e;
}
</style>
<style  lang="scss" rel="stylesheet/scss" scoped>

* {
  box-sizing: border-box;
}

.electricitych {
  .poundage {
    color: red;
    font-size: 12px;
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

  .content {
    background: #fff;

    .form {
      .form-group {
        padding: 0 0.9375rem;
        height: 2.8125rem;
        border-top: 0.0625rem solid #ccc;
        display: -webkit-flex;

        /* Safari */
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
          height: auto;
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

  #isSubtotal {
    background: #fff;
  }

  .m-footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;

    .amount.disableds {
      button {
        background: #ccc;
      }
    }

    .amount {
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

.electricitywei {
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

  .content {
    background: #fff;

    .form {
      .form-group {
        padding: 0 0.9375rem;
        height: 2.8125rem;
        border-top: 0.0625rem solid #ccc;
        display: -webkit-flex;

        /* Safari */
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

/deep/.van-switch {
  float: right !important;
  top: 0.5rem;
}

/deep/.van-switch__node {
  top: -1px;
}

</style>
