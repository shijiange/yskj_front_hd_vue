<template>
  <div id="new_card">
    <c-title :hide="false" text='开通会员'></c-title>
    <div class="viewBox">
      <div class="top_title">
        <div class="top_title_img">
          <img src="" alt="">
        </div>
        <div class="top_title_span">
          <span class="span_one">VIP1</span>
          <span class="span_two">有限期：2天</span>
          <span class="span_two">5折优惠 更多特权</span>
        </div>
      </div>
    </div>
    <div class="select">
      <span>请选择升级商品</span>
    </div>
    <div class="list_box">
      <div class="list_box_min">
        <div class="list_box_img">
          <img src="" alt="">
        </div>
        <div class="list_box_right">
          <div class="left_con">
            <div class="left_con_top">
              <span>
              升级商品名称升级商品名升级商品名称称升级升级商品名称升级商品名升级商品名称称升级升级商品名称升级商品名升级商品名称称升级
              </span>
            </div>
            <div class="left_con_bottom">
              <span>
                80.00<p>元</p>
              </span>
            </div>
          </div>
          <div class="right_con">
            <van-radio-group v-model="radio">
              <van-radio name="1" checked-color="#ee1818" @click="taprag()"></van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <div class="cenbtn">
          确定
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";
export default {
  data(){
    return{
      radio:''
    };
  },
  methods:{
    taprag(e){
      console.log(e);
    }
  },
  activated(){

  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#new_card {
  padding-top: 10px;

  .btn {
    width: 100%;
    height: 3.06rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    .cenbtn {
      width: 19.56rem;
      height: 2.63rem;
      background-color: #3b3b4f;
      border-radius: 0.41rem;
      text-align: center;
      line-height: 2.63rem;
      color: #fff;
      font-size: 0.94rem;
    }
  }

  .viewBox {
    width: 21.56rem;
    height: 6.25rem;
    background-color: #fff;
    border-radius: 0.16rem;
    margin: 0 auto;
    overflow: hidden;

    .top_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.84rem 0.75rem;

      .top_title_img {
        width: 4.31rem;
        height: 4.31rem;
        border-radius: 50%;
        background: yellow;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .top_title_span {
        height: 4.31rem;
        width: 70%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        // text-align: left;
        .span_one {
          font-size: 1rem;
        }

        .span_two {
          font-size: 0.75rem;
          color: #999;
        }
      }
    }
  }

  .select {
    font-size: 1rem;
    color: #333;
    width: 21.56rem;
    margin: 0.88rem auto;
  }

  .list_box {
    width: 21.56rem;
    height: 6.22rem;
    background-color: #fff;
    border-radius: 0.16rem;
    margin: 0 auto;
    margin-bottom: 0.63rem;
    overflow: hidden;

    .list_box_min {
      margin: 0.72rem 0.66rem 0.88rem 0.66rem;
      display: flex;
      justify-content: space-between;

      .list_box_img {
        width: 4.63rem;
        height: 4.63rem;
        background-color: #ffc29d;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .list_box_right {
      width: 74%;
      background: #fff;
      display: flex;

      .left_con {
        width: 11.42rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        // span{
        //   text-align: left;
        // }
        .left_con_top span {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: left;
          font-size: 0.94rem;
          color: #333;
        }

        .left_con_bottom {
          display: flex;

          span {
            text-align: left;
            font-size: 1rem;
            color: #ee1818;

            p {
              font-size: 0.75rem;
              display: inline-block;
            }
          }
        }
      }

      .right_con {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
