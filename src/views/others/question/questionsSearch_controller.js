import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      key:'',
      list:[],

      plugin_name:'问卷调查'
    };
  },
  activated() {
    this.page = 1;
    this.getData();
    this.key = '';
  },
  mouted() {},
  methods: {
    goback(){
      this.$router.go(-1);
    },
    detail(item){
      if(this.fun.getPhoneEnv() == 1){
        item.start_time = item.start_time.replace(/\./g, "/");
        item.end_time = item.end_time.replace(/\./g, "/");
      }
      if (!this.fun.isTextEmpty(item.start_time) && !this.fun.isTextEmpty(item.end_time)) {
        let timestamp = Date.parse(new Date());
        if (timestamp < Date.parse(new Date(item.start_time))) {
          Toast(`${this.plugin_name}未开始`);
          return;
        }
        if (timestamp > Date.parse(new Date(item.end_time))) {
          Toast(`${this.plugin_name}已结束`);
          return;
        }
      }
      let id = item.id;
      this.$router.push(this.fun.getUrl("questions", { id: id, tag: "index" }));
    },
    onSearch(e){
      console.log(e,this.key);
      this.getData();
    },
    getData() {
      let that = this;
      $http
        .post("plugin.questionnaire.api.index.indexInfo", { page: that.page, index: "index", keyword: { title: that.key } }, "")
        .then(
          response => {
            if (response.result === 1) {
              that.list = response.data.index.list.data;
              that.plugin_name = response.data.plugin_name;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    cTitle
  }
};
