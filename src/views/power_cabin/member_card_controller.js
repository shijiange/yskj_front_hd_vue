

import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      result: {},
      index:'0',
    };
  },

  components: {
    cTitle
  },
  mounted() {
    this.getData();
  },
  methods: {
    getIndex(val){
      this.index=val;
    },
    toFamily(id) {
      this.$router.push(this.fun.getUrl('addFamily',{ id: id }));
    },
    toDetail(id) {
      this.$router.push(this.fun.getUrl('cardDetail', { id: id }));
    },
    toRecord(id) {
      this.$router.push(this.fun.getUrl('powerCancellation', { card_type: id }));
    },
    getData() {
      const that = this;
      $http.get('plugin.energy-cabin.frontend.user-terminal.member-card', {}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.result = response.data;
           
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
   
  }
};
