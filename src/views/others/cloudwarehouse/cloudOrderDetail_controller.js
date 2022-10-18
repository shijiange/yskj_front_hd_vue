
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      info:[]
    };
  },
  methods: {
    getData() {
      $http
        .get(
          "plugin.cloud-warehouse.frontend.order-detail",
          { order_id: this.$route.params.id },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  activated() {
    console.log(this.$route.params.id);
    this.getData();
  },
  components: { cTitle }
};