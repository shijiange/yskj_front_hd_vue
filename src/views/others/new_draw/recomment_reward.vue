<!-- 我的奖品列表 -->
<template>
  <div id="recomment_reward">
    <c-title :hide="false" text="中奖推荐奖励"></c-title>
    <div class="ul">
      <!-- 我的抽奖 -->
      <div class="li" v-for="(item, index) in list" :key="index">
        <div class="top-box flex-style">
          <div class="color-text">活动id:{{ item.activity_id }}</div>
          <div>{{ item.created_at }}</div>
        </div>
        <div class="reward-details">
          <div class="reward-details-title">奖励</div>
          <div class="reward-list">
            <div class="list" v-html="item.content"></div>
          </div>
        </div>
        <div class="good-box flex-style" v-if="item.is_identical">
          <img :src="item.goods_thumb" alt="" class="good-img" />
          <div class="good-other flex-style">
            <div class="tt flex-style">
              <div class="good-title">{{ item.goods_name }}</div>
            </div>
          </div>
        </div>
        <div class="order-btn">
          <div class="btn" v-if="item.reward_data_id && item.is_used == 0" @click.stop="confirmBtn(item, 0)">填写地址</div>
          <div class="btn" v-if="item.reward_data_id && item.is_used == 1 && item.order_id" @click.stop="confirmBtn(item, 1)">查看订单</div>
        </div>
      </div>
      <yz-blank v-if="fun.isTextEmpty(list)" :data="list" text="暂无奖励记录" :isBtn="false"></yz-blank>
    </div>

    <van-popup v-model="showAddrss" class="award-information" position="bottom" :style="{ height: '80%' }">
      <van-nav-bar title="中奖推荐奖励" right-text="返回" @click-right="showAddrss = false" />
      <van-cell-group v-if="activityInfo.type == 2 && activityInfo.need_address == 1">
        <van-field v-model="tel" type="tel" label="手机号" placeholder="请输入手机号" />
      </van-cell-group>
      <div class="address-box" v-else @click.stop="getAddress">
        <div class="address-title">收货地址</div>
        <div class="addr" v-if="!fun.isTextEmpty(activityInfo.address)">
          <i class="fa fa-map-marker"></i>
          <div class="address-info">
            <div class="address-namenick">收货人:{{ activityInfo.address.username }} {{ activityInfo.address.mobile }}</div>
            <div class="address-shipping">
              {{ activityInfo.address.province }} {{ activityInfo.address.city }} {{ activityInfo.address.district }} {{ activityInfo.address.street || "" }} {{ activityInfo.address.address }}
            </div>
          </div>
          <i class="fa fa-angle-right"></i>
        </div>
        <div v-else class="addr">
          <i class="fa fa-map-marker"></i>
          <div class="address-info" style="padding: 0.875rem;">
            请选择收货地址
          </div>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div class="confirm-address-btn" @click.stop="joinActivity">确定</div>
    </van-popup>
    <yz-address-list v-model="showAddress" v-on:confirm="confirmSelectAddress"></yz-address-list>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";
