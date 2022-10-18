<!-- 直播助手 直播列表 -->
<template>
  <div id="helper_liveList">
    <c-title :hide="false" text="主播助手"></c-title>
    <ul class="list">
      <li class="childs" v-for="(item, index) in list" :key="item.id" @click="gotoRoom(item.status, item.id, item.ban)">
        <img :src="item.cover" alt="" class="cover" />
        <div class="live_Countdown" v-if="item.status == 1 || item.status == 2">
          <i class="iconfont icon-all_countdown"></i
           >
           <span v-if="fun.getTimeDifference(item.live_time) == 0">等待开播</span>
           <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" ></van-count-down>
        </div>
        <div class="roomInfo" @click.stop>
          <div class="setBackRoom" v-if="item.back_open != null">
            <em>是否开启回放功能</em>
            <van-switch
              v-model="item.back_open"
              size="14px"
              @click.stop="openBack(item.id, item.back_open, index)"
              active-color="#ff6333"
            />
          </div>
          <div class="other_1">
            <div style="display: flex; flex-wrap: wrap; font-size: 10px;">
              <span class="status_color" :class="`status_color${item.status}`">{{ item.status | statusName }}</span
              ><span class="shopType">#{{ item.shop_name }}</span>
            </div>
            <div class="look_power" v-if="item.is_purview == 1" @click.stop="lookPurview(item.id)">
              <i class="iconfont icon-all_watchroot"></i>
            </div>
          </div>
          <div class="title">{{ item.title }}</div>
          <div class="timebox">
            <div class="time">{{ item.live_time | timestampToTime }}</div>
            <div class="goodNum">商品:{{ item.goods_num }}</div>
          </div>
        </div>
      </li>
    </ul>
    <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="fun.isTextEmpty(list)" />
    <van-popup v-model="showPower" closeable class="power_style">
      <div class="p_title">观看权限</div>
      <ul class="powerList">
        <li v-if="levelList.member_level_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>会员等级</p>
          <div class="childpower">
            <div class="childpowers" v-for="(items, index) in levelList.member_level" :key="index">
              <i class="iconfont icon-all_select_active"></i>
              <p>{{ items }}</p>
            </div>
          </div>
        </li>
        <li v-if="levelList.commission_level_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>分销商等级</p>
          <div class="childpower">
            <div class="childpowers" v-for="(items, index) in levelList.commission_level" :key="index">
              <i class="iconfont icon-all_select_active"></i>
              <p>{{ items }}</p>
            </div>
          </div>
        </li>
        <li v-if="levelList.team_level_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>经销商等级</p>
          <div class="childpower">
            <div class="childpowers" v-for="(items, index) in levelList.team_level" :key="index">
              <i class="iconfont icon-all_select_active"></i>
              <p>{{ items }}</p>
            </div>
          </div>
        </li>
        <li v-if="levelList.agent_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>推广员</p>
        </li>
        <li v-if="levelList.store_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>门店店长</p>
        </li>
        <li v-if="levelList.hotel_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>酒店店长</p>
        </li>
        <li v-if="levelList.supplier_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>供应商</p>
        </li>
        <li v-if="levelList.password_open == 1">
          <i class="iconfont icon-all_select_choose"></i>
          <p>密码:{{ levelList.password }}</p>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { scrollMixin } from 'utils/mixin';
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      showPower: false,
      levelList: []
    };
  },
  components: {
    cTitle
  },
  filters: {
    statusName: function(value) {
      var x;
      if (!value) return '';
      switch (value) {
      case 1:
        x = '待审核';
        break;
      case 2:
        x = '等待直播';
        break;
      case 3:
        x = '直播中';
        break;
      case 4:
        x = '已结束';
        break;
      default:
        console.log('error:: src\views\live\helper_liveList.vue ');
        break;
      }
      return x;
    },
    //将时间戳转换成正常时间格式
    timestampToTime: function(timestamp) {
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '.';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes();
      return Y + M + D + h + m;
    }
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    gotoRoom(_status, _id, _ban) {
      if (_ban == 1 || _ban == '1') {
        Toast('该直播间已被禁用！');
        return;
      }
      if (_status == 1 || _status == 2) {
        return;
      }
      this.$router.push(this.fun.getUrl('helperLiveRoom', { id: _id }));
    },
    getData() {
      $http
        .post('plugin.room.frontend.anchor-aide.get-list', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.get('plugin.room.frontend.anchor-aide.get-list', { page: this.page }, '').then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    openBack(_id, _back_open, index) {
      let _url = !_back_open
        ? 'plugin.room.frontend.anchor-aide.open-back'
        : 'plugin.room.frontend.anchor-aide.close-back';
      $http.get(_url, { id: _id }, '').then(
        response => {
          if (response.result === 1) {
            let _status = !_back_open ? true : false;
            this.$set(this.list[index], 'back_open', _status);
            Toast('设置成功！');
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    lookPurview(_id) {
      $http.get('plugin.room.frontend.anchor-aide.purview', { id: _id }, '').then(
        response => {
          if (response.result === 1) {
            this.levelList = response.data;
            this.showPower = true;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
#helper_liveList {
  background: #fdfdfd;
  min-height: 100vh;

  .power_style {
    width: 19.375rem;
    max-height: 21rem;
    overflow: scroll;
    border-radius: 0.375rem;

    .p_title {
      height: 4rem;
      line-height: 4rem;
      font-size: 1rem;
      color: #000;
    }

    .powerList {
      display: flex;
      flex-direction: column;
      padding: 1rem 1.375rem;

      li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        font-size: 1rem;
        margin-bottom: 0.5rem;

        i {
          font-size: 14px;
          color: #ff2c29;
          margin-right: 0.5rem;
        }

        .childpower {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 0.5rem 1rem 0;

          .childpowers {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
            color: #666;
            font-size: 0.75rem;

            i {
              font-size: 12px;
              color: #ff2c29;
              margin-right: 0.5rem;
            }
          }
        }
      }
    }
  }

  .list {
    padding: 0.875rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .childs {
      width: 48%;
      height: 15.625rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      // padding: 0 0.5rem;
      margin-bottom: 0.875rem;
      background: #fff;
      border-radius: 0.375rem;
      box-shadow: 0 0 0.781rem 0 rgba(0, 0, 0, 0.05);
      position: relative;

      .cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .live_Countdown {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        height: 1.25rem;
        line-height: 1.25rem;
        background-image: linear-gradient(0deg, #ff2c29 0%, #ff6333 100%), linear-gradient(#fff, #fff);
        background-blend-mode: normal, normal;
        border-radius: 0.625rem;
        opacity: 0.8;
        color: #fff;
        font-size: 14px;
        padding: 0 0.25rem;

        .van-count-down {
          display: inline-block;
          color: #fff;
          font-size: 14px;
        }
      }

      .roomInfo {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        color: #fff;
        padding-top: 0.5rem;
        background-image:
          linear-gradient(
            0deg,
            rgba(3, 0, 0, 0.8) 0%,
            rgba(3, 0, 0, 0.37) 50%,
            rgba(3, 0, 0, 0.34) 54%,
            rgba(255, 255, 255, 0) 100%
          );

        .setBackRoom {
          width: 100%;
          height: 1.625rem;
          line-height: 1.625rem;
          padding: 0 0.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // background-image: linear-gradient(90deg, rgba(255, 44, 41, 0.82) 0%, #ff6333 100%);
          background: linear-gradient(-90deg, rgba(255, 99, 51, 0.1), rgba(255, 44, 41, 0.7));

          em {
            font-weight: bold;
          }
        }

        .other_1 {
          font-size: 0.625rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.25rem;

          span {
            display: inline-block;
            border-radius: 0.5rem;
            // height: 1rem;
            line-height: 1rem;
            padding: 0 0.3rem;
          }

          .status_color {
            background: #ff6333;
            margin-right: 0.25rem;
            border: 1px solid rgba(0, 0, 0, 0);
          }

          .status_color1 {
            background-color: #7e02e7;
          }

          .status_color2 {
            background-color: #01d5ba;
          }

          .status_color3 {
            background-color: #ffae00;
          }

          .status_color4 {
            background-color: #999;
          }

          .shopType {
            border: 1px solid #fff;
            max-width: 5.75rem;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        .title {
          padding: 0 0.25rem;
          text-align: left;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        .timebox {
          padding: 0.25rem;
          font-size: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>
