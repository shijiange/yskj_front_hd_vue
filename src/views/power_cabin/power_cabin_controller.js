//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      member:{},
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    toCheck(){
      this.$router.push(this.fun.getUrl("powerCheck"));
    },
    toMember(){
      this.$router.push(this.fun.getUrl("memberCard"));
    },
    getData() {
      const that = this;
      $http.get('plugin.energy-cabin.frontend.user-terminal.index', {}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.member=response.data;
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
    this.getData();
  }
};
