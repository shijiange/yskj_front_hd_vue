<!-- 猜你喜欢  -->
<template>
  <div class="like-list">
    <div class="guess-like">
      <div class="guess-like-title">
        <h3>猜你喜欢</h3>
      </div>

      <div class="guess-like-goods">
        <van-swipe class="my-swipe" indicator-color="red">
          <van-swipe-item v-for="(value,i) in list" class="my-swipe-item" :key="i">
            <div class="guess-like-goods-item" v-for="(item,index) in value" :key="index" @click="pushGoodGoto(item)">
              <img :src="item.thumb" alt="">
              <div class="guess-like-goods-title">{{ item.title | escapeTitle }}</div>
              <div class="guess-like-goods-price" v-if="status && status.status == 1">{{ $i18n.t("money") }}{{ word }}</div>
              <div class="guess-like-goods-price" v-else>{{ $i18n.t("money") }}{{ item.price }}</div>
            </div>
          </van-swipe-item>
        </van-swipe>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    word: {
      type: String,
      default: ""
    },
    status: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    //推广商品跳转
    pushGoodGoto(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val.id }));
    }
  }
};
</script>
<style lang="scss" scoped>
.like-list {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
  padding: 0.5rem;
}

.guess-like {
  padding: 0 0.2rem;

  .guess-like-title {
    text-align: left;
    margin: 0.5rem 0;

    h1 {
      color: #5f5e5e;
    }
  }

  .guess-like-goods {
    /deep/ .van-swipe__indicators {
      bottom: 1px;

      .van-swipe__indicator {
        width: 0.25rem;
        height: 0.25rem;
        background-color: #c2c2c2;
        border-radius: 50%;
        margin: 0 0.375rem;
        opacity: 1;
      }

      .van-swipe__indicator--active {
        margin: 0 0.375rem;
        width: 0.5rem;
        height: 0.25rem;
        border-radius: 0.125rem;
      }
    }

    .my-swipe-item {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 1rem;

      .guess-like-goods-item {
        width: 6.1rem;
        margin: 0.25rem;

        img {
          width: 6.1rem;
          height: 6.1rem;
        }

        .guess-like-goods-title {
          width: 6.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
        }

        .guess-like-goods-price {
          text-align: left;
          color: #f14e4e;
        }
      }
    }
  }
}
</style>
