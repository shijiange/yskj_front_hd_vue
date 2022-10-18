<template>
  <div>
    <c-title text="查看明细"></c-title>
    <van-list
      class="list"
      @load="getPointDetails"
      v-model="pagination.loading"
      :finished="pagination.finished"
      :immediate-check="false"
    >
      <div class="item" v-for="detailItem in details" :key="detailItem.id">
        <div class="content">
          <div class="name">{{ detailItem.description }}</div>
          <div
            class="price"
            :class="detailItem.status == 1 ? 'recharge' : ''"
          >{{ detailItem.status == 1 ? '+' : '-' }}{{ detailItem.stream }}</div>
        </div>
        <div class="time">{{ detailItem.created_at }}</div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      details: [],
      pagination: {
        pages: 1,
        finished: false,
        loading: false
      }
    };
  },
  mounted() {
    this.getPointDetails();
    this.fun.setWXTitle("查看明细");
  },
  methods: {
    getPointDetails() {
      $http.get("plugin.new-media-advertising.frontend.stream.stream-log-list", {
        page: this.pagination.pages
      }).then(({ data: { last_page, data, current_page } }) => {
        this.pagination.loading = false;
        this.pagination.pages++;
        if (last_page == current_page) {
          this.pagination.finished = true;
        }
        this.details.push(...data);
      });
    }
  }
};
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0.66rem 0.825rem;
  text-align: left;
  background-color: #fff;
  border-bottom: 0.025rem solid #f5f5f5;
}

.item .content {
  display: flex;
}

.item .content .name {
  flex: 1;
  line-height: 0.88rem;
  font-size: 0.88rem;
  color: #000;
}

.item .content .price {
  font-size: 0.7rem;
  color: #389137;
}

.item .content .price.recharge {
  color: #ff2c29;
}

.item .time {
  margin-top: 0.75rem;
  line-height: 0.6rem;
  font-size: 0.6rem;
  color: #666;
}
</style>