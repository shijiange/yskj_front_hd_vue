<template>
  <div id="independenceBalance">
    <c-title :hide="false" :text="title">
      <span slot="edit" class="rightTxt_a" @click="goDetail">{{ title }}明细</span>
    </c-title>
    <div class="userBox">
      <div class="balanceNum">
        <div class="icon-wealth-a"></div>
        我的{{ title }}
      </div>
      <div class="storeName">门店：{{ store_name }}</div>
      <div class="price">
        {{ $i18n.t("money") }}
        <span>{{ member_balance }}</span>
      </div>
    </div>
    <div class="lis">
      <div class="li" @click="goStoreBalance" v-if="show_button">
        <div class="left">
          <i class="iconfont iconfont icon-balance_b"></i>
          <span>充值</span>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";
import Toast from "vant";
export default {
  data() {
    return {
      title: "",
      store_name: "",
      member_balance: 0,
      show_button: ""
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    goDetail() {
      this.$router.push(this.fun.getUrl("storeBalanceDetail", { store_id: this.$route.params.store_id }));
    },
    goStoreBalance() {
      this.$router.push(this.fun.getUrl("storeBalance", { name: "store", store_id: this.$route.params.store_id }));
    },
    getData() {
      $http
        .post("plugin.store-cashier.frontend.store.balance.home.index", { store_id: this.$route.params.store_id }, "")
        .then(response => {
          this.isShow = true;
          if (response.result === 1) {
            this.title = response.data.title;
            this.store_name = response.data.store_name;
            this.member_balance = response.data.member_balance;
            this.show_button = response.data.show_button;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.lis {
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3.57rem;
    border-bottom: solid 0.03rem #ebebeb;
    margin-left: 0.94rem;
    padding-right: 0.94rem;

    .left {
      font-size: 16px;
      color: #333;
      display: flex;
      align-items: center;

      i {
        font-size: 32px;
        color: #fac337;
      }
    }

    i {
      font-size: 16px;
      color: #878787;
    }
  }

  .li:last-child {
    border-bottom: none;
  }
}

.userBox {
  margin: 0.97rem 0.94rem;
  background-color: #fff;
  box-shadow: 0 0.06rem 0.25rem 0 rgba(7, 11, 33, 0.11);
  border-radius: 0.31rem;
  overflow: hidden;
  box-sizing: border-box;

  .price {
    font-size: 15px;
    color: #333;
    margin-bottom: 1.4rem;

    span {
      font-size: 30px;
      color: #333;
    }
  }

  .storeName {
    font-size: 12px;
    color: #333;
    margin-bottom: 1.4rem;
  }

  .icon-wealth-a {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(46).png") no-repeat center;
    background-size: 1.125rem;
    width: 1.125rem;
    height: 1.125rem;
    margin-right: 0.375rem;
  }

  .icon-wealth-a::before {
    content: "";
  }

  .balanceNum {
    display: flex;
    align-items: center;
    padding: 1.09rem 0;
    justify-content: center;
  }
}

.rightTxt_a {
  font-size: 13px;
  color: #333;
}
</style>
