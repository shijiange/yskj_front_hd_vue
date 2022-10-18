<template>
  <div>
    <c-title :hide="false"
             :text="'广告费记录'">
    </c-title>
    <div class="adfee_box">
      <div class="adfee_list">
        <span class="adfee_time">{{advertsList.created_at}}</span>
        <div class="adfee_main">
          <div class="adfee_item">
            <div class="adfee_img"
                 v-if="advertsList.store">
              <img :src="advertsList.store.thumb"
                   alt="">
              <span>{{advertsList.store.store_name}}</span>
            </div>
            <span class="price_color">{{advertsList.sn}}</span>
          </div>
          <div class="main-box">
            <div class="box">
              <p class="title">{{advertsList.view_count}}{{advertsList.unit_code_name}}</p>
              <p class="gray">广告量</p>
            </div>
            <div class="box">
              <p class="title">{{advertsList.advert_unit}}元/{{advertsList.unit_code_name}}</p>
              <p class="gray">单价</p>
            </div>
            <div class="box">
              <p class="title">{{advertsList.advert_amount}}</p>
              <p class="gray">广告费用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import advertising_fee_controller from "./advertising_fee_controller";

export default advertising_fee_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.adfee_box {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}

.adfee_list {
  background: #fff;
  margin-bottom: 1rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}

.adfee_list .adfee_time {
  padding: 0.5rem 1rem;
  text-align: left;
  line-height: 2rem;
  border-bottom: 1px solid #f0f6fb;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}

.adfee_list .adfee_item {
  display: flex;
  display: -webkit-box;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  line-height: 2rem;
  margin: 0.5rem 1rem 0 1rem;
  padding: 0.5rem;
}

.adfee_item span {
  display: block;
}

.adfee_item .adfee_img {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.adfee_item .adfee_img img {
  width: 2rem;
  height: 2rem;
  margin: 0;
  margin-right: 0.5rem;
  border-radius: 100%;
}

.adfee_item .price_color {
  color: #f15353;
}

.adfee_item em {
  font-size: 0.5rem;
}

.adfee_main {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f6fb;
}

.main-box {
  display: flex;
  margin: 1rem 0;

  .box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .gray {
    color: #999;
  }
}
</style>
