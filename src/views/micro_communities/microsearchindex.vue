<template>
    <div id="microsearchindex">
        <div class="header">
            <div class="left" @click="goBack">
                <i class="fa fa-angle-left"></i>
            </div>
            <div class="search">
                <div class="searchion"><i class="iconfont iconfont icon-sousuo1"></i></div>
                <div class="textinp">
                    <van-field v-model="commodityTitle" placeholder="搜索帖子名称"  :clearable="true"/>
                </div>
            </div>
            <div class="right" @click="goToSearch">搜索</div>
        </div>
        <div class="historical" v-if="historydata&&historydata.length>0">
            <div class="top">
                <div class="left">历史记录</div>
                <div class="right" @click="clearHistory">
                    <img src="../../assets/images/micro_communities/History_del@2x.png">
                </div>
            </div>
            <div class="bottom">
                <ul>
                    <li :key='index' v-for="(item,index) in historydata" @click="goHistoryBtn(item.title)">{{item.title}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import microsearchindex_controller from "./microsearchindex_controller";
export default microsearchindex_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #microsearchindex {
    background: #fff;

    .header {
      display: flex;
      align-items: center;
      padding-top: 0.63rem;
      padding-bottom: 0.63rem;
      border-bottom: 0.06rem solid #ebebeb;

      .left {
        font-size: 1.5rem;
        margin-left: 1.06rem;
        margin-right: 1.44rem;
      }

      .search {
        display: flex;
        width: 17.19rem;
        height: 1.88rem;
        background-color: #f5f5f5;
        border-radius: 0.94rem;
        align-items: center;

        .searchion {
          font-size: 0.81rem;
          color: #999;
          margin-left: 0.5rem;
          margin-right: 0.41rem;
        }

        .van-cell {
          background-color: transparent;
          padding: 0;
        }
      }

      .right {
        font-size: 1rem;
        color: #1c96fe;
        flex: 1;
      }
    }

    .historical {
      .top {
        padding-top: 1.59rem;
        display: flex;
        padding-left: 0.75rem;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.94rem;

        .left {
          font-size: 1rem;
          color: #333;
          font-weight: bold;
        }

        .right {
          width: 0.88rem;
          height: 0.88rem;
          margin-right: 0.91rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .bottom {
        padding-bottom: 5rem;

        ul {
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          display: flex;
          flex-wrap: wrap;

          li {
            font-size: 0.88rem;
            line-height: 1.88rem;
            height: 1.88rem;
            padding-left: 0.91rem;
            padding-right: 0.91rem;
            margin-right: 0.63rem;
            margin-bottom: 0.63rem;
            background-color: #f5f5f5;
            border-radius: 0.94rem;
          }
        }
      }
    }
  }
</style>
