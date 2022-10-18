//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      card_type: '',
      datas: []
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    getData() {
      const that = this;
      $http
        .get('plugin.energy-cabin.frontend.user-terminal.card-detail', { card_type: that.card_type }, '加载中...')
        .then(
          function(response) {
            if (response.result === 1) {
              that.datas = response.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  },
  activated() {
    this.card_type = this.$route.params.id;
    this.getData();
  }
};
