



export default {
  data() {
    return {
      goods_list:[],
      name:'',
      mobile:'',

      goods_id:0,

      shopkeeper:0,

      title:'店主申请'

    };
  },
  created(){
    window.scrollTo(0, 0);
    if(this.$route.query.shopkeeper && this.$route.query.shopkeeper==1){
      this.shopkeeper = 1 ;
      this.title = '店主信息';
      this.fun.setWXTilte(this.title);
    }else {
      this.getApplyInfo();
    }
    
    
    
  },
  methods: {
    getApplyInfo(){

      $http.get('plugin.owner-order-import.frontend.modules.owner.controllers.register.index',{},"").then((res)=>{
        if (res.result !== 1) {
          this.$toast(res.msg);
          return;
        }

        this.goods_list = res.data.goods_list;
        this.name = res.data.owner.name;
        this.mobile = res.data.owner.mobile;
        
      });
    },
    setGoodsId(id){
      this.goods_id = id;
    },
    sendApply(){
      if(this.fun.isTextEmpty(this.name)) return this.$toast("请输入申请姓名");
      if(this.fun.isTextEmpty(this.mobile)) return this.$toast("请输入手机号");
      if(this.fun.isMoblie(this.mobile)) return this.$toast("请输入正确手机号");

      let url = 'plugin.owner-order-import.frontend.modules.owner.controllers.perfect.index';
      if(this.shopkeeper !=1){
        if(this.goods_id<=0) return this.$toast("请选择商品");
        url = 'plugin.owner-order-import.frontend.modules.owner.controllers.apply.index';
      }
      

      $http.post(url,{
        name:this.name,
        mobile:this.mobile
      },"").then((res)=>{
        if(res.result!=1) return this.$toast(res.msg);
        if(this.shopkeeper !=1){
          this.$router.replace(this.fun.getUrl('goods',{id:this.goods_id}));
        }else {
          this.$router.go(-1);
        }
      });

    },
  
  }
};
