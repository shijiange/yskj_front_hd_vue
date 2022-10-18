<template>
  <div>
    <c-title text="粉丝"></c-title>
    <van-list
      class="follow"
      @load="getFans"
      :finished="pagination.finished"
      v-model="pagination.loading"
    >
      <div class="follow-item" v-for="fanItem in fans" :key="fanItem.id">
        <fans-item :data="fanItem"></fans-item>
      </div>
    </van-list>
  </div>
</template>

<script>
import FansItem from "./ScopedComponents/FansItem";
export default {
  mounted(){
    this.fun.setWXTitle("粉丝");
  },
  data() {
    return {
      fans: [],
      pagination: {
        finished: false,
        loading: false,
        pages: 1
      }
    };
  },
  methods: {
    getFans() {
      $http.get("plugin.new-media-advertising.frontend.member.my-fan-list", {
        page: this.pagination.pages
      }).then(({ data: { data: fans, last_page, per_page, current_page } }) => {
        this.pagination.loading = false;
        this.pagination.pages++;
        if (current_page == last_page) {
          this.pagination.finished = true;
        }
        this.fans.push(...fans);
      });
    }
  },
  components: {
    FansItem
  }
};
</script>

<style scoped>
.follow {
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.follow .follow-item {
  margin-bottom: 0.5rem;
}
</style>