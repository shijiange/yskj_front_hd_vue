<template>
  <div id="all">
    <c-title :hide="false" text="活动报名信息"></c-title>
    <van-cell-group>
      <van-cell center v-for="(item, i) in datas" :key="i">
        <span slot="title" style="color: #555;">{{ item.title }}</span>
        <span slot="default" style="color: #555;" v-if="item.is_image == 0">{{ item.value }}</span>
        <div v-else class="imgBopx">
          <template v-for="(info, ind) in item.value">
            <img :src="info" alt="" :key="ind" />
          </template>
        </div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import my_activity_info_controller from "./my_activity_info_controller";
export default my_activity_info_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/member.scss";

.imgBopx {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;

  img {
    margin: 0 0.3rem;
  }
}

#tool ul li {
  width: 100% !important;
}

.title {
  flex: 2;
  background: #fff;
  height: 2.8125rem;
  line-height: 2.8125rem;
}

.info {
  height: 2.8125rem;
  flex: 8;
  width: vw;
  line-height: 2.8125rem;
  background: #fff;
}

.van-cell__value {
  img {
    width: 2rem;
    height: 2rem;
  }
}

.yd-cell-box {
  margin-bottom: 0 !important;
}

.yd-btn-block {
  margin-top: 0.1875rem;
}

.checkbox {
  background: #fff;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border-bottom: 0.0625rem solid #ece9e9;
}

#all .van-cell__title {
  text-align: left;
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
