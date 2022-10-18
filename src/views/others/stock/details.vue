<template>
  <div class="inventory-details" v-if="goods">
    <c-title text="库存明细"></c-title>
    <div @click="viewGoods(goods.id)">
      <goods-item class="goods-item" :data="goods" />
    </div>
    <div class="details">
      <div class="details-title">库存明细</div>
      <d-list
        @load="getOrderDetails"
        :finished="!isMoreData"
        :loading="loading"
        :showStatusText="false"
      >
        <ul class="detail-list">
          <li class="detail-item" v-for="detailItem in stockDetails" :key="detailItem.id">
            <template v-if="detailItem.type == 3">
              <div class="detail-date">{{ detailItem.created_at }}</div>
              <div class="detail-title">修改库存为{{ detailItem.stock }}</div>
            </template>
            <template v-else>
              <div class="detail-date">{{ detailItem.created_at }}</div>
              <div class="detail-title">{{ detailItem.type===1?'出货':'进货' }}</div>
              <div class="detail-title">{{ detailItem.type===1?'出货数量:':'进货数量:' }}
                <span style="color: red;">{{ detailItem.type===1?'-':'+' }}{{detailItem.goods_total}}</span>
                </div>
              <div class="detail-title">
                {{ detailItem.type===1?'出货价格:':'进货价格:' }}
                <span style="color: red;">{{detailItem.price}}</span>
              </div>
            </template>
            
          </li>
        </ul>
      </d-list>
    </div>
  </div>
</template>

<script>
import GoodsItem from "@/components/member/stock/goods_item.vue";
import DList from "@/components/dlist";
import { Toast } from "vant";
export default {
  activated() {
    console.log(this.$route.query)
    // if (!this.$route.query.id) {
    //   Toast.fail("库存明细不存在");
    //   this.$router.go(-1);
    //   return;
    // }
    this.detailsId = parseInt(this.$route.query.id);
    this.getOrderDetails();
  },
  data() {
    return {
      detailsId: 0,
      goods: null,
      stockDetails: [],
      loading: false,
      isMoreData: true,
      page: 1
    };
  },
  methods: {
    viewGoods(goodsId) {
      this.$router.push(
        this.fun.getUrl("goods", {
          id: goodsId
        })
      );
    },
    getOrderDetails() {
      if (this.loading === true || this.isMoreData === false) {
        return;
      }
      this.loading = true;
      $http
        .post("plugin.agency.api.stock.log-list", {
          page: this.page,
          goods_id: this.detailsId
        })
        .then(({ result, data, msg }) => {
          if (result === 0) {
            Toast.fail(msg);
            this.$router.push(this.fun.getUrl("member"));
            return;
          }
          if (data.current_page == data.last_page || data.data.length === 0 || data.data.length < data.pre_page) {
            this.isMoreData = false;
          }
          this.page++;
          this.goods = data.goods;
          this.stockDetails = data.data;

          this.loading = false;
        });
    }
  },
  components: {
    GoodsItem,
    DList
  }
};
</script>

<style scoped>
/* .goods-item { */

/* } */

.inventory-details {
  padding: 0.9375rem;
}

.details {
  padding: 0.75rem;
  margin-top: 0.625rem;
  border-radius: 0.3438rem;
  background: white;
}

.details-title {
  position: relative;
  padding-left: 0.3438rem;
  width: 100%;
  overflow: hidden;
  font-size: 0.9375rem;
  text-align: left;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.details-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 0.125rem;
  height: 13.5008px;
  border-radius: 0.125rem;
  background-color: #fb6b68;
}

/* 明细列表 */
.detail-list {
  font-size: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.6875rem 0;
  border-bottom: 1px solid #efefef;
}

.detail-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.detail-item div {
  flex-grow: 1;
  text-align: left;
}

.detail-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 0.25rem;
}

.detail-date {
  margin-top: 0.6875rem;
  color: #8c8c8c;
}

.detail {
  flex-shrink: 0;
  padding-left: 0.3125rem;
}

.detail.detail-positive {
  color: #0cb156;
}

.detail.detail-negative {
  color: #f15353;
}
</style>