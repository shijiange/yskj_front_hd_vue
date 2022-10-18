<template>
  <div id="teamClient">
    <c-title :hide="false" :text="name"></c-title>
    <div id="content">

      <div class="nav">
        <div class="nav_box">
          <ul class="nav_item">
            <li @click="changeTab(tab,i)" :class="selected === i ? 'tab-item tab' : 'tab-item'" v-for="(tab ,i) of tabs" :key='i'>
              {{tab.level_name}}({{tab.count}})
            </li>
          </ul>
        </div>

        <div class="list_box">
          <div class="box" v-for="(item,i) in bossList" :key='i'>
            <div v-if="item.has_one_member" class="client" @click="showDetail(item)">
              <div class="img">
                <img :src="item.has_one_member.avatar">
              </div>
              <ul class="name">
                <li><span class="star" v-if="item.directly === '1'">*</span><span>客户名称：{{item.has_one_member.nickname}}</span></li>
              </ul>
              <i class="fa fa-angle-right" :class="item.show&&item.has_one_member.uid === uid ?'show_detail':''"></i>
            </div>
            <transition name="fade">
              <ul class="drop-down" v-if="item.show&&item.has_one_member.uid === uid">
                <li>
                  <span>下级经销商人数：{{detail.child_count}}人</span>
                  <span>自购订单金额：{{detail.self_buy_price}}</span>
                </li>
                <!--<li>-->
                <!--<span>经销商等级：{{detail.role}}</span>-->
                <!--</li>-->
              </ul>
            </transition>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import newteamClient_controller from './newteamClient_controller';

export default newteamClient_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#teamClient {
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

      .list_box {
        margin-top: 0.375rem;

        .box {
          .client {
            background-color: #fff;
            padding: 0.875rem 1.25rem;
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
                width: 100%;
              }
            }

            .name {
              text-align: left;
              margin-left: 0.625rem;
              width: 15rem;

              .star {
                color: red;
                font-size: 32px;
                position: relative;
                top: 0.8rem;
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

          .fade-enter-active {
            transition: 0.5s;
          }

          .fade-enter,
          .fade-leave-active {
            opacity: 0;
            height: 0;
          }

          .drop-down {
            background-color: #fafafa;
            padding: 0.625rem 0.875rem;
            color: #8c8c8c;

            li {
              line-height: 1.875rem;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>