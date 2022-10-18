<template>
  <div>
    <van-popup v-model="popShow" position="bottom" closeable round>
      <div class="popup-return-reason">
        <van-nav-bar title="申请原因" />
        <van-radio-group v-model="radio" checked-color="#f14e4e">
          <div class="popup-reason-list">
            <div class="popup-reason-item" v-for="(item,key) in reasonList" :key="key">
              <div class="popup-reason-text">{{item}}</div>
              <div class="radio">
                <van-radio :name="key"></van-radio>
              </div>
            </div>
            <textarea rows="5" v-model="otherText" v-if="(radio+1)==reasonList.length"></textarea>
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
  props: ['reasonList'],
  data() {
    return {
      popShow: false,
      radio:0,
      otherText:""
    };
  },
  methods: {
    setPopShow(flag) {
      this.popShow = flag;
    },
    send(){
      let text=this.reasonList[this.radio];
      if((this.radio+1) == this.reasonList.length){
        text = this.otherText;
        if(this.otherText=="") return this.$toast("请输入其他原因");
      }
      this.setPopShow(false);
      this.$emit('confirm',{text});
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>


.popup-return-reason{
  .popup-reason-list{
    padding: 1rem 2rem 0;
    .popup-reason-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 2.2rem;
    }
    textarea{
      border:1px solid #ccc;
      width: 100%;
      padding:0.5rem 1rem;
      margin-top:0.5rem;
      border-radius: 0.3rem;
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
