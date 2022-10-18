<template>
  <div class="related-links_wrapper">
    <div class="related-links" @click="routerNav($event)">
      <div href class="related-link-item" v-for="linkItem in relatedLink" :key="linkItem.name" :data-router-name="linkItem.routerName">
        <img :src="linkItem.icon" alt class="related-link-icon" :data-router-name="linkItem.routerName" />
        <p class="related-link-title" :data-router-name="linkItem.routerName">{{ linkItem.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      relatedLink: [
        {
          name: "plaen_order",
          title: "订货",
          routerName: "StockGuide",
          icon: require("@/assets/images/stock/plean_order.png")
        },
        {
          name: "my_inventory",
          title: "我的库存",
          routerName: "StockMy",
          icon: require("@/assets/images/stock/my_inventory.png")
        },
        {
          name: "my_order",
          title: "零售",
          routerName: "StockGuide1",
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/images/stock/my_order.png"
        }
      ]
    };
  },
  methods: {
    routerNav(event) {
      const routerName = event.target.dataset.routerName;
      if (routerName == "StockGuide1") {
        this.$router.push(this.fun.getUrl("StockGuide", { target: "retail" }));
      } else {
        this.$router.push(this.fun.getUrl(routerName));
      }
    }
  }
};
</script>

<style scoped>
.related-links_wrapper {
  min-height: calc(100vh - (7.5rem + 0.625rem + 4.25rem));
  background: white;
}

/** 相关链接 */
.related-links {
  display: grid;
  grid-template-columns: repeat(5, 20%);
  padding: 0.3125rem 0;
}

.related-link-item {
  padding: 0.625rem 0.1875rem 0.625rem;
  width: 100%;
  overflow: hidden;
}

.related-link-icon {
  width: 2.1875rem;
  height: 2.1875rem;
}

.related-link-title {
  margin-top: 0.1188rem;
  height: 1rem;
  width: 100%;
  overflow: hidden;
  color: #202020;
  font-weight: 500;
  font-size: 0.6563rem;
}
</style>
