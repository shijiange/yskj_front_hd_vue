<!-- 会员折扣 -->
<template>
  <div>
    <div @click="gotoMemberGradeList(goodsInfo.member_discount.display_page)">
      <van-row style="background: #f5f5f5;">
        <van-col :span="24" id="memberBox" style="padding: 0.3rem 0;" v-if="openVip == '1'">
          <van-col :span="5" class="img">
            <img src="../../../assets/images/goods/member@2x.png" alt />
          </van-col>
          <van-col :span="14" class="vipBox" v-if="goodsInfo.member_discount && goodsInfo.member_discount.discount_value">
            <div style="font-size: 12px;">
              {{ goodsInfo.member_discount.level_name }}专享价{{ $i18n.t("money") }}{{ goodsInfo.member_discount.discount_value }}
              <span v-if="isRent">/天</span>
            </div>
            <div
              style="font-size: 12px; margin-top: 0.3rem; color: #a77b00;"
              v-if="goodsInfo.member_discount.next_level_price != goodsInfo.member_discount.discount_value && goodsInfo.member_discount.next_level_price > 0.0"
            >
              加入{{ goodsInfo.member_discount.next_level_name }}专享价{{ $i18n.t("money") }}{{ goodsInfo.member_discount.next_level_price }}
              <span v-if="isRent">/天</span>
            </div>
          </van-col>
          <van-col :span="5" class="sale" v-if="goodsInfo.member_discount.display_page == '1'">
            <div class="vipBox_btn">
              立即开通
              <i class="icon-member_look iconfont"></i>
            </div>
          </van-col>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: {
      type: Object,
      default: () => ({})
    },
    isRent: {
      type: Boolean,
      default: false
    },
    loaging: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openVip: 2
    };
  },
  components: {},
  // computed: {},
  methods: {
    init() {
      if (this.goodsInfo.member_discount) {
        if (this.fun.isTextEmpty(this.goodsInfo.member_discount.discount)) {
          this.openVip = 1;
        } else {
          this.openVip = this.goodsInfo.member_discount.discount;
        }
      }
    },
    gotoMemberGradeList(flag) {
      if (flag == "1") {
        this.$router.push(this.fun.getUrl("MemberGradeList", {}));
      }
    }
  },
  watch: {
    loaging(newVal, oldVal) {
      this.init();
    }
  }
};
</script>
<style lang="scss" scoped>
#memberBox {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  background: #fffbe1;

  .img {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;

    img {
      width: 3.875rem;
      height: 1.375rem;
    }
  }

  .vipBox {
    text-align: left;
    color: #333;
  }

  .sale {
    padding-right: 0.625rem;
    font-size: 1.125rem;
    color: #333;
  }

  .vipBox_btn {
    display: flex;
    justify-content: space-around;
    width: 4rem;
    height: 1.375rem;
    line-height: 1.375rem;
    border-radius: 0.25rem;
    background: #363635;
    color: #fee5a3;
    overflow: hidden;
    font-size: 0.75rem;

    i {
      font-size: 0.75rem;
      line-height: 1.375rem;
    }
  }
}
</style>
