// import { Toast } from 'vant';
import emptyImage from "../../../../../assets/images/new_diy/image.png";

export default {
  data() {
    return {
      emptyImage
    };
  },
  activated() {
  },
  methods: {
    gotoDetail(id) {
      this.$router.push(this.fun.getUrl("caseLibrarySubjectDetail", { id: id }));
    }
  },
  props: {
    datas: {
      type: Array || Number, //指定传入的类型
      default: [] //这样可以指定默认的值
    }

  }
};
