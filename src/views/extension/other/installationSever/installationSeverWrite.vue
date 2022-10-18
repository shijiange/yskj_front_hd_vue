<!-- 商家核销页 -->
<template>
  <div id="installationSeverWrite">
    <template v-if="status == 1">
      <div class="installShop">
        <div class="shopTitle">
          <div>订单号：{{ detailInfo.order_sn }}</div>
          <div style="color: #f15354;">{{ detailInfo.state_name }}</div>
        </div>
        <div class="shopList" v-for="(item, index) in detailInfo.goods_list" :key="index">
          <div class="shoplis">
            <div class="imgbox">
              <img :src="item.thumb" />
            </div>
            <div class="shoptxt">{{ item.title }}</div>
            <div class="total">数量：x{{ item.total }}</div>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div style="width: 100%; height: 6rem;"></div>
      <div class="posBtn set-pc-styleLeft">
        <div class="btn" @click="sendBtn">确定取货</div>
      </div>
    </template>

    <div class="success" v-if="status == 2">
      <i class="iconfont icon-wancheng"></i>
      <p>核销成功</p>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      detailInfo: {},
      status: 1
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
        .get("plugin.live-install.frontend.store-order.orderDetail", { take_sn: this.$route.params.take_sn }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.detailInfo = res.data;
          } else {
            Toast(res.msg);
            if (window.history.length <= 1) {
              this.$router.push(this.fun.getUrl("home", {}));
            } else {
              this.$router.go(-1);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    sendBtn() {
      $http
        .get("plugin.live-install.frontend.store-order.takeOrder", { order_id: this.detailInfo.order_id }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.status = 2;
          } else {
            Toast(res.msg);
            return;
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
/* packageH/installationSever/installationSeverWrite/installationSeverWrite.wxss */

.installShop {
  background-color: #fff;
  padding: 0.78rem 0.88rem 0.94rem 0.94rem;
  box-sizing: border-box;
}

.installShop .shopTitle {
  font-size: 0.69rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
}

.installShop .shopList {
  padding-bottom: 0.5rem;
}

.installShop .shopList .shoplis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.66rem 0 0 0;
  box-sizing: border-box;
}

.installShop .shopList .shoplis .imgbox {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #c3c3c3;
  margin-right: 0.47rem;
}

.installShop .shopList .shoplis .imgbox img {
  width: 2.5rem;
  height: 2.5rem;
}

.installShop .shopList .shoplis .shoptxt {
  flex: 1;
  font-size: 0.88rem;
  text-align: left;
}

.installShop .shopList .shoplis .total {
  color: #202020;
  font-size: 0.69rem;
}

.installShop .shopList .shopBtns {
  display: flex;
  justify-content: flex-end;
}

.installShop .shopList .shopBtns .shopBtn {
  width: 4.06rem;
  height: 1.88rem;
  background-color: #f15354;
  border-radius: 0.31rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-left: 0.63rem;
}

.posBtn {
  width: 100%;
  height: 2.75rem;
  position: fixed;
  bottom: 0.91rem;
}

.posBtn .btn {
  width: 21.56rem;
  height: 2.75rem;
  background-color: #f15354;
  border-radius: 0.31rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin: 0 auto;
}

.success {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 20px;
  color: #f15354;
  font-size: 13px;
  font-weight: bold;
  text-align: center;

  .icon-wancheng {
    color: #f15354;
    font-size: 40px;
  }
}

.success p {
  margin-top: 5px;
}
</style>
