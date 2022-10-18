<!-- 渠道商 库存明细 -->
<template>
  <div id="distributor_stock">
    <c-title :hide="false" :text="'库存明细'"></c-title>
    <div>
      <van-tabs v-model="active" @click="getData">
        <van-tab title="剩余库存">
          <div class="good_info" @click.stop="gotoGoods(goods.id)">
            <img :src="goods.thumb" alt="" />
            <div class="g_left">
              <div class="titile">{{ goods.title }}</div>
              <!-- v-if="!fun.isTextEmpty(goods.option)" -->
              <div class="goodsOption">规格 {{ goods.option }}</div>
            </div>
          </div>
          <div class="caption">
            <div class="caption_child">库存明细</div>
            <div class="caption_child"></div>
          </div>
          <ul class="listClass">
            <li v-for="(item, index) in list" :key="index">
              <div class="li_left">
                <div class="type">
                  {{ item.channel_order ? item.channel_order.type_name : '' }}
                </div>
                <div class="time">{{ item.created_at }}</div>
              </div>
              <div class="li_right" @click="gotoOrderDetail(item.channel_order.order_id)">
                <div class="num">{{ item.agent_stock }}</div>
                <i class="fa fa-angle-right"></i>
              </div>
            </li>
            <img
              src="../../assets/images/blank.png"
              alt=""
              style="width: 5rem; margin: 2rem 0;"
              v-if="fun.isTextEmpty(list)"
            />
          </ul>
        </van-tab>
        <van-tab title="冻结库存">
          <div class="good_info" @click.stop="gotoGoods(goods.id)">
            <img :src="goods.thumb" alt="" />
            <div class="g_left">
              <div class="titile">{{ goods.title }}</div>
              <!-- v-if="!fun.isTextEmpty(goods.option)" -->
              <div class="goodsOption">规格 {{ goods.option }}</div>
            </div>
          </div>
          <div class="caption">
            <div class="caption_child">库存明细</div>
            <div class="caption_child"></div>
          </div>
          <ul class="listClass">
            <li v-for="(item, index) in list" :key="index">
              <div class="li_left">
                <div class="type">
                  {{ item.channel_order ? item.channel_order.type_name : '' }}
                </div>
                <div class="time">{{ item.created_at }}</div>
              </div>
              <div class="li_right" @click="gotoOrderDetail(item.channel_order.order_id)">
                <div class="num">{{ item.agent_stock }}</div>
                <i class="fa fa-angle-right"></i>
              </div>
            </li>
            <img
              src="../../assets/images/blank.png"
              alt=""
              style="width: 5rem; margin: 2rem 0;"
              v-if="fun.isTextEmpty(list)"
            />
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
// import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      goods: {},
      active: 0,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  components: {
    cTitle
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let _url =
        this.active == 0
          ? 'plugin.channel.frontend.my-stock.getStockLog'
          : 'plugin.channel.frontend.my-stock.getStockLogByFreedom';
      $http
        .post(
          _url,
          {
            goods_id: this.$route.params.goods_id,
            option_id: this.$route.params.option_id
          },
          ''
        )
        .then(response => {
          if (response.result === 1) {
            this.goods = response.data.goods;
            this.goods.option = response.data.goodsOption;
            this.list = response.data.list.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            this.$dialog.alert({message:response.msg});
         
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
        let _url =
          this.active == 0
            ? 'plugin.channel.frontend.my-stock.getStockLog'
            : 'plugin.channel.frontend.my-stock.getStockLogByFreedom';
        let _json = {};
        this.page = this.page + 1;
        _json.page = this.page;
        $http.get(_url, _json, '加载中').then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.last_page;
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
    },
    gotoOrderDetail(_order_id) {
      this.$router.push(
        this.fun.getUrl('DisOrderDetail', {
          order_id: _order_id,
          orderType: 'shop'
        })
      );
    },
    gotoGoods(_id) {
      this.$router.push(this.fun.getUrl('goods', { id: _id }));
    }
  }
};
</script>
<style lang="scss" scoped>
#distributor_stock {
  background: #fff;

  .good_info {
    display: flex;
    padding: 0.875rem;

    img {
      width: 8rem;
      height: 8rem;
      display: inline-block;
      overflow: hidden;
      border-radius: 0.5rem;
      margin-right: 0.875rem;
    }

    .g_left {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .titile {
        line-height: 1.25rem;
        color: #000;
        font-weight: bold;
        font-size: 1rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .goodsOption {
        text-align: left;
      }
    }
  }

  .caption {
    display: flex;
    justify-content: space-between;
    padding: 0 0.875rem;
    height: 1.875rem;
    line-height: 1.875rem;
    background-color: #eee;
    font-weight: bold;
  }

  .listClass {
    padding: 0 0.875rem;

    li {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;

      .li_left {
        width: 50%;
        display: flex;
        flex-direction: column;
        text-align: left;

        .type {
          color: #000;
          font-size: 0.875rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .time {
          color: #999;
          font-size: 0.75rem;
        }
      }

      .li_right {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        font-weight: bold;

        .num {
          color: #ff6333;
          margin-right: 0.25rem;
        }
      }
    }
  }
}
</style>
