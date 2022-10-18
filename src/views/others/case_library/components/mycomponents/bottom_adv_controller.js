// import { Toast } from 'vant';
import emptyImage from "../../../../../assets/images/new_diy/image.png";

export default {
  data() {
    return {
      emptyImage,
      ad2: {}

    };
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      let that = this;
      let advert = that.$store.state.caseLibrary.advert;
      that.ad2 = (advert.ad2.length && advert.ad2.length == 0) ? {} : advert.ad2;
    },
    gotoRelease() {
      this.$router.push(this.fun.getUrl("caseLibrary", {}));
    }
  }
};
