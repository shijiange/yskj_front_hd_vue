<template>
     <img :src="imgSrc" alt="">
</template>

<script>

import QRCode from 'qrcode';

export default {

  data(){
    return{
      imgSrc:''
    };
  },

  created(){
    console.log("执行");

  },

  methods:{
    createQrc(query) {

      return new Promise((resolve,reject)=>{
        let str = "i=" + this.fun.getKeyByI();

        str += "&mid="+this.fun.getKeyByMid();

        if((typeof query)=='object' && Object.keys(query).length>=1){
          console.log("触发条件");

          for(let i in query){
            str += "&"+i+"="+query[i];
          }
        }
        let _url = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/groupCodeLabel?"+str;
        QRCode.toDataURL(_url).then((res)=>{
          this.imgSrc = res;
          this.$nextTick(()=>{
            setTimeout(resolve,1000);
              
          });
        });

      });


    }
  }
};

</script>

<style lang="scss" scoped>

  canvas,
  img {
    width: 13rem;
    height: 13rem;
  }

</style>
