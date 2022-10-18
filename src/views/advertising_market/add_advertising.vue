<template>
  <div id="add_adverting">
    <c-title :hide="false" :text="$route.params.id ? '编辑广告' : '添加广告'">
    </c-title>

    <div class="main">
      <div class="text-item">
        <p class="title">广告名称</p>
        <input
          type="text"
          v-model="formData.advert_name"
          title="name"
          placeholder="请输入广告名称"
        />
      </div>
      <div>
        <p class="title">广告类型</p>
        <van-radio-group
          v-model="formData.advert_type"
          style="display: flex; margin: 1rem 0;"
        >
          <van-radio :name="1" checked-color="#f55955">图片</van-radio>
          <van-radio :name="2" checked-color="#f55955" style="margin-left: 1rem;"
            >视频</van-radio
          >
        </van-radio-group>
      </div>
      <div>
        <p class="title">素材</p>
        <van-uploader
          :after-read="onRead_1"
          v-if="formData.advert_type == 1"
        >
          <div
            style="padding: 0.2rem; width: 100%; height: auto; border: 1px dashed #c0ccda; margin: 1rem auto; display: flex;"
          >
            <img
              v-if="imgUrl"
              :src="imgUrl"
              style="width: 100%; margin: 0 auto;"
              class="avatar"
            />
            <img
              v-else
              src="../../assets/images/up_icon.png"
              style="width: 50%; height: 50%;"
              class="avatar"
            />
          </div>
        </van-uploader>

        <div class="video-wrap" v-if="formData.advert_type == 2">
          <video
            preload="metadata"
            controlslist="nodownload"
            width="100%"
            height="100%"
            controls
            ref="video"
            webkit-playsinline="true"
            x5-video-player-type="h5"
            playsinline
            x5-playsinline=""
            x5-video-orientation="portrait"
            x5-video-player-fullscreen=""
            autoplay="autoplay"
            :src="videoUrl"
            id="video"
            v-show="videoUrl"
            style="background: #fff;"
          >
            <source :src="videoUrl" type="video/ogg" />
            <source :src="videoUrl" type="video/mp4" />
            你的浏览器不支持video标签！
          </video>
          <img
            src="../../assets/images/agreen_video@2x.png"
            alt=""
            class="back_img"
            v-show="!videoUrl"
          />
          <input
            class="video-input"
            type="file"
            id="file"
            accept="video/*"
            v-show="!videoUrl"
            @change="onReadVideo"
          />
        </div>
      </div>
      <div class="text-item">
        <p class="title">广告预算(元)</p>
        <p style="font-size: 10px; color: #f15353; padding: 0.25rem 0;">
          广告预算会从您的会员{{ fun.getBalanceLang() }}中扣除并冻结，当前{{
            fun.getBalanceLang()
          }}： {{ balance }}元
        </p>
        <input
          type="text"
          v-model="formData.advert_budget"
          title="name"
          placeholder="请输入广告预算"
        />
      </div>
      <div>
        <p class="title">广告投放类型</p>
        <van-checkbox-group
          v-model="formData.advert_code"
          style="display: flex; margin: 1rem 0;"
        >
          <van-checkbox name="1" shape="square" checked-color="#f55955"
            >待机广告</van-checkbox
          >
          <van-checkbox
            name="2"
            shape="square"
            checked-color="#f55955"
            style="margin-left: 1rem;"
            >支付广告</van-checkbox
          >
        </van-checkbox-group>
      </div>
      <div class="text-item">
        <p class="title">待机广告单价(元/分钟)</p>
        <input
          type="text"
          v-model="formData.await_amount"
          title="name"
          placeholder="请输入待机广告单价"
        />
      </div>
      <div class="text-item">
        <p class="title">支付广告单价(元/次)</p>
        <input
          type="text"
          v-model="formData.payment_amount"
          title="name"
          placeholder="请输入支付广告单价"
        />
      </div>
      <div class="text-item">
        <p class="title">投放区域</p>
        <input
          type="text"
          title="name"
          @click.stop="streetShow = true"
          v-model="addressName"
          readonly
          placeholder="请选择区域"
        />
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <div
        class="text-item"
        style="padding-bottom: 0.5rem;"
        v-if="result3.length > 0"
      >
        已选地区：
        <span v-for="(city, i) in result3" :key="i">{{
          JSON.parse(city).n
        }}</span>
      </div>
      <div class="text-item">
        <p class="title">投放门店分类</p>
        <input
          type="text"
          title="name"
          @click.stop="show1 = true"
          v-model="addressName"
          readonly
          placeholder="请选择门店分类"
        />
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <div
        class="text-item"
        style="padding-bottom: 0.5rem;"
        v-if="result.length > 0"
      >
        已选分类：<span v-for="(class1, j) in result" :key="j">{{
          JSON.parse(class1).name
        }}</span>
      </div>
    </div>

    <div
      class="submit"
      @click="play_Upload"
      v-show="showUploadBtn && formData.advert_type == 2"
    >
      上传视频
    </div>
    <div
      class="submit"
      @click="Sumbit"
      v-show="(!showUploadBtn && !uploadIng) || formData.advert_type == 1"
    >
      提交
    </div>

    <van-popup v-model="show">
      <div class="popop-box">
        <div class="popup-content">
          <img
            class="pic"
            src="../../assets/images/adsystem_pic_warning@2x.png"
            alt=""
          />
          <div class="red">您当前的余额不足以支付广告预算</div>
          <div class="gray">请先充值余额后再重试!</div>
          <div class="sure" @click="show = false">确认</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="streetShow" position="right" class='pro' style="width: 100%; height: 100%;">
      <van-nav-bar title="选择投放区域（必须选择区">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow=false" color='#333' />
          </span>
        </template>
        <template #right>
          <div style="color: #3c3c3c;" @click="Sure">确定</div>
        </template>
      </van-nav-bar>
      <div
        style="display: flex; overflow-y: hidden; background: #fff;"
        @touchMove.stop
      >
        <div ref="cartWrapper" style="height: 32rem; overflow: auto;">
          <div id="cityClass">
            <p class="classTitle">省</p>
            <van-checkbox-group
              v-model="result1"
              style="display: flex; flex-direction: column; margin: 1rem 0;"
            >
              <van-checkbox
                :name="item.v"
                v-for="(item, i) in district"
                :key="item.v"
                @click="seleItem(item, i)"
                shape="square"
                checked-color="#f15353"
                >{{ item.n }}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>

        <div ref="cartWrapper1" style="height: 32rem; overflow: hidden;">
          <div id="cityClass2">
            <p class="classTitle" v-show="select1.length > 0">市</p>
            <van-checkbox-group
              v-model="result2"
              style="display: flex; flex-direction: column; margin: 1rem 0;"
            >
              <van-checkbox
                :name="item.v"
                v-for="(item, i) in select1"
                :key="item.v"
                @click="seleItem2(item, i)"
                shape="square"
                checked-color="#f15353"
                >{{ item.n }}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </div>
    </van-popup>


    <van-popup
      v-model="show2"
      position="right"
      :style="{
        height: '100%',
        width: '80%',
        background: '#fff',
        borderRadius: '0'
      }"
    >
      <div id="popClass1">
        <p class="classTitle">区</p>
        <van-checkbox
          v-model="all"
          shape="square"
          checked-color="#f15353"
          @click.stop="toggleAll"
          >全选</van-checkbox
        >
        <van-checkbox-group
          v-model="result3"
          ref="checkboxGroup"
          style="display: flex; flex-direction: column; margin: 0 0 1rem 0;"
        >
          <van-checkbox
            :name="JSON.stringify(item)"
            v-for="item in select2"
            :key="item.v"
            shape="square"
            checked-color="#f15353"
            >{{ item.n }}
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </van-popup>

    <van-popup
      v-model="show1"
      position="right"
      :style="{
        height: '100%',
        width: '80%',
        background: '#fff',
        borderRadius: '0'
      }"
    >
      <div id="popClass">
        <van-checkbox-group
          v-model="result"
          style="display: flex; flex-wrap: wrap; margin: 1rem 0;"
        >
          <van-checkbox
            :name="JSON.stringify(item).slice(0, -18) + '}'"
            v-for="(item, i) in store_cateGorys"
            :key="i"
            shape="square"
            checked-color="#f15353"
            >{{ item.name }}
          </van-checkbox>
        </van-checkbox-group>
        <div class="sureBtn" @click="show1 = false">确认</div>
      </div>
    </van-popup>

    <!--垫高样式-->
    <div style="height: 1rem;"></div>
  </div>
