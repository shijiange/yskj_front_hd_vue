import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      setInter_Week: "",
      id: "",
      score: "",
      allNum: "",
      rewardPoint: "",
      info: [],
      banner: "",
      tag:'index',
      goods_id:'',
      plugin_point_name:''
    };
  },
  activated() {
    this.init();
    this.id = this.$route.params.questionnaire_id;
    this.score = this.$route.params.score;
    this.allNum = this.$route.params.allNum;
    this.rewardPoint = this.$route.params.rewardPoint;
    this.plugin_point_name = this.$route.params.plugin_point_name?this.$route.params.plugin_point_name:'积分';
    this.tag = this.$route.params.tag;
    this.goods_id = this.$route.params.goods_id;
    this.mycanvasTap();
    this.getData();
  },
  mouted() {},
  methods: {
    init(){
      this.id = '';
      this.score = '';
      this.allNum = '';
      this.rewardPoint = '';
      this.tag = '';
      this.goods_id = '';
    },
    goback(){
      if(this.tag == 'video'){
        this.$router.push(this.fun.getUrl("CourseDetail", { id: this.$route.params.goods_id }));
      }else{
        this.$router.push(this.fun.getUrl("questionnaireIndex", { id: this.$route.params.goods_id }));
      }
    },
    back() {
      this.$router.push(this.fun.getUrl("questionnaireIndex", {}));
    },
    mycanvasTap() {
      // 底色圆
      this.drawGraycir();
      setTimeout(() => {
        this.drawColorcir(parseInt((this.score / this.allNum) * 100));
      }, 500);
    },
    drawColorcir(progress = "55") {
      // 进度圆
      let that = this;
      var canvas = document.getElementById("cirWeek_run");
      var ctx = canvas.getContext("2d");
      var canvasWidth = document.getElementById("myCanvas");
      let awidth = Math.ceil((Number(window.getComputedStyle(canvasWidth).width.replace(/px/, "")) - 1) / 2);
      let aheight = Math.ceil((Number(window.getComputedStyle(canvasWidth).height.replace(/px/, "")) - 1) / 2);
      let linew = 15;
      ctx.shadowColor = "#ffdf70";
      ctx.strokeStyle = "#ffdf70";
      ctx.lineWidth = linew;
      ctx.lineCap = "round";
      var step3 = 0;
      clearInterval(that.setInter_Week);
      that.setInter_Week = setInterval(function() {
        if (step3 >= progress) {
          clearInterval(that.setInter_Week);
          step3 = progress;
        }
        step3++;
        ctx.beginPath();
        ctx.setLineCap = "round";
        ctx.arc(awidth + linew, aheight, (awidth - linew * 2) / 2, 0.75 * Math.PI, (0.75 + (step3 / 100) * 1.5) * Math.PI);
        ctx.translate(0, 0);
        ctx.stroke();
        ctx.closePath();
      }, 18);
    },
    drawGraycir() {
      // 灰色圆
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      var canvasWidth = document.getElementById("myCanvas");
      let awidth = Math.ceil((Number(window.getComputedStyle(canvasWidth).width.replace(/px/, "")) - 1) / 2);
      let aheight = Math.ceil((Number(window.getComputedStyle(canvasWidth).height.replace(/px/, "")) - 1) / 2);
      let linew = 15;
      ctx.beginPath();
      ctx.lineWidth = linew;
      ctx.strokeStyle = "#eee";
      ctx.lineCap = "round";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#7bbfff";
      ctx.arc(awidth + linew, aheight, (awidth - linew * 2) / 2, 0.75 * Math.PI, 2.25 * Math.PI);
      // ctx.arc(100,75,50,0,2*Math.PI);
      ctx.translate(0, 0);
      ctx.stroke();
    },
    getData() {
      let that = this;
      $http
        .post(
          "plugin.questionnaire.api.index.indexInfo",
          {
            getAnswerScore: "getAnswerScore",
            score: that.score,
            questionnaire_id: that.id
          },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.info = response.data.getAnswerScore.recommendation?response.data.getAnswerScore.recommendation:[];
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
