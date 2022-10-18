<!-- 精英奖记录 -->
<template>
  <div id="eliteAward_record">
    <c-title :hide="false" text="精英奖记录"></c-title>
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="getData">
      <div style="min-height: 100vh;">
        <div class="list" v-for="(item, index) in list" :key="index">
          <div class="list_child_left">
            <template v-if="is_achievement">
              <div class="award_type">
                <template v-if="item.achievement">业绩:{{ item.achievement }}元 </template>
              </div>
              <div class="award_time">{{ item.statistics_time | timestampToTime }}</div>
            </template>
          </div>
          <div class="list_child_rigth">
            <template v-if="is_reward">
              <div class="award_type">
                奖励:<em class="total" v-if="item.reward_amount">+{{ item.reward_amount }}</em>
              </div>
              <div class="award_time">{{ item.reward_time | timestampToTime }}</div>
            </template>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { scrollMixin } from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isLoading: false,
      is_reward: true,
      is_achievement: true,
      list: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {},
  created() {
    window.scrollTo(0, 0);
  },
  components: { cTitle },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      let that = this;
      $http.post('plugin.elite-award.api.index.reward-log', {}).then(
        function(response) {
          that.isLoading = false;
          if (response.result == 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.list = response.data.data;
            that.is_reward = response.data.set.is_reward == '1' ? true : false;
            that.is_achievement = response.data.set.is_achievement == '1' ? true : false;
          }
        },
        function(response) {}
      );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        // let _url = null;
        // let _json = {};
        that.page = that.page + 1;
        $http.get('plugin.elite-award.api.index.reward-log', { page: that.page }, '加载中').then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#eliteAward_record {
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.875rem;
    height: 4.375rem;
    font-size: 1rem;
    background: #fff;
    margin-bottom: 0.25rem;

    .list_child_left {
      text-align: left;
    }

    .list_child_rigth {
      text-align: right;
    }

    .award_type {
      color: #000;
      margin-bottom: 0.75rem;

      .total {
        color: #ff2c29;
      }
    }

    .award_time {
      font-size: 0.75rem;
      color: #999;
    }
  }
}
</style>
