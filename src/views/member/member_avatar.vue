<template>
  <div id="articleContent">
    <c-title :hide="false" text="更换头像"></c-title>
    <h4>我的头像</h4>
    <div class="myAvatar"><img :src="avatar"/></div>
    <div class="changeAvatarBtn">
      <van-button size="large" type="primary" @click="changeAvatar(userid)">去更换</van-button>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";
export default {
  data() {
    return {
      avatar: "",
      userid:this.$route.params.id
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      let that = this;
      $http
        .get("member.member.getAvatar", {}, "加载中")
        .then(
          function(response) {
            //console.log(response);
            if (response.result === 1) {
              that.avatar = response.data.avatar;
            } else {
              console.log(response.msg);
            }
          },
          function(response) {
            console.log(response.msg);
          }
        );
    },
    changeAvatar(userid){
      this.$router.push(this.fun.getUrl("changeMemberAvatar",{id:userid}));
    }
  },
  components: { cTitle }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#articleContent {
  padding: 0.625rem;
  background: #fff; 
  h4{margin:10px auto;}
  .changeAvatarBtn{margin-top:20px;}
}
</style>
