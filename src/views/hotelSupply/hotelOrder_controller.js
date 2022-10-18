// import { Toast } from 'vant';
import cTitle from "components/title";

export default {
  data() {
    return {
      info:'',
      data_info:''
    };
  },

  activated() {
    if (this.fun.isTextEmpty(this.$route.params.id)) {
      this.$router.push(this.fun.getUrl("home", {}));
    }
    this.id = this.$route.params.id;
    this.getData();
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getData() {
      $http
        .get("plugin.hotel-supply.frontend.hotel-supply.order-info", {
          order_id:this.id
        })
        .then(res => {
          if (res.result == 1) {
            this.data_info = res.data.has_one_hotel;
            this.info=res.data;
          }else{
            this.$dialog.alert({message:res.msg});
          
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goToAdress(lng, lat) {
      let point = this.fun.bd_decrypt( lng, lat );

      window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${this.data_info.name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
    },
  },
  components: { cTitle}
};
