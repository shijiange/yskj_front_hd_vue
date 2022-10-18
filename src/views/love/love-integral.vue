<template>
  <div class="love-integral">
    <c-title :text="'转换'+integral"></c-title>
    <div>可转换：{{loveData.love}}</div>
    <div class="content">
      <div>请输入要转化的{{loveName}}</div>
      <div class="exchange">
        <i class="iconfont icon-fontclass-jifen"></i>
        <input type="number" class="input" v-model="love_nums">
        <div class="all" @click="allLove">全部兑换</div>
      </div>
      <div class="tips">
        <span>可转化{{(this.loveData.ratio * this.love_nums || 0).toFixed(2)}}{{integral}}</span>
        <span v-if="loveData.least>0">,最低保留{{loveData.least}}{{loveName}}</span>
        <span v-if="loveData.value>0">,1{{loveName}}={{loveData.value}}元</span>
      </div>
      <!-- <div class="tips">可转化{{(this.loveData.ratio * this.love_nums || 0).toFixed(2)}}{{integral}}</div>
      <div class="tips">最低保留{{loveData.least}}{{loveName}}</div>
      <div class="tips">1{{loveName}}={{loveData.value}}元</div> -->
      <div class="confirm" @click="setdata">确认转化</div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        loveData:{
          love:0,
          ratio:0,
          least:0,
          value:0
        },
        love_nums:"",
        integral:"消费积分",
        loveName:"爱心值"
      }
    },
    created(){
      this.getdata();
      this.getyz_basic_info();
    },
    methods:{
      getyz_basic_info(){
        let yz_basic_info = localStorage.getItem("yz_basic_info");
        if (yz_basic_info) {
          yz_basic_info = JSON.parse(yz_basic_info);
          this.integral = yz_basic_info.integral;
          this.loveName = yz_basic_info.love;
          this.fun.setWXTitle("转换" + yz_basic_info.integral);
        }
      },
      loading(message){
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          message,
          forbidClick: true,
        });
      },
      getdata(){
        this.loading('获取数据中...');
        $http.post("plugin.love.Frontend.Modules.Love.Controllers.change-integral.index").then(({result,msg,data})=>{
          this.$toast.clear();
          if(result == 1) this.loveData = data;
          else this.$toast(msg)
        })
      },
      setdata(){
        if(this.love_nums<=0 || this.love_nums === ""){
          this.$toast("转化的数量不能为0，也不能为空");
          return false
        }else if((this.love_nums) * 1 > this.loveData.love * 1){
          this.$toast("转化的数量不能大于总数量");
          return false
        }else if(this.love_nums * 1 > (this.loveData.love - this.loveData.least) * 1){
          this.$toast("最低保留"+this.loveData.least+"爱心值")
          return false
        }
        this.loading("正在转化中...");
        $http.post("plugin.love.Frontend.Modules.Love.Controllers.change-integral.change",{love_nums:this.love_nums}).then(({result,msg,data})=>{
          if (result == 1) {
            this.$toast({
              type: 'success',
              message:data
            })
            setTimeout(()=>{
              this.getdata();
            },1000)
          }else this.$toast(msg)
        })
      },
      allLove(){
        this.love_nums = (this.loveData.love - this.loveData.least).toFixed(2);
      }
    }
  }
</script>

<style scoped lang="scss">
  $mt:.8rem;
  $color:#f15353;
  .love-integral{
    text-align: left;
    padding: $mt;
    .content{
      margin-top: $mt;background-color: #fff;box-shadow: 0px 1px 4px 0px rgba(7, 11, 33, 0.11);border-radius: .2rem;padding: $mt 1rem;
      .exchange{
        display: flex;align-items: center;border-bottom: 1px solid rgba(84,152,252,.2);font-size: .75rem;padding:$mt 0;
        .input{border: none;flex: 1;padding: 0 1rem;color: #333;font-size:1.3rem;overflow: auto;}
        .icon-fontclass-jifen{color: $color;font-size: 1.3125rem;}
        .all{color:$color;}
      }
      .tips{color: #888;margin: $mt 0;}

      .confirm{height: 2.5rem;line-height: 2.5rem;text-align: center;font-size: .875rem;color: #fff;background-color: $color;border-radius: .375rem;margin: 0 auto;}
    }
  }
</style>