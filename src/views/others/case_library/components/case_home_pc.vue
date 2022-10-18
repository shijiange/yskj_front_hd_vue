<template>
  <div id="case-home-pc">
    <navigation></navigation>
    <el-carousel height="400px" v-if="banner.length > 0">
      <el-carousel-item v-for="item in banner" :key="item">
        <a :href="item.url || '#'">
          <img :src="item.img_pc_src || emptyImage" alt="" style="width: 100%; height: 100%;" />
        </a>
      </el-carousel-item>
    </el-carousel>
    <div class="hot">
      <div class="hot-box">
        <div class="one">
          <div class="title">热门案例</div>
          <div class="categories">
            <div
              class="category"
              v-for="(item, index) in hotCategory"
              :key="index"
              @click="changeCategory(item.id)"
              :class="{ 'category-selected': choosed_category_id == item.id }"
            >
              {{ item.category_name }}
            </div>
          </div>
          <div class="more" @click="gotoCategory">查看更多></div>
        </div>
        <div class="two" v-if="hotCases.length > 0">
          <div class="li" v-for="(item, index) in hotCases" :key="index" @click="gotoCaseDetail(item.id)">
            <div class="img">
              <img :src="item.img_src || emptyImage" alt="" />
              <!-- <div class="icon">
                <img src="../../../../assets/images/radius-alipay.png" alt="" />
              </div> -->
            </div>
            <div class="text">{{ item.case_name }}</div>
          </div>
        </div>
        <div class="two" v-else>
          暂无更多~
        </div>
      </div>
    </div>
    <div class="special">
      <div class="one">
        <div class="title">热门专题</div>
        <div class="more" @click="gotoSpecialList">查看更多></div>
      </div>
      <div class="two" v-if="special.length>0">
        <div
          class="li"
          v-for="(item, index) in special"
          :key="index"
          @click="gotoSpecial(item.id)"
          v-if="item.special_banner_src"
        >
          <img :src="item.special_banner_src || emptyImage" alt="" />
        </div>
      </div>
      <div class="two" v-else>
        暂无更多~
      </div>
    </div>
    <div class="new">
      <div class="left">
        <div class="one">
          <div class="title">最新案例</div>
          <div class="change" @click="changeCasePage">换一批⟳</div>
        </div>
        <div class="two">
          <div class="li" v-for="(item, index) in newCase" :key="index" @click="gotoCaseDetail(item.id)">
            <div class="img">
              <img :src="item.img_src || emptyImage" alt="" />
            </div>
            <div class="name">{{ item.case_name }}</div>
            <div class="nickname">{{ item.member?item.member.nickname:'' }}</div>
            <div class="time" v-if="item.created_at">{{ item.created_at.split(' ')[0] }}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="one">
          <div class="title">排行榜</div>
          <div class="more" @click="gotoCategory1">查看更多></div>
        </div>
        <div class="two">
          <div class="li" v-for="(item, index) in rank" :key="index" @click="gotoCaseDetail(item.id)">
            <div class="logo">
              <img src="../../../../assets/images/medal1.png" alt="" v-if="index == 0" />
              <img src="../../../../assets/images/medal2.png" alt="" v-if="index == 1" />
              <img src="../../../../assets/images/medal3.png" alt="" v-if="index == 2" />
              <div class="number" v-if="index > 2">
                <div class="num">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <div class="img">
              <img :src="item.img_src || emptyImage" alt="" />
            </div>
            <div class="name">{{ item.case_name }}</div>
            <div class="nickname">{{ item.member.nickname }}</div>
            <div class="time" v-if="item.created_at">{{ item.created_at.split(' ')[0] }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 广告位 -->
    <div class="adv" v-if="ad1">
      <a :href="ad1.url || '#'">
        <img :src="ad1.pc_img || emptyImage" alt="" />
      </a>
    </div>
    <div class="category-list" v-for="(item, index) in category" :key="index" v-if="item.cases.length > 0">
      <div class="list">
        <div class="one">
          <div class="title">{{ item.category_name }}</div>
          <div class="more" @click="gotoCategory(item.pid,item.id,item.level)">查看更多>{{ item.case }}</div>
        </div>
        <div class="two">
          <caseTemplate :datas="item.cases"></caseTemplate>
        </div>
      </div>
    </div>
    <!-- 广告位 -->
    <div class="adv-two" v-if="ad2">
      <a :href="ad2.url || '#'">
        <img :src="ad2.pc_img || emptyImage" alt="" />
      </a>
    </div>
    <template class="bottom">
      <caseBottom v-if="$store.state.caseLibrary && $store.state.caseLibrary != null"></caseBottom>
    </template>
    <secrvicePc></secrvicePc>
  </div>
</template>

<script>
import case_home_pc_controller from './case_home_pc_controller';

export default case_home_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-home-pc {
  background: #fff;

  .hot {
    background: rgb(252, 252, 252);
    padding: 60px 0;

    .hot-box {
      width: 1200px;
      margin: 0 auto;

      .one {
        display: flex;
        line-height: 36px;

        .title {
          font-size: 22px;
          margin-right: 35px;
          min-width: 88px;
        }

        .categories {
          font-size: 16px;
          display: flex;
          flex-wrap: nowrap;
          overflow: auto;

          .category {
            margin-right: 18px;
            white-space: nowrap;
          }

          .category:hover {
            cursor: pointer;
            color: $orange;
          }

          .category-selected {
            cursor: pointer;
            color: $orange;
          }
        }

        .more {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          min-width: 88px;
        }

        .more:hover {
          cursor: pointer;
          color: $orange;
        }
      }

      .two {
        background: #fff;
        margin: 24px 0;
        padding: 10px 20px;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid rgb(242, 242, 242);

        .li {
          width: 110px;
          height: 150px;
          padding: 8px;
          margin: 7px 17px;
          border: 1px solid transparent;

          .img {
            position: relative;
            width: 94px;
            height: 94px;

            img {
              width: 100%;
              height: 100%;
            }

            .icon {
              position: absolute;
              top: 0;
            }
          }

          .text {
            line-height: 30px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 9px;
          }
        }

        .li:hover {
          border: 1px solid rgb(238, 238, 238);
          cursor: pointer;

          .text {
            background: $orange;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }

  .special {
    width: 1200px;
    margin: 0 auto;
    padding: 30px 0;

    .one {
      display: flex;
      line-height: 36px;

      .title {
        font-size: 22px;
        margin-right: 35px;
      }

      .more {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }

      .more:hover {
        cursor: pointer;
        color: $orange;
      }
    }

    .two {
      display: flex;
      width: 100%;
      overflow: auto;

      .li {
        margin-top: 24px;
        width: 224px;
        min-width: 224px;
        height: 130px;
        margin-right: 19px;
        border-radius: 10px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }

      .li:last-child {
        margin-right: 0;
      }
    }
  }

  .new {
    width: 1200px;
    margin: 30px auto;
    display: flex;

    .left {
      width: 520px;
      margin-right: 80px;

      .one {
        display: flex;
        line-height: 36px;

        .title {
          font-size: 22px;
          margin-right: 35px;
          flex: 1;
          text-align: left;
        }

        .change {
          text-align: right;
          color: $orange;
          font-size: 16px;
          cursor: pointer;
        }
      }

      .two {
        .li {
          margin: 12px 0;
          display: flex;
          text-align: left;
          line-height: 45px;
          height: 45px;
          width: 520px;
          font-size: 16px;
          cursor: pointer;

          .img {
            border-radius: 50%;
            min-width: 45px;
            width: 45px;
            height: 45px;
            margin-right: 17px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: 30px;
            min-width: 180px;
          }

          .nickname {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: 30px;
            color: $orange;
            min-width: 115px;
          }

          .time {
            min-width: 100px;
            text-align: right;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .right {
      flex: 1;

      .one {
        display: flex;
        line-height: 36px;

        .title {
          font-size: 22px;
          margin-right: 35px;
        }

        .more {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .more:hover {
          cursor: pointer;
          color: $orange;
        }
      }

      .two {
        .li {
          margin: 12px 0;
          display: flex;
          text-align: left;
          line-height: 45px;
          height: 45px;
          width: 600px;
          font-size: 16px;
          cursor: pointer;

          .logo {
            min-width: 66px;
            width: 66px;
            height: 36px;
            margin-top: 4.5px;
            margin-right: 17px;
            text-align: center;

            img {
              width: 29px;
              height: 100%;
            }

            .number {
              color: #fff;
              display: flex;
              justify-content: center;
              text-align: center;
              height: 36px;
              align-items: center;

              .num {
                width: 24px;
                background: $orange;
                border-radius: 50%;
                height: 24px;
                line-height: 24px;
              }
            }
          }

          .img {
            border-radius: 50%;
            min-width: 45px;
            width: 45px;
            height: 45px;
            margin-right: 17px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: 30px;
            min-width: 180px;
          }

          .nickname {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: 30px;
            color: $orange;
            min-width: 115px;
          }

          .time {
            min-width: 100px;
            text-align: right;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .adv {
    width: 1200px;
    margin: 30px auto;
    height: 200px;

    img {
      width: 100%;
      height: 200px;
    }
  }

  .category-list {
    width: 1200px;
    margin: 30px auto;
    display: flex;

    .list {
      width: 100%;

      .one {
        display: flex;
        line-height: 36px;
        width: 100%;

        .title {
          font-size: 22px;
          margin-right: 35px;
        }

        .more {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .more:hover {
          cursor: pointer;
          color: $orange;
        }
      }

      .two {
        display: flex;
        flex-wrap: wrap;

        .li {
          width: 281px;
          height: 149px;
          border: 1px solid #eee;
          padding: 20px;
          margin: 21px 25px 21px 0;

          .top {
            display: flex;

            .img {
              min-width: 71px;
              width: 71px;
              height: 71px;
              margin-right: 10px;
              position: relative;

              img {
                width: 100%;
                height: 100%;
              }

              .icon {
                position: absolute;
                top: 0;
              }
            }

            .content {
              flex: 1;
              text-align: left;
              width: 167px;

              .title {
                font-size: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .detail {
                color: #666;
                padding-top: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
            }
          }

          .bottom-a {
            display: flex;
            margin-top: 10px;
          }

          .rate {
            flex: 1;
            text-align: left;

            .number {
              display: inline-block;
              padding: 0 10px;
            }
          }
        }

        .li:hover {
          cursor: pointer;
          box-shadow: 1px 2px 10px #ccc;
        }

        .li:nth-child(4n + 0) {
          margin-right: 0;
        }
      }
    }
  }

  .adv-two {
    width: 100%;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
