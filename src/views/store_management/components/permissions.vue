<!-- 权限组件 -->
<template>
  <div id="Permissions">
    <div class="power_box">
      <div class="member_power">
        <div class="cell">
            <input-cell  @click.native="showPopup(1)" :value="hyll_Model.length>0 ? hyll_Model.join(',') : ''"
              labelText="会员等级浏览权限：" :isReadonly="true"
            ></input-cell>
        </div>
        <div class="cell">
            <input-cell @click.native="showPopup(2)" :value="hygm_Model.length>0 ? hygm_Model.join(',') : ''"
              labelText="会员等级购买权限：" :isReadonly="true"
            ></input-cell>
        </div>
        <div class="cell">
            <input-cell @click.native="showPopup(3)" :value="hyzll_Model.length>0 ? hyzll_Model.join(',') : ''"
              labelText="会员组浏览权限：" :isReadonly="true"
            ></input-cell>
        </div>
        <div class="cell">
            <input-cell @click.native="showPopup(4)" :value="hyzgm_Model.length>0 ? hyzgm_Model.join(',') : ''"
               labelText="会员组购买权限：" :isReadonly="true"
            ></input-cell>
        </div>
      </div>

      <div class="number_power">
        <div class="cell">
            <van-field label="每次限购数量：" v-model="once_buy_limit"  placeholder="请输入每次下单限购数量" type="number"></van-field>
        </div>
        <div class="cell">
            <van-field label="会员限购总数：" v-model="total_buy_limit"  placeholder="请输入会员限购的总数" type="number"></van-field>
        </div>
        <div class="cell">
            <van-field label="会员每天限购总数：" v-model="day_buy_limit"  placeholder="请输入会员每天限购数量" type="number"></van-field>
        </div>
        <div class="cell">
            <van-field label="会员每周期限购数量：" v-model="week_buy_limit"  placeholder="请输入会员每周期限购数量" type="number"></van-field>
        </div>
        <div class="cell">
            <van-field label="会员每月限购数量：" v-model="month_buy_limit"  placeholder="请输入会员每月限购数" type="number"></van-field>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <yz-popup
      :isShow="isShowPopup"
      :isShowLeft="false"
      :isShowRight="false"
      title="会员等级浏览权限"
      @closePopup="cancelSelect"
      @clickConfirmBtn="confirmType"
    >
      <div class="list" v-if="show1">
        <van-checkbox v-model="show_levels_CheckedAll" @click="checkAll" v-if="levelList.length">全选</van-checkbox>
        <van-checkbox-group v-model="show_levels" ref="checkboxGroup">
          <van-checkbox :name="item.id" v-for="(item, index) in levelList" class="deletaAtfer" :key="index">{{
            item.level_name
          }}</van-checkbox>
        </van-checkbox-group>
        <h2 v-if="!levelList.length" style="text-align: center; margin: 15px 0;">暂无数据</h2>
      </div>

      <div class="list" v-if="show2">
        <van-checkbox v-model="buy_levels_CheckedAll" @click="checkAllBuyLevels" v-if="levelList.length"
          >全选</van-checkbox
        >
        <van-checkbox-group v-model="buy_levels" ref="checkboxGroup">
          <van-checkbox :name="item.id" v-for="(item, index) in levelList" class="deletaAtfer" :key="index">{{
            item.level_name
          }}</van-checkbox>
        </van-checkbox-group>
        <h2 v-if="!levelList.length" style="text-align: center; margin: 15px 0;">暂无数据</h2>
      </div>

      <div class="list" v-if="show3">
        <van-checkbox v-model="show_groups_CheckedAll" @click="checkAllShowGroups" v-if="groupsList.length"
          >全选</van-checkbox
        >
        <van-checkbox-group v-model="show_groups" ref="checkboxGroup">
          <van-checkbox :name="item.id" v-for="(item, index) in groupsList" class="deletaAtfer" :key="index">{{
           item.group_name
          }}</van-checkbox>
        </van-checkbox-group>
        <h2 v-if="!groupsList.length" style="text-align: center; margin: 15px 0;">暂无数据</h2>
      </div>

      <div class="list" v-if="show4">
        <van-checkbox v-model="buy_groups_CheckedAll" @click="checkAllBuyGroups" v-if="groupsList.length"
          >全选</van-checkbox
        >
        <van-checkbox-group v-model="buy_groups" ref="checkboxGroup">
          <van-checkbox :name="item.id" v-for="(item, index) in groupsList" class="deletaAtfer" :key="index">{{
            item.group_name
          }}</van-checkbox>
        </van-checkbox-group>
        <h2 v-if="!groupsList.length" style="text-align: center; margin: 15px 0;">暂无数据</h2>
      </div>
    </yz-popup>
  </div>