import yzBlank from "components/ui_components/yz_blank";
import yzAddressList from "components/ui_components/yz_addressList/index";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showAddrss: false,
      activityInfo: {},
      activity_id: 0,
      reward_data_id: 0, //奖励商品记录ID
      list: [],
      showAddress: false,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.getData();
  },

  components: { yzBlank, yzAddressList },

  computed: {},

  methods: {
    confirmBtn(order, status) {
      this.activity_id = order.activity_id;
      this.reward_data_id = order.reward_data_id;
      if (status == 0) {
        //当奖励有商品时。填写地址参加
        this.addActivity();
      } else {
        //查看订单详情
        if (order.order_id) {
          this.$router.push(this.fun.getUrl("orderdetail", { order_id: order.order_id, orderType: "luck-draw" }));
        }
      }
    },
    addActivity() {
      $http
        .get("plugin.luck-draw.frontend.team.getActivity", { activity_id: this.activity_id }, "")
        .then(res => {
          if (res.result == 1) {
            this.activityInfo = res.data;
            this.showAddrss = true;
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取收货地址
    getAddress() {
      this.addressData = [];
      let that = this;
      $http.get("member.member-address.index", {}, "获取中").then(
        function(response) {
          if (response.result === 1) {
            that.showAddress = true;
            that.addressData = response.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    confirmSelectAddress(item) {
      this.activityInfo.address = item;
      this.showAddress = false;
    },
    joinActivity() {
      let _json = {
        reward_data_id: this.reward_data_id,
        address: JSON.stringify(this.activityInfo.address)
      };

      if (this.activityInfo.type == 2 && this.activityInfo.need_address == 1) {
        //虚拟商品并且开启不填写地址
        if (this.fun.isTextEmpty(this.tel)) {
          Toast("请填写手机号码");
          return;
        }
        _json.address = JSON.stringify({ mobile: this.tel });
      } else {
        if (this.fun.isTextEmpty(this.activityInfo.address)) {
          Toast("请选择收货地址");
          return;
        }
      }
      $http
        .get("plugin.luck-draw.frontend.team.rewardJoinActivity", _json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.getData();
            this.showAddrss = false;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      $http
        .get("plugin.luck-draw.frontend.index.recommendList", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        $http.get("plugin.luck-draw.frontend.index.recommendList", { page: this.page }).then(res => {
          console.log(res);
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = res.data.data;
            this.list = this.list.concat(nextPageData);
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
            console.log(res.msg);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#recomment_reward {
  .flex-style {
    display: flex;
    justify-content: space-between;
  }

  .color-text {
    color: #000;
  }

  .ul {
    padding: 0.875rem;

    .li {
      padding: 0.75rem;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      font-size: 10px;
      color: #666;
      margin-bottom: 10px;

      .top-box {
        width: 100%;
        line-height: 1.5rem;
        padding-bottom: 0.5rem;
      }

      .reward-details {
        text-align: left;
        width: 100%;
        background-color: #fff4f4;
        border-radius: 0.375rem;
        margin-bottom: 0.75rem;
        padding: 0.875rem;

        .reward-details-title {
          line-height: 1rem;
          color: #202020;
        }

        .reward-list {
          padding-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;

          .list {
            margin-right: 0.5rem;
            line-height: 1.125rem;
          }
        }
      }

      .good-box {
        .good-img {
          width: 3.125rem;
          height: 3.125rem;
          background-color: #666;
          border-radius: 0.125rem;
          margin: 0 0.75rem 0 0;
        }

        .good-other {
          flex: 1;
          flex-direction: column;

          .good-title {
            font-size: 14px;
            padding-right: 1rem;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }

      .order-btn {
        padding-top: 0.75rem;
        display: flex;
        flex-direction: row-reverse;

        .btn {
          padding: 0 0.75rem;
          height: 1.5rem;
          line-height: 1.5rem;
          border-radius: 0.75rem;
          border: solid 1px #b4b4b4;
          margin-left: 0.875rem;
        }

        .btn-bg {
          background: #f14e4e;
          border-color: #f14e4e;
          color: #fff;
        }
      }
    }
  }

  .award-information {
    background-color: #f2f2f2;

    .add-num {
      padding: 0 0.875rem;
      margin-bottom: 0.875rem;
      height: 4.875rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .add-num-name {
        text-align: left;

        .name1 {
          font-size: 16px;
          margin-bottom: 0.375rem;
        }

        .name2 {
          font-size: 12px;
          color: #f14e4e;
        }
      }
    }

    .address-box {
      padding: 0 0.875rem;
      background: #fff;
      text-align: left;

      .address-title {
        height: 3rem;
        line-height: 3rem;
        font-size: 16px;
      }

      .addr {
        display: flex;
        align-items: center;

        i {
          font-size: 18px;
        }

        .address-info {
          padding: 0 0.875rem 0.875rem;
          flex: 1;

          .address-namenick {
            font-weight: 700;
            margin-bottom: 0.25rem;
          }
        }
      }
    }
  }

  .confirm-address-btn {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 21.625rem;
    height: 2.75rem;
    background-color: #f14e4e;
    border-radius: 1.375rem;
    font-weight: 700;
    font-size: 16px;
    color: #fff;
    line-height: 2.75rem;
  }
}
</style>
