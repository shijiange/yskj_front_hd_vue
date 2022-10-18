<!-- 珍惠拼拼团 -->
<template>
  <div id="zhp-group-lottery">
    <div class="active-add-member">
      <div class="zhp-group-lottery-title">
        <div class="flex-align-items-center">
          <div class="red-color">{{ member_count }}</div>
          名小伙伴正在排队参与
        </div>
        <div class="flex-align-items-center red-color" v-if="Number(group_id) > 1" @click="gotoUrl('zhpgroupDetail', { id: group_id })">查看更多 <i class="iconfont icon-member_right"></i></div>
      </div>
      <div class="zhp-group-lottery-title top-padding">
        <!-- <div class="flex-align-items-center toflex">
          <div class="toflex_row">
            当前商品您已拼中
            <div class="red-color">{{ my_win_count }}</div>
            次
          </div>
          <div class="toflex_row" v-if="love_status == 1" style="margin-top: 0.35rem;">
            还差
            <div class="red-color">{{ my_surplus_count }}</div>
            次可获得{{ love_plugin_name }}奖励
          </div>
        </div> -->
        <!-- <div class="group-btn" v-if="love_status == 1" @click="gotoUrl('groupRedeem', { id: $route.params.id })">{{ love_plugin_name }}激活兑换</div> -->
        <div style="display: block; text-align: left;">
          该商品还差
          <em class="red-color">{{ my_surplus_count }}</em>
          次获得奖励
        </div>
      </div>
    </div>
    <div class="active-add-member">
      <div class="zhp-group-lottery-title">
        <div class="flex-align-items-center">珍惠拼规则</div>
        <div class="flex-align-items-center red-color" @click="showZHPrule = true">查看更多 <i class="iconfont icon-member_right"></i></div>
      </div>
      <div class="zhp-group-lottery-title top-padding">
        参与条件：每日签到或积分商品中获取积分参与
      </div>
    </div>

    <van-popup v-model="showZHPrule" closeable round :style="{ height: '18rem', width: '80%' }" get-container="#appMain">
      <div class="ZHP-rule-box">
        <div class="rule-title">规则说明</div>
        <div class="rule-text" v-html="description"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: {
    member_count: {
      type: [String, Number],
      default: 0
    },
    my_win_count: {
      type: [String, Number],
      default: 0
    },
    is_pearl: {
      type: [String, Number],
      default: 0
    },
    is_integral: {
      type: [String, Number],
      default: 0
    },
    integral_name: {
      type: String,
      default: "爱心值"
    },
    description: {
      type: String,
      default: ""
    },
    group_id: {
      type: [String, Number],
      default: 0
    },
    love_plugin_name: String,
    love_status: Number,
    my_surplus_count: Number
  },
  data() {
    return {
      showZHPrule: false,
      aid: null
    };
  },

  // activated: {},
  components: {},
  computed: {},
  methods: {
    gotoUrl(name, params = {}) {
      if (name == "groupRedeem" && this.is_pearl == 0) {
        Toast(`该商品您未累计拼中次数，还不能奖励${this.integral_name}哦~`);
        return;
      }
      this.$router.push(this.fun.getUrl(name, params));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.toflex {
  display: flex;
  flex-direction: column;
}

.toflex_row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

#zhp-group-lottery {
  color: #333;

  .active-add-member {
    padding: 0.938rem;
    display: flex;
    flex-direction: column;
    background: #fff;
    margin-top: 0.625rem;

    .zhp-group-lottery-title {
      line-height: 0.875rem;
      display: flex;
      justify-content: space-between;
    }

    .group-btn {
      // height: 1.688rem;
      max-width: 10rem;
      line-height: 1rem;
      color: #fff;
      background-color: #f15353;
      border-radius: 0.844rem;
      padding: 0.375rem 0.75rem;
    }

    .top-padding {
      margin-top: 0.938rem;
    }
  }

  .flex-align-items-center {
    align-items: center;
    display: flex;
  }

  .red-color {
    color: #f15353;
  }
}

.ZHP-rule-box {
  display: flex;
  flex-direction: column;
  height: 100%;

  .rule-title {
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }

  .rule-text {
    flex: 1;
    overflow: scroll;
    padding: 0 0.875rem 0.875rem;

    /deep/img {
      max-width: 100%;
    }
  }
}
</style>
