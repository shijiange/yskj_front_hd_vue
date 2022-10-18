import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      id:'',
      dividend_amount:'',
      first_income:'',
      first_rate:'',
      second_income:'',
      second_rate:'',
      third_income:'',
      third_rate:'',
      created_at:'',
      ID:'',

      income_name_text: "",
    };
  },
  activated() {
    if(this.$route.params.id===undefined){
      this.$router.go(-1);
    }
    else{
      this.id=this.$route.params.id;
      this.getData();
    }
    this.customizeIncome();
  },
  methods: {
    getData(){
      let json={
        id:this.id
      };
      $http.get('plugin.team-management.api.team-management.get-dividend',json,'获取中').then(response=>{
        if(response.result===1){
          this.dividend_amount=response.data.dividend_amount,
          this.first_income=response.data.first_income,
          this.first_rate=response.data.first_rate,
          this.second_income=response.data.second_income,
          this.second_rate=response.data.second_rate,
          this.third_income=response.data.third_income,
          this.third_rate=response.data.third_rate,
          this.created_at=response.data.created_at,
          this.ID=response.data.id;        
        }
        else{
          Toast(response.msg);
        }
      });  
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle }
};
