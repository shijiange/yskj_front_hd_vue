<template>
  <div id="enterShop">
    <c-title :hide="false" text='入驻商品'></c-title>

    <div class="top_title">
      请点击二维码图标获取商品支付二维码！
    </div>
    <div>
      <div v-for="(item,index) in goods_list" :key="index">
        <div class="list">
          <div class="ware-item">
            <img :src="item.thumb" alt="" class="ware-image">
            <div class="ware-title" style="-webkit-box-orient: vertical;">
              {{item.title}}
            </div>
            <div class="ware-qrcode">
              <div class="price">
                {{$i18n.t('money')}}{{item.price}}
              </div>
              <img :src="shop_list[index].qrcode_url" alt="" @click="isPopup(item, index)">
            </div>
          </div>
        </div>
        <div style="height: 40px;">

        </div>
      </div>
    </div>

    <div class="dialog-wrapper" v-if="isShowcode" @click="handleShowPopup">
      <div class="dialog">
        <div class="dialog-title">
          <img :src="popupData.thumb" alt="" class="ware-image">
          <p style="-webkit-box-orient: vertical;">{{popupData.title}}</p>
        </div>
        <img :src="shop_list[popupData.index].qrcode_url" alt="" class="dialog-qrcode">
      </div>
    </div>

  </div>
</template>

<script>
import enter_shopcontroller from "./enter_shopcontroller";
export default enter_shopcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#enterShop {
  background: #fff;

  /* min-height: 37.5rem; */
  .list {
    border-bottom: solid 0.0625rem #ebebeb;
    padding: 0.875rem;
  }
}

.top_title {
  height: 1.875rem;
  padding: 0 0.875rem;
  background: #f5f5f5;
  color: #8c8c8c;
  font-size: 14px;
  text-align: left;
  line-height: 1.875rem;
}

.ware-item {
  display: flex;
  justify-content: space-between;
  // height:1000px;
  border-bottom: 10px #eee solid;
}

.ware-image {
  width: 3.75rem;
  height: 3.75rem;
}

.ware-title {
  flex: 1;
  margin: 0 0.625rem;
  line-height: 1.625rem;
  height: 3.25rem;
  font-size: 16px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ware-qrcode {
  img {
    width: 1.75rem;
    height: 1.75rem;
  }

  .price {
    color: #f15353;
    font-size: 18px;
    line-height: 1.875rem;
  }
}

.dialog-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.dialog {
  position: absolute;
  width: 18.75rem;
  padding: 0.875rem;
  left: 50%;
  top: 50%;
  margin-left: -9.375rem;
  margin-top: -11.25rem;
  box-sizing: border-box;
  border: 0.0625rem #ccc solid;
  background: #fff;
}

.dialog-title {
  display: flex;
  margin-bottom: 1.25rem;
  text-align: left;

  img {
    flex: 0 03rem;
    width: 3rem;
    height: 3rem;
    margin-right: 0.625rem;
  }

  p {
    flex: 1;
    line-height: 1.5rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: inline-block;
  }
}

.dialog-qrcode {
  width: 15.4375rem;
  height: 15.4375rem;
  display: block;
  margin: 0 auto;
}
</style>
