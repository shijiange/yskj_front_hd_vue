<!-- 我的拼团组件 -->
<template>
  <div id="mygroups">
    <c-title :hide="false" text="我的拼购"></c-title>
    <div class="content">
      <van-tabs v-model="active" @change="getData" sticky>
        <van-tab title="拼购中" name="a">
          <div class="list_box">
            <div class="list" v-for="(item, index) in info" :key="index">
              <div class="time_state">
                <span class="time">{{ item.created_at }}</span>
                <span class="state">拼购中,还差{{ item.surplus_num }}人</span>
              </div>
              <div class="goods_box">
                <div class="goods_img">
                  <img :src="!fun.isTextEmpty(item.thumb) ? item.thumb : ''" />
                </div>
                <ul class="goods_name">
                  <li class="name_price">
                    <h2 class="name" style="-webkit-box-orient: vertical;">
                      {{ item.title }}
                    </h2>
                  </li>
                  <li class="option">
                    <span class="timestamp_box"
                      >剩余：
                      <van-count-down :time="fun.getTimeDifference(item.end_time)" format="DD天HH时mm分ss秒"></van-count-down>
                    </span>
                    <span class="total_price">{{ $i18n.t('money') }}{{ item.price }}</span>
                  </li>
                </ul>
              </div>
              <div class="allbt">
                <button
                  type="button"
                  @click="operation(item.order_id, bottonChild)"
                  v-for="bottonChild in item.button_models"
                  :key="bottonChild.value"
                >
                  {{ bottonChild.name }}
                </button>
                <button type="button" @click="gotoOrderDetail(item.order_id)">
                  订单详情
                </button>
                <button type="button" @click="gotoGroup(item.order_id)" class="groupDetail">
                  拼购详情
                </button>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="拼购成功" name="b">
          <div class="list_box">
            <div class="list" v-for="(item, index) in info" :key="index">
              <div class="time_state">
                <span class="time">{{ item.created_at }}</span>
                <span class="state">{{ item.state_name }}</span>
              </div>
              <div class="goods_box">
                <div class="goods_img">
                  <img :src="!fun.isTextEmpty(item.thumb) ? item.thumb : ''" />
                </div>
                <ul class="goods_name">
                  <li class="name_price">
                    <h2 class="name" style="-webkit-box-orient: vertical;">
                      {{ item.title }}
                    </h2>
                  </li>
                  <li class="option">
                    <span class="total_price">{{ $i18n.t('money') }}{{ item.price }}</span>
                  </li>
                </ul>
              </div>
              <div class="allbt">
                <button
                  type="button"
                  @click="operation(item.order_id, bottonChild)"
                  v-for="bottonChild in item.button_models"
                  :key="bottonChild.value"
                >
                  {{ bottonChild.name }}
                </button>
                <button type="button" @click="gotoOrderDetail(item.order_id)">
                  订单详情
                </button>
                <button type="button" @click="gotoGroup(item.order_id)" class="groupDetail">
                  拼购详情
                </button>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="拼购失败" name="c">
          <div class="list_box">
            <div class="list" v-for="(item, index) in info" :key="index">
              <div class="time_state">
                <span class="time">{{ item.created_at }}</span>
                <span class="state">{{ item.state_name }}</span>
              </div>
              <div class="goods_box">
                <div class="goods_img">
                  <img :src="!fun.isTextEmpty(item.thumb) ? item.thumb : ''" />
                </div>
                <ul class="goods_name">
                  <li class="name_price">
                    <h2 class="name" style="-webkit-box-orient: vertical;">
                      {{ item.title }}
                    </h2>
                  </li>
                  <li class="option">
                    <span class="total_price">{{ $i18n.t('money') }}{{ item.price }}</span>
                  </li>
                </ul>
              </div>
              <div class="allbt">
                <button
                  type="button"
                  @click="operation(item.order_id, bottonChild)"
                  v-for="bottonChild in item.button_models"
                  :key="bottonChild.value"
                >
                  {{ bottonChild.name }}
                </button>
                <button type="button" @click="gotoOrderDetail(item.order_id)">
                  订单详情
                </button>
                <button type="button" @click="gotoGroup(item.order_id)" class="groupDetail">
                  拼购详情
                </button>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <yz-blank :datas="info" text="暂无记录" :isBtn="true" btnText="返回首页" tolink="home"></yz-blank>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from '../../../utils/mixin'; //引入加载更多
