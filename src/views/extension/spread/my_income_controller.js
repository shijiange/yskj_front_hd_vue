import cTitle from 'components/title';
// import { Toast } from 'vant';
export default{
  components: { cTitle },
  data(){
    return{
      obj:{},
      income_name_text: "",
    };
  },
  activated() {
    this.obj={};
    this.getData();
    this.customizeIncome();
    this.fun.setWXTitle('我的' + this.income_name_text);
  },
  methods:{
    getData(){
      $http.get("income.share-page.index",{},"加载中...").then(res =>{
        if(res.result == 1){
          this.obj=res.data;
        }else{
          this.$dialog.alert({message:res.msg});
                   
        }
      }).catch(error =>{
        console.log(error);
      });
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  }
};