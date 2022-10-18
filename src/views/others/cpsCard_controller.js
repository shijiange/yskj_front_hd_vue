import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      num: 1,
      arr: [],
      bonus_data: {},
      hot: [],
      category: [],
      acindex: 0,
      indImg: require('../../assets/images/icon_card_menu.png'),
      brand: []
    };
  },
  activated() {
    this.acindex = 0;
    this.getdata();
    window.scrollTo(0,0);
  },
  mouted() {

  },
  methods: {
    tapCard(kid,name) {
      this.$router.push(this.fun.getUrl("cpsList", { id: kid,title:name }));
    },
    tapAcindex(ind) {
      this.acindex = ind;
      this.brand = this.category[ind].brand;
    },
    getdata() {
      let that = this;
      $http
        .get(
          'plugin.aggregation-cps.api.equity',
          {},
          ''
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response.data);
              that.hot = response.data.hot;
              that.category = response.data.category;
              that.brand = response.data.category[0].brand;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.error(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    cTitle,

  }
};