import yzBlank from '../../../components/ui_components/yz_blank';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      info: [],
      active: 'a',
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.init();
    this.getData(0);
  },
  methods: {
    init() {
      this.info = {};
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    getData() {
      let that = this;
      this.info = [];
      let state = null;
      if (this.active == 'a') {
        state = 1; //正在拼团
      } else if (this.active == 'b') {
        state = 2; //拼团成功
      } else if (this.active == 'c') {
        state = 3; //拼团失败
      }
      let json = {
        state: state,
        art: 'buyList'
      };

      $http.get('plugin.together-purchase.api.index.getTogetherData', json, '').then(
        response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.buyList.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.info = response.data.buyList.data;
            // if (that.fun.isTextEmpty(response.data.buyList.data)) {
            //   Toast({
            //     message: '暂无数据！',
            //     duration: 800
            //   })
            // }
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    operation(order_id, btn) {
      if (btn.value === 'together_purchase_pay') {
        this.toPay(order_id, btn);
      } else {
        this.publicMessage(order_id, btn.api, btn.name);
      }
    },
    publicMessage(order_id, api, text) {
      let _text = text || '';
      if (!api) {
        return;
      }
      this.$dialog.confirm({ message: `确定${_text}?`})
        .then(() => {
          var that = this;
          let json = {
            order_id: order_id
          };
          $http.get(api, json).then(
            function(response) {
              if (response.result == 1) {
                Toast(`${_text}成功`);
                that.getData();
              } else {
                that.$dialog.alert({message:`确定${_text}?`});
               
              }
            },
            function(response) {
              console.log(response);
            }
          );
        }).catch(() => {});
    },
    toPay(item, btn) {
      this.$router.push(
        this.fun.getUrl(
          'orderpay',
          {
            status: 1,
            order_ids: item
          },
          { api: btn.api }
        )
      );
    },
    gotoGroup(id) {
      this.$router.push(this.fun.getUrl('groupBuyDetail', { id: id }));
    },
    gotoOrderDetail(order_id) {
      this.$router.push(
        this.fun.getUrl('orderdetail', {
          order_id: order_id,
          orderType: 'groupsBuy'
        })
      );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      let state = null;
      if (this.active == 'a') {
        state = 1; //正在拼团
      } else if (this.active == 'b') {
        state = 2; //拼团成功
      } else if (this.active == 'c') {
        state = 3; //拼团失败
      }
      let json = {
        state: state,
        art: 'buyList'
      };

      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        json.page = that.page;

        $http
          .get('plugin.together-purchase.api.index.getTogetherData', json, '加载中')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.buyList.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
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
  },
  components: { cTitle, yzBlank },
  filters: {
    startTimes(t) {
      // let unixTimestamp = new Date(t * 1000);
      // return unixTimestamp.toLocaleString();
      let date = new Date(t * 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#mygroups {
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
          font-size: 14px;
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;

          .state {
            color: #f15353;
          }
        }

        .goods_box {
          padding: 0.5rem;
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
                line-height: 1.125rem;
                height: 4.5rem;
                text-align: left;
                font-weight: normal;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
              }

              .price {
                font-size: 14px;
                text-align: right;
                line-height: 1.25rem;

                span {
                  color: #8c8c8c;
                }
              }
            }

            .option {
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #f15353;
              font-size: 14px;
              text-align: left;

              .timestamp_box {
                display: block;
                padding: 0 0.5rem;
                height: 1.25rem;
                line-height: 1.25rem;
                border-radius: 0.625rem;
                background-color: rgba(255, 44, 41, 0.1);

                .van-count-down {
                  display: inline-block;
                  color: #f15353;
                  font-size: 14px;
                  line-height: 1.25rem;
                }
              }

              .total_price {
                font-size: 1rem;
                line-height: 1.5rem;
              }
            }
          }
        }

        .all_price {
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;
          text-align: right;
          font-size: 14px;
          font-weight: normal;

          span {
            font-weight: bold;
            font-size: 18px;
          }
        }

        .allbt {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0.5rem 0.875rem;
          flex-wrap: wrap;

          button {
            border-radius: 0.75rem;
            border: solid 0.0625rem #ff2c29;
            font-size: 12px;
            padding: 0.25rem 0.625rem;
            margin: 0 0 0.625rem 0.625rem;
            color: #ff2c29;
          }

          .groupDetail {
            color: #fff;
            background: #ff2c29;
          }
        }
      }
    }
  }
}
</style>
