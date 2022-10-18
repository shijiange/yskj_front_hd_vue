// import cTitle from "../components/title";
// import District from "ydui-district/dist/gov_province_city_area_id";
import { Toast } from "vant";
import diyfrom from "../components/diyform";

export default {
  data() {
    return {
      form_id:'',
      goodsId:'',
      optionsId:'',
      total:'',
      tag:''
    };
  },

  mounted() {
    // console.log(this.diydata, "芝士奶盖");
    this.form_id = this.$route.params.id;
    this.goodsId = this.$route.params.goodsId;
    this.optionsId = this.$route.params.optionsId;
    this.total = this.$route.params.total;
    if (!this.form_id) {
      Toast("该表单不存在！");
      this.$router.push(this.fun.getUrl("member"));
    }
    if (this.$route.params.tag) {
      this.tag = this.$route.params.tag;
    }
  },
  methods: {},
  activated() {
    this.form_id = this.$route.params.id;
    this.goodsId = this.$route.params.goodsId;
    this.optionsId = this.$route.params.optionsId;
    this.total = this.$route.params.total;
    if (!this.form_id) {
      Toast("该表单不存在！");
      this.$router.push(this.fun.getUrl("member"));
    }
    if (this.$route.params.tag) {
      this.tag = this.$route.params.tag;
    }
  },
  created() {
  },
  components: { diyfrom }
};
