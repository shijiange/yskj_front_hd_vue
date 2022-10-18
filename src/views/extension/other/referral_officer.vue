<!-- 推荐官 【49701】 -->
<template>
  <div id="referral_officer">
    <c-title :hide="false" :text="info.custom_name"></c-title>
    <div class="member_info">
      <img :src="info.avatar" alt="" class="avatar" />
      <div class="text">
        <p class="name">{{ info.nickname }}</p>
        <div style="display: flex;">
          <div class="grade">{{ info.level_name }}</div>
        </div>
      </div>
    </div>

    <div class="total_list">
      <div class="total_child">
        <p class="num">{{ info.acount ? info.acount[1].total : '-' }}</p>
        <p class="num_name">累计金额(元)</p>
      </div>
      <div class="total_child">
        <p class="num">{{ info.acount ? info.acount[0].total : '-' }}</p>
        <p class="num_name">未结算(元)</p>
      </div>
    </div>

    <div class="tab_box">
      <van-tabs v-model="active" @click="getInfo" sticky :offset-top="39" swipeable>
        <van-tab :title="items" v-for="(items, index) in arr" :key="index">
          <router-link
            :to="fun.getUrl('referral_officerDetail', { id: item.id })"
            class="list_child"
            v-for="item in list"
            :key="item.id"
            tag="div"
          >
            <div class="childs">
              <div class="order_sn">提成ID:{{ item.id }}</div>
              <div class="money">{{ $i18n.t('money') }} {{ item.reward_money }}</div>
            </div>
            <div class="childs">
              <div class="time">时间:{{ item.created_at }}</div>
              <div class="status">{{ item.state_name }}</div>
            </div>
          </router-link>
        </van-tab>
      </van-tabs>
    </div>
    <yz-blank :datas="list"></yz-blank>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';
import yzBlank from '../../../components/ui_components/yz_blank';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: {},
      list: {},
      active: 0,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      arr: ['全部', '未结算', '已结算']
    };
  },

  activated() {
    this.init();
    this.getInfo(true);
  },

  components: { yzBlank },

  computed: {},

  methods: {
    init() {
      this.list = [];
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getInfo(_tag) {
      $http
        .post('plugin.recommender.api.index.index', { state: this.active }, '')
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.list = response.data.list.data;
            if (_tag) {
              this.fun.setWXTitle(this.info.custom_name);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = { state: this.active };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.post('plugin.recommender.api.index.index', _json, '加载中').then(
          response => {
            let res = response.data;
            that.isLoadMore = true;
            if (res.result === 1) {
              var myData = res.data.list.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            console.log('response', response);
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#referral_officer {
  .member_info {
    height: 7.375rem;
    background-color: #ee2e2b;
    display: flex;
    align-items: center;
    padding: 0 1rem;

    .avatar {
      width: 3.125rem;
      height: 3.125rem;
      border: 3px solid #fff;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 0.5rem 0 0;
    }

    .text {
      overflow: hidden;
      text-align: left;
      flex: 1;

      .name {
        font-size: 1rem;
        line-height: 1.5rem;
        color: #fff;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .grade {
        padding: 0 0.875rem;
        color: #fff;
        border-radius: 1rem;
        height: 1.25rem;
        line-height: 1.25rem;
        background: rgba(255, 255, 255, 0.4);
        font-size: 0.75rem;
      }
    }
  }

  .total_list {
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    margin-bottom: 0.65rem;

    .total_child {
      height: 5.875rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      flex: 1;

      .num {
        font-size: 1rem;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .num_name {
        font-size: 0.875rem;
        color: #666;
      }
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

      .childs {
        display: flex;
        justify-content: space-between;
        line-height: 1.625rem;

        .order_sn {
          color: #000;
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
