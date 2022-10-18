// import { Toast } from 'vant';
import cTitle from 'components/title';
// import fun from "../../../fun";




export default {
  data() {
    return {
      dateshow_1:false,
      regional:'请选择迁入分站区域',
      columns: ['广东省-广州市-白云区', '广东省-广州市-天河区', '广东省-广州市-海珠区']
    };
  },

  activated() {

   

  },

  mounted() {

    

  },
  methods: {
    seleRegional:function () {
      this.dateshow_1=true;
    },
    onChange(picker, value, index) {

    },
    onCancelbtn:function (val,index) {
      this.dateshow_1=false;
    },
    onConfirmbtn:function (val,index) {
      this.dateshow_1=false;
      this.regional=val;
    }
  },
  components: {cTitle}
};