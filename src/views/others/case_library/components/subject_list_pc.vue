<template>
  <div id="subject-list-pc" v-if="view_show">
    <navigation></navigation>
    <div class="all">
      <div class="nav">
        <span class="home" @click="gotoHome">首页</span> >
        <span class="case">热门专题</span>
      </div>

      <div class="content">
        <div class="li" v-for="(item, index) in list" :key="index">
          <div class="img">
            <img :src="item.special_banner_src  || emptyImage" alt="" />
          </div>
          <div class="middle">
            <div class="more">
              <div class="left">
                <div class="one">{{ item.special_name }}</div>
                <div class="two">
                  <span class="time">2020-12-17 09:09:12</span>
                  <span>
                    <i class="iconfont icon-ht_operation_perview"></i>
                    {{ item.read_num }}
                  </span>
                </div>
              </div>
              <div class="right" @click="gotoSubjectDetail(item.id)">
                <span>查看</span>
              </div>
            </div>
            <div class="ul">
              <div class="list" v-for="(item1, index1) in item.case_data" :key="index1">
                <div class="img">
                  <img :src="item1.img_src || emptyImage" alt="" />
                </div>
                <div class="text">{{ item1.case_name }}</div>
                <div class="button">
                  <el-popover placement="top" width="400" trigger="click" @show="changeImg(item1)">
                    <div style="display: flex; justify-content: space-around;">
                      <div style="text-align: center;">
                        <img :src="choosed_h5_img || emptyImage" alt="" style="width: 150px; height: 150px;">
                        <div style="font-weight: 700; padding: 15px;">公众号</div>
                      </div>
                      <div style="text-align: center;">
                        <img :src="choosed_mini_img || emptyImage" alt="" style="width: 150px; height: 150px;">
                        <div style="font-weight: 700; padding: 15px;">小程序</div>
                      </div>
                    </div>
                    
                    <span slot="reference">体验</span>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page" style="margin: 30px 0;">
        <el-pagination
          background
          @current-change="currentChange"
          :current-page="current_page"
          :page-size="per_page"
          layout="prev, pager, next, jumper"
          :total="total"
          style="text-align: center;"
        >
        </el-pagination>
      </div>
    </div>
    <bottomAdv></bottomAdv>
    <div class="bottom">
      <caseBottom v-if="$store.state.caseLibrary && $store.state.caseLibrary != null"></caseBottom>
    </div>
    <secrvicePc></secrvicePc>
  </div>
</template>

<script>
import subject_list_pc_controller from './subject_list_pc_controller';

export default subject_list_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#subject-list-pc {
  background: #fff;

  .all {
    width: 1200px;
    margin: 0 auto;
    text-align: left;

    .nav {
      margin: 30px 0;

      .home {
        font-size: 14px;
        color: #333;
      }

      .home:hover {
        color: $orange;
        cursor: pointer;
      }

      .case {
        color: $orange;
      }
    }

    .content {
      margin: 0 17px;
      display: flex;
      flex-wrap: wrap;

      .li {
        margin: 27px 0;
        width: 345px;
        border: 1px solid #eee;
        margin-right: 50px;

        .img {
          width: 343px;
          height: 160px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .middle {
          margin: 0 20px;

          .more {
            height: 73px;
            padding: 7px 0;
            display: flex;

            .left {
              flex: 1;

              .one {
                width: 227px;
                font-size: 16px;
                line-height: 36px;
                color: #202020;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .two {
                font-size: 14px;
                line-height: 24px;
                color: #999;

                .time {
                  margin-right: 30px;
                }
              }
            }

            .right {
              width: 76px;
              display: flex;
              justify-content: flex-end;
              align-items: center;

              span {
                display: inline-block;
                width: 56px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                background: $orange;
                color: #fff;
                cursor: pointer;
              }
            }
          }

          .ul {
            .list {
              display: flex;
              height: 90px;
              border-top: 1px dashed #d1d1d1;
              padding: 16px 0;
              align-items: center;

              .img {
                width: 58px;
                height: 58px;
                min-width: 58px;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .text {
                flex: 1;
                margin: 0 7px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: #202020;
                line-height: 36px;
              }

              .button {
                cursor: pointer;
                width: 56px;
                min-width: 56px;
                height: 32px;
                border: 1px solid #868686;
                line-height: 32px;
                text-align: center;

                span {
                  display: inline-block;
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }

      .li:nth-child(3n) {
        margin-right: 0;
      }
    }
  }

  .color {
    color: $orange;
  }
}
</style>
