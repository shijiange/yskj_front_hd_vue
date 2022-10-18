import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      code: 'xxx',
      api: '',
      name: ''
    };
  },
  activated() {
    this.name = this.$route.params.name;
    if (this.name === 'blockchain') {
      this.api = 'plugin.asset.Frontend.Modules.Member.Controllers.chain.user-address';
      this.fun.setWXTitle('我的区块链地址');
    } else if (this.name === 'secret') {
      this.api = 'plugin.asset.Frontend.Modules.Member.Controllers.chain.private-key';
      this.fun.setWXTitle('我的秘钥');
    } else {
      this.$router.go(-1);
    }
    this.getData();
  },
  methods: {
    getData() {
      $http.get(this.api, {}, "加载中").then(response => {
        if (response.result === 1) {
          if (this.name === 'blockchain') {
            this.code = response.data.user_address;
          } else if (this.name === 'secret') {
            this.code = response.data.private_key;
          }
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //复制邀请码
    onCopy: function (e) {
      Toast({
        message: '复制成功',
        position: 'bottom',
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: '复制失败',
        position: 'bottom',
        duration: 1000
      });
    },
    isSetPassword() {
      $http.get('plugin.asset.Frontend.Modules.Password.Controllers.has.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.has_mobile = response.data.has_mobile;
          this.has_password = response.data.has_password;
          if (!this.has_mobile) {
            this.$router.push(this.fun.getUrl('editmobile'));
          } else {
            this.passwordData();
          }
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
  },
  components: {cTitle}
};
