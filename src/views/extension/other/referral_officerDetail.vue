<!-- 推荐官-查看详情 -->
<template>
  <div id="referral_officerDetail">
    <c-title :hide="false" text="查看详情"></c-title>
    <div class="list" v-for="(item, i) in list" :key="i">
      <div class="sn-info">
        <div class="sn-num">订单号：{{ item.order_sn }}</div>
        <div class="sn-time">时间：{{ item.created_at }}</div>
      </div>
      <div class="member-info">
        <img :src="item.avatar" alt="" class="avatar" />
        <div class="nickname">{{ item.nickname }}</div>
      </div>
      <div class="goods">
        <img :src="item.thumb" alt="" class="thunmb" />
        <div class="goods-r">
          <div class="good-title">{{ item.title }}</div>
          <div class="goods-price">{{ $i18n.t('money') }} {{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.getInfo();
  },

  components: {},

  computed: {},
  methods: {
    getInfo() {
      $http
        .post('plugin.recommender.api.index.detail', { r_id: this.$route.params.id }, '')
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.list = response.data.data;
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
        let _json = { r_id: this.$route.params.id };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.post('plugin.recommender.api.index.detail', _json, '加载中').then(
          response => {
            let res = response.data;
            that.isLoadMore = true;
            if (res.result === 1) {
              var myData = res.data.data;
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
#referral_officerDetail {
  .list {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 0 0.875rem;
    text-align: left;
    margin-bottom: 0.875rem;

    .sn-info,
    .member-info,
    .goods {
      padding: 0.875rem 0;
      border-bottom: 1px solid #ebebeb;
    }

    .sn-info {
      display: flex;
      flex-direction: column;

      .sn-num {
        font-size: 0.875rem;
        color: #333;
      }

      .sn-time {
        font-size: 0.75rem;
        color: #999;
      }
    }

    .member-info {
      display: flex;

      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 100%;
        margin: 0;
        margin-right: 0.875rem;
      }
    }

    .goods {
      display: flex;
      border: none;

      .thunmb {
        width: 4.375rem;
        height: 4.375rem;
        margin: 0;
        margin-right: 0.875rem;
      }

      .goods-r {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .good-title {
          line-height: 1.125rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .goods-price {
          font-size: 0.75rem;
        }
      }
    }
  }
}
</style>
