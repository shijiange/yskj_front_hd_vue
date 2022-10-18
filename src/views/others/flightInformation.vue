<template>
  <div id="flightInformation">
    <c-title :hide="false" :text="'航班信息收集'"> </c-title>
    <div class="posBtn set-pc-style">
      <div class="btnposA" @click="goDetail">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/flightInformationreplay.png" alt="" />
      </div>
    </div>
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <img :src="banner_one.img_url" alt="" @click="linkUrl(banner_one.link)" />
        </van-swipe-item>
        <van-swipe-item v-if="banner_two.img_url">
          <img :src="banner_two.img_url" alt="" @click="linkUrl(banner_two.link)" />
        </van-swipe-item>
        <van-swipe-item v-if="banner_three.img_url">
          <img :src="banner_three.img_url" alt="" @click="linkUrl(banner_three.link)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="isForm">
      <div class="title">
        <div class="left">
          <div class="line"></div>
          填写表单
        </div>
        <span @click="show = true">注意事项</span>
      </div>
      <div class="formConten">
        <!-- <c-dyPopup v-if="dyFormPopup" :datas="dfData" :form_id="goodDYDormID" :status="true" ref="gofunarr" v-on:gofunarr="dfsave" :identification="true"></c-dyPopup> -->
        <c-dyPopup
          v-if="dyFormPopup"
          ref="gofunarr"
          v-on:gofunarr="dfsave"
          :singleDatas="dfData"
          :form_id="goodDYDormID"
          :identification="true"
          modeType="Single"
          :singleStatus="true"
          :desThumb="false"
        ></c-dyPopup>
      </div>
    </div>
    <!-- 航班信息二期 -->
    <div class="pLine" @click="search('des')">
      <van-field v-model="form.destination" placeholder="请输入出发地" input-align="left" required readonly />
      <i class="iconfont icon-sousuo1"></i>
    </div>
    <div class="pLine" @click="search('ter')">
      <van-field v-model="form.terminus" placeholder="请输入目的地" input-align="left" required readonly />
      <i class="iconfont icon-sousuo1"></i>
    </div>
    <div class="pLine" @click="search('fli')">
      <van-field v-model="form.flight" placeholder="请输入航班号" input-align="left" required readonly />
      <i class="iconfont icon-sousuo1"></i>
    </div>
    <div class="pLine" @click="calendarShow = true">
      <van-field v-model="form.isDateName" placeholder="请选择飞行计划日期" input-align="left" required :readonly="true" />
      <van-icon name="arrow-down" />
    </div>
    <!-- <div class="selectBox" @click="columnsShow = true">
      <div class="boxCen"><span>*</span>{{ start_name && destination_name && flight_name ? start_name + "-" + destination_name + "-" + flight_name : "请选择航班信息" }}</div>
      <van-icon name="arrow-down" />
    </div> -->
    <div class="btns" v-if="info.is_submit" @click="gofunarr">提交</div>
    <div class="btns_no" v-else>提交</div>
    <div v-if="show" id="misnad">
      <van-popup v-model="show">
        <div class="popbox set-pc-style">
          <div class="title">说明</div>
          <div class="contenTxt" v-html="info.information"></div>
        </div>
        <div class="is_icon">
          <i class="iconfont icon-adsystem_icon_cancle" @click="show = false"></i>
        </div>
      </van-popup>
    </div>
    <van-calendar v-model="calendarShow" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate" :default-date="minDate" />
    <van-popup v-model="selectShow" position="bottom" :style="{ height: '80%', width: '100%' }" @close="checkClose">
      <div style="position: fixed; width: 100%;">
        <van-search v-model="form.destination" shape="round" placeholder="请输入搜索关键词" @input="searchGinfo()" v-if="noKey == 'des'" />
        <van-search v-model="form.terminus" shape="round" placeholder="请输入搜索关键词" @input="searchGinfo()" v-if="noKey == 'ter'" />
        <van-search v-model="form.flight" shape="round" placeholder="请输入搜索关键词" @input="searchFlight()" v-if="noKey == 'fli'" />
      </div>
      <div style="padding-top: 3.75rem;">
        <div v-for="(item, index) in moreList" :key="index" class="selectBoxDiv" @click.stop="tapSelect(item)">
          <template v-if="noKey == 'des'">
            <div>{{ item.flight_city_name }}</div>
            <van-icon name="success" v-if="item.id == start_id" />
          </template>
          <template v-if="noKey == 'ter'">
            <div>{{ item.flight_city_name }}</div>
            <van-icon name="success" v-if="item.id == destination_id" />
          </template>
          <template v-if="noKey == 'fli'">
            <div>{{ item.flight_number }}</div>
            <van-icon name="success" v-if="item.id == flight_id" />
          </template>
        </div>
        <div class="btnMore" v-if="page < morePage" @click="tapMore('more')">点击加载更多</div>
      </div>
    </van-popup>
    <!-- <van-popup v-model="columnsShow" position="bottom"> v-if="item.id == "
      <van-picker :columns="columns" show-toolbar ref="selectItem">
        <template #default>
          <div class="diyTitle">
            <div class="tapBtn">
              <span @click="columnsShow = false">取消</span>
              <span style="color: #f14e4e;" @click="onConfirm">确认</span>
            </div>
            <div class="selection">
              <span>起始地</span>
              <span>目的地</span>
              <span>航班号</span>
            </div>
          </div>
        </template>
      </van-picker>
    </van-popup> -->
  </div>
