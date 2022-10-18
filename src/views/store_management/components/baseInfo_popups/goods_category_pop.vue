<template>
  <div class="goods-catgory-pop">
    <yz-popup
      :isShow="isShowPopup"
      title="选择商品分类"
      @closePopup="cancelSelect"
      @clickConfirmBtn="confirmType"
    >
      <template>
      <van-picker
        ref="categoryPicker"
        :columns="columns"
        @confirm="confirmCategory"
      ></van-picker>
      </template>
    </yz-popup>
  </div>
</template>

<script>
import yzPopup from "../yz_popup";

export default {
  props: ['defaultType', 'categoryList'],
  data () {
    return {
      isShowPopup: false,
      columns: [],
    };
  },
  mounted () {
    this.columns = this.formatList(this.categoryList);
    this.active = this.defaultType ? this.defaultType : 0;
  },
  methods: {
    // 格式化列表数据
    formatList (arr) {
      let formatData = [];
      arr.forEach((item, index) => {
        let obj = {};
        let {id, name, parent_id} = item;
        obj = {
          id,
          parent_id,
          text: name,
        };
        if (item.has_many_children && item.has_many_children.length > 0) {
          obj.children = this.formatList(item.has_many_children);
        }
        formatData[index] = obj;
      });
      return formatData;
    },
    showPopup (activeTag, index) {
      this.isShowPopup = true;
      if (activeTag && !this.fun.isTextEmpty(index)) {
        this.$nextTick(() => {
          let {parent_name, child_name, third_name} = activeTag;
          this.$refs.categoryPicker.setValues([parent_name, child_name, third_name]);
        });
      }

    },
    cancelSelect () {
      this.isShowPopup = false;
    },
    confirmType (event) {
      this.$nextTick(() => {
        this.$refs.categoryPicker.confirm();
        this.isShowPopup = event;
      });
    },

    confirmCategory (value, ids) {
      let manyGoodsCategory = {};
      let values = this.$refs.categoryPicker.getValues();
      if (values.length >= 1) {
        manyGoodsCategory.parentid = values[0].id;
        manyGoodsCategory.parent_name = values[0].text;
      }
      if (values.length >= 2) {
        manyGoodsCategory.childid = values[1].id;
        manyGoodsCategory.child_name = values[1].text;
      }
      if (values.length >= 3) {
        manyGoodsCategory.thirdid = values[2].id;
        manyGoodsCategory.third_name = values[2].text;
      }
      this.$emit("confirmType", manyGoodsCategory);
    },
  },

  components: {
    yzPopup
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.goods-catgory-pop {
  /deep/ .van-picker-column__item--selected {
    color: #f15353;
  }
}

</style>