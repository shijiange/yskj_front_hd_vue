<!-- 社区团购 数据 -->
<template>
  <div id="community_buying-buying_data">
    <c-title :hide="false" text="社区团购"></c-title>
    <div class="top-box">
      <div class="list-child">
        <div class="size1">{{ info.orderTotalCount }}</div>
        <div>订单总数（笔）</div>
      </div>
      <div class="list-child">
        <div class="size1">
          <em>{{ $i18n.t('money') }}</em
          >{{ info.totalIncome }}
        </div>
        <div>本团总收入</div>
      </div>
    </div>
    <div class="data-list">
      <div class="list-child">
        <div class="size2">{{ info.orderTodayCount }}</div>
        <div class="size3">今日订单数（笔）</div>
      </div>
      <div class="list-child">
        <div class="size2">{{ info.todayUcount }}</div>
        <div class="size3">参与人数（人）</div>
      </div>
      <div class="list-child">
        <div class="size2">{{ $i18n.t('money') }}{{ info.todayIncome }}</div>
        <div class="size3">今日收入</div>
      </div>
    </div>

    <div class="goods-list">
      <div class="list-title">
        <div class="name">商品</div>
        <div class="num">数量</div>
      </div>
      <div class="good-child" v-for="item in info.goodsList" :key="item.id">
        <div class="good-title">{{ item.title }}</div>
        <div class="good-right">
          <van-progress :show-pivot="false" color="#ffb643" track-color="#fff" :percentage="80" stroke-width="15" />
          <div class="text">已销售{{ item.total }}件</div>
          <van-progress :show-pivot="false" color="#ff6643" track-color="#fff" :percentage="60" stroke-width="15" />
          <div class="text">收入{{ $i18n.t('money') }}{{ item.price }}</div>
        </div>
      </div>
      <img
        v-if="!this.$store.state.isloadding && fun.isTextEmpty(info.goodsList)"
        src="../../assets/images/blank.png"
        alt=""
        style="width: 5rem; margin: 2rem auto;"
      />
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
  activated() {
    this.getData();
  },
  components: {},
  computed: {},
  methods: {
    getData() {
      $http
        .post('plugin.package-deliver.frontend.communityGroups.statistic', { group_id: this.$route.params.id }, '')
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#community_buying-buying_data {
  .data-list,
  .top-box {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .list-child {
      display: flex;
      flex-direction: column;
      flex: 1;

      .size1 {
        font-size: 1.25rem;

        em {
          font-size: 0.875rem;
        }
      }

      .size2 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
        color: #f15353;
        font-weight: bold;
      }

      .size3 {
        font-size: 0.75rem;
      }
    }
  }

  .top-box {
    background-color: #f15353;
    height: 5.5rem;
    color: #fff;
  }

  .data-list {
    height: 4.375rem;
    background-color: #fff;
    margin-bottom: 0.625rem;
  }

  .goods-list {
    background: #fff;
    padding: 0 0.938rem;

    .list-title {
      height: 2.625rem;
      line-height: 2.625rem;
      display: flex;
      text-align: left;
      font-size: 1rem;

      .name {
        width: 40%;
        padding-right: 0.75rem;
      }

      .num {
        flex: 1;
      }
    }

    .good-child {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      .good-title {
        width: 40%;
        padding-right: 0.75rem;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .good-right {
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: left;

        .text {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
      }
    }
  }
}
</style>
