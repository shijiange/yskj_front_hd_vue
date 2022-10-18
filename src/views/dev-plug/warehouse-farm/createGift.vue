<!-- 创建礼物分享 -->
<template>
  <div id="warehouse-farm-createGift">
    <c-title :hide="false" text="送礼物"></c-title>
    <div class="nav">
      <div>赠送设置</div>
      <div style="color: #ff464c;" @click.stop="openPopup('showInstructions', true)">使用说明</div>
    </div>

    <div class="list-item">
      <img class="good-img" :src="stock.thumb" alt="" />
      <div class="item-right">
        <div class="title">{{ stock.title }}</div>
        <div class="good-info">
          <div class="stock">库存：{{ stock.nums }}</div>
        </div>
      </div>
    </div>

    <div class="create-box">赠送数量<input type="number" :placeholder="`请输入数量,最多${stock.nums || ''}${stock.sku || ''}`" v-model="num" />{{ stock.sku }}</div>
    <div class="create-box" style="margin-top:10px;">分享人数<input type="number" placeholder="请输入人数" v-model="share_num" />位</div>
    <div class="share-box set-pc-style">
      <van-button type="primary" :disabled="!num" block color="#ff464c" @click.stop="creatGift">创建分享</van-button>
    </div>

    <van-popup v-model="showInstructions" round position="bottom" :style="{ height: '80%' }">
      <div class="instructions-box">
        <van-nav-bar title="使用说明" right-text="关闭" @click-right="openPopup('showInstructions', false)" />
        <div class="Instructions-content" v-html="explain"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showInstructions: false,
      explain: null,
      stock: {},
      num: null,
      share_num: null
    };
  },

  activated() {
    this.getData();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    getData() {
      $http
        .get("plugin.warehouse.frontend.controllers.gift.give.instructions", { stock_id: this.$route.params.id })
        .then(response => {
          if (response.result === 1) {
            this.explain = response.data.explain;
            this.stock = response.data.stock;
          } else {
            this.$toast(response.msg);
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    creatGift() {
      if (!this.num) {
        this.$toast("请输入数量");
        return;
      }
      if (!this.share_num) {
        this.$toast("请输入分享人数");
        return;
      }
      if (Number(this.num) > Number(this.stock.nums)) {
        this.$toast(`已超出范围，当前库存为${this.stock.nums}`);
        this.num = this.stock.nums;
        return;
      }
      if (Number(this.num) < Number(this.share_num)) {
        this.$toast("赠送数量需要大于分享人数");
        return;
      }
      this.$router.push(this.fun.getUrl("warehouseFarmGiftDetail", { mode: "creat", gid: this.stock.id, nums: this.num, sNum: this.share_num }));
    },
    openPopup(name, check = false) {
      if (name) this[name] = check;
    },
    toUrl(_name, _params = {}, _query = {}) {
      if (_name) this.$router.push(this.fun.getUrl(_name, _params, _query));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-createGift {
  padding: 0 1rem;
  .nav {
    height: 2.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .list-item {
    padding: 0.625rem;
    background: #fff;
    display: flex;
    border-radius: 0.375rem;
    margin-bottom: 0.625rem;
    .good-img {
      width: 4.625rem;
      height: 4.625rem;
      background-color: #9d9d9d;
      border-radius: 0.375rem;
      margin-right: 0.625rem;
    }
    .item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: left;
      .title {
        font-size: 15px;
        color: #2c2c2c;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .good-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .stock {
          color: #8a8a8a;
          font-size: 10px;
        }
      }
    }
  }
  .create-box {
    background: #fff;
    height: 3.5rem;
    background-color: #ffffff;
    border-radius: 0.375rem;
    padding: 0 0.875rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      padding: 0 0.5rem;
      flex: 1;
      border: none;
      text-align: right;
    }
  }
  .share-box {
    padding: 0 1.375rem 0.938rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
.instructions-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .Instructions-content {
    flex: 1;
    overflow-y: scroll;
    padding: 1rem 0.875rem;
  }
}
</style>
