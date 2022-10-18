<template>
  <div id="questions">
    <div class="navTitle set-pc-style">
      <van-icon name="arrow-left" @click="goback" />
      {{ plugin_name }}
    </div>
    <div style="width: 100%; height: 3.6rem;"></div>
    <div class="banner">
      <div class="title">{{ title }}</div>
    </div>
    <div class="selectBox" v-for="(item, ind) in info" :key="ind">
      <div class="queTitle">
        <span v-if="item.required">*</span>
        <div>{{ ind + 1 }}.({{ item.type == 1 ? "单选" : "多选" }}){{ item.choice_title }}</div>
      </div>
      <template v-if="item.answer">
        <div
          class="answer"
          :class="[datainfo[ind] && datainfo[ind][0].answer[index] == arr ? 'contenBack' : '']"
          v-for="(arr, index) in item.answer.answer"
          :key="index"
          @click="typeSelect(item, ind, index)"
        >
          {{ arr }}
          <i class="iconfont icon-record_go" v-if="datainfo[ind] && datainfo[ind][0].answer[index] == arr"></i>
        </div>
      </template>
    </div>
    <div class="hint" v-if="hint">您还有必填项未选中</div>
    <div :class="[isLoading ? 'btnShow' : '']" class="btn set-pc-style">
      <div @click="submit">提交</div>
    </div>
  </div>
</template>
<script>
import questions_controller from "./questions_controller";

export default questions_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.0625rem;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btnShow {
  display: none;
  transition: 1s;
}

.btn div {
  width: 20.0938rem;
  height: 2.375rem;
  background-color: #2672ff;
  border-radius: 0.125rem;
  text-align: center;
  line-height: 2.375rem;
  color: #fff;
  font-size: 1rem;
  letter-spacing: 0.0625rem;
}

.hint {
  position: fixed;
  bottom: 3.125rem;
  width: 100%;
  height: 1.9375rem;
  text-align: center;
  background-color: #000;
  opacity: 0.4;
  color: #fff;
  line-height: 1.9375rem;
  font-size: 0.75rem;
  letter-spacing: 0.0625rem;
}

#questions {
  background: #fff;
  padding-bottom: 3.0625rem;
}

.selectBox {
  padding: 0 0.78rem;
  margin-bottom: 1.75rem;

  .queTitle {
    display: flex;
    justify-content: flex-start;
    font-size: 1rem;
    text-align: left;
    margin-bottom: 0.9rem;

    span {
      color: #fa0505;
      font-size: 16px;
    }
  }

  .answer {
    text-align: left;
    padding-left: 0.91rem;
    height: 2rem;
    display: flex;
    align-items: center;
    font-size: 1rem;
  }
}

.contenBack {
  background: #f3f7ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0.9rem;

  i {
    color: #0c6cff;
  }
}

.navTitle {
  width: 100%;
  font-size: 1.25rem;
  padding: 1rem 0;
  box-sizing: border-box;
  text-align: left;
  background: #fff;
  padding-left: 0.72rem;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 999;
}

.banner {
  width: 100%;
  height: 8.8438rem;
  margin-bottom: 0.8125rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/wj_titlebg@2x.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.title {
  width: 11.25rem;
  margin: 2.7188rem 0 0 1.5938rem;
  font-size: 1.125rem;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-align: left;
}
</style>
