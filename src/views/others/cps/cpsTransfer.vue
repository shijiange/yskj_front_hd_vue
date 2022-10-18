<template>
  <div>
  </div>
</template>

<script>
import { cpsApi } from "../../../utils/cpsApi"; //引入CPS方法
export default {
  mixins: [cpsApi],
  data() {
    return {
      id: '',
      phone: '',
      need_mobile: ''
    };
  },
  activated() {
    this.id = this.$route.query.plat_id;
    this.need_mobile = this.$route.query.need_mobile;
    if(this.need_mobile == 1) {
      // 需要获取手机号
      this.getPhone();
    }else {
      this.getCPSLogin('link');
    }
  },
  methods: {
    getPhone() {
      $http.get("plugin.aggregation-cps.api.web.getMobile").then((response) => {
        if (response.result == 1) {
          this.phone = response.data.mobile;
          if(this.phone) {
            this.getCPSLogin('link');
          }else {
            this.$router.push(this.fun.getUrl("editmobile"));
          }
        }else {
          this.$dialog.alert({ message: response.message });
        }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>