import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      dividend_id:'',
      bonus:''
    };
  },
  activated() {
    this.dividend_id=this.$route.params.id;
    this.getdividends();
  },

  methods: {
    getdividends(){
      let that = this;
      $http.get("plugin.team-manage.frontend.bonusDetail.index",{id:that.dividend_id}).then(
        function(response) {
          if (response.result == 1) {
            let bonus = response.data.bonus;
            that.bonus = bonus;
          }else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    }
  },
  components: { cTitle }
};