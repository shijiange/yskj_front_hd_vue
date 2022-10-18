<!--  -->
<template>
  <div class="filterPopup-box">
    <div class="filterPopup-box-title">入群方式</div>
    <van-radio-group v-model="join_scene" class="filterPopup-box-cell">
      <van-radio :name="item" v-for="item in configData.join_scene" :key="item.value" :class="{ checked: join_scene == item }">{{ item.name }}</van-radio>
    </van-radio-group>
    <div class="filterPopup-box-title">是否在群</div>
    <van-radio-group v-model="status" class="filterPopup-box-cell">
      <van-radio :name="item" v-for="item in configData.status" :key="item.value" :class="{ checked: status == item }">{{ item.name }}</van-radio>
    </van-radio-group>
    <template v-if="!hiddenMember">
      <div class="filterPopup-box-title">会员</div>
      <van-radio-group v-model="is_old" class="filterPopup-box-cell">
        <van-radio :name="item" v-for="item in configData.is_old" :key="item.value" :class="{ checked: is_old == item }">{{ item.name }}</van-radio>
      </van-radio-group>
    </template>
    <template v-if="!hiddenFans">
      <div class="filterPopup-box-title">是否是粉丝</div>
      <van-radio-group v-model="is_fans" class="filterPopup-box-cell">
        <van-radio :name="item" v-for="item in configData.is_fans" :key="item.value" :class="{ checked: is_fans == item }">{{ item.name }}</van-radio>
      </van-radio-group>
    </template>

    <div class="filter-select-btn">
      <van-button type="primary" size="small" color="#f14e4e" plain @click="resetData">重置</van-button>
      <van-button type="primary" size="small" color="#f14e4e" @click="confirm">完成</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hiddenMember: {
      type: Boolean,
      default: false
    },
    hiddenFans: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      join_scene: null,
      status: null,
      is_old: null,
      is_fans: null,
      configData: {
        join_scene: [
          {
            name: "直接邀请",
            value: 1
          },
          {
            name: "邀请链接",
            value: 2
          },
          {
            name: "扫码入群",
            value: 3
          }
        ],
        status: [
          {
            name: "在群",
            value: 1
          },
          {
            name: "退群",
            value: 0
          }
        ],
        is_old: [
          {
            name: "新会员",
            value: 0
          },
          {
            name: "老会员",
            value: 1
          }
        ],
        is_fans: [
          {
            name: "粉丝",
            value: 1
          },
          {
            name: "全部成员",
            value: 0
          }
        ]
      }
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    resetData() {
      this.join_scene = null;
      this.status = null;
      this.is_old = null;
      this.is_fans = null;
    },
    confirm() {
      let _fans = this.is_fans;
      if (_fans) _fans.name = _fans.value == 1 ? "粉丝" : "游客";

      let _data = {};
      if (this.join_scene) _data.join_scene = this.join_scene;
      if (this.status) _data.status = this.status;
      if (this.is_old) _data.is_old = this.is_old;
      if (this.is_fans) _data.is_fans = _fans;

      this.$emit("confirm", _data);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.filterPopup-box {
  padding: 20px 12px;
  .filterPopup-box-title {
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    padding: 18px 0px;
  }
  .filterPopup-box-cell {
    display: flex;
    flex-wrap: wrap;
  }
  .filter-select-btn {
    margin-top: 28px;
    display: flex;
    justify-content: center;
    button {
      margin: 0 15px;
      min-width: 120px;
    }
  }
  .van-radio {
    height: 28px;
    line-height: 28px;
    padding-right: 8px;
    border-radius: 14px;
    // background: #eff0f1;
    border: 1px solid #eff0f1;
    margin-right: 12px;
    color: #666666;
  }
  /deep/.van-radio__icon {
    display: none;
  }
  /deep/.van-radio__label {
    min-width: 64px;
  }
  .checked {
    border: 1px solid #f14e4e;
    // background: #f14e4e;
    /deep/.van-radio__label {
      color: #f14e4e;
    }
  }
}
</style>
