// import { Toast } from 'vant';
import cTitle from "components/title";

export default {
  data() {
    return {
      article_data: [],
      title: ""
    };
  },

  computed: {},

  activated() {
    this.initData();
    if(this.$route.query.from === 'U_headline') {
      if (localStorage.getItem("showheadline")) {
        let obj = JSON.parse(localStorage.getItem("showheadline"));
        this.article_data = obj.list;
        this.title = '头条列表';
      }
    }else {
      if (localStorage.getItem("showheadline")) {
        let obj = JSON.parse(localStorage.getItem("showheadline"));
        this.article_data = obj.data;
        this.title = obj.params.toptitle;
      }
    }
    this.fun.setWXTitle("");
  },

  mounted() {
  },
  methods: {
    //跳转
    gotoArticle(item) {
      if(item.has_one_article_pay){
        if(item.has_one_record){
          this.$router.push(this.fun.getUrl("articleContent", { id: item.articleid ? item.articleid: item.id,home:'1' }));
        }else{
          this.$router.push(this.fun.getUrl("payList", { id: item.articleid ? item.articleid: item.id,home:'1' }));
          return;
        }
      }else{
        this.$router.push(this.fun.getUrl("articleContent", { id: item.articleid ? item.articleid: item.id,home:'1' }));
        return;
      }
    },

    //初始化数据
    initData() {
      this.article_data = [];
      this.title = "";
    }
  },
  components: { cTitle }
};
