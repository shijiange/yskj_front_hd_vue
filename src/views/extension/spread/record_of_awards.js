import cTitle from 'components/title';
export default{
  components: { cTitle },
  data(){
    return{
      id:"",
      all_amount:"",
      order_price:"",
      ratio:"",
      star:"",
      amount:"",
      amount_surplus:"",
      created_at:""
    };
  },
  methods: {
    previousPage(){
      this.$router.push(this.fun.getUrl("ExtensionPage"));
    },
        
    getData(){
      $http.get("plugin.member-return.frontend.log.index",{log_id:this.id},"...").then(response =>{
        if(response.result == 1){
          if(this.fun.isTextEmpty(response.data.log.has_one_queue)){
            this.star="";
          }else{
            var sum="";
            for(let i=0;i<response.data.log.has_one_queue.star;i++){
              sum+="<i  class='iconfont icon-extension-stars icon-custom-undefined' style='font-size: 1rem; color: rgb(241, 83, 83);'></i>";
            }

            this.star=sum;
          }

          this.all_amount=response.data.log.has_one_queue.amount;

          this.order_price=response.data.log.order_price;

          this.ratio=response.data.log.ratio;

          this.amount=response.data.log.amount;

          this.amount_surplus=response.data.log.has_one_queue.amount_surplus;

          this.created_at=response.data.log.created_at;








        }
      }).catch(error =>{
        console.log(error);
      });
    }
  },

  activated() {
    this.id=this.$route.params.id;

    this.getData();
  },
    
};