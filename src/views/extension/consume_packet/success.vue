<template>
  <div style="background: #fff; height: 100vh;">
    <div class="content">
      <img class="bg" src="../../../assets/images/consume_packet_bg.png" alt="">
      <div class="red-packet">
        <div>恭喜您领取红包</div>
        <div class="money"><span class="num">{{money || 0}}</span><span>元</span></div>
      </div>
    </div>

    <div class="button" @click="toPacketList">
      <span>查看</span>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'vant';

export default {
  data() {
    return {
      money: '',
      order_id: ''
    };
  },
  activated() {
    this.order_id = this.$route.query.order_id;
    this.getConsumePacket();
  },
  methods: {
    toPacketList() {
      this.$router.replace(this.fun.getUrl('ConsumePacket'));
    },
    getConsumePacket() {
      $http
        .post("plugin.consume-red-packet.Frontend.Modules.Packet.Controllers.receive.index", {
          order_id: this.order_id.split(",")
        }, "loading")
        .then( (response)=> {
          if (response.result == 1) {
            this.money = response.data.packet_amount;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
        },
        function (response) {
          this.$dialog.alert({
            message: response.msg
          });
          // error callback
        }
        );
    },
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    position: relative;

    .bg {
      width: 100%;
    }

    .red-packet {
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 18px;
    }

    .money {
      line-height: 2;
    }

    .num {
      font-size: 36px;
    }
  }

  .button {
    width: 10rem;
    margin: 2rem auto;
    height: 2rem;
    background-image:
      linear-gradient(
        0deg,
        #ffc600 0%,
        #ffe023 39%,
        #fff945 100%
      ),
      linear-gradient(
        #ffe71f,
        #ffe71f
      );
    background-blend-mode:
      normal,
      normal;
    box-shadow:
      0 0 0 0
      rgba(255, 148, 8, 0.8);
    border-radius: 2rem;
    color: #ff4e00;
    font-size: 16px;
    line-height: 2rem;
    font-weight: bold;
  }
</style>
