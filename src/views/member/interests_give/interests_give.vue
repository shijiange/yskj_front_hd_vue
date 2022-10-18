<template>
  <div :class="[fun.getPhoneEnv() == 3?'PC-style':'']">
    <c-title :text="titleName"></c-title>
      <div class="item" >
       <p>剩余权益(个)</p>
       <p class="num">{{total}}</p>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      titleName: "",
      total: 0,
    };
  },

  computed: {},

  activated() {
    this.getData();
  },

  methods: {
    async getData() {
      let res = await $http.get('plugin.full-return.frontend.queue.index', {}, "加载中");
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.titleName = res.data.name;
      this.total = res.data.queue_total;
      document.title = res.data.name ? res.data.name : '满额赠送';
    },
  },

};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>

.item {
  width: 21rem;
  height: 8rem;
  margin: 0 auto;
  margin-top: 1rem;
  background-image:
    linear-gradient(
      90deg,
      #3da7ff 0%,
      #1d55ff 100%
    );
  box-shadow: 0 0 1rem 0	rgba(37, 105, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem 0.5rem  0.2rem 1.5rem;
  color: #fff;
  text-align: left;
  overflow: hidden;

  .num {
    margin-top: 1rem;
    font-size: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}
</style>