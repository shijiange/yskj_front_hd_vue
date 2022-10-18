<!-- 自定义表单核销 -->
<template>
  <div id="diyRormProveLog">
    <c-title :hide="false" text="核销记录"></c-title>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="item in list" :key="item.id" class="list" @click="toUrl('diyRormProveDetail', { id: item.id })">
          <div class="title">
            <div>{{ (item.form && item.form.title) || `id:${item.id}` }}</div>
            <div style="font-size: 10px;color: #999;">
              {{ item.created_at }}
            </div>
          </div>
          <i class="iconfont icon-member_right"></i>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      total_page: 0,
      page: 1,
      list: []
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    getData() {
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.formDataLg", { page: this.page })
        .then(response => {
          this.refreshing = false;
          this.loading = false;
          if (response.result === 1) {
            if (this.page == 1) {
              this.list = [];
            }
            this.list = this.list.concat(response.data.list.data);
            this.total_page = response.data.list.last_page;
            this.page = this.page + 1;
            if (response.data.list.current_page == response.data.list.last_page) {
              this.finished = true;
            }
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData() {
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.list = [];
    },
    onRefresh() {
      this.initData();
      this.getData();
    },
    onLoad() {
      this.getData();
    },
    onSearch() {
      this.initData();
      this.getData();
    },
    toUrl(_name, _params = {}, _query = {}) {
      if (_name) this.$router.push(this.fun.getUrl(_name, _params, _query));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#diyRormProveLog {
  .list {
    margin: 0.625rem 0.625rem 0;
    padding: 1rem 0.938rem;
    background: #fff;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    .title {
      flex: 1;
      font-size: 15px;
      line-height: 1.25rem;
      text-align: left;
      padding-right: 0.25rem;
    }
    .icon-member_right {
      color: #999999;
    }
  }
}
</style>
