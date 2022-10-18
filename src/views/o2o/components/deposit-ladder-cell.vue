<!-- 定金阶梯团 -->
<template>
  <div id="deposit-ladder-cell">
    <div class="activity-goods-details" @click="getGoodDetail">
      <van-image class="activity-goods-cover" width="6.25rem" height="6.25rem" :src="thumb || ''" radius="0.31rem"></van-image>
      <div class="activity-goods-info">
        <div class="activity-goods-title">{{ title }}</div>
        <div class="activity-goods-sku"><i class="iconfont icon-group_list"></i>{{ count ? `${count}人` : "--" }}</div>
        <div class="activity-goods-price">￥{{ price }}</div>
        <div class="activity-goods-footer" @click.stop>
          <span class="activity-goods-deposit">定金：￥{{ deposit }}</span>
          <van-button type="primary" size="mini" color="#f14e4e" @click.stop="toDetail">去下定<i class="fa fa-angle-right" style="margin-left: 6px;"></i></van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from "vant";
export default {
  props: {
    thumb: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: "暂无信息"
    },
    option: {
      type: String,
      default: null
    },
    price: {
      type: String,
      default: ""
    },
    deposit: {
      type: String,
      default: null
    },
    store_id: {
      type: [String, Number],
      default: null
    },
    id: {
      type: [String, Number],
      default: null
    },
    count: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {};
  },

  activated() {},

  components: { VanImage },

  computed: {},

  mounted() {},

  methods: {
    toDetail() {
      let _query = {
        id: this.id
      };
      if (this.store_id) {
        _query.store_id = this.store_id;
      }
      if (!this.id) {
        return;
      }
      this.$router.push(this.fun.getUrl("depositGroupActivity", {}, _query));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.activity-goods-details {
  display: flex;
  align-items: flex-start;
  background: #fff;
  margin: 0 0.5rem 0.75rem;
  padding: 0.75rem;
  text-align: left;
  border-radius: 4px;
  box-shadow: 0 0 0.56rem 0 rgba(169, 169, 169, 0.24);
}

.activity-goods-cover {
  flex-shrink: 0;
}

.activity-goods-info {
  width: 100%;
  margin-left: 0.63rem;
}

.activity-goods-title {
  font-size: 14px;
  height: 2.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #333;
  font-weight: bold;
}

.activity-goods-sku {
  margin-top: 4px;
  line-height: 0.75rem;
  color: #f14e4e;
  font-size: 12px;
  i {
    padding-right: 4px;
  }
}

.activity-goods-price {
  margin-top: 8px;
  line-height: 14px;
  font-size: 14px;
  color: #202020;
  font-weight: bold;
}

.activity-goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.activity-goods-deposit {
  font-size: 0.88rem;
  color: #f14e4e;
  font-weight: bold;
}
</style>
