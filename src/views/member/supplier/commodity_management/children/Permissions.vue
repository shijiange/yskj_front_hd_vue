<!-- 权限组件 -->
<template>
  <div id="Permissions">
    <div class="power_box">
      <ul class="member_power">
        <li>
          <span>会员等级浏览权限：</span>
          <input type="text" @click="showPopup(1)" v-model="hyll_Model" readonly placeholder="请选择" />
          <i class="fa fa-angle-right"></i>
        </li>
        <li>
          <span>会员等级购买权限：</span>
          <input type="text" @click="showPopup(2)" v-model="hygm_Model" readonly placeholder="请选择" />
          <i class="fa fa-angle-right"></i>
        </li>
        <li>
          <span>会员组浏览权限：</span>
          <input type="text" @click="showPopup(3)" v-model="hyzll_Model" readonly placeholder="请选择" />
          <i class="fa fa-angle-right"></i>
        </li>
        <li>
          <span>会员组购买权限：</span>
          <input type="text" @click="showPopup(4)" v-model="hyzgm_Model" readonly placeholder="请选择" />
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>

      <ul class="number_power">
        <li>
          <span>每次限购数量：</span>
          <input type="text" v-model="once_buy_limit" placeholder="请输入每次下单限购数量" @blur="clearSrcoll()" />
        </li>
        <li>
          <span>会员限购总数：</span>
          <input type="text" v-model="total_buy_limit" placeholder="请输入会员限购的总数" @blur="clearSrcoll()" />
        </li>
        <li>
          <span>会员每天限购总数：</span>
          <input type="text" v-model="day_buy_limit" placeholder="请输入会员每天限购数量" @blur="clearSrcoll()" />
        </li>
        <li>
          <span>会员每周期限购数量：</span>
          <input type="text" v-model="week_buy_limit" placeholder="请输入会员每周期限购数量" @blur="clearSrcoll()" />
        </li>
        <li>
          <span>会员每月限购数量：</span>
          <input
            type="text"
            v-model="month_buy_limit"
            placeholder="请输入会员每月限购数"
            id="inputs"
            @blur="clearSrcoll()"
          />
        </li>
      </ul>
    </div>

    <!-- 弹窗 -->
    <van-popup v-if="show1" v-model="show1" position="bottom" @click-overlay="isCoverLayer">
      <div class="select_box">
        <div class="title">
          <h2>会员等级浏览权限</h2>
          <i class="iconfont icon-guanbi" @click="showPopup"></i>
        </div>
        <div class="list">
          <van-checkbox v-model="show_levels_CheckedAll" @click="checkAll" v-if="levelsList.length">全选</van-checkbox>
          <van-checkbox-group v-model="show_levels" ref="checkboxGroup">
            <van-checkbox :name="item.id" v-for="(item, index) in levelsList" class="deletaAtfer" :key="index">{{
              item.level_name
            }}</van-checkbox>
          </van-checkbox-group>
          <h2 v-if="!levelsList.length" style="text-align: center; margin: 15px 0;">暂无数据</h2>
        </div>
        <div class="select_btn" @click="showPopup">
          <button type="button">完成</button>
        </div>
      </div>
    </van-popup>

    <van-popup v-if="show2" v-model="show2" position="bottom" @click-overlay="isCoverLayer">
      <div class="select_box">
        <div class="title">
          <h2>会员等级购买权限</h2>
          <i class="iconfont icon-guanbi" @click="showPopup"></i>
        </div>
        <div class="list">
          <van-checkbox v-model="buy_levels_CheckedAll" @click="checkAllBuyLevels" v-if="levelsList.length"
            >全选</van-checkbox
          >
          <van-checkbox-group v-model="buy_levels" ref="checkboxGroup">
            <van-checkbox :name="item.id" v-for="(item, index) in levelsList" class="deletaAtfer" :key="index">{{
              item.level_name
            }}</van-checkbox>
          </van-checkbox-group>
          <h2 v-if="!levelsList.length" style="text-align: center; margin: 15px 0;">暂无数据</h2>
        </div>
        <div class="select_btn" @click="showPopup">
          <button type="button">完成</button>
        </div>
      </div>
    </van-popup>

    <van-popup v-if="show3" v-model="show3" position="bottom" @click-overlay="isCoverLayer">
      <div class="select_box">
        <div class="title">
          <h2>会员组浏览权限</h2>
          <i class="iconfont icon-guanbi" @click="showPopup"></i>
        </div>

        <div class="list">
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
        <div class="select_btn" @click="showPopup">
          <button type="button">完成</button>
        </div>
      </div>
    </van-popup>

    <van-popup v-if="show4" v-model="show4" position="bottom" @click-overlay="isCoverLayer">
      <div class="select_box">
        <div class="title">
          <h2>会员组购买权限</h2>
          <i class="iconfont icon-guanbi" @click="showPopup"></i>
        </div>
          <div class="list">
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
        <div class="select_btn" @click="showPopup">
          <button type="button">完成</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// import { Toast } from 'vant';
