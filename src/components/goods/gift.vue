<!-- 赠品-->
<template>
  <div class="cart-box" @click.stop="toGoodsInfo(goods_id)">
    <div class="cart_good">
      <div class="right" :style="rightStyle">
        <div class="img" :style="imgStyle">
          <img :src="goods_thumb">
        </div>
        <div class="info">
          <ul class="inner">
            <li>
              <h1 class="name" style="-webkit-box-orient: vertical;height:1.5em;"> {{ goods_title }} </h1>
            </li>
            <li>
              <labels v-if="labels" label-style="background-color:#f15353; color:#fff;" :labels="labels"></labels>
            </li>
            <li>
              <div class="gift_cart" v-if="from==='cart'" style="display: flex;justify-content: space-between">
                <div class="dPriceBox" style="width: 50%;">
                  <div class="price_cart">{{ $i18n.t("money") }}<span>{{ price }}</span></div>
                </div>
                <div class="num" style="text-align: right;position: inherit">
                  × {{ total }}
                </div>
              </div>
              <div class="gift_order"  v-else-if="from==='confirmOrder'" style="display: flex;justify-content: space-between">
                <div class="dPriceBox" >
                  <div class="price_order" style="text-align: left;">{{ $i18n.t("money") }} <span>{{ price }}</span></div>
                </div>
                <div class="num" style="text-align: right;position: inherit">
                  × {{ total }}
                </div>

              </div>
              <div class="gift_order"  v-else="from==='orderList'" style="">
                <div class="num" style="text-align: left;position: inherit">
                  × {{ total }}
                </div>
                <div class="dPriceBox">
                  <div class="price_order" style="text-align: right;">{{ $i18n.t("money") }} <span>{{ price }}</span></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import labels from "components/goods/labels";

export default {
  props: {
    //数据，为空才显示
    labels: {
      type: [String, Object, Array],
      default: []
    },
    goods_thumb:{
      type:String,
      default: ''
    },
    goods_id:{
      type:[String, Number],
      default: ''
    },
    goods_title:{
      type:String,
      default: ''
    },
    price:{
      type:String,
      default: ''
    },
    total:{
      type:String,
      default: ''
    },
    goods:{
      type: Object,
      default: null
    },
    from:{
      type: String,
      default: 'cart'
    }
  },
  data() {
    return {
      rightStyle:'margin-left:20px;',
      imgStyle:"width: 3rem;height: 3rem; margin-left:3rem; margin-top:3rem;"
    };
  },
  created(){
    if(this.from === 'cart'){
      this.rightStyle = 'margin-left:20px;';
      this.imgStyle = "width: 3rem;height: 3rem; margin-left:3rem; margin-top:3rem;";
    }else if(this.from === 'confirmOrder'){
      this.rightStyle = 'margin-left:20px;';
      this.imgStyle = "width: 3rem;height: 3rem; margin-left:3rem; margin-top:3rem;";
    }else{
      this.rightStyle = 'width:100%;';
      this.imgStyle = "width: 15%;height: 50%;margin-left:10%;margin-top:2rem;";
    }
  },
  components: {labels},
  computed: {},
  methods: {
    toGoodsInfo(goods_id){
      if(goods_id){
        this.$router.push(this.fun.getUrl("goods", { id: goods_id }));
      }
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
      width: 90%;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;

      .img {
        width: 3rem;
        height: 3rem;
        margin-left: 3rem;
        margin-top: 2rem;
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
            justify-content: space-between;
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
              word-break: normal;
              span{
                font-size: 18px;
              }
            }
          }
          .gift_order{
            .price_order{
              text-align: right;
              font-size: 12px;
              word-break: normal;
            }
          }
        }
      }
    }
  }
}

.estimated {
  align-self: self-start;
  padding: 2px 8px;
  margin-top: 5px;
  border-radius: 10px;
  display: inline;
  text-align: left;
  font-size: 12px;
  color: #f14e4e;
  background-color: #fdf2f2;
}
</style>
