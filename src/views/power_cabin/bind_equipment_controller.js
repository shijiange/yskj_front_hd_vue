//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      equipment_no: ''
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    bind() {
      const that = this;
      let json = {
        equipment_no: that.equipment_no
      };
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.add-equipment', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
            that.$router.go(-1);
          } else {
            Toast(response.msg);
            that.$router.go(-1);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  activated() {
    this.equipment_no = '';
  }
};
