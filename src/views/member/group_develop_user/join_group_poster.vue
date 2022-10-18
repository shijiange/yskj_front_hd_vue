<!-- 通过分享海报或链接进入，生成自己的入群二维码海报 -->
<template>
  <div id="join_group_poster">
    <img :src="url" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: ""
    };
  },

  created() {
    this.getData();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    getData() {
      $http
        .get("plugin.group-develop-user.frontend.group-chat.get-new-post", { id: this.$route.params.id, is_worker: 0 }, ".")
        .then(response => {
          if (response.result == 1) {
            this.url = response.data.image_url;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#join_group_poster {
  padding: 12px;
  img {
    width: 100%;
    object-fit: contain;
  }
}
</style>
