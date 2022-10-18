// import { Toast } from 'vant';
import emptyImage from '../../../../../assets/images/new_diy/image.png';

export default {
  data() {
    return {
      emptyImage
    };
  },
  mounted() {},
  created() {},
  methods: {
    gotoDetail(id) {
      this.$router.push(this.fun.getUrl('caseLibraryDetail', { id: id }));
    },
    gotoLabel(id) {
      this.$router.push(this.fun.getUrl('caseLibraryLabel', { id: id }));
    }
  },
  props: {
    datas: {
      type: Array || Number, //指定传入的类型
      default: [] //这样可以指定默认的值
    },
    listType: {
      type: String,
      default: ''
    }
  }
};