</template>

<script>
// import { Toast } from 'vant';
import inputCell from "./inputCell";
import yzPopup from "./yz_popup";
export default {
  props: {
    levelList: {
      type: [String, Array, Object],
      default: ()=>[]
    },
    groupsList: {
      type: [String, Array, Object],
      default: ()=>[]
    },
    widgetsInfo: {
      type: [String, Number, Object],
      default: ()=>{}
    },
  },
  data() {
    return {
      isShowPopup: false,
      popTitle: '',


      show_levels_CheckedAll: false,
      buy_levels_CheckedAll: false,
      show_groups_CheckedAll: false,
      buy_groups_CheckedAll: false,

      show1: false,
      show2: false,
      show3: false,
      show4: false,

      buy_levels: [],
      show_levels: [],
      show_groups: [],
      buy_groups: [],

      once_buy_limit: '0',
      total_buy_limit: '0',
      day_buy_limit: '0',
      week_buy_limit: '0',
      month_buy_limit: '0',

      hyll_Model: [],
      hygm_Model: [],
      hyzll_Model: [],
      hyzgm_Model: []
    };
  },
  watch: {
    show_levels(newList, oldList) {
      if (newList.length == this.levelList.length) {
        this.show_levels_CheckedAll = true;
      } else {
        this.show_levels_CheckedAll = false;
      }
      var arr1 = this.levelList.filter(function(v) {
        return newList.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
      });
      this.hyll_Model = arr1.map(function(user) {
        return user.level_name;
      });
    },

    buy_levels(newList, oldList) {
      if (newList.length == this.levelList.length) {
        this.buy_levels_CheckedAll = true;
      } else {
        this.buy_levels_CheckedAll = false;
      }
      var arr2 = this.levelList.filter(function(v) {
        return newList.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
      });
      this.hygm_Model = arr2.map(function(user) {
        return user.level_name;
      });
    },

    show_groups(newList, oldList) {
      if (newList.length == this.groupsList.length) {
        this.show_groups_CheckedAll = true;
      } else {
        this.show_groups_CheckedAll = false;
      }
      var arr3 = this.groupsList.filter(function(v) {
        return newList.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
      });
      this.hyzll_Model = arr3.map(function(user) {
        return user.group_name;
      });
    },

    buy_groups(newList, oldList) {
      if (newList.length == this.groupsList.length) {
        this.buy_groups_CheckedAll = true;
      } else {
        this.buy_groups_CheckedAll = false;
      }
      var arr4 = this.groupsList.filter(function(v) {
        return newList.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
      });
      this.hyzgm_Model = arr4.map(function(user) {
        return user.group_name;
      });
    },


  },
  activated() {
    this.init();
    this.getDataInfo();
  },
  mounted() {
    this.init();
    this.getDataInfo();
  },
  methods: {
    cancelSelect () {
      this.isShowPopup = false;
    },
    confirmType (event) {
      this.isShowPopup = false;
    },
    init() {
      this.show_levels_CheckedAll = false;
      this.buy_levels_CheckedAll = false;
      this.show_groups_CheckedAll = false;
      this.buy_groups_CheckedAll = false;

      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
    },
    getDataInfo() {
      let that = this;
      //编辑
      if (this.widgetsInfo && this.widgetsInfo.privilege) {
        let {
          show_levels, show_groups, buy_levels, buy_groups, once_buy_limit, total_buy_limit,
          day_buy_limit, week_buy_limit, month_buy_limit
        } = this.widgetsInfo.privilege;
        that.show_levels = show_levels ? show_levels.map(Number) : [];
        that.show_groups = show_groups ? show_groups.map(Number) : [];
        that.buy_levels = buy_levels ? buy_levels.map(Number) : [];
        that.buy_groups = buy_groups ? buy_groups.map(Number) : [];
        that.once_buy_limit = String(once_buy_limit);
        that.total_buy_limit = String(total_buy_limit);
        that.day_buy_limit = String(day_buy_limit);
        that.week_buy_limit = String(week_buy_limit);
        that.month_buy_limit = String(month_buy_limit);
        var arr1 = that.levelList.filter((v) =>{
          return this.widgetsInfo.privilege.show_levels.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
        });
        that.hyll_Model = arr1.map((user) => {
          return user.level_name;
        });
        var arr2 = that.levelList.filter((v) => {
          return this.widgetsInfo.privilege.buy_levels.indexOf(v.id) !== -1;
        });
        that.hygm_Model = arr2.map((user) => {
          return user.level_name;
        });

        var arr3 = that.groupsList.filter((v) => {
          return this.widgetsInfo.privilege.show_groups.indexOf(v.id) !== -1;
        });
        that.hyzll_Model = arr3.map((user) => {
          return user.group_name;
        });
        var arr4 = that.groupsList.filter((v) => {
          return this.widgetsInfo.privilege.buy_groups.indexOf(v.id) !== -1;
        });
        that.hyzgm_Model = arr4.map((user) => {
          return user.group_name;
        });
      }
    },
    //全选 --------------------
    checkAll() {
      if (this.show_levels_CheckedAll) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
      }
    },
    checkAllBuyLevels() {
      if (this.buy_levels_CheckedAll) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
      }
    },
    checkAllShowGroups() {
      if (this.show_groups_CheckedAll) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
      }
    },
    checkAllBuyGroups() {
      if (this.buy_groups_CheckedAll) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
      }

    },

    validatorData() {
      let json = {};
      json = {
        show_levels: this.show_levels,
        buy_levels: this.buy_levels,
        show_groups: this.show_groups,
        buy_groups: this.buy_groups,
        once_buy_limit: this.once_buy_limit,
        total_buy_limit: this.total_buy_limit,
        day_buy_limit: this.day_buy_limit,
        week_buy_limit: this.week_buy_limit,
        month_buy_limit: this.month_buy_limit
      };
      return json;
    },
    showPopup(index) {
      this.isShowPopup = true;
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
      switch (index) {
      case 1:
        this.popTitle = "会员等级浏览权限";
        this.show1 = true;
        break;
      case 2:
        this.popTitle = "会员等级购买权限";
        this.show2 = true;
        break;
      case 3:
        this.popTitle = "会员组浏览权限";
        this.show3 = true;
        break;
      case 4:
        this.popTitle = "会员组购买权限";
        this.show4 = true;
        break;
      default:
        break;
      }
    },
  },
  components: {
    inputCell,
    yzPopup
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Permissions {
  width: 100%;
  padding-bottom: 3.3125rem;
  overflow: scroll;
  z-index: 9999;

  /deep/ .member_power {
    // margin-top: 0.625rem;
    background: #fff;
    overflow: hidden;
    .cell {
      margin-top: 0.62rem;
      text-align: left;
      background-color: #ffffff;
      white-space: nowrap;
      .van-cell__value {
        overflow: hidden;
        .van-field__right-icon {
          display: flex;
          width: 100%;
          span {
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  /deep/ .number_power {
    margin-top: 0.625rem;
    background: #fff;
    .van-cell__title {
      width: auto;
    }
  }
  /deep/ .list {
    max-height: 25rem;
    position: relative;
    overflow: scroll;
    padding: 0.625rem 0 0.625rem 0.875rem;
    .van-checkbox {
      margin-bottom: 1rem;
      font-size: 15px;
      .van-checkbox__icon .van-icon {
        color: #fff;
        background-color: #c4c4c4;
      }
      .van-checkbox__icon--checked .van-icon {
        background-color: #f15353;
        border-color: #f15353;
        // border: none;
      }
    }
    .deletaAtfer::after {
      display: none;
    }
  }

}
</style>
