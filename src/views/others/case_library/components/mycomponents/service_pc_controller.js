// import { Toast } from 'vant';
import emptyImage from "../../../../../assets/images/new_diy/image.png";

export default {
  data() {
    return {
      emptyImage,
      service_phone: "",
      service_qr_code_src: ""
    };
  },
  activated() {

  },
  mounted() {
    this.setData();
  },

  methods: {

    setData() {
      let that = this;
      that.service_phone = that.$store.state.caseLibrary.set.service_phone || "";
      that.service_qr_code_src = that.$store.state.caseLibrary.set.service_qr_code_src || "";
    },
    goTop() {
      window.scrollTo(0, 0);
    }
  },
  props: {
    datas: {
      type: Array || Number, //指定传入的类型
      default: [] //这样可以指定默认的值
    }
  }
};
