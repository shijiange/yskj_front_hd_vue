<!-- 抢团--中奖纪录--我的抢团 -->
<template>
  <div id="grab_group_my_record">
    <c-title :hide="false" :text="'我的抢团'"></c-title>
    <div class="content">
      <van-tabs v-model="activeName" @change="getData" sticky>
        <van-tab title="中奖">
          <div class="list_box" v-if="dataList[activeName]">
            <div class="list" v-for="(child, i) in dataList[activeName].list" :key="i">
              <div class="time_state">
                <span class="time">活动ID:{{ child.activity_id }} 订单号:{{ child.order_sn }}</span>
                <span class="state"></span>
              </div>
              <div class="goods_box">
                <div class="goods_img">
                  <img :src="!fun.isTextEmpty(child.thumb) ? child.thumb : ''" />
                </div>
                <ul class="goods_name">
                  <li class="name_price">
                    <h2 class="name" style="-webkit-box-orient: vertical;">{{ child.title }}</h2>
                  </li>
                  <li class="option">
                    <div class="option_other">
                      <div class="option_other_child">
                        {{ child.reward_method_name }}
                        <div class="option_num">{{ child.money }}</div>
                      </div>
                      <div>{{ child.settlement_type_name }}</div>
                    </div>
                    <span class="option_other">时间:{{ child.created_at }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="未中奖">
          <div class="list_box" v-if="dataList[activeName]">
            <div class="list" v-for="(child, i) in dataList[activeName].list" :key="i">
              <div class="time_state">
                <span class="time">活动ID:{{ child.activity_id }} 订单号:{{ child.order_sn }}</span>
                <span class="state"></span>
              </div>
              <div class="goods_box">
                <div class="goods_img">
                  <img :src="!fun.isTextEmpty(child.thumb) ? child.thumb : ''" />
                </div>
                <ul class="goods_name">
                  <li class="name_price">
                    <h2 class="name" style="-webkit-box-orient: vertical;">{{ child.title }}</h2>
                  </li>
                  <li class="option">
                    <div class="option_other">
                      <div class="option_other_child">
                        {{ child.reward_method_name }}
                        <div class="option_num">{{ child.money }}</div>
                      </div>
                      <div>{{ child.settlement_type_name }}</div>
                    </div>
                    <span class="option_other">时间:{{ child.created_at }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <template v-if="dataList[activeName]">
        <yz-blank
          :datas="dataList[activeName].list"
          text="暂无记录"
          :isBtn="true"
          btnText="去抢团"
          tolink="grab_group_home"
        ></yz-blank>
      </template>
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
      activeName: 0,
      dataList: [],
      isLoading: false,
      isLoadMore: true
    };
  },

  activated() {
    this.init();
    this.getData();
  },

  components: { cTitle, yzBlank },
  computed: {},
  methods: {
    init() {
      this.activeName = 0;
      this.isLoadMore = true;
      this.dataList = [
        {
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        },
        {
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        }
      ];
    },
    onRefresh() {
      this.dataList[this.activeName].list = [];
      this.getData();
    },
    getData() {
      $http
        .post(
          'plugin.snatch-regiment.api.index.getSnatchData',
          { art: 'leagueReward', prize: this.activeName == 0 ? 1 : 0 },
          ''
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoading = false;
            let that = this;
            if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
              that.isLoadMore = this.dataList[that.activeName].isLoadMore;
              return;
            }
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], 'isLoadMore', true);
            that.$set(this.dataList[that.activeName], 'total_page', response.data.leagueReward.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], 'total_page', 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], 'list', response.data.leagueReward.data);
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
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          art: 'leagueReward',
          prize: this.activeName == 0 ? 1 : 0
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get('plugin.snatch-regiment.api.index.getSnatchData', _json, '').then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.leagueReward.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
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
#grab_group_my_record {
  .content {
    .list_box {
      .list {
        background: #fff;
        margin: 0.875rem;
        overflow: hidden;
        border-radius: 0.375rem;

        .time_state {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          height: 2.25rem;
          line-height: 2.25rem;
          padding: 0 0.875rem;

          .state {
            color: #f15353;
          }
        }

        .goods_box {
          padding: 0 0.5rem 0.5rem;
          display: flex;

          .goods_img {
            width: 7.875rem;
            height: 7.875rem;
            overflow: hidden;
            background: #f2f2f2;
            border-radius: 0.25rem;
            margin-right: 0.875rem;
            flex-shrink: 0;

            img {
              width: 100%;
            }
          }

          .goods_name {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name_price {
              display: flex;
              justify-content: space-between;

              .name {
                width: 100%;
                font-size: 0.875rem;
                color: #000;
                line-height: 1.25rem;
                height: 2.5rem;
                text-align: left;
                font-weight: normal;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }

            .option {
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #5b5b5b;
              font-size: 0.75rem;
              text-align: left;
              line-height: 1.25rem;

              .option_other {
                display: flex;
                justify-content: space-between;
              }

              .option_other_child {
                display: flex;
                align-items: center;
              }

              .option_num {
                font-size: 1rem;
                color: #ff2c29;
              }
            }
          }
        }
      }
    }
  }
}
</style>
