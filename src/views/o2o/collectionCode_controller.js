// import { mapState, mapMutations } from "vuex";
import cTitle from "components/title";
// var haveShop = false;

export default {
  data() {
    return {
      imgSrc:''
    };
  },

  mounted() {
  },
  methods: {
    getdata(){
      $http
        .get("plugin.store-cashier.frontend.store.goods-buy.get-collection-code")
        .then(res => {
          if (res.result === 1) {
            console.log(res);
            this.imgSrc = res.data;
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        });
    }
  },
  computed: {},
  activated() {
    this.getdata();
  },
  created() {
   
  },
  components: { cTitle }
};
