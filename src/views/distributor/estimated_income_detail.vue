<!-- 预估收益详情 -->
<template>
  <div id="estimated_income_detail">
    <c-title :hide="false" :text="'预估收益详情'"> </c-title>
    <div class="content">
      <div class="li" v-if="Object.keys(award_model).length != 0">
        <p>
          <span class="left">订单号：{{ award_model.order_sn || '---' }}</span
          ><span class="red right">{{ award_model.status_name || '---' }}</span>
        </p>
        <!-- <p v-if="award_model.parent_member">
          <span class="member left"
            >接单人：<img class="avator" :src="award_model.parent_member.avatar_image" alt="" />{{
              award_model.parent_member.nickname
            }}</span
          ><span class="right"><i class="iconfont icon-advertise-next"></i></span>
        </p> -->
        <p>
          <span class="left">等级：{{ award_model.parent_level ? award_model.parent_level.level_name : '---' }}</span>
        </p>
      </div>

      <div class="reward-detail">
        <div class="reward-title">收益奖励</div>
        <div class="reward-child">{{ award_model.award_name || '---' }}：{{ award_model.amount || '---' }}元</div>
        <!-- <div class="reward-title">补货收益</div>
        <div class="reward-child">出货收入：xxx元</div>
        <div class="line"></div>
        <div class="reward-title">不补货收益</div>
        <div class="reward-child">直播奖：xxx元</div> -->
      </div>

      <div class="reward-detail">
        <div class="reward-title">额外信息</div>
        <div class="reward-child">{{ award_model.other_info || '---' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      award_model: {}
    };
  },

  activated() {
    this.getData();
  },

  components: {},

  computed: {},

  methods: {
    getData() {
      $http
        .get('plugin.channel.frontend.predict.detail', { id: this.$route.params.id }, '')
        .then(response => {
          if (response.result === 1) {
            this.award_model = response.data.award_model;
          } else {
            MessageBox.alert(response.msg, '提示');
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
#estimated_income_detail {
  .content {
    padding: 0.875rem;

    .li {
      margin-bottom: 0.625rem;
      background: #fff;
      border-radius: 0.625rem;
      overflow: hidden;
      padding: 0.5rem;

      p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.25rem;
        text-align: left;
        font-size: 0.75rem;

        span {
          display: block;
        }

        .left {
          flex: 1;
          display: flex;
          align-items: center;

          .avator {
            width: 1.125rem;
            height: 1.125rem;
            border-radius: 50%;
            margin: 0 0.25rem 0 0;
          }
        }

        .red {
          color: #f14e4e;
        }
      }
    }

    .reward-detail {
      display: flex;
      flex-direction: column;
      padding: 0.625rem;
      background-color: #fff;
      text-align: left;
      border-radius: 0.625rem;
      overflow: hidden;
      margin-bottom: 0.875rem;

      .reward-title {
        font-weight: bold;
      }

      .reward-child {
        font-size: 0.75rem;
        height: 1.875rem;
        line-height: 1.875rem;
      }

      .line {
        width: 100%;
        margin: 0.5rem 0;
        position: relative;
      }

      .line::after {
        height: 1px;
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: 0;
        content: '';
        width: 100%;
        background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
      }
    }
  }
}
</style>
