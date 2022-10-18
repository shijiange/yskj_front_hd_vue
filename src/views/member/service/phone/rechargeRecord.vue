<template>

  <div id="rechargeRecord" :class="'rechargeRecord'+$store.state.service.lang">

    <c-title :hide="false" :text='language.title'></c-title>

    <div class="main">
      <div class="monthList" v-for="(elem,i) in datas" :key='i'>
        <p class="title">订单号：{{elem.has_one_order.order_sn}}<b>{{$i18n.t("money")}}{{elem.price}}</b></p>
        <ul>
          <li @click="goDetails(elem.order_id)">
            <div class="left">
              <p>充值{{elem.amount}}元--{{elem.mobile}}</p>
              <span>{{elem.created_at}}</span>
            </div>
            <div class="right">
              <p v-if='elem.has_one_order.status==0'>待付款</p>
              <p v-if='elem.has_one_order.status==1'>待发货</p>
              <p v-if='elem.has_one_order.status==2'>待收货</p>
              <p v-if='elem.has_one_order.status==3'>交易完成</p>

            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  components: { cTitle },
  data() {
    return {
      language: {},
      datas: []
    };
  },
  methods: {
    goDetails(e) {
      this.$router.push(this.fun.getUrl("rechargeDetail", { orderId: e }));
    },
    // 获取记录
    getBalance() {
      let that = this;
      $http.get("plugin.recharge.api.goods.rechargeRecord", {}, "加载中...").then((response) => {

        if (response.result == 1) {
          this.datas = response.data;

        } else {
          that.$dialog.alert({ message: response.msg });

        }

      }, function(response) {
        that.$dialog.alert({ message: response.msg });

      });
    }
  },
  //实时监测this.$store.state.service.chinese的变化，获取最新的语言包
  computed: {
    getLangState() {
      return this.$store.state.service.languageService;
    }
  },
  watch: {
    getLangState(val) {
      if (val) {
        this.language = JSON.parse(sessionStorage.languageService).rechargeRecord;
      } else {
        this.language = this.$store.state.service.languageService.rechargeRecord;
      }
    }
  },

  mounted() {
    if (sessionStorage.languageService) {
      this.language = JSON.parse(sessionStorage.languageService).rechargeRecord;
    } else {
      this.language = this.$store.state.service.languageService.rechargeRecord;
    }
  },

  activated() {
    this.getBalance();
    this.$store.commit("onload");
  }

};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .rechargeRecordch {
    .main {
      width: 100%;
      overflow: auto;

      .monthList:last-child {
        border: none;
      }

      .monthList {
        padding: 0.625rem 0;
        height: auto;
        background: #fff;
        border-bottom: solid 0.0625rem #ebebeb;

        .title {
          display: flex;
          justify-content: space-between;
          padding: 0 0.875rem;
          color: #333;
          line-height: 1.875rem;
          font-size: 14px;
          text-align: left;
        }

        li {
          box-sizing: border-box;
          padding: 0 0.875rem;
          display: flex;
          justify-content: space-between;
          line-height: 1.5rem;

          .left {
            width: 11.875rem;
            line-height: 1.5rem;
            text-align: left;

            p {
              color: #333;
              font-size: 14px;
              font-weight: 500;
              display: block;
            }

            span {
              display: block;
              color: #8c8c8c;
              font-size: 13px;
            }
          }

          .right {
            float: right;
            width: 4.375rem;
            text-align: right;
            line-height: 1.375rem;

            p {
              color: #8c8c8c;
              text-align: right;
              font-size: 14px;
            }

            b {
              color: #424242;
              font-size: 14px;
            }
          }
        }

        li:last-child {
          border: none;
        }
      }
    }
  }

  .rechargeRecordwei {
    .main {
      width: 100%;
      overflow: auto;

      .monthList {
        height: auto;
        background: #fff;

        .title {
          padding: 0 0.9375rem;
          color: #fff;
          line-height: 1.875rem;
          font-size: 14px;
          background: #39d1b6;
          margin-bottom: 0.0625rem;
          text-align: right;
        }

        li {
          height: 3.75rem;
          box-sizing: border-box;
          padding: 0.5rem 0.9375rem;
          border-bottom: 0.0625rem solid #efefef;

          .left {
            width: 11.875rem;
            float: right;
            line-height: 1.375rem;
            text-align: right;

            p {
              color: #616161;
              font-size: 14px;
              font-weight: 500;
            }

            span {
              color: #b6b6b6;
              font-size: 13px;
            }
          }

          .right {
            float: left;
            width: 4.375rem;
            text-align: left;
            line-height: 1.375rem;

            p {
              color: #ffc285;
              text-align: left;
              font-size: 12px;
            }

            b {
              color: #424242;
              font-size: 14px;
            }
          }
        }

        li:last-child {
          border: none;
        }
      }
    }
  }
</style>-->
