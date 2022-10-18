// import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 ,//总页数
      record_id:'',
      questionnaire_id:'',
      choice:[],
      record:[],
      title:''
    };
  },
  activated() {
    console.log(this.$route.params);
    this.record_id = this.$route.params.id;
    this.questionnaire_id = this.$route.params.questionnaire_id;
    this.getData();
  },
  mouted() {},
  methods: {
    goback(){
      this.$router.go(-1);
    },
    getData() {
      let that = this;
      let json = {
        details: "details",
        record_id:that.record_id,
        questionnaire_id:that.questionnaire_id
      };
      $http
        .get("plugin.questionnaire.api.index.indexInfo", json, "")
        .then(
          response => {
            if (response.result === 1) {
              that.choice = response.data.details.choice;
              that.record = response.data.details.record.answers;
              that.total_page = response.data.details.record_id;
              that.title = response.data.details.record.has_one_questionnaire.title;  
              console.log(response.data);
            } else {
              Toast(response.msg);
            }
          },
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {}
};