</template>
<script>
import flightInformation_controller from "./flightInformation_controller";

export default flightInformation_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.posBtn {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  z-index: 1111;

  .btnposA {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-direction: column;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.btnMore {
  text-align: center;
  margin-bottom: 0.9375rem;
  color: #999;
}

.selectBoxDiv {
  width: 100%;
  padding: 1.25rem 1.25rem;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;

  i {
    color: #f14e4e;
  }
}

#flightInformation {
  padding-bottom: 7rem;
  background: #fff;

  /deep/ .van-picker-column__item--selected {
    color: #f14e4e;
    font-size: 1.2rem;
  }

  /deep/.van-picker__toolbar {
    height: 100% !important;
  }

  .diyTitle {
    width: 100%;

    .selection {
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 1rem;
      color: #4d4d4d;
      margin-top: 1.63rem;
      margin-bottom: 1.1rem;
    }

    .tapBtn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 1.03rem;
      padding-right: 0.84rem;
      font-size: 1rem;
      color: #999;
      margin-top: 0.91rem;
    }
  }

  #misnad .van-popup {
    background-color: transparent !important;
  }

  .is_icon {
    margin-top: 1rem;
  }

  #misnad .van-popup i {
    color: #fff;
    font-size: 2.5rem;
  }

  .popbox {
    width: 18.78rem;
    height: 23.75rem;
    background-color: #fff;
    border-radius: 0.31rem;
    padding: 0 1.28rem;
    padding-top: 1.75rem;
    position: relative;
    overflow: hidden;

    .title {
      font-size: 1rem;
      color: #161615;
      text-align: center;
    }

    .contenTxt {
      height: 17rem;
      overflow-y: scroll;
      text-align: left;
      margin-top: 1.19rem;

      /deep/ img {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }

  .btn {
    width: 20rem;
    height: 2.5rem;
    background-color: #c9c9c9;
    border-radius: 1.25rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .btns {
    width: 20rem;
    height: 2.5rem;
    background-color: #f14e4e;
    border-radius: 1.25rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .btns_no {
    width: 20rem;
    height: 2.5rem;
    background-color: #c9c9c9;
    border-radius: 1.25rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .selectBox {
    width: 21.56rem;
    height: 2.38rem;
    border-radius: 0.31rem;
    border: solid 0.03rem #959595;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.72rem;
    padding-right: 0.81rem;
    box-sizing: border-box;
    margin-bottom: 3.06rem;

    .boxCen {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.94rem;
    }

    span {
      font-size: 2rem;
      margin-top: 0.7rem;
      margin-right: 0.53rem;
      color: #f14e4e;
    }
  }

  .banner {
    width: 23.44rem;

    img {
      width: 23.44rem;
      height: 0 auto;
    }
  }

  .pLine {
    padding-right: 1.13rem;
    margin: 0 1.13rem;
    border: 1px solid #f2f2f2;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .isForm {
    .formConten {
      padding-top: 0.78rem;
      padding-bottom: 1.25rem;
    }

    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 0.94rem;
      padding-top: 1.44rem;
      align-items: center;
      margin-bottom: 1.25rem;

      .left {
        display: flex;
        align-items: center;
        font-size: 1.06rem;

        span {
          font-size: 0.94rem;
          color: #666;
        }
      }

      .line {
        width: 0.13rem;
        height: 0.75rem;
        background-color: #f14e4e;
        border-radius: 0.06rem;
        margin-right: 0.47rem;
      }
    }
  }
}
</style>
