<!-- 广告市场 - 店长提成 -->
<template>
  <div id="managerCommission">
    <c-title :hide="false" text="我的设备"></c-title>
    <div class="top">
      <div class="memony">提成金额(元)</div>
      <div class="num">{{ loglist.amount }}</div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="aaa">广告ID</div>
        <div class="aaa">广告单价(元)</div>
        <div class="aaa">广告量({{ loglist.unit_code_name }})</div>
        <div class="aaa">广告收入</div>
        <div class="aaa">店长提成比例(%)</div>
        <div class="aaa">广告类型</div>
        <div class="aaa">时间</div>
      </div>
      <div class="right">
        <div class="bbb">{{ loglist.advert_id }}</div>
        <div class="bbb">{{ loglist.advert_unit }}</div>
        <div class="bbb">{{ loglist.view_count }}</div>
        <div class="bbb">{{ loglist.advert_amount }}</div>
        <div class="bbb">{{ loglist.ratio }}</div>
        <div class="bbb">{{ loglist.code_name }}</div>
        <div class="bbb">{{ loglist.created_at }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      loglist: {}
    };
  },

  activated() {
    this.loglist = {};
    this.getEquipmentLogInfo();
  },

  components: { cTitle },

  computed: {},

  methods: {
    getEquipmentLogInfo() {
      $http
        .get(
          "plugin.advert-market.frontend.center.getEquipmentLogInfo",
          {
            log_id: this.$route.params.log_id ? this.$route.params.log_id : ""
          },
          ""
        )
        .then(response => {
          if (response.result == 1) {
            this.loglist = response.data.log;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#managerCommission {
  background: #fff;

  .top {
    background: #f15353;
    display: flex;
    flex-wrap: wrap;
    color: #fff;
    height: 7.813rem;
    flex-direction: column;
    justify-content: center;

    .memony {
      width: 100%;
      font-size: 0.875rem;
      padding-bottom: 1rem;
    }

    .num {
      width: 100%;
      font-size: 1.75rem;
      font-weight: bold;
    }
  }

  .bottom {
    display: flex;
    padding: 0 1rem;

    .left,
    .right {
      width: 50%;
      line-height: 2.5rem;
    }

    .aaa {
      text-align: left;
      color: #666;
    }

    .bbb {
      text-align: right;
      color: #333;
    }
  }
}
</style>
