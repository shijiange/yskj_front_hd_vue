<template>
  <div>
    <c-sort :supplier="true" v-on:sortIn="sortOut" style="background:#fff;"></c-sort>
    <div class="choicenessList" v-for="item in good" :key="item.id" @click="toGood(item.goods_id)">
      <div class="img">
        <img :src="item.thumb" alt="" />
      </div>
      <div class="rightBox">
        <div class="title">{{ item.title }}</div>
        <div class="total">已售{{ item.total_sales }}</div>
        <div class="price" v-if="item.has_option == 1">
          {{ $i18n.t("money") }}{{ item.min_price }}
        </div>
        <div class="price" v-else>{{ $i18n.t("money") }}{{ item.price }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import cSort from "components/sort";
export default {
  props: {
    good: {
      type: null,
    },
  },
  data() {
    return {};
  },
  watch: {
    good(res) {
      // console.log(res)
    },
  },
  methods: {
    toGood(key) {
      this.$router.push(this.fun.getUrl("goods", { id: key }));
    },
    getGoods(json) {
      this.$emit("tapJson", json);
    },
    sortOut(e) {
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      let json = {};
      if (this.order_field == "id") {
        // 升降序 综合 asc
        if (this.order_by == "asc") {
          json = {
            order_by: "asc",
          };
        } else {
          json = {
            order_by: "desc",
          };
        }
      } else if (this.order_field == "show_sales") {
        // 升降序 销量
        if (this.order_by == "asc") {
          json = {
            order_by: "asc",
            order_field: "show_sales",
          };
        } else {
          json = {
            order_by: "desc",
            order_field: "show_sales",
          };
        }
      } else if (this.order_field == "price") {
        //升降序 价格
        if (this.order_by == "asc") {
          json = {
            order_by: "asc",
            order_field: "price",
          };
        } else {
          json = {
            order_by: "desc",
            order_field: "price",
          };
        }
      }
      this.getGoods(json);
    },
  },
  components: {
    cSort,
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.choicenessList {
  display: flex;
  align-items: center;
  margin-bottom: 1.56rem;
  margin-top: 0.56rem;
  .rightBox {
    height: 5.31rem;
    margin-left: 0.63rem;
    margin-right: 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .title {
      text-align: left;
      font-size: 0.88rem;
      color: #2c2c2c;
    }
    .total {
      font-size: 0.75rem;
      color: #333333;
    }
    .price {
      font-size: 0.88rem;
      color: #fe5e56;
    }
  }
  .img {
    flex-shrink: 0;
    width: 5.31rem;
    height: 5.31rem;
    background-color: #9d9d9d;
    border-radius: 0.31rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
