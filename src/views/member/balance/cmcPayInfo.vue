<!-- cmc账号管理与修改 -->
<template>
  <div id="cmcPayInfo">
    <c-title :hide="false" text="CMC账号管理"></c-title>
    <van-field v-model="mobile" label="账号" placeholder="请输入账号" />
    <van-field v-model="password" label="密码" placeholder="请输入密码" />
    <div style="margin-top: 2rem; padding: 0 2rem;">
      <van-button type="primary" block @click="saveInfo">保存</van-button>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      mobile: '',
      password: ''
    };
  },
  activated() {
    this.getInfo();
  },
  components: { cTitle },
  computed: {},
  methods: {
    getInfo() {
      let that = this;
      $http.get('plugin.cmc-pay.frontend.account.get-cmc-account', {}, '').then(
        function(response) {
          if (response.result === 1) {
            let _data = response.data;
            if (!that.fun.isTextEmpty(_data)) {
              that.mobile = _data.mobile;
              that.password = _data.password;
            }
          } else {
            // Toast(response.msg)
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    saveInfo() {
      let that = this;
      $http
        .get(
          'plugin.cmc-pay.frontend.account.store-account',
          {
            mobile: this.mobile,
            password: this.password
          },
          ''
        )
        .then(
          function(response) {
            if (response.result === 1) {
              Toast('保存成功');
              that.$router.go(-1);
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            // error callback
          }
        );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cmcPayInfo {
  text-align: left;
}
</style>
