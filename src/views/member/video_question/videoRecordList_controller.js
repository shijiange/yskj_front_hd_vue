import cTitle from "components/title";
export default {
  data() {
    return {
      info:[],
      vid:''
    };
  },
  activated() {
    this.vid = this.$route.params.id;
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      $http.get("plugin.agent-qa.api.answer_record.details", { id: this.vid }).then(
        response => {
          if (response.result === 1) {
            for (let i = 0; i < response.data.answer_record.length; i++) {
              for (let j = 0; j < response.data.answer_record[i].option.length; j++) {
                if (response.data.answer_record[i].option[j].answer == 1 && response.data.answer_record[i].option[j].answer_id == 1) {
                  response.data.answer_record[i].isrela = true;
                }
              }
            }
            that.info = response.data;
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
  },
  components: {
    cTitle
  }
};