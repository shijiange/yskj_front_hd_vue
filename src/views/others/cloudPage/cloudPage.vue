<template>
  <div class="cloud"></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get("plugin.cloud-link-port.frontend.controllers.link.index", { activity_id: this.$route.params.id }, ".")
        .then(res => {
          if (res.result == 1) {
            window.location.href = res.data.jump_url;
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>