<template>
  <div class="update">
    <c-title :hide="false" text=""> </c-title>
    <!-- 背景 -->
    <div class="img_box">
      <img class="image" :src="list.top_image_url" alt="" @click="goUrl" />
    </div>
    <!-- 名称 -->
    <div class="name">
      <div class="icon">
        <img class="image" :src="list.app_logo_url" alt="" />
      </div>
      <div class="appName">
        <img class="img" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/android@2x.png" alt="" />
        <span class="title">{{ list.app_name }}</span>
      </div>
    </div>
    <!-- 下载 -->
    <div class="download">
      <div>版本号：{{ list.version }}</div>
      <div class="time">包大小：{{ list.size }}</div>
      <div class="time">更新时间：{{ list.refresh_time }}</div>
      <button v-if="list.url" class="btn" @click="download">下载安装</button>
    </div>
    <!-- 日志 -->
    <div class="log">
      <div class="title">更新日志</div>
      <p v-for="(item, index) in list.log" :key="index">{{ item }}</p>
    </div>
    <!-- 简介 -->
    <div class="intro">
      <div class="title">APP简介</div>
      <div v-html="list.app_text" class="detail"></div>
    </div>

    <!-- 浏览器中打开提示 -->
    <yz-wechat-share-img v-model="showWechatshar" :text="'请点击右上角在浏览器中打开'"></yz-wechat-share-img>
  </div>
</template>
<script>
import update from "./update_controller";

export default update;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.image {
  width: 100%;
  height: 100%;
}
// 背景
.img_box {
  width: 100%;
  height: auto;
}
// 标题
.title {
  font-size: 18px;
  color: #333;
}
// APP名称
.name {
  margin: 1.3rem 2.8rem;
  border-bottom: 0.031rem solid #e2e2e2;
}

.name .icon {
  margin: 0 auto;
  width: 5.938rem;
  height: 5.938rem;
  border-radius: 10px;
  overflow: hidden;
}

.name .appName {
  margin: 1rem 0;
}

.name .appName span {
  margin-left: 0.938rem;
  vertical-align: 3px;
}

.name .appName .img {
  width: 1.125rem;
  height: 100%;
}
// 下载安装
.download {
  margin: 0 0.906rem;
  padding-bottom: 1.438rem;
  text-align: center;
  border-bottom: 0.031rem solid #e2e2e2;
}

.download .time {
  margin-top: 0.5rem;
}

.download .btn {
  margin-top: 1.5rem;
  padding: 0.3rem 2rem;
  color: #fff;
  background-color: #ff4848;
  border: none;
  border-radius: 50px;
}
// 日志，简介
.log,
.intro {
  margin: 0 0.906rem;
  padding: 1.25rem 0;
  border-bottom: 0.031rem solid #e2e2e2;
}

.log p,
.detail {
  text-align: left;
  margin-top: 0.5rem;
}
</style>
