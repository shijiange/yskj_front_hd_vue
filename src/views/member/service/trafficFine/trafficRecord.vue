<template>

  <div id="trafficRecord" :class="'trafficRecord'+$store.state.service.lang">

    <c-title :hide="false" :text='language.title'></c-title>

    <div class="main">
      <div class="monthList" v-for="(elem,i) in data" :key='i'>
        <p class="title">{{elem.time}}</p>
        <ul>
          <li v-for="(parm,i) in elem.data" :key='i'>
            <div class="left">
              <p>{{parm.content}}</p>
              <span>{{parm.date}}</span>
            </div>
            <div class="right">
              <p>{{$i18n.t("money")}}{{parm.money}}</p>
              <b>{{parm.status}}</b>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>


<script>
import trafficRecord_controller from "./trafficRecord_controller";

export default trafficRecord_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .trafficRecordch {
    .main {
      width: 100%;
      overflow: auto;

      .monthList {
        background: #fff;

        .title {
          padding-left: 0.875rem;
          color: #333;
          line-height: 1.875rem;
          font-size: 14px;
          text-align: left;
          background: #fafafa;
        }

        li {
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0.5rem 0.9375rem;
          border-bottom: 0.0625rem solid #ebebeb;

          .left {
            width: 11.875rem;
            float: left;
            line-height: 1.875rem;
            text-align: left;

            p {
              color: #333;
              font-size: 14px;
              font-weight: 500;
            }

            span {
              color: #8c8c8c;
              font-size: 14px;
            }
          }

          .right {
            float: right;
            width: 4.375rem;
            text-align: right;
            line-height: 1.875rem;

            p {
              color: #f15353;
              text-align: right;
              font-size: 16px;
            }

            b {
              color: #8c8c8c;
              font-size: 14px;
            }
          }
        }

        li:last-child {
          border: none;
        }
      }
    }
  }

  .trafficRecordwei {
    .main {
      width: 100%;
      overflow: auto;

      .monthList {
        height: 9.5625rem;
        background: #fff;

        .title {
          padding: 0 0.9375rem;
          color: #fff;
          line-height: 1.875rem;
          font-size: 14px;
          background: #39d1b6;
          margin-bottom: 0.0625rem;
          text-align: right;
        }

        li {
          height: 3.75rem;
          box-sizing: border-box;
          padding: 0.5rem 0.9375rem;
          border-bottom: 0.0625rem solid #efefef;

          .left {
            width: 11.875rem;
            float: right;
            line-height: 1.375rem;
            text-align: right;

            p {
              color: #616161;
              font-size: 14px;
              font-weight: 500;
            }

            span {
              color: #b6b6b6;
              font-size: 13px;
            }
          }

          .right {
            float: left;
            width: 4.375rem;
            text-align: left;
            line-height: 1.375rem;

            p {
              color: #333;
              text-align: left;
              font-size: 16px;
            }

            b {
              color: #333;
              font-size: 14px;
            }
          }
        }

        li:last-child {
          border: none;
        }
      }
    }
  }
</style>
