<template>
  <div class="page">
    <c-title :hide="false" :text="pluginOptions.plugin_name"></c-title>
    <div class="imagebox" v-if="introduction.pickingbanner">
      <img class="image" :src="introduction.pickingbanner" />
    </div>
    <van-form @submit="onSubmit">
      <div class="content">
        <van-field
          v-model.trim="applyModel.password"
          required
          :name="pluginOptions.password_name"
          label-width="4.5rem"
          :label="pluginOptions.password_name"
          :placeholder="`请输入${pluginOptions.password_name}`"
          @blur="getPrice"
          :rules="[{ required: true, message: `请输入${pluginOptions.password_name}` }]"
        />
        <van-field v-model.trim="applyModel.realname" required name="姓名" label-width="2.5rem" label="姓名:" placeholder="请输入姓名" />
        <van-field v-model.trim="applyModel.mobile" required label="手机号:" label-width="3.5rem" placeholder="请输入手机号" />
        <van-cell is-link style="padding-left: 10px; padding-right: 10px;" class="text-name">
          <span style="margin-right: 0.5rem;"><span style="color: #ee0a24;">*</span>{{ pluginOptions.city_name }}</span>
          <input style="border: none;" type="text" @click.stop="addressShow = true" v-model="addressName" readonly placeholder="请选择城市" />
        </van-cell>

        <van-cell is-link style="padding-left: 10px; padding-right: 10px;" v-if="strShow" class="text-name">
          <span style="margin-right: 0.5rem;"><span style="color: #ee0a24;">*</span>街道</span>
          <input style="border: none;" type="text" @click.stop="streetShow = true" v-model="street" readonly placeholder="请选择街道" />
        </van-cell>

        <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="area"></yd-cityselect>
        <van-popup v-model="streetShow" position="right" :style="{ width: '100%', height: '100%', overflow: auto }">
          <van-nav-bar title="选择街道">
            <template #left>
              <span>
                <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
              </span>
            </template>
          </van-nav-bar>

          <van-cell is-link :border="false" :key="i" arrowv v-for="(item, i) in districtVal" @click.native="streetConfirm(item)">
            <span slot="title">{{ item.areaname }}</span>
          </van-cell>
        </van-popup>
        <van-field required v-model.trim="applyModel.address" label-width="4.5rem" :label="pluginOptions.address_name" placeholder="请输入详细地址" />
      </div>
      <div class="text">{{ introduction.commitment }}: {{ $i18n.t("money") }}{{ price || 0 }}</div>
      <template v-if="plugin == 'picking-card-one'">
        <div class="input text install">
          <div>
            <span style="color: #ee0a24;">*</span>
            <span style="margin: 0 0.2rem;">请确认是否使用{{ introduction.commitment }}兑换滤芯</span>
          </div>
          <van-radio-group v-model="applyModel.is_filter" direction="horizontal" class="radio">
            <van-radio name="2" icon-size="0.9rem" checked-color="#f15353" class="radioItem">是</van-radio>
            <van-radio name="1" icon-size="0.9rem" checked-color="#f15353" class="radioItem">否</van-radio>
          </van-radio-group>
        </div>
        <div style="display: flex; margin-bottom: 1rem;">
          <van-checkbox v-model="instroductionSelect" class="checkbox text" checked-color="#f15353" shape="square"></van-checkbox>
          <p @click="showIntroduction">提货说明</p>
        </div>
      </template>
      <button @click="setApplyData" class="submit">立即申请</button>
    </van-form>

    <van-popup v-model="introductionShow" round closeable>
      <p class="popup-title">提货说明</p>
      <div class="popup-box" v-html="introduction.pick_explain"></div>
    </van-popup>
  </div>
</template>

<script>
import pickUpCardIndexController from "./pick_up_card_index_controller";

export default pickUpCardIndexController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background-color: #fff;
  text-align: left;
  min-height: 100vh;

  .title {
    display: flex;
    line-height: 2.75rem;
    letter-spacing: 0;
    padding-left: 0.906rem;

    .van-icon {
      flex: 1;
      display: flex;
    }

    .van-icon::before {
      padding-top: 0.969rem;
    }

    span {
      flex: 1;
      margin-left: -3rem;
    }
  }

  .imagebox {
    text-align: center;
    padding: 0.531rem;
  }

  .image {
    width: 21.563rem;
    border-radius: 0.625rem;
  }

  .content {
    padding: 0.5rem 0.5rem 0;

    .field {
      padding-left: 0;
    }
  }

  .button {
    border-radius: 0.469rem;
  }

  .text {
    padding-left: 1.531rem;
    line-height: 3rem;
  }

  .install {
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  .checkbox {
    display: flex;
    margin-right: 0.3rem;
  }

  .submit {
    margin: 1rem 2rem;
    width: 19.125rem;
    height: 2.5rem;
    background-color: #f15353;
    border: none;
    color: #fff;
    border-radius: 0.469rem;
  }
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 0.5rem;
}

.popup-box {
  width: 18rem;
  height: 18rem;
  margin: 0 auto;
  padding: 0.5rem;
  overflow-y: scroll;
}

.text-name {
  color: #555;

  .van-cell__value {
    span {
      color: #555;
    }
  }
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
