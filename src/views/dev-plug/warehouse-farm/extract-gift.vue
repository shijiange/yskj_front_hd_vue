<!-- 提取礼物 -->
<template>
  <div id="warehouse-farm-extract-gift">
    <c-title :hide="false" text="提礼物"></c-title>
    <van-sticky :offset-top="40">
      <van-search v-model="keyword" placeholder="搜索商品" shape="round" @search="onSearch" />
    </van-sticky>

    <van-checkbox-group v-model="result" ref="checkboxGroup" checked-color="#ff464c" @change="changeGroup">
      <van-checkbox :name="item" v-for="item in list" :key="item.id">
        <div class="list-item">
          <img class="good-img" :src="item.thumb" alt="" />
          <div class="item-right">
            <div class="title">{{ item.title }}</div>
            <div class="good-info" @click.stop>
              <div class="stock">库存：{{ item.nums }}</div>
              <van-stepper min="0" :max="item.nums" v-model="item.total" button-size="22px" />
            </div>
          </div>
        </div>
      </van-checkbox>
    </van-checkbox-group>

    <div class="bottom-button-box set-pc-style">
      <van-checkbox v-model="checked" @click="checkChange" checked-color="#ff464c">全选</van-checkbox>
      <van-button type="primary" size="small" round color="#ff464c" style="padding:0 30px;" @click="toOrder">下单</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      list: [],
      result: [],
      checked: false
    };
  },

  activated() {
    this.ininData();
    this.getData();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    ininData() {
      this.checked = false;
      this.keyword = "";
      this.list = [];
      this.result = [];
    },
    onSearch() {
      this.list = [];
      this.getData();
    },
    getData() {
      $http
        .get("plugin.warehouse.frontend.controllers.takeDelivery.list", { keyword: this.keyword }, ".")
        .then(response => {
          this.refreshing = false;
          if (response.result === 1) {
            this.list = response.data;
            for (let j = 0; j < this.list.length; j++) {
              this.list[j].total = 1;
            }
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toOrder() {
      if (this.result.length == 0) {
        this.$toast("请选择礼物！");
        return;
      }
      let _json = [];
      for (let j = 0; j < this.result.length; j++) {
        let obj = {};
        obj["goods_id"] = this.result[j].id;
        obj["total"] = this.result[j].total;
        obj["option_id"] = 0;
        _json.push(obj);
      }
      let json_data = {
        tag: "warehouse"
      };
      json_data.goods = JSON.stringify(_json);
      this.$router.push(this.fun.getUrl("goodsorder", {}, json_data));
    },
    changeGroup(e) {
      this.checked = e.length == this.list.length && e.length ? true : false;
    },
    checkChange(e) {
      if (this.list.length > 0) this.$refs.checkboxGroup.toggleAll(this.checked);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-extract-gift {
  padding-bottom: 80px;
  .van-checkbox-group {
    padding: 0 0.875rem;

    .van-checkbox {
      margin-top: 0.625rem;
      background: #fff;
      padding-left: 0.5rem;
      border-radius: 0.375rem;
    }
  }
  /deep/.van-checkbox__label {
    flex: 1;
  }
  .list-item {
    flex: 1;
    display: flex;
    background: #fff;
    padding: 0.625rem 0.625rem 0.625rem 0rem;
    border-radius: 0.375rem;
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
      justify-content: space-between;
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
  .bottom-button-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 3rem;
    line-height: 3rem;
    background-color: #ffffff;
    box-shadow: 1px -1px 1px 0rem rgba(205, 205, 205, 0.4);
    display: flex;
    align-items: center;
    padding: 0 0.938rem;
    justify-content: space-between;
  }
}
</style>
