<!-- 开团详情 -->
<template>
  <div id="openGroup_detail">
    <c-title :hide="false" text="开团详情"></c-title>
    <div class="list">
      <div class="list-child" v-for="item in list" :key="item.id">
        <div class="child-top">
          <div class="sn-num">订单编号：{{ item.order_sn }}</div>
          <div class="status-name">{{ item.status_message }}</div>
        </div>
        <div class="member-info">
          <img :src="item.avatar" alt="" class="avtor" />
          <div class="name">{{ item.nickname }}</div>
        </div>
        <div class="list-cell">规格：{{ item.option_title }} x{{ item.purchase_quantity }}</div>
        <div class="list-cell">
          拼团总价：<em>{{ item.price }}</em>
        </div>
        <div class="list-cell">
          实付价格：<em>{{ item.order_price }}</em>
        </div>
        <div class="tiem" v-if="item.status != 2">
          拼团时间：{{ item.created_at }} <template v-if="item.pay_time>0">l 支付时间:{{ fun.timestampToTime(item.pay_time) }}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      list: []
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
        .get(
          'plugin.fight-groups.frontend.store.team-store.search-details',
          { team_id: this.$route.params.id, page: this.page },
          ''
        )
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.data;
          } else {
            Toast(response.msg);
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
#openGroup_detail {
  .list {
    .list-child {
      margin-bottom: 0.625rem;
      background: #fff;
      text-align: left;
      padding: 0.875rem;

      .child-top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.625rem;

        .status-name {
          font-size: 0.75rem;
          color: #f14e4e;
        }
      }

      .member-info {
        display: flex;
        align-items: center;
        padding-bottom: 0.625rem;

        .avtor {
          width: 1.656rem;
          height: 1.656rem;
          border-radius: 50%;
          margin-right: 0.625rem;
        }

        .name {
          flex: 1;
          font-weight: bold;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .list-cell {
        padding-bottom: 0.625rem;

        em {
          color: #f14e4e;
        }
      }

      .tiem {
        font-size: 0.75rem;
        color: #666;
      }
    }
  }
}
</style>