export default {
  props: {
    DataInfo: {
      type: [String, Number, Object],
      default: ()=>{}
    },
    GoodSetData: {
      type: [String, Number, Object],
      default: ()=>{}
    }
  },
  data() {
    return {
      show_levels_CheckedAll: false,
      buy_levels_CheckedAll: false,
      show_groups_CheckedAll: false,
      buy_groups_CheckedAll: false,

      isType: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,

      levelsList: [], //会员等级,
      buy_levels: [],
      show_levels: [],
      groupsList: [], //会员分组,
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
      if (newList.length == this.levelsList.length) {
        this.show_levels_CheckedAll = true;
      } else {
        this.show_levels_CheckedAll = false;
      }
      var arr1 = this.levelsList.filter(function(v) {
        return newList.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
      });
      this.hyll_Model = arr1.map(function(user) {
        return user.level_name;
      });
    },

    buy_levels(newList, oldList) {
      if (newList.length == this.levelsList.length) {
        this.buy_levels_CheckedAll = true;
      } else {
        this.buy_levels_CheckedAll = false;
      }
      var arr2 = this.levelsList.filter(function(v) {
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
    this.isType = this.fun.isTextEmpty(this.$route.params.goods_id); //return true为商品发布
    this.getDataInfo();
  },
  mounted() {
    this.init();
    this.isType = this.fun.isTextEmpty(this.$route.params.goods_id); //return true为商品发布
    this.getDataInfo();
    let orderHights = document.body.clientHeight;
    document.getElementById('Permissions').style.height = orderHights - 82 + 'px';
  },
  methods: {
    clearSrcoll() {
      var currentPosition, timer;
      var speed = 1; //页面滚动距离
      timer = setInterval(function() {
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition); //页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition); //页面向下滚动
        clearInterval(timer);
      }, 1);
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
      // //获取会员等级
      //   $http.post('plugin.store-cashier.frontend.store.goods.get-member-level', {},"加载中").then(
      //     function(response) {
      //       if (response.result === 1) {
      //         that.levelsList = response.data;
      //         //console.log("获取会员等级",response.data)
      //         if(!that.isType){
      //           //用于弹窗的val 值（id）与 input的level_name对应，ydui组件显示的是val值
      //           var arr1 = that.levelsList.filter(function(v){
      //             return that.DataInfo.privilege.show_levels.indexOf(v.id)!== -1 // 利用filter方法来遍历是否有相同的元素
      //           })
      //           that.hyll_Model = arr1.map(function (user) { return user.level_name; });
      //           var arr2 = that.levelsList.filter(function(v){
      //             return that.DataInfo.privilege.buy_levels.indexOf(v.id)!== -1
      //           })
      //           that.hygm_Model = arr2.map(function (user) { return user.level_name; });
      //         }
      //       } else {
      //         console.log("获取会员等级error",response.msg)
      //       }
      //     },
      //     function(response) {
      //       console.log(response);
      //     }
      //   );
      //   //获取会员分组
      //   $http.post('plugin.store-cashier.frontend.store.goods.get-member-group', {},"加载中").then(
      //     function(response) {
      //       if (response.result === 1) {
      //         //console.log("获取会员分组",response.data)
      //         that.groupsList = response.data;
      //         if(!that.isType){
      //           var arr3 = that.groupsList.filter(function(v){
      //           return that.DataInfo.privilege.show_groups.indexOf(v.id)!== -1
      //         })
      //         that.hyzll_Model = arr3.map(function (user) { return user.group_name; });
      //         var arr4 = that.groupsList.filter(function(v){
      //           return that.DataInfo.privilege.buy_groups.indexOf(v.id)!== -1
      //         })
      //         that.hyzgm_Model = arr4.map(function (user) { return user.group_name; });
      //         }
      //       } else {
      //         console.log("获取会员分组error",response.msg)
      //       }
      //     },
      //     function(response) {
      //       console.log(response);
      //     }
      //   );
      that.levelsList = that.GoodSetData.member_level;

      that.groupsList = that.GoodSetData.member_group;
      if (that.isType) {
        //发布
        console.log('发布55555', that.GoodSetData.member_level, that.GoodSetData.member_group);
      } else {
        //编辑
        console.log('编辑55555', that.GoodSetData.member_level, that.GoodSetData.member_group);
        that.show_levels = this.DataInfo.privilege.show_levels;
        that.show_groups = this.DataInfo.privilege.show_groups;
        that.buy_levels = this.DataInfo.privilege.buy_levels;
        that.buy_groups = this.DataInfo.privilege.buy_groups;
        that.once_buy_limit = String(this.DataInfo.privilege.once_buy_limit);
        that.total_buy_limit = String(this.DataInfo.privilege.total_buy_limit);
        that.day_buy_limit = String(this.DataInfo.privilege.day_buy_limit);
        that.week_buy_limit = String(this.DataInfo.privilege.week_buy_limit);
        that.month_buy_limit = String(this.DataInfo.privilege.month_buy_limit);

        //用于弹窗的val 值（id）与 input的level_name对应，ydui组件显示的是val值
        var arr1 = that.levelsList.filter(function(v) {
          return that.DataInfo.privilege.show_levels.indexOf(v.id) !== -1; // 利用filter方法来遍历是否有相同的元素
        });
        that.hyll_Model = arr1.map(function(user) {
          return user.level_name;
        });
        var arr2 = that.levelsList.filter(function(v) {
          return that.DataInfo.privilege.buy_levels.indexOf(v.id) !== -1;
        });
        that.hygm_Model = arr2.map(function(user) {
          return user.level_name;
        });

        var arr3 = that.groupsList.filter(function(v) {
          return that.DataInfo.privilege.show_groups.indexOf(v.id) !== -1;
        });
        that.hyzll_Model = arr3.map(function(user) {
          return user.group_name;
        });
        var arr4 = that.groupsList.filter(function(v) {
          return that.DataInfo.privilege.buy_groups.indexOf(v.id) !== -1;
        });
        that.hyzgm_Model = arr4.map(function(user) {
          return user.group_name;
        });
      }
    },
    // //弹窗相关------
    // change(value, buy_levels_CheckedAll) {
    //   this.buy_levels_CheckedAll = buy_levels_CheckedAll
    //   //用于弹窗的val 值（id）与 input的level_name对应，ydui组件显示的是val值
    //   var arr1 = this.levelsList.filter(function(v) {
    //     return that.show_levels.indexOf(v.id) !== -1 // 利用filter方法来遍历是否有相同的元素
    //   })
    //   this.hyll_Model = arr1.map(function(user) {
    //     return user.level_name
    //   })
    //   //console.log("arr3",arr3.id)
    // },
    // listCheckAllChange(value, buy_levels_CheckedAll) {
    //   this.buy_levels_CheckedAll = buy_levels_CheckedAll
    //   let that = this
    //   var arr2 = this.levelsList.filter(function(v) {
    //     return that.buy_levels.indexOf(v.id) !== -1
    //   })
    //   this.hygm_Model = arr2.map(function(user) {
    //     return user.level_name
    //   })
    // },
    // showGroupsChange(value, show_groups_CheckedAll) {
    //   this.show_groups_CheckedAll = show_groups_CheckedAll
    //   let that = this
    //   var arr3 = this.groupsList.filter(function(v) {
    //     return that.show_groups.indexOf(v.id) !== -1
    //   })
    //   this.hyzll_Model = arr3.map(function(user) {
    //     return user.group_name
    //   })
    // },
    // buyGroupsChange(value, buy_groups_CheckedAll) {
    //   this.buy_groups_CheckedAll = buy_groups_CheckedAll
    //   let that = this
    //   var arr4 = this.groupsList.filter(function(v) {
    //     return that.buy_groups.indexOf(v.id) !== -1
    //   })
    //   this.hyzgm_Model = arr4.map(function(user) {
    //     return user.group_name
    //   })
    // },
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

    PermissionsJson() {
      let json = {};
      if (this.GoodSetData.goods_widgets.tab_privilege == '1') {
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
      }
      //console.log('权限的json数据',json)
      this.$emit('getChildtwoData', json);
      // }
    },
    showPopup(index) {
      // this.$emit('CoverLayer', true);
      switch (index) {
      case 1:
        this.show1 = true;
        break;
      case 2:
        this.show2 = true;
        break;
      case 3:
        this.show3 = true;
        break;
      case 4:
        this.show4 = true;
        break;
      default:
        this.show1 = false;
        this.show2 = false;
        this.show3 = false;
        this.show4 = false;
        this.$emit('CoverLayer', false);
        break;
      }
    },
    isCoverLayer() {
      this.$emit('CoverLayer', false);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Permissions {
  // position:fixed;
  width: 100%;
  // height: auto;
  // top: 0;
  // left:0;
  // bottom: 3.3125rem;
  //height: 100%;
  padding-bottom: 3.3125rem;
  overflow: scroll;
  z-index: 9999;

  .power_box {
    .member_power,
    .number_power {
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
          width: 9.75rem;
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

  .select_box {
    background: #fff;
    width: 100%;
    padding-top: 50px;
    padding-bottom: 60px;

    .title {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      text-align: center;
      font-size: 16px;
      display: flex;
      justify-content: center;
      border-bottom: solid 0.0625rem #ebebeb;
      z-index: 9999;
      background-color: #fff;

      i {
        position: absolute;
        right: 0.625rem;
        font-size: 1rem;
        color: #c9c9c9;
      }
    }

    .list {
      max-height: 25rem;
      position: relative;
      overflow: scroll;
      padding: 0.625rem 0 3.125rem 0.875rem;

      .van-checkbox {
        line-height: 2.875rem;
        border-bottom: solid 0.0625rem #ebebeb;
        font-size: 15px;
      }

      .deletaAtfer::after {
        display: none;
      }
    }

    .select_btn {
      position: fixed;
      width: 100%;
      padding: 0.375rem 0.875rem;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;
      z-index: 9999;
      background-color: #fff;

      button {
        margin: 0 auto;
        width: 100%;
        height: 2.5rem;
        background: #f15353;
        border-radius: 0.1875rem;
        color: #fff;
        border: none;
        font-size: 16px;
      }
    }
  }

  .select_box .list {
    .van-checkbox {
      height: 2.5rem;
      border: none;
    }

    .van-checkbox-group {
      padding-left: 1.3rem;

      /deep/.van-icon {
        position: static;
      }

      /deep/.van-checkbox__label {
        padding-left: 0.625rem;
        // position: absolute;
        // right: 0.875rem;
      }
    }
  }
}
</style>
