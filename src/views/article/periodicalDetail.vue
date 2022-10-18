<template>
  <div class="periodicalDetail">
    <c-title :hide="false" text="期刊杂志"></c-title>
    <div class="head">
      <div class="headTop">
        <div class="headLeft">
          <div>
            <div class="logo">
              <img :src="info.logo" alt="" />
            </div>
            <div class="headTitle">{{ dinfo.title }}</div>
            <div class="magazineDetail">
              <div class="dete">
                <i class="iconfont icon-fontclass-rili" style="color: #9e9e9e;"></i>
                {{ dinfo.created_time }}
              </div>
              <div class="sectionNum">
                <i class="iconfont icon-fontclass-wenzhangshu"></i>
                {{ dinfo.article_total }}
              </div>
            </div>
          </div>
          <div class="contenTxt">本期内容</div>
        </div>
        <div class="headRight">
          <div class="img">
            <img :src="dinfo.cover" alt="" />
          </div>
        </div>
      </div>
      <div :class="contenTapMore ? 'headBottom' : 'headBottomMore'">
        {{ dinfo.overview }}
      </div>
      <div class="upicon">
        <i class="iconfont icon-member-top" v-if="contenTapMore && overview.length > '100'" @click="contenTapMore = false"></i>
        <i class="iconfont icon-member-bottom" v-if="!contenTapMore" @click="contenTapMore = true"></i>
      </div>
    </div>
    <div class="list">
      <div class="title">
        <!-- <i class="iconfont icon-ht_show_formicon"></i> -->
        <span>目录</span>
      </div>
      <div class="lis" @click="goWatch(index)" v-for="(item, index) in datas" :key="index">
        <div style="font-size: 1rem; font-weight: 600;">P{{ index + 1 }} <span>{{item.list_title}}</span></div>
        <!-- <div
          style="font-size: 0.94rem;
    color: #666;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;"
        >
          {{ item.title }}
        </div> -->
        <div class="titleName_d">{{ item.title }}</div>
      </div>
    </div>
    <div class="posBtn set-pc-style" @click="toGoBtn('home')">
      <div class="circle">
        <img src="../../assets/images/periodical/home.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import periodicalDetail_controller from "./periodicalDetail_controller";
export default periodicalDetail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.periodicalDetail {
  .posBtn {
    position: fixed;
    width: 2.8rem;
    height: 2.8rem;
    // background-color: #f14e4e;
    // box-shadow: 0.05rem 0.08rem 0.16rem 0rem rgba(209, 209, 209, 0.36);
    // display: flex;
    right: 1.09rem;
    bottom: 7.06rem;

    .circle {
      border-radius: 100%;
      width: 2.8rem;
      height: 2.8rem;
      margin-bottom: 0.63rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
    // border-radius: 100%;
    // i {
    //   font-size: 1.2rem;
    //   color: #ffffff;
    // }
    // span {
    //   font-size: 0.53rem;
    //   color: #ffffff;
    // }
  }

  .list {
    background: #fff;
    // padding: 0 0.94rem;
    padding-top: 0.94rem;
    overflow: hidden;
    box-sizing: border-box;
    margin-bottom: 3rem;
    text-indent: 2em;

    .lis {
      // height: 3.91rem;
      width: 100%;
      border-bottom: 0.03rem solid #efefef;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 1rem 0;
      padding-left: 0.3rem;

      .titleName_d {
        font-size: 0.94rem;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 0.5rem;
      }
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 1.41rem;

      i {
        font-size: 1.5rem;
        color: #1d9a89;
        margin-right: 0.66rem;
      }

      span {
        font-size: 1.8rem;
        color: rgb(137, 137, 137);
        font-weight: 600;
        letter-spacing: 0.5rem;
      }
    }
  }

  .head {
    width: 23.44rem;
    // height: 11.72rem;
    background-color: #fff;
    padding: 0.78rem 0.85rem;
    margin-bottom: 0.63rem;

    .headRight {
      flex: 1;

      .img {
        width: 5rem;
        height: 6.66rem;
        // background-color: #f26646;
        // box-shadow: 0 0.06rem 1.09rem 0 rgba(181, 181, 181, 0.79);
        border-radius: 0.13rem;
        margin-right: 0.91rem;
        margin-left: 4.63rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .headBottom {
      text-align: left;
      transition: 1s;

      span {
        color: #f14e4e;
      }
    }

    .upicon {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        font-size: 1rem;
      }
    }

    .headBottomMore {
      transition: 1s;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      span {
        color: #f14e4e;
      }
    }

    .headTop {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;

      .headLeft {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        .contenTxt {
          font-size: 0.81rem;
          color: #333;
          text-align: left;
          font-weight: 600;
        }

        .logo {
          width: 5rem;
          height: 3.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .headTitle {
          font-size: 0.94rem;
          color: #333;
          font-weight: 600;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .magazineDetail {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 0.75rem;
          color: #666;

          .date {
            display: flex;
            align-items: center;

            i {
              margin-right: 0.22rem;
            }
          }

          .sectionNum {
            display: flex;
            align-items: center;
            margin-left: 1.53rem;

            i {
              margin-right: 0.22rem;
            }
          }
        }
      }
    }
  }
}
</style>
