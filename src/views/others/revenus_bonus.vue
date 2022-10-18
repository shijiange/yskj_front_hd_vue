<template>
  <div id="revenus_bonus">
    <c-title :hide="false" :text="'收益奖'"></c-title>
    <div class="topbox">
      <div class="userPhoto">
        <img :src="number.avatar_image" alt="">
      </div>
      <span class="userTname">{{number.nickname}}</span>
    </div>
    <div class="cenBox">
      <div class="cenlefr" v-if="scaleShowa">
        <p>{{scale.shareholder}}</p>
        <span>股东分红比例(%)</span>
      </div>
      <div class="cenlefr" v-if="scaleShowb">
        <p>{{scale.area}}</p>
        <span>区域分红比例(%)</span>
      </div>
      <div class="cenright">
        <p>{{total}}</p>
        <span>累计消费</span>
      </div>
    </div>
    <div class="fhList">
      <div class="tabList">
        <div class="tabTxt">分红记录</div>
      </div>
      <div class="list" v-for="(item,index) in listData" :key="index">
          <div class="listTitle">
            <div class="tit-left">
              <p>分红ID：{{item.id}}</p>
              <span>{{item.reward_time}}</span>
            </div>
            <div class="tit-right">
              <span>{{item.reward_amount}}<p>元</p></span>
            </div>
          </div>
          <div class="listUser">
            <div class="user-left">
              <div style="width: 1.63rem; height: 1.63rem; border-radius: 50%; margin-left: 0.3rem; */">
                <img :src="item.has_one_member.avatar_image" alt="" class="userImg">
              </div>
              <span class="userName">{{item.has_one_member.realname}}</span>
            </div>
            <div class="user-right">
              {{item.proportion}}元
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data(){
    return{
      listData:'',
      number:'',
      scaleShow:'',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated(){
    this.initData();
    this.getData();
  },
  methods:{
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getData() {
      const that = this;
      $http
        .get(
          "plugin.revenue-award.frontend.index.index",
          { },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              that.listData = response.data.list.data;
              that.number = response.data.member;
              that.scale = response.data.scale;
              that.total = response.data.total;
              for(let i = 0;i<that.listData.length;i++){
                that.listData[i].reward_time = that.formatDateTime(that.listData[i].reward_time * 1000);
              }
              // that.listData.forEach((item,index) => {
              //   item.reward_time = that.formatDateTime(item.reward_time* 1000)
              //   // if(item.refund_time){
              //   // item.refund_time = that.timeStyle(item.refund_time)
              //   // }
              // });
              that.isLoadMore = true;
              that.page = 1;
              that.total_page = response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              if(that.fun.isTextEmpty(response.data.scale)){
                that.scaleShowa = false;
                that.scaleShowb = false;
              }else{
                if(!that.fun.isTextEmpty(response.data.scale.area)){
                  that.scaleShowa = true;
                }
                if(!that.fun.isTextEmpty(response.data.scale.shareholder)){
                  that.scaleShowb = true;
                }
                console.log(!that.fun.isTextEmpty(response.data.scale.area));
                console.log(!that.fun.isTextEmpty(response.data.scale.shareholder));
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    formatDateTime: function(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ('0' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return y+'-'+m+'-'+d+' '+' '+h+':'+minute+':'+second;
    },
    getMoreData(){
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.revenue-award.frontend.index.index",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                that.listData = that.listData.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              console.log(response);
              Toast(response);
            }
          );
      }
    }
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#revenus_bonus {
  .topbox {
    width: 23.44rem;
    height: 10rem;
    background-color: #f15353;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .userPhoto {
      width: 4.31rem;
      height: 4.31rem;
      border-radius: 50%;
      background: yellow;

      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }

    .userTname {
      width: 8.78rem;
      font-size: 1.13rem;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-bottom: 1.13rem;
    }
  }

  .cenBox {
    width: 21.56rem;
    height: 5.81rem;
    background-color: #fff;
    border-radius: 0.31rem;
    margin: 0 auto;
    margin-top: -2rem;
    display: flex;

    .cenlefr {
      // width: 50%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      p {
        font-size: 1.13rem;
      }

      span {
        font-size: 0.63rem;
        color: #333;
      }
      // .cenline{
      //   position: absolute;
      //   right: 0;
      //   width: 0.03rem;
      //   height: 1.66rem;
      //   top: 50%;
      //   margin-top: -0.83rem;
      //   background-color: #d1d1d1;
      // }
    }

    .cenright {
      // width: 50%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      p {
        font-size: 1.13rem;
      }

      span {
        font-size: 0.63rem;
        color: #333;
      }
    }
  }

  .fhList {
    width: 21.56rem;
    // height: 16.81rem;
    background-color: #fff;
    border-radius: 0.63rem;
    margin: 0 auto;
    margin-top: 0.53rem;

    .tabList {
      width: 100%;
      height: 2.31rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // margin-bottom: 1.03rem;
      .tabTxt {
        margin-left: 3rem;
        height: 100%;
        line-height: 2.31rem;
        border-bottom: 0.13rem solid #f15353;
      }
    }

    .list {
      width: 19.63rem;
      margin: 0 auto;
      margin-top: 1.06rem;
      display: flex;
      // justify-content: space-between;
      flex-direction: column;
      border-bottom: 0.03rem solid #f3f3f3;

      .listTitle {
        width: 100%;
        // height: 1.66rem;
        display: flex;
        justify-content: space-between;

        .tit-left {
          p {
            text-align: left;
            font-size: 0.75rem;
          }

          span {
            font-size: 0.63rem;
            color: #c1c1c1;
          }
        }

        .tit-right {
          display: flex;
          align-items: center;

          span {
            display: flex;
            // align-items: center;
            font-size: 1.13rem;
            color: #f15353;

            p {
              font-size: 0.63rem;
              color: #f15353;
              margin-top: 0.4rem;
            }
          }
        }
      }

      .listUser {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.91rem;
        padding-bottom: 0.75rem;

        .user-left {
          display: flex;
          align-items: center;

          .userImg {
            width: 1.63rem;
            height: 1.63rem;
            background: #f15353;
            border-radius: 50%;
          }

          .userName {
            margin-left: 0.47rem;
            font-size: 0.75rem;
          }
        }

        .user-right {
          font-size: 0.75rem;
          color: #333;
        }
      }
    }
  }
}
</style>
