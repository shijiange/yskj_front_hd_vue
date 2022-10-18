<!-- 折扣组件 -->
<template>
  <div id="discount">
    <div class="rebate_box">
      <ul class="type">
        <li>
          <van-field label="折扣类型：">
            <template #input>
              <van-checkbox v-model="level_discount_type" checked-color="#f15353">
                会员等级
              </van-checkbox>
            </template>
          </van-field>
        </li>
        <li>
          <van-field label="折扣方式：">
            <template #input>
              <van-radio-group v-model="discount_method" direction="horizontal" checked-color="#f15353">
                <van-radio :name="1" icon-size="18px">折扣</van-radio>
                <van-radio :name="2" icon-size="18px">固定金额</van-radio>
                <van-radio :name="3" icon-size="18px">成本比例</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </li>
      </ul>
      <ul class="member_number">
        <li v-for="(item, index) in discount_values" :key="index">
          <van-field v-model="item.discount_value" :label="item.level_name" placeholder="请输入等级折扣"></van-field>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    widgetsInfo: {
      type: [String, Number, Object],
      default: function() {
      }
    },
    levelList: {
      type: Array,
      default: function() {
        return [];
      }
    },
  },
  data() {
    return {
      discount_values: [],
      level_discount_type: true,
      discount_method: 1
    };
  },
  mounted() {
    this.discount_values = this.levelList;
    this.getDataInfo();
  },
  methods: {
    setDiscountValues () {

    },
    getDataInfo() {
      let that = this;
      if (this.widgetsInfo && this.widgetsInfo.discount) {
        let {level_discount_type, discount_method} = this.widgetsInfo.discount;
        that.level_discount_type = Boolean(level_discount_type);
        that.discount_method = discount_method;
      }
    },

    // 过滤数据
    filertMap (list=[]) {
      let arr = list.map(item => {
        return {level_id: item.id, discount_value: item.discount_value};
      });
      return arr;
    },
    validatorData() {
      let json = {};
      json = {
        level_discount_type: this.level_discount_type ? 1 : 0,
        discount_method: this.discount_method,
        discount_value: this.filertMap(this.discount_values)
      };
      return json;
    }
  },
  computed: {}
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  #discount {
    padding-bottom: 3.3125rem;
    overflow: scroll;
    z-index: 9999;
    overflow: hidden;

    /deep/ .rebate_box {
      .type,
      .member_number {
        margin-top: 0.625rem;
        background: #fff;
        li {
          display: flex;
          align-items: center;
          font-size: 15px;
          .van-radio {
            display: flex;
            flex-wrap: nowrap;
            margin-bottom: 0.5rem;
          }
        }

        .van-cell__title {
          width: auto !important;
          max-width: 10rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .van-radio-group {
          flex-wrap: nowrap;
        }
        .van-radio {
          .van-radio__icon .van-icon {
            color: #fff !important;
            background-color: #c4c4c4 !important;
          }
          .van-radio__icon--checked .van-icon {
            background-color: #f15353 !important;
            border-color: #f15353 !important;
          }
        }
        .list_box {
          padding: 0.625rem 0.875rem;
        }
      }
      .type {
        margin-top: 0;
      }
    }
  }
</style>
