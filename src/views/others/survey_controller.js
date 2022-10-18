import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      radio1: '',
      radio2: '',
      radio3: '',
      info:''
    };
  },
  activated() {
    this.mid = this.getUrlKey('mid');
    this.cover_id = this.getUrlKey('cover_id');
    this.isI = this.getUrlKey('i');
    this.getData();
  },
  mounted() {
  },
  methods: {
    getUrlKey(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [,""])[1].replace(/\+/g, '%20')) || null;
    },
    handIn() {
      let arr = [];
      for(let i = 0;i<this.info.length;i++){
        console.log(this.info[i]);
        arr.push(this.info[i]);
      }
      // var newArr = [];
      // var len = arr.length;
      // for(let i = 0, j = 0; i < len; i += 8, j++){
      //     newArr[j] = arr.splice("");
      // }
      // console.log(newArr)
      // return
      // let asrry = arr;
      this.status = !this.status;
      let json = {
        mid: this.mid,
        cover_id: 499,
        comment:arr
      };
      var that = this;
      $http
        .post("plugin.pet.api.survey.saveSurvey", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            Toast("提交成功");
            that.$router.push(
              that.fun.getUrl("home", {})
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getData(){
      var that = this;
      $http
        .post("plugin.alerts.api.send-notice.getComment",{}, '')
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            that.info = response.data;
          }
        })
        .catch(error => {
        });
    },
    tapIn(e) {
      for(let i = 0;i<this.info.length;i++){
        if(this.fun.isTextEmpty(this.info[i].radio)){
          Toast('请对'+this.info[i].name+'进行评价');
          return;
        }
      }
      this.handIn();
    }
  },
  components: {
    cTitle
  }
};
