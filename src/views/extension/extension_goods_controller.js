import cTitle from 'components/title';
import goods from 'components/goodsList';


export default {
  data(){
    return{
      goodList:[],
    };
  },
  create(){
    
  },
  activated(){
    this.getData();
  },
  methods:{
    getData(){
      $http.get("member.member.shareinfo",{},"加载中...").then(res =>{
        if(res.result == 1){
          this.goodList=res.data.become_goods.map((value)=>{
            let json={};
            json.goods_id=value.id;
            json.thumb=value.thumb;
            json.title=value.title;
            return json;
          });
        }
      }).catch(error =>{
        console.log(error);
      });
    }
  },
  components: { cTitle,goods}
};