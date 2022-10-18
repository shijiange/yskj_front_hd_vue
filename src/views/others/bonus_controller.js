import cTitle from "components/title";
import { Toast } from 'vant';
import countTo from 'vue-count-to';
export default{
  data(){
    return{
      arr:[],
      bonus_data:{},
    };
  },
  activated() {
    this.getData();
    this.timer();
  },
  mouted(){

  },
  methods: {
    timer(){
      let that = this;
      return setInterval((i)=>{
        console.log('刷新');
        that.getData();
      },600000);
    },
    getData() {
      let that = this;
      $http
        .get(
          "plugin.bonus-pool.frontend.index.index",
          {},
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.arr = response.data.arr,
              that.redData = response.data.bonus_data.data;
              that.fun.setWXTitle(response.data.name);
              that.love_total = response.data.love_total;//(平台爱心值总额)
              that.love_unit = response.data.love_unit;//(单价)
              if(that.fun.isTextEmpty(response.data.love_show)||response.data.love_show == '0'){
                that.love_show = false;
              }else{
                that.love_show = response.data.love_show;
              }
              if(that.fun.isTextEmpty(response.data.name)){
                that.name = '奖金池';
              }else{
                that.name = response.data.name;
              }
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
  },
  components: { 
    cTitle,
    countTo 
  }
};