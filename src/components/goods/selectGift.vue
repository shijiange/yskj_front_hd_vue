<!-- 赠品-->
<template>
  <van-checkbox-group v-model="values" @change="change" >
    <div class="cart-box" v-for="goods in goodsList" :goods="goods" style="padding: 0.625rem 0">
      <div class="cart_good">
        <van-checkbox checked-color="#f15353" :name="goods.id" :disabled="!values.includes(goods.id) && showDisabled"></van-checkbox>
        <div class="right" :style="rightStyle">
          <div class="img" :style="imgStyle">
            <img :src="goods.thumb">
          </div>
          <div class="info">
            <ul class="inner">
              <li>
                <h1 class="name" style="-webkit-box-orient: vertical;height:1.5em;"> {{goods.title}} </h1>
              </li>
              <li>
                <van-row>
                  <van-col span="4">× {{goods.num}}</van-col>
                </van-row>
  <!--              <div class="gift_cart">-->
  <!--&lt;!&ndash;                <div class="dPriceBox" style="width: 50%;">&ndash;&gt;-->
  <!--&lt;!&ndash;                  <div class="price_cart">¥<span>0.00</span></div>&ndash;&gt;-->
  <!--&lt;!&ndash;                </div>&ndash;&gt;-->
  <!--                <div class="num" style="text-align: right;position: inherit">-->
  <!--                  × 1-->
  <!--                </div>-->
  <!--              </div>-->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </van-checkbox-group>

</template>
<script>

export default {
  props: {
    //数据，为空才显示
    goodsNum: {
      type: Number,
      default: 0
    },
    goodsList:{
      type: Array,
      default: []
    }
  },
  data() {
    return {
      values:[],
      showDisabled:false,
      rightStyle:'',
      imgStyle:""
    };
  },
  created(){
    _.each(this.goodsList, goods=>{
      if (goods.checked) {
        this.values.push(goods.id);
      }
    });
    if(this.values.length >= this.goodsNum){
      this.showDisabled = true;
    }else{
      this.showDisabled = false;
    }
    console.log('selectGift-created', this.values);
  },
  components: {},
  computed: {},
  methods: {
    change(value){
      if(value.length >= this.goodsNum){
        this.showDisabled = true;
      }else{
        this.showDisabled = false;
      }
      this.$emit('change', value);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

.cart-box {
  padding: 0.625rem 0.875rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;

  .cart_good {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;

    .right {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;

      .img {
        width: 6rem;
        height: 6rem;
        overflow: hidden;

        img {
          height: 100%;
          width: 100%;
          border-radius: 10px;
          -o-object-fit: contain;
          object-fit: contain;
        }
      }

      .info {
        width: 50%;
        position: relative;
        margin-left: 0.625rem;
        -webkit-box-flex: 2;
        -webkit-flex: 2;
        -ms-flex: 2;
        flex: 2;

        .inner {
          -webkit-box-flex: 4;
          -webkit-flex: 4;
          -ms-flex: 4;
          flex: 4;

          .name {
            font-weight: normal;
            -webkit-box-flex: 2;
            -webkit-flex: 2;
            -ms-flex: 2;
            flex: 2;
            height: 2.4rem;
            line-height: 1.2rem;
            width: 12rem;
            color: #333;
            text-align: justify;
            font-size: 14px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .gift_cart {
            display: flex;
            justify-content: right;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            margin-top: 0.5rem;

            .dPriceBox {
              width: 50%;
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal;
              -webkit-flex-direction: column;
              -ms-flex-direction: column;
              flex-direction: column;
              -webkit-box-align: start;
              -webkit-align-items: flex-start;
              -ms-flex-align: start;
              align-items: flex-start;
            }

            .num {
              text-align: right;
              position: inherit;
              bottom: 0;
              right: 0;
              border-radius: 0.1875rem;
              height: 1.25rem;
              width: 5.1rem;
              float: right;
            }

            .price_cart{
              text-align: left;
              font-size: 12px;
              float: left;
              color: #ff4949;
              width: 60%;
              word-break: break-all;
              span{
                font-size: 18px;
              }
            }
          }
          .gift_order{
            .price_order{
              text-align: right;
              font-size: 12px;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>
