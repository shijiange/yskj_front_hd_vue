<!--  -->
<template>
  <div id="group-contributionDetail">
    <c-title :hide="false" :text="gxz_name"></c-title>
    <ul class="content">
      <li class="li" v-for="item in list" :key="item.id">
        <div class="p" style="margin-bottom: 0.75rem;">
          <!-- :style="{ color: Number(item.status) == 2 ? '#8e8e8e' : '#000000' }" -->
          <div class="left time" >{{ item.order_sn }}</div>
          <div class="red right" >+{{ item.commission_gxz }}</div>
        </div>
        <div class="p">
          <div class="left member">
            <img class="avator" :src="item.avatar" alt="" />
            <div class="member-name">{{ item.nickname }}</div>
          </div>
          <div class="right">{{ item.created_at }}</div>
        </div>
      </li>
    </ul>
    <yz-blank :datas="list"></yz-blank>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      gxz_name: "",
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  components: { yzBlank },
  computed: {},
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.contribution.get-child-contribution-detail", { member_id: this.$route.params.id ,page: this.page}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.gxz_name = response.data.gxz_name + "明细";
            this.fun.setWXTitle(this.gxz_name);
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
        .catch(err => {
          console.log(err);
        });
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
          .get("plugin.zhp-group-lottery.frontend.contribution.get-child-contribution-detail", { page: that.page, member_id: this.$route.params.id }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
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
<style lang="scss" scoped>
#group-contributionDetail {
  .content {
    font-size: 15px;
    // padding-bottom: 1rem;
    background: #fff;

    .li {
      padding: 1.5rem 1rem 0 1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;

      .p {
        display: flex;

        span {
          display: inline-block;
        }
      }

      .member {
        display: flex;
        align-items: center;
        font-size: 14px;
        overflow: hidden;
        flex: 1;

        .avator {
          width: 1rem;
          height: 1rem;
          background-color: #dedede;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin: 0 0.375rem 0 0;
        }

        .member-name {
          text-align: left;
          flex: 1;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .right {
        flex: 1;
        color: #666;
        text-align: right;
      }

      .red {
        color: #f0201f;
      }

      .dayDel-class {
        color: #000;
      }

      .time {
        color: #8e8e8e;
      }
    }
  }
}
</style>
