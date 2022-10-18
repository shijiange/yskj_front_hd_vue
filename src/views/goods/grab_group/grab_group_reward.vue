<!-- 抢团--推广中心--奖励记录 -->
<template>
  <div id="grab_group_reward">
    <c-title :hide="false" :text="'我的抢团'"></c-title>
    <div class="top-member">
      <img class="avator" :src="member.avatar" alt="" />
      <div class="name">{{ member.nickname }}</div>
    </div>
    <div class="tab_box">
      <van-tabs v-model="active" @change="getData" sticky>
        <van-tab title="奖励记录">
          <div class="list_child" v-for="(item, index) in list" :key="index">
            <div class="childs">
              <div class="order_sn">订单号:{{ item.order_sn }}</div>
              <div class="money">{{ item.money }} {{ $i18n.t('元') }}</div>
            </div>
            <div class="childs">
              <div class="time">{{ item.created_at }}</div>
              <div class="status">{{ item.settlement_type_name }}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <yz-blank :datas="list" text="暂无记录" :isBtn="false"></yz-blank>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { scrollMixin } from 'utils/mixin';
import yzBlank from '../../../components/ui_components/yz_blank';
import { Toast } from 'vant';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      member: {},
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.getData();
  },
  components: { cTitle, yzBlank },
  computed: {},
  methods: {
    getData() {
      $http
        .post('plugin.snatch-regiment.api.index.getSnatchData', { art: 'rewardRecord' }, '')
        .then(response => {
          if (response.result === 1) {
            this.isLoading = false;
            this.total_page = response.data.rewardRecord.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.member = response.data.rewardRecord.member;
            this.list = response.data.rewardRecord.list.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get('plugin.snatch-regiment.api.index.getSnatchData', { page: that.page, art: 'rewardRecord' }, '加载中')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.rewardRecord.list.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#grab_group_reward {
  .top-member {
    padding: 1.875rem 1.625rem 2rem;
    background: #ee2e2b;
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;

    .avator {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 100%;
      overflow: hidden;
      margin-right: 0.75rem;
    }

    .name {
      flex: 1;
      overflow: hidden;
      font-size: 1rem;
      color: #fff;
      font-weight: bold;
      text-align: left;
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }
  }

  .tab_box {
    padding: 0 0.75rem;
    background: #fff;

    .list_child {
      width: 100%;
      height: 4.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 0.75rem;

      .childs {
        display: flex;
        justify-content: space-between;
        line-height: 1.625rem;

        .order_sn {
          color: #000;
          font-size: 0.875rem;
        }

        .money {
          color: #f15353;
        }

        .time,
        .status {
          color: #666;
        }
      }
    }
  }
}
</style>
