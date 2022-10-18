<!-- 折扣组件 -->
<template>
  <div id="discount">
    <div class="rebate_box">
      <ul class="type">
        <li>
          <span>折扣类型：</span>
          <van-checkbox v-model="level_discount_type" checked-color="#f15353">
            会员等级
          </van-checkbox>
        </li>
        <li>
          <span>折扣方式：</span>
          <van-radio-group v-model="discount_method">
            <van-radio name="1">折扣</van-radio>
            <van-radio name="2">固定金额</van-radio>
          </van-radio-group>
        </li>
      </ul>
      <ul class="member_number">
        <li v-for="(item,index) in levelsList" :key="index">
          <span>{{item.level_name}}</span>
          <input type="text" v-model="discount_value[item.id]" placeholder="请输入等级折扣" @blur="clearSrcoll()">
        </li>
      </ul>
      <!-- <span @click="dddd">几十块的黄金时代</span> -->
    </div>
  </div>
</template>

<script>
// import { Toast } from 'vant';

export default {
  props: {
    DataInfo: {
      type: [String, Number, Object],
      default: function() {
      }
    },
    GoodSetData: {
      type: [String, Number, Object],
      default: function() {
      }
    }
  },
  data() {
    return {
      isType: false,
      levelsList: [],
      discount_value: {},
      level_discount_type: true,
      discount_method: "1"
    };
  },
  activated() {
    this.levelsList = [];
    this.discount_value = {};
    this.isType = this.fun.isTextEmpty(this.$route.params.goods_id);//return true为商品发布
    this.getDataInfo();
  },
  mounted() {
    this.levelsList = [];
    this.discount_value = {};
    this.isType = this.fun.isTextEmpty(this.$route.params.goods_id);//return true为商品发布
    this.getDataInfo();
    let orderHights = document.body.clientHeight;
    document.getElementById("discount").style.height = (orderHights - 82) + "px";
  },
  methods: {
    clearSrcoll() {
      var currentPosition, timer;
      var speed = 1;//页面滚动距离
      timer = setInterval(function() {
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition);//页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition);//页面向下滚动
        clearInterval(timer);
      }, 1);
    },
    getDataInfo() {
      let that = this;
      //获取会员等级
      // $http.post('plugin.store-cashier.frontend.store.goods.get-member-level', {},"加载中").then(
      //   function(response) {
      //     if (response.result === 1) {
      //       that.levelsList = response.data;
      //       //console.log("折扣获取会员等级",response.data)
      //     } else {
      //       console.log("获取会员等级error",response.msg)
      //     }
      //   },
      //   function(response) {
      //     console.log(response);
      //   }
      // );
      that.levelsList = that.GoodSetData.member_level;
      if (that.isType) {
        //发布
      } else {
        //编辑
        that.level_discount_type = Boolean(this.DataInfo.discount.level_discount_type);
        that.discount_method = this.DataInfo.discount.discount_method.toString();
        that.discount_value = this.DataInfo.discount.discount_value;
      }
    },
    dddd() {
      console.log(this.discount_value);
      // let that = this;
    },
    DiscountJson() {
      let json = {};
      if (this.GoodSetData.goods_widgets.tab_discount == "1") {
        json = {
          level_discount_type: this.level_discount_type ? 1 : 0,
          discount_method: this.discount_method == "1" ? 1 : 2,
          discount_value: this.discount_value
        };
      }
      //console.log('折扣的json数据',json)
      this.$emit("getChildthreeData", json);
      this.$emit("getSignthree", this.levelsList.length);
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

    .rebate_box {
      .type,
      .member_number {
        margin-top: 0.625rem;
        background: #fff;
        padding: 0.625rem 0.875rem;

        li {
          display: flex;
          align-items: center;
          height: 2.5rem;
          position: relative;
          font-size: 15px;

          span {
            width: 6.875rem;
          }

          input {
            border: none;
            width: 11.25rem;
          }

          .fa {
            position: absolute;
            right: 0;
            font-size: 1.125rem;
            color: #c9c9c9;
          }
        }

        .list_box {
          padding: 0.625rem 0.875rem;
        }
      }
    }
  }
</style>
