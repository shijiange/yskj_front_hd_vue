import cTitle from "components/title";
export default {
  data() {
    return {
      arr: [],
      bonus_data: {},
    };
  },
  activated() {},
  mounted() {

  },
  methods: {
    // 发布普通帖子
    issueTopic(id,index){
      this.$router.push(this.fun.getUrl("circleTopic",{} ,{id:this.$route.query.id,index:1}));
    },
    // 发布视频帖子
    issueVideo(id,index){
      this.$router.push(this.fun.getUrl("circlereleaseVideo",{},{id:this.$route.query.id,index:2}));
    },
  },
  components: {
    cTitle,
  }
};
