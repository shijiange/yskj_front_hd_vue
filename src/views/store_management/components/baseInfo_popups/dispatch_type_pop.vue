<template>
  <div class="stock-type-pop">
    <yz-popup
      :isShow="isShowPopup"
      title="运费设置"
      @closePopup="closePopup"
      @clickConfirmBtn="confirmType"
    >
      <template>
        <van-radio-group v-model="dispatchData.dispatch_type" style="text-align:left" checked-color="#f15353" @change="changeType">
          <van-cell-group>
            <van-cell clickable @click="dispatchData.dispatch_type = 1">
              <template #title>
                <p class="title">统一邮费</p>
                <van-field v-if="dispatchData.dispatch_type == 1" v-model="dispatchData.dispatch_price" placeholder="请输入统一邮费">
                  <template #extra>
                    <span style="display: flex; align-items: center;">元</span>
                  </template>
                </van-field>
              </template>
              <template #right-icon>
                <van-radio :name="1" />
              </template>
            </van-cell>
            <van-cell clickable @click="dispatchData.dispatch_type = 0">
              <template #title>
                <p class="title">选择运费模板</p>
              </template>
              <template #right-icon>
                <van-radio :name="0" />
              </template>
            </van-cell>
            <van-cell
              v-if="dispatchData.dispatch_type == 0" :title="templateName"
              is-link style="padding: 0 0 0 1rem"
              @click="checkDisTemplate"
            ></van-cell>
          </van-cell-group>
        </van-radio-group>
      </template>
    </yz-popup>


    <!-- 运费模板 -->
    <van-popup v-model="showTemplate" round position="bottom">
      <van-picker
        ref="dispatchPicker"
        title="运费设置"
        show-toolbar
        :columns="templates"
        value-key="dispatch_name"
        @confirm="confirmTemplate"
        @cancel="cancelTemplate"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
import yzPopup from "../yz_popup";

export default {
  props: {
    defaultData: {
      type: Object,
      default () {
        return {};
      }
    },
    templates: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  data () {
    return {
      isShowPopup: false,
      showTemplate: false,
      dispatchData: {},

      radio: 0,
      dispatchPrice: '',
      columns: [],
      checkTemplate: {},
    };
  },
  computed: {
    templateName () {
      let text = '';
      this.templates.forEach((item, index) => {
        if (item.id == this.checkTemplate.id) text = this.checkTemplate.dispatch_name;
      });
      return text ? text : "默认模板";
    },
  },
  mounted () {
    this.dispatchData = this.defaultData;
  },
  methods: {
    showPopup () {
      this.isShowPopup = true;
    },
    changeType (type) {
      this.$emit('changeType', type);
    },
    closePopup () {
      this.isShowPopup = false;
    },
    confirmType (event) {
      if (this.dispatchData.dispatch_type == 1 && this.fun.isTextEmpty(this.dispatchData.dispatch_price)) {
        return this.$toast('请填写统一邮费');
      }
      this.isShowPopup = event;
      this.$emit("confirmType", this.dispatchData);
    },

    checkDisTemplate () {
      this.isShowPopup = false;
      this.showTemplate = true;
    },
    // 运费模板
    confirmTemplate (check) {
      this.checkTemplate = check;
      this.dispatchData.dispatch_id = check.id;
      this.cancelTemplate();
    },
    cancelTemplate () {
      this.isShowPopup = true;
      this.showTemplate = false;
    },
  },

  components: {
    yzPopup
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.stock-type-pop {
  /deep/ .van-cell {
    padding: 1rem 0;
    .van-radio {
      align-items: start !important;
      .van-radio__icon .van-icon {
        color: #fff !important;
        background-color: #c4c4c4 !important;
      }
      .van-radio__icon--checked .van-icon {
        background-color: #f15353 !important;
        border-color: #f15353 !important;
      }
    }
    .van-field__control {
      padding: 0.4rem 1rem;
      border-radius: 0.31rem;
      border: solid 0.03rem #cecece;
    }
  }
  .title {
    font-size: 0.88rem;
    line-height: 1.13rem;
    color: #2b2a2a;
  }
  .description {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.13rem;
    letter-spacing: 0rem;
    color: #919191;
  }
  /deep/ .van-picker-column__item--selected {
    color: #f15353;
  }
}

</style>