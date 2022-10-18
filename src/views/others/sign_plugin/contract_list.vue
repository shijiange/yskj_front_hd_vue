<template>
  <div>
    <c-title :hide="false" :text="'合同列表'">
    </c-title>
    <van-tabs color="#377aff" @click="getData" v-model="active">
      <van-tab title="待我签署" name="0"></van-tab>
      <van-tab title="我已签署" name="1"></van-tab>
      <van-tab title="已完成" name="2"></van-tab>
      <van-tab title="已超时" name="4"></van-tab>
    </van-tabs>
    <div class="blank"  v-if="recordsList.length <= 0">
      <img src="../../../assets/images/blank.png">
      <span>还没有记录哦</span>
    </div>
    <div class="content">
      <div class="item-box" v-for="item in recordsList" :key="item.id" @click="toSign(item)">
        <p class="head">{{item.name}}</p>
        <div class="item-bottom">
          <div class="title">
            发起人：{{item.account_name}}
          </div>
          <div class="status">
            <span class="tag">{{item.status_desc}}</span>
          </div>
        </div>
        <div class="item-bottom">
          <div class="title" v-if="item.has_many_role.length>0">
            参与人：<span v-for="(role,index) in item.has_many_role" :key="role.id">{{role.name}}<em v-if="index < item.has_many_role.length-1">，</em></span>
          </div>
          <div class="status">
            <!--<span style="margin-right: 0.5rem" v-if="item.status <= 0" @click.stop="stopUse(item)">取消</span>-->
            <!--<span @click.stop="downpdf(item)">下载</span>-->
          </div>
        </div>
      </div>
    </div>

    <signButton :signIndex="'signIndexPlu'"></signButton>
  </div>
</template>

<script>
import signButton from "../sign/component/sign_button";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    toSign(item) {
      this.$router.push(this.fun.getUrl("signPagePlu",{id: item.id},{fromHome: 1}));
    },
    stopUse(item) {
      this.$dialog.confirm({ message: "确定取消吗?"})
        .then(() => {
          $http
            .get("plugin.yun-sign.frontend.h5.contract.cancel", { id: item.id }, "正在取消")
            .then(response => {
              if (response.result === 1) {
                this.recordsList = [];
                this.getData();
                Toast('取消成功!');
              } else {
                Toast('取消失败!');
              }
            })
            .catch(err => {
              console.error(err);
            });
        }).catch(() => {});
    },
    downpdf(item) {
      window.open(item.download_url);
    },
    getData() {
      this.page = 1;
      $http
        .get(
          "plugin.shop-esign.frontend.contract.get-list",
          { page: 1, status: this.active  },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.dataInfo = response.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = response.data.data;
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
        $http
          .get(
            "plugin.shop-esign.frontend.contract.get-list",
            { page: that.page, status: this.active },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
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
  },
  components: { signButton }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .item-box {
    background: #fff;
    padding: 1rem;
    margin-bottom: 0.5rem;
    text-align: left;
  }

  .head {
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    margin-bottom: 0.5rem;
  }

  .item-bottom {
    display: flex;
    margin-bottom: 0.3rem;

    .title {
      flex: 1;
      color: #666;
    }

    .status {
      flex: 0 0 5rem;
      color: #377aff;
      text-align: center;
    }

    .tag {
      border: 1px solid #377aff;
      border-radius: 15px;
      padding: 0.1rem 0.3rem;
    }
  }

</style>
