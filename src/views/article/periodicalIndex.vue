<template>
  <div id="periodicalIndex">
    <c-title :hide="false" text="期刊杂志"></c-title>
    <div class="head">
      <img :src="first_data.cover" alt="" @click="goDetail(first_data.id)" />
      <div class="headTitle">
        <div class="headLeft">
          <div class="title">{{ first_data.title }}</div>
          <div class="magazineDetail">
            <div class="dete">
              <i class="iconfont icon-fontclass-rili"></i>
              {{ first_data.created_time }}
            </div>
            <div class="sectionNum">
              <i class="iconfont icon-fontclass-wenzhangshu"></i>
              {{ first_data.article_total }}
            </div>
          </div>
        </div>
        <div class="headRight">
          <div class="tapReading" @click="goDetail(first_data.id)">点击阅读</div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="lisHead">
        <div class="lisHeadLeft">
          <!-- <i class="iconfont icon-ht_show_formicon"></i> -->
          往期杂志
        </div>
        <div class="logo">
          <!-- <img :src="info.logo" alt="" /> -->
        </div>
      </div>
      <div class="lis">
        <div class="lisbox" v-for="(item, index) in datas" :key="index" @click="goDetail(item.id)">
          <div class="lisLeft">
            <img :src="item.cover" alt="" />
          </div>
          <div class="lisRight">
            <div class="rightTitle">
              {{ item.title }}
            </div>
            <div class="magazineDetail">
              <div class="dete">
                <i class="iconfont icon-fontclass-rili" style="color: #9e9e9e;"></i>
                {{ item.created_time }}
              </div>
              <div class="sectionNum">
                <i class="iconfont icon-fontclass-wenzhangshu"></i>
                {{ item.article_total }}
              </div>
            </div>
            <div style="font-size: 0.81rem; color: #333; font-weight: 600;">
              重点内容
            </div>
            <div class="contenTxt">
              {{ item.overview }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import periodicalIndex_controller from "./periodicalIndex_controller";
export default periodicalIndex_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.head {
  width: 100%;
  height: auto;
  background: #f9f9f9;
  position: relative;
  margin-bottom: 2.3rem;

  img {
    width: 100%;
  }

  .headTitle {
    position: absolute;
    bottom: -1.91rem;
    left: 0.94rem;
    width: 21.56rem;
    // height: 4.06rem;
    background-color: #fff;
    box-shadow: 0 0.06rem 0.84rem 0 rgba(217, 217, 217, 0.46);
    border-radius: 0.47rem;
    display: flex;
    align-items: center;
    padding: 0.5rem 0.78rem 0.5rem 0.66rem;

    .headLeft {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      flex: 1;
      overflow: hidden;

      .title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        font-size: 1.06rem;
        color: #333;
        font-weight: 600;
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

    .headRight {
      padding-left: 1.28rem;

      .tapReading {
        background-color: rgb(255, 215, 0);
        border-radius: 0.06rem 0.63rem 0.06rem 0.06rem;
        box-sizing: border-box;
        width: 5rem;
        height: 1.75rem;
        text-align: center;
        line-height: 1.75rem;
        color: #fff;
      }
    }
  }
}

.list {
  margin-top: 0.97rem;
  overflow: hidden;

  .lis {
    margin: 0 1.22rem 0.78rem 0.66rem;

    .lisbox {
      width: 100%;
      // height: 8.28rem;
      background: #fff;
      display: flex;
      justify-content: space-between;
      padding-left: 0.63rem;
      box-shadow: 0 0.06rem 0.91rem 0 rgba(181, 181, 181, 0.29);
      border-radius: 0.47rem;
      margin-bottom: 1.64rem;

      .lisLeft {
        width: 5.78rem;
        height: 7.69rem;
        box-shadow: 0 0.06rem 1.09rem 0 rgba(181, 181, 181, 0.79);
        margin-top: -0.75rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }

      .lisRight {
        flex: 1;
        margin-left: 0.59rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        padding-top: 0.5rem;
        padding-right: 1.13rem;
        padding-bottom: 0.78rem;

        .contenTxt {
          color: #666;
          font-size: 0.75rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .magazineDetail {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.5rem;

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
              color: #9e9e9e;
              margin-right: 0.22rem;
            }
          }
        }

        .rightTitle {
          font-size: 0.94rem;
          color: #333;
          font-weight: 600;
          max-width: 12.09rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .lisHead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.94rem;

    .lisHeadLeft {
      display: flex;
      align-content: center;
      margin-left: 0.94rem;

      i {
        color: #1d9a89;
        font-size: 1.6rem;
        margin-right: 0.47rem;
      }

      font-size: 1.25rem;
      color: rgb(137, 137, 137);
      font-weight: 600;
    }

    .logo {
      margin-right: 0.94rem;
      width: 5rem;
      height: 3.5rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
