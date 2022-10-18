<template>
  <div>
    <c-title :hide="false" :text="'客服简介'"></c-title>
    <div class="top-box">
      <div class="avatar">
        <img :src="serviceData.avatar" alt="">
      </div>
      <p class="name">{{serviceData.nickname}}</p>
    </div>
    <div class="content" :class="[fun.getPhoneEnv() == 3 ? 'set-pc-styleLeft' : '']">
      <h1 class="title">个人简介</h1>
      <div id="a_content" class="profile-text" v-html="serviceData.desc"></div>
      <p class="profile-text" v-if="!serviceData.desc">暂无简介</p>
    </div>

    <footer class="foot" :class="[fun.getPhoneEnv() == 3 ? 'set-pc-styleLeft' : '']">
      <div class="i-home" @click="toHome">
        <i class="iconfont icon-fontclass-shouye1"></i>
        <div style="margin-left: -5px;">首页</div>
      </div>
      <div class="btn-chat" @click="toChat">发起聊天</div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      serviceData: {}
    };
  },

  activated() {
    this.id = this.$route.query.id;
    this.getData();
  },

  methods: {
    toChat() {
      window.location.href = this.serviceData.h5_page_url;
    },
    toHome() {
      this.$router.push(this.fun.getUrl("home"));
    },
    getData() {
      $http
        .get("plugin.yun-chat.frontend.h5.employee.get-detail", {id: this.id}, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.serviceData = response.data || {};
            }
          },
          (response)=> {
            console.log(response);
          }
        )
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.top-box {
  width: 100%;
  height: 12rem;
  padding-top: 1.5rem;
  padding-bottom: 3.3rem;
  background-image: linear-gradient(90deg, #66b3ff 0%, #0b79f0 100%), linear-gradient(-50deg, #3265ff 0%, #45b2ff 100%);
  background-blend-mode: normal, normal;

  .avatar {
    width: 4.69rem;
    height: 4.69rem;
    margin: 0 auto;
    border-radius: 0.44rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .name {
    margin: 0.5rem auto 0;
    font-weight: bold;
    font-size: 18px;
    color: #fff;
  }
}

.content {
  overflow-y: scroll;
  position: fixed;
  width: 100%;
  height: calc(100vh - 12rem);
  background: #fff;
  bottom: 0;
  left: 0;
  border-radius: 20px 20px 0 0;
  padding: 15px 15px 3.5rem 15px;
  text-align: left;

  .title {
    position: relative;
    font-size: 1.06rem;
    color: #3b98f7;
    padding-left: 1rem;
  }

  .title::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 0;
    height: 80%;
    width: 0.2rem;
    border-radius: 0.09rem;
    background-color: #3b97f7;
  }

  .profile-text {
    display: block;
    margin-top: 1rem;
    font-size: 14px;
  }
  .profile-text::-webkit-scrollbar { width: 0 !important; }
}

.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #fff;
  border-top: 1px solid #f2f2f2;

  .i-home {
    text-align: center;
    color: #777;
  }

  .btn-chat {
    width: 15.63rem;
    height: 2.38rem;
    line-height: 2.38rem;
    background-color: #3b97f7;
    border-radius: 1.19rem;
    color: #fff;
  }
}
</style>
