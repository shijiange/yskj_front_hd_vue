<template>
  <div>
    <!--<c-title :hide="false" :text="title">-->
    <!--</c-title>-->
    <!--<div style="height: 40px"></div>-->
    <div id="a_content" class="content" v-html="content"></div>
  </div>
</template>

<script>
// import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      content: "",
      title: ""
    };
  },
  activated() {
    this.getData();
    if (this.$route.query.show === "agreement") {
      this.title = "用户协议";
    }else if (this.$route.query.show === "cps_agreement") {
      this.title = "用户协议";
    }else if (this.$route.query.show === "cps_privacy") {
      this.title = "隐私政策";
    } else {
      // privacy
      this.title = "隐私政策";
    }
    this.fun.setWXTitle(this.title);
  },
  methods: {
    getData() {
      let that = this;
      let url = "plugin.app-set.frontend.set.index";
      let json = {};
      if(this.$route.query.show === "cps_agreement") {
        url = "plugin.aggregation-cps.api.page-setting.getPageText";
        json = {
          text_type: '1'
        };
      }else if(this.$route.query.show === "cps_privacy") {
        url = "plugin.aggregation-cps.api.page-setting.getPageText";
        json = {
          text_type: '2'
        };
      }
      $http
        .get(url, json, "加载中")
        .then(
          (response)=> {
            if (response.result === 1) {
              if (that.$route.query.show === "agreement") {
                that.content = response.data.agreement;
              }else if (this.$route.query.show === "cps_agreement") {
                that.content = response.data;
              }else if (this.$route.query.show === "cps_privacy") {
                that.content = response.data;
              } else {
                that.content = response.data.privacy;
              }
            } else {
              Toast(response.msg);
            }
          },
          (response)=> {
            console.log(response);
          }
        );
    }
  },
  components: {
    // cTitle
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    padding: 1rem;
  }
</style>
