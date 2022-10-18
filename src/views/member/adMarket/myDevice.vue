<!--广告市场 我的设备/设备管理 -->
<template>
  <div id="mydevice">
    <c-title :hide="false" text="我的设备"></c-title>
    <div class="top_member">
      <!-- 用户信息 -->
      <img :src="MyEquipment.store_thumb" alt="" />
      <div class="name">
        {{ MyEquipment.store_name }}
      </div>
      <div class="Commission">
        <div class="left">累计店长提成金额（元）</div>
        <div class="right">{{ MyEquipment.amount_total }}</div>
      </div>
    </div>
    <div class="title">设备总数:{{ total }}台</div>
    <div class="ul">
      <div
        class="li"
        v-for="item in list"
        :key="item.id"
        @click="gotoDetail(item.sn)"
      >
        <div class="sbNumber">{{ item.sn }}</div>
        <div class="other">
          {{ item.sellte_total }}元 <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div v-if="fun.isTextEmpty(list) && isLoading" class="nomore">
        <img src="../../../assets/images/blank.png" alt="" />
        <div class="text">抱歉，您暂无设备绑定！</div>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      isLoading: false,
      MyEquipment: {},
      list: [],
      total: 0,
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.init();
    this.getMyEquipmentStatistics();
  },

  components: { cTitle },

  computed: {},

  methods: {
    init() {
      this.isLoading = false;
      this.MyEquipment = {};
      this.list = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    getMyEquipmentStatistics() {
      $http
        .get(
          "plugin.advert-market.frontend.center.getMyEquipmentStatistics",
          {},
          ""
        )
        .then(response => {
          if (response.result == 1) {
            this.MyEquipment = response.data;
            this.isLoadMore = true;
            this.total_page = response.data.equipments.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.total = response.data.equipments.total;
            this.list = response.data.equipments.data;
            this.isLoading = true;
          } else {
            Toast(response.msg);
            this.isLoading = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoDetail(sn) {
      this.$router.push(this.fun.getUrl("DeviceDetail", { sn: sn }));
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get(
            "plugin.advert-market.frontend.center.getMyEquipmentStatistics",
            { page: that.page },
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.equipments.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#mydevice {
  .top_member {
    padding: 1.344rem 1.344rem 0;
    overflow: hidden;
    width: 100%;
    background: #fff;

    img {
      margin-bottom: 0.875rem;
      width: 4.344rem;
      height: 4.344rem;
      border-radius: 100%;
    }

    .name {
      font-size: 0.875rem;
      font-weight: bold;
      color: #333;
      text-align: center;
      width: 100%;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }

    .Commission {
      display: flex;
      height: 3.25rem;
      line-height: 3.25rem;
      text-align: left;

      .left,
      .right {
        width: 50%;
      }

      .right {
        text-align: right;
      }
    }
  }

  .title {
    height: 2rem;
    line-height: 2rem;
    text-align: left;
    text-indent: 1.344rem;
    color: #999;
  }

  .ul {
    background: #fff;

    .li {
      padding: 0 1.25rem;
      display: flex;
      height: 2.5rem;
      line-height: 2.5rem;
      border-bottom: 0.0625rem solid #f0f6fb;

      .sbNumber {
        text-align: left;
        width: 50%;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .other {
        flex: 1;
        text-align: right;
        color: #666;

        i {
          font-size: 1rem;
        }
      }
    }

    .nomore {
      padding: 0.8rem 0;

      img {
        width: 5rem;
      }

      .text {
        width: 100%;
        padding: 0.8rem 0;
        color: #666;
      }
    }
  }
}
</style>
