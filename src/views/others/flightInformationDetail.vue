<template>
  <div id="flightInformationDetail">
    <c-title :hide="false" :text="'航班信息收集记录'"> </c-title>
    <!-- <c-dyPopup v-if="dyFormPopup" :datas="dfData" :form_id="goodDYDormID" :flight="true" :status="false" ref="gofunarr" v-on:gofunarr="dfsave" :identification="true"></c-dyPopup> -->
    <c-dyPopup v-if="dyFormPopup"
        ref="gofunarr"
        v-on:gofunarr="dfsave"
        :singleDatas="dfData"
        :form_id="goodDYDormID" 
        :identification="true"
        modeType="Single"
        :singleStatus="false"
        :desThumb="false"
        :flight="true"
      ></c-dyPopup>
    <div class="room">
      <div class="txt">出发地：{{ from.start_name }}</div>
      <div class="txt">目的地：{{ from.destination_name }}</div>
      <div class="txt">航班号：{{ from.flight_number }}</div>
      <div class="txt">计划飞行时间：{{ timestampToTime(from.flight_time) }}</div>
    </div>
  </div>
</template>
<script>
import flightInformationDetail_controller from "./flightInformationDetail_controller";

export default flightInformationDetail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.room {
  background-color: #fff;
  padding: 1rem 1rem;

  .txt {
    text-align: left;
    margin-top: 0.5rem;
  }
}
</style>
