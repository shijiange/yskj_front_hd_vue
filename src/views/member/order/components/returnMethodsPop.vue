<template>
  <div>
    <van-popup v-model="popShow" position="bottom"  closeable round>
      <div class="popup-receiving-status">
        <van-nav-bar title="选择退货方式" />
        <van-radio-group v-model="radio" checked-color="#f14e4e">
          <div class="popup-receiving-list">
            <div class="popup-receiving-item" v-for="item in send_back_way" :key="item.value">
              <div class="popup-receiving-text">{{item.name}}</div>
              <div class="radio">
                <van-radio :name="item.value"></van-radio>
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
  props:{
    send_back_way:{
      type:Array,
      default:()=>[]
    }
  },
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
      this.$emit("confirm",{status:this.radio});
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
