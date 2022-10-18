<template>
  <div class="groupcblog">
    <c-title :hide="false" :text="gxz_name"></c-title>
    <div class="boxlist">
      <div class="boxflex">会员信息</div>
      <div class="boxPadd">{{gxz_name}}</div>
      <div class="boxPadd">下级{{gxz_name}}</div>
    </div>
    <div class="cblist" v-for="(item, ind) in list" :key="ind">
      <div class="cbflex">
        <div class="avaimg">
          <img :src="item.avatar" alt="" />
        </div>
        <div class="txtName">{{ item.nickname }}</div>
        <div class="uidBox">{{ item.uid }}</div>
      </div>
      <div class="boxPadd" @click="gotoUrl('groupContributionDetailslog',{id:item.uid})">{{ item.contribution }}</div>
      <div class="boxPadd" @click="gotoUrl('groupContributionDetails',{id:item.uid})">{{ item.contribution_today }}</div>
    </div>
  </div>
</template>
<script>
// import yzBlank from "components/ui_components/yz_blank";
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
  activated() {
    this.getData();
  },
  methods: {
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.contribution.get-child-contribution", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.gxz_name = response.data.gxz_name;
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
          .get("plugin.zhp-group-lottery.frontend.contribution.get-child-contribution", { page: that.page}, "加载中")
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
.groupcblog {
  background: #fff;
}

.cblist {
  height: 3rem;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  align-items: center;

  .cbflex {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .txtName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .uidBox {
      padding: 0.2rem 0.35rem;
      color: #ff4c4c;
      border-radius: 2px;
      background: #ffe4e4;
      flex-shrink: 0;
      margin-left: 0.35rem;
    }

    .avaimg {
      width: 30px;
      height: 30px;
      margin-right: 0.25rem;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }

  .boxPadd {
    flex: 0.4;
  }
}

.boxlist {
  height: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .boxflex {
    flex: 1;
  }

  .boxPadd {
    flex: 0.4;
  }
}
</style>