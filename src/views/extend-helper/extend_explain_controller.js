import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      synopsis: ''
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      $http.get('plugin.promotion-assistant.api.assistant.get-setting', {}, ' ').then(
        response => {
          if (response.result === 1) {
            that.synopsis = response.data.synopsis;
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
  components: { cTitle }
};
