<template>
  <div>
    <van-popup v-model="popShow" position="bottom" :style="{ height: '100%' }">
      <div class="popup-goods-wrapper">
        <van-nav-bar title="选择售后商品" />
        <div class="goods-list">
          <van-checkbox-group v-model="returnGoodsModels">
            <div class="goods-item" v-for="item in goodsList" :key="item.id">
              <div class="goods-checkbox">
                <van-checkbox :name="item.id" icon-size="16px" checked-color="#f14e4e"></van-checkbox>
              </div>
              <div :class="item.is_gift ? 'gift-goods-img' : 'goods-img'">
                <img :src="item.thumb" alt="" />
              </div>
              <div class="goods-content">
                <div class="goods-title">
                  {{item.title}}
                </div>
                <labels v-if="item.is_gift" :labels="['赠品']"></labels>
                <div class="goods-desc">
                  <div class="goods-num">数量最多填{{item.total-item.refund_total}}</div>
                  <van-stepper theme="round" button-size="20px" :max="item.total-item.refund_total" v-model="item.stepperValue" />
                </div>
              </div>
            </div>
          </van-checkbox-group>
        </div>
        <div class="popup-send-wrapper">
          <div class="popup-btn" @click="sendBtn">确定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import labels from "components/goods/labels";
export default {
  props:['goodsList'],
  components:{labels},
  data() {
    return {
      popShow: false,

      returnGoodsModels: []
    };
  },
  methods: {
    setPopShow(flag) {
      this.popShow = flag;
    },
    sendBtn(){
      if(this.returnGoodsModels.length<1) return this.$toast("请选择商品");
      let modelsArr=[];
      let total_price=0;
      this.goodsList.forEach(item => {
        if(this.returnGoodsModels.indexOf(item.id)!=-1){
          let o={};
          o.goods_thumb = item.thumb;
          o.goods_title = item.title;
          o.refund_total = item.stepperValue;
          o.id = item.id;
          o.goods_option_title = item.goods_option_title;
          o.refund_price= ((Number(item.payment_amount)/item.total).toFixed(2))*item.stepperValue;
          total_price += o.refund_price;
          modelsArr.push(o);
        }
      });
      this.setPopShow(false);
      this.$emit('confirm',{modelsArr,total_price});
      //console.log(this.goodsList,this.returnGoodsModels);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.popup-goods-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .goods-list {
    flex: 1;
    padding: 0.625rem;
    overflow: auto;
    .goods-item {
      display: flex;
      align-items: center;
      height: 6rem;
      padding: 0.625rem 0.625rem 0.375rem;
      margin-bottom: 0.688rem;
      .goods-checkbox {
        padding-right: 0.4rem;
      }
      .goods-img {
        width: 4.688rem;
        height: 4.688rem;
        img {
          width: 4.688rem;
          height: 4.688rem;
        }
      }
      .gift-goods-img {
        width: 4.688rem;
        height: 4.688rem;
        img {
          margin-top: 2.344rem;
          margin-left: 2.344rem;
          width: 2.344rem;
          height: 2.344rem;
        }
      }
      .goods-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 4.688rem;
        padding-left: 0.625rem;
        .goods-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 15px;
          color: #2c2c2c;
        }
        .goods-desc {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .goods-num {
            font-size: 11px;
            color: #f14e4e;
          }
        }
      }
    }
  }
  .popup-send-wrapper {
    padding: 0.75rem 1.719rem;
    background: #fff;
    .popup-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.188rem;
      font-size: 14px;
      color: #ffffff;
      background-color: #f14e4e;
      border-radius: 1.031rem;
    }
  }
}
</style>
