<template>
  <div id="videoRecordList">
    <c-title :hide="false" :text="'答题详情'"> </c-title>
    <div class="header">得分：<span style="font-size: 0.938rem;">{{info.score}}分</span></div>
    <div class="contenBox" v-for="(item,index) in info.answer_record" :key="index">
      <div class="list">
        <div class="title">{{index + 1}}.{{item.title}}</div>
        <div :class="[datas.answer_id?'answerSelect':'answer']" v-for="(datas,ind) in item.option" :key="ind">
          {{datas.content}}
        </div>
        <div style="color: #00b98d; font-size: 0.813rem;">得分:{{item.isrela?item.score:'0'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import videoRecordList_controller from "./videoRecordList_controller";
export default videoRecordList_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.header {
  width: 100%;
  height: 2.188rem;
  background-color: #00b98d;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.75rem;
  color: #fff;
  padding-left: 0.938rem;
  box-sizing: border-box;
}

.contenBox {
  padding: 1.5rem 1.28rem;
  background-color: #fff;

  .list {
    text-align: left;

    .title {
      font-size: 1rem;
      color: #202020;
      margin-bottom: 1.25rem;
    }

    .answer {
      width: 19.281rem;
      // height: 2.188rem;
      padding: 0.5rem;
      background-color: #00b98d;
      border-radius: 0.625rem;
      margin-bottom: 0.938rem;
      color: #fff;
      font-size: 0.813rem;
      text-align: center;
      // line-height: 2.188rem;
    }

    .answerSelect {
      width: 19.281rem;
      padding: 0.5rem;
      // height: 2.188rem;
      background-color: #ff9c00;
      border-radius: 0.625rem;
      margin-bottom: 0.938rem;
      color: #fff;
      font-size: 0.813rem;
      text-align: center;
      // line-height: 2.188rem;
    }
  }
}
</style>