</template>

<script>
import add_advertising_controller from "./add_advertising_controller";

export default add_advertising_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.classTitle {
  text-align: center;
  font-size: 16px;
}

#popClass,
#popClass1 {
  height: 100%;
  overflow-y: scroll;

  .van-checkbox {
    margin: 1rem 0 0 1rem;
  }

  .sureBtn {
    width: 15rem;
    height: 2rem;
    margin: 0 auto 1rem;
    line-height: 2rem;
    text-align: center;
    color: #fff;
    background-color: #f15353;
    box-shadow: 0 0 0.313rem 0 rgba(255, 73, 73, 0.3);
    border-radius: 1.219rem;
  }
}

#cityClass,
#cityClass2 {
  flex: 1;

  /* overflow-y: scroll; */
  .van-checkbox {
    width: 85%;
    margin: 0 1rem 1rem 1rem;
  }

  .van-checkbox__label {
    width: 90%;
  }
}

.popop-box {
  width: 13rem;
  height: 14rem;
  margin: 0 auto;
  border-radius: 10px;

  .popup-content {
    background: #fff;
    width: 13rem;
    height: 14rem;
    padding: 1rem 0;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    overflow-y: scroll;
  }

  .pic {
    width: 3rem;
    height: 3rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .red {
    color: #f15353;
    margin: 1rem 0;
  }

  .sure {
    width: 9rem;
    height: 2rem;
    line-height: 2rem;
    background-color: #f15353;
    box-shadow: 0 0 0 0 rgba(255, 73, 73, 0.3);
    border-radius: 1rem;
    color: #fff;
    margin: 1.5rem auto 0 auto;
  }
}

#add_adverting {
  background: #fff;
  text-align: left;

  .van-popup {
    border-radius: 10px;
    background: transparent;
  }

  input {
    margin: 0.625rem 0;
    width: 92%;
    height: 1.875rem;
    border-radius: 0.375rem;
    border: 0;
    outline: 0;
  }

  .main {
    margin: 1rem;
  }

  .title {
    font-weight: bold;
  }

  .text-item {
    border-bottom: 1px solid #efefef;
    margin: 0.5rem 0;

    span {
      margin: 0.2rem 0.3rem;
      padding: 0.1rem 0.2rem;
      color: #f15353;
      background: rgba(241, 83, 83, 0.16);
      border-radius: 5px;
      display: inline-block;
    }
  }

  .submit {
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    line-height: 2.438rem;
    margin: 0 auto;
    width: 19.375rem;
    height: 2.438rem;
    background-color: #f15353;
    box-shadow: 0 0 0.313rem 0 rgba(255, 73, 73, 0.3);
    border-radius: 1.219rem;
  }

  .video-wrap {
    width: 90%;
    height: 14.19rem;
    position: relative;
    display: flex;
    margin: 1rem auto;
    background: #fafafa;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .back_img {
      width: 5rem;
      height: 5rem;
    }

    .video-guide {
      position: absolute;
      color: #fff;
    }

    .video-input {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;
    }
  }

  .pro {
    border-radius: 0;
    background: #fff;
  }
}
</style>
