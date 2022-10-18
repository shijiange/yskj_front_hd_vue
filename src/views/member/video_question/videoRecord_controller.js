import cTitle from "components/title";
export default {
  data() {
    return {
      page: 1,
      info:[]
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      $http.get("plugin.agent-qa.api.answer_record.index", { page: this.page }).then(
        response => {
          if (response.result === 1) {
            console.log(response);
            that.info = response.data;
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    toList(kid){
      console.log(kid);
      this.$router.push(this.fun.getUrl("videoRecordList",{id:kid}));
    }
  },
  components: {
    cTitle
  }
};