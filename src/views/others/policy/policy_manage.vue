<template>
  <div>
    <c-title :hide="false" :text="'保单管理'"></c-title>
    <div class="bd_top">
      <div class="bd_text_flex">
        <i class="iconfont icon-all_baozhang iconcolor"></i>
        保单数量：1
      </div>
      <button class="bd_add">添加保单</button>
    </div>
    <div class="bd_list">
      <div class="bd_list_item">
        <span class="text_bolds">序号:1</span>
        <div class="bd_text_flex">
          <span class="text_bold">麻辣小龙虾</span>
          <i class="iconfont icon-all_more" style="color: #ccc; padding-left: 0.2rem;"></i>
        </div>
      </div>
      <div>
        <a class="bd_list_item">
          <span class="text_thin">查看记录</span>
          <i class="iconfont icon-advertise-next gray_color"></i>
        </a>
      </div>
      <div class="bd_list_item">
        <span class="text_thin">支付时间</span>
        <div class="bd_text_flex">
          <span class="text_thin">2020-03-13</span>
          <span class="bd_text_date">254天后到期</span>
        </div>
      </div>
      <div class="item_button">
        <div>
          <van-button round type="primary" text="已支付" class="button button_pay" />
        </div>
        <div>
          <van-button
            round
            type="primary"
            text="一键续保"
            class="button button_allpay"
            @click="showPopup"
          />
        </div>
      </div>
    </div>
    <div class="bd_list">
      <div class="bd_list_item">
        <span class="text_bolds">序号:1</span>
        <div class="bd_text_flex">
          <span class="text_bold">麻辣小龙虾</span>
          <div class="btn">
            <Button class="button_border" @click="moreEvent()">
              <i class="iconfont icon-all_more" style="color: #ccc;"></i>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <a class="bd_list_item">
          <span class="text_thin">查看记录</span>
          <i class="iconfont icon-advertise-next gray_color"></i>
        </a>
      </div>
      <div class="item_button">
        <div>
          <van-button round type="primary" text="未支付" class="button button_pay" />
        </div>
        <div>
          <van-button
            round
            type="primary"
            text="一键续保"
            class="button button_allpay"
            @click="showPopup"
          />
        </div>
      </div>
    </div>
    <van-popup
      v-model="show"
      round
      closeable
      close-icon-position="top-right"
      class="tanchuang tanchuangstate"
    >
      <div class="title">提示</div>
      <span>暂不可用，如需修改，请拨打15237861276或154568987809</span>
      <van-button
        round
        type="primary"
        text="一键拨号"
        class="button button_pay button_call"
        @click="showCall"
      />
    </van-popup>
    <van-popup v-model="show1" round class="tanchuang tanchuangstate1">
      <div class="call_list">
        <span>15237861276</span>
        <van-button round type="primary" text="拨号" class="button_call1" />
      </div>
      <div class="call_list">
        <span>15237861276</span>
        <van-button round type="primary" text="拨号" class="button_call1" />
      </div>
      <span class="tc_cancle" @click="showHidden">取消</span>
    </van-popup>
  </div>
</template>

<script>
import policy_manage_controller from "./policy_manage_controller";

export default policy_manage_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.bd_top {
  background-color: #fff;
  padding: 0.5rem 1rem;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}

.bd_text_flex {
  align-items: center;
  display: flex;
  display: -webkit-flex;
}

.iconcolor {
  color: #ff2c29;
  font-size: 1.5rem;
  padding-right: 0.5rem;
}

.bd_add {
  border: none;
  background: #ff2c29;
  border-radius: 25px;
  color: #fff;
  height: 1.5rem;
  line-height: 1.5rem;
  padding: 0 0.5rem;
}

.bd_list {
  background: #fff;
  padding: 0 1rem;
  margin-top: 0.8rem;
  display: flex;
  display: -webkit-flex;
  flex-flow: column wrap;
}

.bd_list_item {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  padding-top: 0.7rem;
}

.gray_color {
  color: #999;
  font-size: 1.5rem;
}

.text_bolds {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  width: 8rem;
  text-align: left;
}

.text_bold {
  max-width: 9rem;
  overflow: hidden;/* 超出部分隐藏 */
  text-overflow: ellipsis;/* 超出部分显示省略号 */
  white-space: nowrap;/* 规定段落中的文本不进行换行 */
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.text_thin {
  color: #666;
}

.bd_text_date {
  color: #ff2c29;
  border: 1px solid #ff2c29;
  border-radius: 25px;
  height: 1.25rem;
  line-height: 1.25rem;
  padding: 0 0.25rem;
  margin-left: 0.2rem;
}

.item_button {
  justify-content: flex-end;
  padding: 0.5rem 0;
  border-top: 1px solid #f2f2f7;
  display: flex;
  display: -webkit-flex;
  margin-top: 0.7rem;
}

button {
  margin-left: 0.5rem;
  height: 2rem;
  text-align: center;
  line-height: 0%;
}

.button_call1 {
  background: #ff2c29;
  color: #fff;
  border: none;
}

.button_pay {
  background: #ff2c29;
  color: #fff;
  border: none;
}

.button_allpay {
  border: 1px solid #ff2c29;
  color: #ff2c29;
  background: none;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}

.button_border {
  border: none;
  background: none;
}

.operation {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  padding: 0.3rem;
}

.operation i {
  display: block;
  font-size: 1.5rem;
  color: #333;
}

.operation span {
  display: block;
}

.api {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
}

.tanchuang {
  width: 19rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}

.tanchuangstate {
  padding: 0.2rem 0 1rem 0;
}

.tanchuangstate1 {
  padding: 1rem 0 0;
}

.title {
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
  border-bottom: 1px solid #f2f2f7;
}

.tanchuang span {
  text-align: center;
  line-height: 1.5rem;
  padding: 0.8rem;
  font-size: 1rem;
}

.button_call {
  margin-top: 1rem;
  align-self: center;
}

.tc_cancle {
  border-top: 1px solid #f2f2f7;
  display: block;
  margin-top: 0.8rem;
}

.call_list {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem 0 0.5rem;
}
</style>
