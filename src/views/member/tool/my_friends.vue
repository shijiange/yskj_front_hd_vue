<template>
  <div id="myFridens">
    <c-title :hide="false"
             :text="diyName"></c-title>
    <div id="content">
      <div class="nav">
        <div class="nav_box">
          <ul class="nav_item">
            <li @click="changeTab(tab, i)"
                :class="selected === i ? 'tab-item tab' : 'tab-item'"
                v-for="(tab, i) of tabs" :key='i'>
              {{ tab.level_name }}<i style="color: #000;">({{ tab.count }})</i><i style="color: #f15353;">({{ tab.count_order }})</i>
            </li>
          </ul>
        </div>

        <div class="list_box">
          <div class="box"
               v-for="(item,i) in bossList" :key='i'>
            <div v-if="item.has_one_member"
                 class="client">
              <div class="img">
                <img :src="item.has_one_member.avatar_image" />
              </div>
              <ul class="name">
                <li>
                  <h2>
                    {{ item.has_one_member.nickname }}：({{ item.level_name }})
                  </h2>
                  <span>会员ID:{{ item.has_one_member.uid }}</span>
                  <span class="rightTime">{{ item.created_at }}</span>
                </li>
                <li class="btnList">
                  <span :class="{ activeClass: item.member_count > 0 }">直推：{{ item.member_count }}</span>
                  <span :class="{ activeClass: item.member_child_count > 0 }">团队：{{ item.member_child_count }}</span>
                  <span :class="{ activeClass: item.order_count > 0 }">业绩：{{ item.order_count }}</span>
                </li>
              </ul>
            </div>
          </div>
          <h2 v-if="showNoText">没有搜索到相关数据</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myFridens_controller from "./my_friends_controller";

export default myFridens_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#myFridens {
  #content {
    .nav {
      .nav_box {
        border-bottom: solid 0.0625rem #ebebeb;
        padding: 0 0.625rem;
        margin-bottom: 0.5rem;
        background-color: #fff;
        text-align: center;

        .nav_item {
          height: 2.75rem;
          line-height: 2.75rem;
          display: flex;
          width: 100%;
          white-space: nowrap;
          overflow-x: auto;

          li {
            margin: 0 0.625rem;
            font-size: 15px;
            max-width: 14rem;
            display: inline-block;
          }

          .tab {
            border-bottom: 5px solid #f15353;
            color: #f15353;
            box-sizing: border-box;
            padding-bottom: 5px;
          }
        }

        .nav::-webkit-scrollbar {
          display: none;
        }
      }

      .nav_box::-webkit-scrollbar {
        display: none;
      }

      .list_box {
        margin-top: 0.375rem;

        .box {
          .client {
            background-color: #fff;
            padding: 0.75rem 1.25rem;
            display: flex;
            position: relative;
            border-bottom: solid 0.0625rem #ebebeb;

            .show_detail {
              transform: rotate(90deg);
            }

            .img {
              width: 3rem;
              height: 3rem;
              border-radius: 1.5rem;
              overflow: hidden;

              img {
                width: 3rem;
                height: 3rem;
                background-size: cover;
              }
            }

            .name {
              text-align: left;
              margin-left: 0.625rem;
              width: 18rem;

              li {
                h2 {
                  font-weight: 400;
                  color: #000;
                }

                span {
                  font-weight: 400;
                  color: #8c8c8c;
                  font-size: 0.75rem;
                  width: 50%;
                  display: inline-block;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                .rightTime {
                  float: right;
                  text-align: right;
                }
              }

              .btnList {
                span {
                  width: auto;
                  padding: 0 0.4rem;
                  height: 1.6rem;
                  line-height: 1.6rem;
                  text-align: center;
                  display: inline-block;
                  background: #000;
                  color: #fff;
                  border-radius: 0.25rem;
                }

                .activeClass {
                  background-color: #f15353;
                }
              }

              li:first-child {
                line-height: 1.5rem;
                font-size: 15px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              li:last-child {
                font-size: 14px;
                color: #8c8c8c;
              }
            }

            i {
              position: absolute;
              right: 1.25rem;
              font-size: 1.75rem;
              color: #999;
              line-height: 3rem;
            }
          }
        }
      }
    }
  }
}
</style>
