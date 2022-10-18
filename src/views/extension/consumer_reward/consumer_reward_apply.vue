<template>
    <div class="page">
      <c-title :hide="false" :text="title"></c-title>
        <div class="record" @click="gotoRewardRecord" >
            领取记录
        </div>

        <div class="c1">可领取的收益</div>
        <div class="c2">￥{{userInfo.reward_record}}</div>
        <div class="c3">提现到收入比例{{userInfo.ratio}}%</div>

        <div class="btn" @click="receive" v-if="userInfo.reward_record>0">领取</div>


        <van-popup v-model="profitShow" round position="bottom"  closeable style="max-height: 70%;">
            <div class="profitWrapper">
                <div class="title">填写资料</div>
                <div class="profitForm">
                    <template v-if="networkLoading">
                      <c-dyPopup
                        v-on:submitsave="dfsave"
                        :datas="dfData"
                        :form_data_id="form_data_id"
                        :form_id="form_id"
                        :status="true"
                        v-if="profitShow"
                      ></c-dyPopup>
                        <!-- <diyform datas="{{diyform}}" params="{{'order'}}" bind:traCheckedData="traCheckedData"></diyform> -->
                    </template>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import apply_controller from "./consumer_reward_apply_controller";

export default apply_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.page { background: #fff; min-height: 100vh; }

.record {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.875rem;
  padding-right: 0.906rem;
}

.c1 {
  display: flex;
  justify-content: center;
  margin-top: 2.3rem;
  font-size: 0.938rem;
  color: #333;
}

.c2 {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #202020;
}

.c3 {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #666;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12.5rem;
  height: 2.188rem;
  margin: 1.5rem auto 0;
  font-size: 0.938rem;
  color: #fff;
  background-color: #f14e4e;
  border-radius: 1.094rem;
}

.profitWrapper {
  position: relative;
  height: 100%;
}

.profitWrapper .title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
}

.profitWrapper .profitForm {
  flex: 1;
  padding: 0 0.9rem;
  padding-bottom: 3.2rem;
  overflow: scroll;
  height: calc(100% - 2.5rem);
}

.profitWrapper .profitBtns {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.2rem;
  display: flex;
  align-items: center;
  background: #fff;
}

</style>