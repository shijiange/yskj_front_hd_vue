import { Toast } from 'vant';
export default {
  data() {
    return {
      pass: false,
      question: [],
      answer: [],
      score: '',
      is_qualified: ''
    };
  },
  activated() {
    window.scrollTo(0,0);
    this.init();
    this.getData();
  },
  methods: {
    init(){
      var that = this;
      that.question= [];
      that.answer= [];
      that.score = [];
      that.is_qualified = '';
      that.pass = false;
    },
    tapAnswer(aid, qid) {
      var that = this;
      let is_asw = {};
      let arr = that.answer;
      is_asw.question_id = qid;
      is_asw.answer_id = aid;
      let qarr = that.question;
      if (that.answer.length == 0) {
        arr[0] = is_asw;
      } else {
        let is_as = that.check(arr, qid);
        console.log(is_as);
        if (is_as || is_as == 0) {
          arr[is_as] = is_asw;
        } else {
          arr[arr.length] = is_asw;
        }
      }
      console.log(arr);
      that.answer = arr;
      for (let i = 0; i < qarr.length; i++) {
        if (qarr[i].id == qid) {
          for (let j = 0; j < qarr[i].option.length; j++) {
            if (qarr[i].option[j].id == aid) {
              that.$set(that.question[i].option[j],'crd',true);
            } else {
              that.$set(that.question[i].option[j],'crd',false);
            }
          }
        }
      }
    },
    check(arr, qid) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].question_id == qid) {
          console.log('1q2', i);
          return i;
        }
      }
    },
    answerClose() {
      this.$router.go(-1);
      console.log('111');
    },
    goApply() {
      // this.submit();
      this.$router.push(this.fun.getUrl("videoApply"));
    },
    again() {
      console.log('重新答题');
      this.answer = [];
      this.pass = false;
      window.scrollTo(0,0);
      this.question = [];
      this.getData();
    },
    getData() {
      var that = this;
      $http.get("plugin.agent-qa.api.answer-question.get-question", {}).then(
        response => {
          if (response.result === 1) {

            that.question = response.data;
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    submit() {
      var that = this;
      console.log(that.answer);
      if(that.answer.length == 0){
        return;
      }
      let as = JSON.stringify(that.answer);
      $http.post("plugin.agent-qa.api.answer-question.answer-question", {  answers:as },'').then(
        response => {
          if (response.result === 1) {
            this.pass = true;
            that.is_qualified = response.data.is_qualified;
            that.score = response.data.score;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    }
  },
  components: {
  }
};