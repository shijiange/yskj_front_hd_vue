<template>
  <div class="page">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <div class="info">{{login_info}}</div>
  </div>
</template>

<script>

import { Toast } from "vant";

export default {
  data() {
    return {
      user_id: "8ffc1e0b-1586-4b1a-a598-6e783031e118",
      sign: "17A67F3F80EB6D4179913B1841238BBF984F0EF13E3B93C9994B0E5510015245",
      login_info: "跳转失败"
    };
  },
  created() {
    if (!this.$route.query.user_id) {
      this.$dialog.alert({ message: "缺少user_id" });
      return;
    }
    // if(!this.$route.query.sign){

    // 	return;
    // }
    this.user_id = this.$route.query.user_id;
    this.sign = this.$route.query.sign;
    this.login();
  },
  methods: {
    async login() {
      this.login_info = "跳转中...";
      $http.post("plugin.point_exchange.api.login.memberLogin", {
        user_id: this.user_id,
        sign: this.sign
      })
        .then((response) => {
          Toast.clear();
          if (response.result == 1) {
            this.$router.push(
              this.fun.getUrl("member")
            );
          } else {
            this.login_info = "跳转失败";
            this.$dialog.alert({ message: response.msg });

          }
        });

    }
  }
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background: #fff;
    min-height: 100vh;
    padding-top: 10rem;
  }

  .info {
    padding-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    position: relative;
  }

  .double-bounce1,
  .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgb(241, 82, 79);
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: bounce 2s infinite ease-in-out;
    animation: bounce 2s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  @-webkit-keyframes bounce {
    0%,
    100% {
      -webkit-transform: scale(0);
    }

    50% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }

    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
</style>

