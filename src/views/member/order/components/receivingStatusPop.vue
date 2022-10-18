<template>
  <div>
    <van-popup v-model="popShow" position="bottom"  closeable round>
      <div class="popup-receiving-status">
        <van-nav-bar title="收货状态" />
        <van-radio-group v-model="radio">
          <div class="popup-receiving-list">
            <div class="popup-receiving-item">
              <div class="popup-receiving-text">未收到货</div>
              <div class="radio">
                <van-radio :name="0" checked-color="#f14e4e"></van-radio>
              </div>
            </div>
            <div class="popup-receiving-item">
              <div class="popup-receiving-text">已收到货</div>
              <div class="radio">
                <van-radio :name="1" checked-color="#f14e4e"></van-radio>
              </div>
            </div>
          </div>
        </van-radio-group>
        <div class="popup-send-wrapper">
          <div class="popup-btn" @click="send">确定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popShow:false,

      radio:0
    };
  },
  methods:{
    setPopShow(flag){
      this.popShow = flag;
    },
    send(){
      let status = this.radio==0 ? 'not_received' : 'received';
      this.$emit("confirm",{status});
      this.setPopShow(false);
    },
    setRadio(radio){
      this.radio = radio;
    }
    
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.popup-receiving-status {
  .popup-receiving-list {
    padding: 0 2rem;
    .popup-receiving-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3rem;
    }
  }
  .popup-send-wrapper {
    padding: 2rem;
    .popup-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.188rem;
      font-size: 14px;
      color: #ffffff;
      background-color: #f14e4e;
      border-radius: 0.231rem;
    }
  }
}

</style>
