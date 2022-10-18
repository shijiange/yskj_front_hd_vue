<template>
  <div>
    <c-title :hide="false"
             :text="'广告主中心'">
    </c-title>
    <div class="advertise">
      <div class="advertise_content">
        <div class="advertiser_top"
             @click="gotoUrl('placedAdvertising')">
          <span>我投放的广告</span>
          <img src="../../assets/images/advertise-next-white.png" />
        </div>
        <div class="advertise_record">
          <div class="ad_record_list">
            <span class="ad_list_title">累计投放数量</span>
            <span class="ad_list_num">{{statistics.put_count}}</span>
          </div>
          <div class="ad_record_list">
            <span class="ad_list_title">投放中的广告数量</span>
            <span class="ad_list_num">{{statistics.puting_count}}</span>
          </div>
          <div class="ad_record_list">
            <span class="ad_list_title">广告费累计总额(元)</span>
            <span class="ad_list_num">{{statistics.budget_total	}}</span>
          </div>
          <div class="ad_record_list">
            <span class="ad_list_title">广告费已使用金额(元)</span>
            <span class="ad_list_num">{{statistics.used_total}}</span>
          </div>
          <div class="ad_record_list">
            <span class="ad_list_title">广告费剩余金额(元)</span>
            <span class="ad_list_num">{{statistics.surplus_total}}</span>
          </div>
        </div>
      </div>
      <div class="advertise_adcost_record">
        <span class="advertise_adcost_title">广告费记录</span>
        <div class="adcost_list"
             v-for="item in advertsList"
             :key="item.id"
             @click="gotoUrl('advertisingFee',{log_id: item.id})">
          <div style="display: flex;">
            <div class="adcost_list_item"
                 style="flex: 1.5;">
              <span class="list_top">{{item.created_at}}</span>
              <!--<span class="list_bottom">2019</span>-->
            </div>
            <div class="adcost_list_item align_left">
              <span class="list_top title">{{item.advert.advert_name}}</span>
              <span class="list_bottom">{{item.code_name}}</span>
              <span class="list_bottom">{{item.view_count}}{{item.unit_code_name}}</span>
            </div>
            <div class="adcost_list_item align_left">
              <span class="list_top list_price">{{item.advert_amount}}</span>
              <span class="list_bottom">{{item.advert_unit}}</span>
            </div>
          </div>
          <div class="adcost_list_item">
            <img src="../../assets/images/advertise-next-gray.png"
                 alt="">
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import advertiser_controller from "./advertiser_controller";

export default advertiser_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.advertise {
  display: flex;
  flex-flow: column nowrap;
  background: #fff;
}

.advertise_content {
  display: flex;
  flex-flow: column nowrap;
}

.advertiser_top {
  background-color: rgb(241, 83, 83);
  // margin-top: 2.5rem;
  width: 100%;
  padding: 1rem 1rem 6rem 1rem;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
}

.advertiser_top span {
  color: #fff;
  font-size: 1rem;
  line-height: 2rem;
}

.advertiser_top img {
  width: 1rem;
  margin: 0;
}

.advertise_record {
  background-color: #fff;
  box-shadow: 0 0 0.4rem 0.02rem rgba(255, 73, 73, 0.4);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  margin: -5rem 1rem 0 1rem;
  padding: 0.5rem 1rem;
}

.ad_record_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ad_record_list span {
  line-height: 2.5rem;
  font-size: 1rem;
}

.ad_record_list .ad_list_title {
  color: #999;
}

.ad_record_list .ad_list_num {
  color: #333;
}

.advertise_adcost_record {
  padding: 1rem;
}

.advertise_adcost_record .advertise_adcost_title {
  color: #333;
  font-size: 1rem;
  font-weight: bolder;
  line-height: 2rem;
  display: block;
  text-align: left;
}

.advertise_adcost_record .adcost_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f6fb;
  padding: 0.5rem 0;
}

.adcost_list .adcost_list_item {
  display: flex;
  padding: 0.5rem;
  flex: 1;
}

.list_top {
  color: #333;
  font-size: 1rem;
  line-height: 2rem;
}

.list_bottom {
  color: #999;
  font-size: 0.8rem;
}

.list_price {
  color: #f15353;
}

.adcost_list_item img {
  width: 1rem;
  margin-top: 1rem;
}

.align_left {
  flex-direction: column;
}

.title {
  width: 6.5rem;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

