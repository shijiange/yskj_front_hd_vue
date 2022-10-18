//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      member: {},
      total_amount:'',
      plugin_name:'',
    };
  },

  components: {
    cTitle
  },
  mounted() {
    this.getData();
  },

  methods: {
    toExtension(){
      this.$router.push(this.fun.getUrl("withdrawal"));
    },
    getData() {
      const that = this;
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.index', {}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.member = response.data.member;
            that.total_amount=response.data.total_amount;
            that.plugin_name=response.data.plugin_name;
            that.fun.setWXTitle(that.plugin_name);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    toequ() {
      this.$router.push(this.fun.getUrl('powerEquipment'));
    },
    toStore() {
      this.$router.push(this.fun.getUrl('powerStore'));
    },
    toMember() {
      this.$router.push(this.fun.getUrl('powerMember'));
    }
  },
  activated() {}
};
