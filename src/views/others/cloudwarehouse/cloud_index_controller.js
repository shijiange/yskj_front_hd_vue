
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      tu1: require('../../../assets/images/cloudthq2.png'),
      tu2: require('../../../assets/images/cloudfc2.png'),
      tu3: require('../../../assets/images/cloudthdd2.png'),
      tu4: require('../../../assets/images/cloudjd1.png'),
      member: '',
      avatar_image: ''
    };
  },
  methods: {
    getData(kid) {
      $http
        .get(
          "plugin.cloud-warehouse.frontend.user-cloud-warehouse.index",
          {},
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.member = response.data;
            this.avatar_image = response.data.avatar_image;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goth(){
      this.$router.push(
        this.fun.getUrl("pickUpArea", { })
      );
    },
    gothdd(){
      this.$router.push(
        this.fun.getUrl("cloudOrderList", { })
      );
    },
    gojd(){
      this.$router.push(
        this.fun.getUrl("cloudRecord", { })
      );
    }
  },
  activated() {
    this.getData();
  },
  components: { cTitle }
};