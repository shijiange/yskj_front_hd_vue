<template>
  <div id="placedAdvertising">
    <c-title :hide="false"
             :text="'我投放的广告'">
    </c-title>
    <div class="adpalce_box">
      <div class="adpalce_list"
           v-for="item in advertsList"
           :key="item.id">
        <div class="adpalce_top">
          <div class="adpalce_state">
            <span class="state"
                  :class="item.status_name === '下架'? 'adpalce_ago' :'adpalce_ing'">{{item.status_name}}</span>
            <span>{{item.created_at}}</span>
          </div>
          <div class="adpalce_operate"
               @click="gotoEdit(item.id)">
            <div class="a">
              <img src="../../assets/images/advertise_edit@2x.png"
                   alt="">
              <span>编辑</span>
            </div>
          </div>
        </div>
        <div class="adpalce_content">
          <img src="../../assets/images/agreen_video@2x.png"
               :class="item.status_name === '下架'? 'adpalce_ago_img' : ''"
               v-if="item.advert_img_url.indexOf('mp4') > 0">
          <img :class="item.status_name === '下架'? 'adpalce_ago_img' : ''"
               :src="item.advert_img_url"
               v-else>
          <div class="adpalce_info">
            <span class="info_title"
                  :class="item.status_name === '下架'? 'adpalce_ago_text' : ''">{{item.advert_name}}</span>
            <div class="adpalce_tip">
              <span :class="item.status_name === '下架'? 'adpalce_ago_text adpalce_ago_border' : 'adpalce_ing_text adpalce_ing_border'">待机:{{item.await_amount}}元/min</span>
              <span :class="item.status_name === '下架'? 'adpalce_ago_text adpalce_ago_border' : 'adpalce_ing_text adpalce_ing_border'">支付:{{item.payment_amount}}元/次</span>
            </div>
          </div>
          <span class="adpalce_price"
                :class="item.status_name === '下架'? 'adpalce_ago_text' : 'adpalce_ing_text'">{{item.advert_budget}}<em>元</em></span>
        </div>
        <div class="adpalce_li"
             @click="getCity(item.id)">
          <span>投放区域</span>
          <img src="../../assets/images/advertise-next-gray.png"
               alt="">
        </div>
        <div class="adpalce_li"
             @click="getClass(item.id)">
          <span>门店分类</span>
          <img src="../../assets/images/advertise-next-gray.png"
               alt="">
        </div>
      </div>

    </div>
    <div class="button_add_ad">
      <button @click="gotoEdit()">添加广告</button>
    </div>

    <div style="height: 4rem;"></div>

    <van-popup v-model="show1">
      <div class="popop-box">
        <div class="popup-content">
          <p class="title">投放区域</p>
          <div class="box">
            <div v-for="(item,i) in districts"
                 :key="i"
                 class="popup-head">{{item.address.areaname}}</div>
          </div>
        </div>
        <div class="close"
             @click="show1 = false">
          <img src="../../assets/images/close@2x.png"
               alt="">
        </div>
      </div>
    </van-popup>

    <van-popup v-model="show2">
      <div class="popop-box">
        <div class="popup-content">
          <p class="title">门店分类</p>
          <div class="box">
            <div v-for="(item,i) in catrgorys"
                 :key="i"
                 class="popup-head1"><img class="pic"
                   src="../../assets/images/top_up_success.png"
                   alt="">{{item.has_one_store_category.name}}</div>
          </div>
        </div>
        <div class="close"
             @click="show2 = false">
          <img src="../../assets/images/close@2x.png"
               alt="">
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import placed_advertising_controller from "./placed_advertising_controller";

export default placed_advertising_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#placedAdvertising {
  .van-popup {
    border-radius: 10px;
    background: transparent;
  }
}

.popop-box {
  width: 20rem;
  height: 26rem;
  margin: 0 auto;
  border-radius: 10px;

  .popup-content {
    background: #fff;
    width: 20rem;
    height: 22rem;
    border-radius: 10px;
    overflow-y: scroll;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-top: 0.2rem;
    }

    .box {
      margin: 0.5rem;
      display: flex;
      flex-wrap: wrap;
    }

    .pic {
      width: 1.2rem;
      height: 1rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .popup-head1 {
    display: flex;
    align-self: center;
    padding: 0.3rem;
    margin: 0.4rem 0.4rem 0 0;
  }

  .popup-head {
    padding: 0.3rem;
    letter-spacing: 1px;
    color: #f15353;
    margin: 0.4rem 0.3rem 0 0;
    background-color: rgba(241, 83, 83, 0.16);
    border-radius: 6px;
  }

  .close {
    position: absolute;
    bottom: 0;
    left: calc(50% - 1rem);

    img {
      width: 2rem;
      height: 2rem;
    }
  }
}

.adpalce_box {
  padding: 0 1rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}

.adpalce_box .adpalce_list {
  background: #fff;
  border-radius: 0.5rem;
  margin-top: 1rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}

.adpalce_list .adpalce_top {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: 0.5rem 0;
  color: #ccc;
}

.adpalce_top .adpalce_state .state {
  color: #fff;
  padding: 0.2rem 0.3rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.adpalce_top .adpalce_operate {
  padding-right: 0.5rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}

.adpalce_operate .a {
  align-items: center;
  display: flex;
  display: -webkit-flex;
  margin-left: 0.3rem;
}

.adpalce_operate .a img {
  width: 1rem;
  height: 1rem;
}

.adpalce_content {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #f0f6fb;
}

.adpalce_content img {
  width: 3rem;
  height: 3rem;
  border-radius: 5px;
  margin: 0;
}

.adpalce_content .adpalce_info {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.adpalce_content .adpalce_info span {
  text-align: left;
}

.adpalce_content .adpalce_info .info_title {
  font-size: 1rem;
  line-height: 1.2rem;
}

.adpalce_content .adpalce_tip span {
  line-height: 2rem;
  margin-right: 0.3rem;
  padding: 0.1rem 0.2rem;
  font-size: 0.5rem;
  border-radius: 4px;
}

.adpalce_content .adpalce_price {
  font-size: 1rem;
}

.adpalce_content .adpalce_price em {
  font-size: 0.5rem;
}

.adpalce_list .adpalce_li {
  border-bottom: 1px solid #f0f6fb;
  padding: 1rem 0.5rem;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
}

.adpalce_list .adpalce_li img {
  width: 1rem;
  margin: 0;
}

//投放中背景颜色
.adpalce_ing {
  background: linear-gradient(to right, #00b2ff, #5bceff);
}

//下架背景颜色
.adpalce_ago {
  background: #ccc;
}

//投放中文字颜色
.adpalce_ing_text {
  color: #f15353;
}

//下架文字颜色
.adpalce_ago_text {
  color: #ccc;
}

//投放中边框颜色
.adpalce_ing_border {
  border: 1px solid #f15353;
}

//下架边框颜色
.adpalce_ago_border {
  border: 1px solid #ccc;
}

//下架产品图片变化
.adpalce_ago_img {
  background: #ccc;
  opacity: 0.5;
}

.button_add_ad {
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  padding: 0.5rem;
  width: 100%;
}

.button_add_ad button {
  background: #f15353;
  box-shadow: 0 0 0.4rem 0.02rem rgba(255, 73, 73, 0.4);
  color: #fff;
  font-size: 18px;
  border-radius: 3rem;
  border: none;
  padding: 0.5rem 6.5rem;
}
</style>
