<!-- 社区团购主页 -->
<template>
  <div id="community_buying-index">
    <c-title :hide="false" text="社区团购"></c-title>
    <div class="top-box">
      <div class="member-info" v-if="info.userinfo">
        <img :src="info.userinfo ? info.userinfo.avatar : ''" alt="" class="avator" />
        <div class="name">{{ info.userinfo.nickname }}</div>
      </div>
      <div class="award">累计奖励金额：{{ $i18n.t('money') }}{{ info.amount }}</div>
    </div>
    <div class="list">
      <div class="list-child" @click.stop="gotoUrl('communityBuyEdit_info')">
        <i class="iconfont icon-massage_client"></i>
        <div class="list-name">我的信息</div>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="list-child" @click.stop="gotoUrl('communityBuyGroup')" v-if="info.community">
        <i class="iconfont icon-fx_canyu"></i>
        <div class="list-name">社区团购</div>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="list-child" @click.stop="gotoUrl('communityBuyOrder')">
        <i class="iconfont icon-fontclass-shangpindingdan"></i>
        <div class="list-name">订单列表</div>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="list-child border-none" @click.stop="gotoUrl('selfCarry_reward')">
        <i class="iconfont icon-massage_apply"></i>
        <div class="list-name">提成明细</div>
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      info: {}
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post('plugin.package-deliver.frontend.deliver.getDeliverBonusAmount', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoUrl(_url, params = {}) {
      this.$router.push(this.fun.getUrl(_url, params));
    }
  }
};
</script>
<style lang="scss" scoped>
#community_buying-index {
  .top-box {
    background-color: #ee2e2b;
    color: #fff;
    text-align: left;
    margin-bottom: 0.875rem;

    .member-info {
      padding: 1.375rem 1.5rem;
      display: flex;

      .avator {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 0.875rem;
      }

      .name {
        font-size: 1rem;
        font-weight: bold;
        flex: 1;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    .award {
      height: 1.75rem;
      background-color: #f14e4e;
      font-size: 0.75rem;
      padding: 0 1.5rem;
      line-height: 1.75rem;
    }
  }

  .list {
    background: #fff;
    color: #333;
    font-size: 1rem;

    .list-child {
      padding: 0 1rem;
      height: 2.75rem;
      line-height: 2.75rem;
      // border: 1px solid #f2f2f2;
      display: flex;
      align-items: center;
      position: relative;

      i {
        font-size: 1rem;
        color: #cdcdd7;
      }

      .iconfont {
        margin-right: 0.5rem;
      }

      .list-name {
        text-align: left;
        flex: 1;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    .list-child::after {
      height: 1px;
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0;
      content: '';
      width: 100%;
      background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
    }

    .border-none::after {
      height: 0;
    }
  }
}
</style>
