import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      //
      isLoading: false,
      info: [],
      id: "",
      tag:'index',
      goods_id:'',
      title: "",
      allNum: 0,
      datainfo: [],
      hint: false,
      plugin_name:''
    };
  },
  activated() {
    // this.page = 1;
    this.init();
    if(this.$route.params.goods_id){
      this.goods_id = this.$route.params.goods_id;
    }
    if(this.$route.params.id){
      this.id = this.$route.params.id;
    }
    if(this.$route.params.tag){
      this.tag = this.$route.params.tag;
    }
    this.getData();
  },
  mouted() {},
  methods: {
    goback(){
      if(this.tag == 'video'){
        this.$router.push(this.fun.getUrl("CourseDetail", { id: this.$route.params.goods_id }));
      }else if(this.tag == 'index'){
        this.$router.go(-1);
      }else {
        this.$router.push(this.fun.getUrl("questionnaireIndex", { }));
      }
    },
    init() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.info =[];
      this.datainfo = [];
      this.goods_id = '';
      this.id = '';
      this.tag = '';
    },
    onSearch(e) {
      console.log(e, this.key);
      this.getData();
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      console.log(this.id);
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.questionnaire.api.index.indexInfo",
            {
              answer: "answer",
              questionnaire_id: that.id,
              page: that.page,
              goods_id: that.goods_id ? that.goods_id : ""
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.answer.choice.data;
                that.info = that.info.concat(myData); //数组拼接
                if (Number(that.page) >= Number(that.total_page)) {
                  console.log("a11111");
                  that.isLoading = false;
                } else {
                  that.isLoading = true;
                }
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              console.error(response.msg);
            }
          );
      }
    },
    getData() {
      let that = this;
      $http
        .post(
          "plugin.questionnaire.api.index.indexInfo",
          {
            answer: "answer",
            questionnaire_id: that.id,
            page: that.page,
            goods_id: that.goods_id ? that.goods_id : ""
          },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              console.log(response);
              that.info = response.data.answer.choice.data;
              that.id = response.data.answer.questionnaire_id;
              that.title = response.data.answer.title;
              that.total_page = response.data.answer.choice.last_page;
              that.plugin_name = response.data.plugin_name;
              that.fun.setWXTitle(that.plugin_name);
              console.log(Number(response.data.answer.choice.current_page) >= Number(response.data.answer.choice.last_page));
              if (Number(that.page) >= Number(that.total_page)) {
                console.log("a11111");
                that.isLoading = false;
              } else {
                that.isLoading = true;
              }
              console.log(that.isLoading);
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
    },
    typeSelect(item, ind, index) {
      if (item.type == "1") {
        this.radio(item, ind, index);
      } else {
        this.multiple(item, ind, index);
      }
    },
    radio(item, ind, index) {
      let radioArr = [];
      let datainfo = this.datainfo;
      let is_answer = item.answer.answer[index]; // 答案
      let is_fraction = item.answer.fraction[index]; // 分数
      radioArr.push(
        {
          answer: {}
        },
        {
          fraction: {}
        },
        {
          id: item.id
        },
        {
          questionnaire_id: item.questionnaire_id
        }
      );
      radioArr[0].answer[index] = is_answer;
      radioArr[1].fraction[index] = is_fraction;
      datainfo[ind] = radioArr;
      this.datainfo = datainfo;
      console.log(this.datainfo);
      this.$forceUpdate();
    },
    multiple(item, ind, index) {
      // index 子 ind 父
      let datainfo = this.datainfo;
      let is_answer = item.answer.answer[index]; // 答案
      let is_fraction = item.answer.fraction[index]; // 分数
      let info = [];
      if (datainfo.length == 0) {
        //第一次选择
        info.push(
          {
            answer: {}
          },
          {
            fraction: {}
          },
          {
            id: item.id
          },
          {
            questionnaire_id: item.questionnaire_id
          }
        );
        info[0].answer[index] = is_answer;
        info[1].fraction[index] = is_fraction;
        datainfo[ind] = info;
      } else {
        console.log("第二次选");
        let ischeack = this.cheackarr(datainfo, ind, item.id);
        if (ischeack) {
          console.log("1aaaaaaaaaaaaaaaaaa");
          for (let i = 0; i < datainfo[ind].length; i++) {
            if (datainfo[ind][i].answer) {
              if (datainfo[ind][i].answer[index]) {
                delete datainfo[ind][i].answer[index];
              } else {
                datainfo[ind][i].answer[index] = is_answer;
              }
            }
            if (datainfo[ind][i].fraction) {
              if (datainfo[ind][i].fraction[index]) {
                delete datainfo[ind][i].fraction[index];
              } else {
                datainfo[ind][i].fraction[index] = is_fraction;
              }
            }
          }
        } else {
          console.log("2bbbbbbbbbbbbbbbb");
          info.push(
            {
              answer: {}
            },
            {
              fraction: {}
            },
            {
              id: item.id
            },
            {
              questionnaire_id: item.questionnaire_id
            }
          );
          info[0].answer[index] = is_answer;
          info[1].fraction[index] = is_fraction;
          datainfo[ind] = info;
        }
      }
      this.datainfo = datainfo;
      this.$forceUpdate();
      console.log(this.datainfo);
    },
    cheackarr(datainfo, ind, ids) {
      let is_cheack;
      console.log(datainfo);
      if (datainfo[ind]) {
        for (let i = 0; i < datainfo[ind].length; i++) {
          if (datainfo[ind][i].id == ids) {
            is_cheack = true;
            // console.log('选的是同一个问题')
            return is_cheack;
          }
        }
      } else {
        is_cheack = false;
        return is_cheack;
      }
    },
    submit() {
      let datainfo = this.datainfo;
      console.log(this.info);
      this.allNum = 0;
      let info = this.info;
      let allNum = this.allNum;
      for (let i = 0; i < info.length; i++) {
        if (!info[i].answer || !info[i].answer.fraction) {
          continue;
        }
        if (info[i].type == 2) {
          console.log(info[i].answer.fraction, "多选");
          for (let key in info[i].answer.fraction) {
            allNum += Number(info[i].answer.fraction[key]);
            console.log(allNum, "allNum");
          }
        }
        if (info[i].type == 1) {
          let Arr = [];
          for (let key in info[i].answer.fraction) {
            Arr[key] = Number(info[i].answer.fraction[key]);
          }
          let r = Arr.filter(function(element, index, self) {
            if (element) {
              return element;
            }
          });
          allNum += Math.max(...r);
        }
      }
      this.allNum = allNum;
      console.log(allNum, "总分");
      for (let i = 0; i < info.length; i++) {
        if (info[i].id && info[i].required) {
          if (!datainfo[i]) {
            console.log("还有必填项没被选择");
            this.hint = true;
            setTimeout(() => {
              this.hint = false;
            }, 1500);
            return;
          }
        }
      }
      this.pushData();
    },
    pushData() {
      let that = this;
      $http
        .get(
          "plugin.questionnaire.api.index.indexInfo",
          {
            answerScore: "answerScore",
            questionnaire_id: that.id ? that.id : "",
            data: JSON.stringify(that.datainfo)
          },
          ""
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            let sterarr = response.data.answerScore;
            let json = {
              score: sterarr.score,
              questionnaire_id: sterarr.questionnaire_id,
              allNum: that.allNum,
              rewardPoint:sterarr.rewardPoint,
              tag:that.tag,
              goods_id:that.goods_id,
              plugin_point_name:sterarr.plugin_point_name
            };
            this.$router.push(this.fun.getUrl("surveyResult", json));
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    cTitle
  }
};
