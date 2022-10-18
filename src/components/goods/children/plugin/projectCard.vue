<template>
  <div id="projectbox">
    <div class="title">
      <span class="mian_title">套餐包含{{projectName}}</span>
      <span class="describ">购买后可直接获得{{projectName}}服务次数，可直接到店核销！</span>
    </div>
    <div class="projectCard">
      <div v-for="item in projectList" class="row" :key="item.id" :style="{ 'margin': projectList.length < 2 ? '' : '0.5rem','width': projectList.length === 1 ? '92%' : '' }">
        <div class="row_project" @click="btnMoreStore(item.project_id)">
          <div class="project" :style="{'width': projectList.length === 1 ? '100%' : '' }">
            <div><img :src="item.thumb" alt="" /></div>
            <div class="project_middle">
              <span class="project_name">{{ item.project_title }}</span>
              <span class="effective">有效期限：{{ item.period }}</span>
            </div>
            <div class="data_num">
              <van-icon name="arrow" @click="btnDetail(item.project_id)" />
              <div class="row_data" :style="{ 'margin-right':item.service_count > 9 ? '0.5rem' : '0' }"><span class="data">{{item.service_count}}</span><span class="num">次</span></div>
            </div>
          </div>
        </div>
        <div class="store">
          <div class="icon_img">
            <i class="iconfont fontclass-tuanduifenxiaoshang"></i>
            <span class="apply_store">适用门店</span>
          </div>
          <div class="store_detail">
            <div><img :src="item.store_thumb" alt="" /></div>
            <div class="store_row">
              <span class="name">{{ item.store_name }}</span>
              <div class="date"><span>营业时间：</span><span>{{ item.store_business_hours_start }} - {{ item.store_business_hours_end }}</span></div>
            </div>
            <span class="distance">{{ item.store_distance }}{{ item.store_distance_unit }}</span>
          </div>
          <div class="address">
            <div class="left" >
              <i class="iconfont icon-order_locate"></i>
              <span class="address_name">{{ item.store_full_address || "全国" }}</span>
            </div>
          </div>
        </div>
        <span class="line"></span>
        <span class="more_detail" @click="btnMoreStore(item.project_id)"> 查看{{projectName}}详情及更多适用门店 </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      projectName: "",
      address: "",
      lng: "",
      lat: "",
      point: "",
      location: "",
      projectList: []
    };
  },
  props: ["id"],
  mounted() {
    this.getLocationData();
    this.projectName = this.fun.getCustomTextLang("store_projects.project", "项目");
  },
  activated() {
    this.getLocationData();
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http
        .get("plugin.store-projects.frontend.project.get-list-by-goods-id", {
          lng: this.lng,
          lat: this.lat,
          goods_id: this.id
        },'load')
        .then(response => {
          if (response.result === 1) {
            this.projectList = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    btnMoreStore(id) {
      this.$router.push(this.fun.getUrl("MoreStores",{ id: 0 , project_id:id }));
    },
    tolocation() {
      this.$store.commit("setReferer", window.location.href);
      this.$router.push(this.fun.getUrl("o2oLocation"));
    },
    getLocationData() {
      this.fun
        .getLocation()
        .then(res => {
          this.location = res;
          this.address = res.title;
          this.getProjectList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转到商品详情
    btnDetail(id){
      this.$router.push(this.fun.getUrl("VerificationProjectDetails", { id: id }));
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#projectbox {
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;

  .mian_title {
    font-size: 14px;
    color: #202020;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .describ {
    font-size: 12px;
  }

  .title {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 0.5rem 0;
    border-radius: 10px;
    padding: 1rem;
    background: #fff;
  }

  .projectCard {
    display: flex;
    width: 100%;
    overflow: hidden;
    overflow-x: scroll;

    .row {
      // display: grid;
      background: #fff;

      .row_project {
        display: flex;
        justify-content: center;
        height: 4.5rem;
      }

      .project {
        padding: 0.7rem 0 0.7rem 1.5rem;
        display: flex;
        background-image: linear-gradient(90deg, #ffebd2 0%, #fbc889 100%);
        border-radius: 0.47rem 0.47rem 0 0;

        img {
          width: 3rem;
          height: 3rem;
          margin: 0;
          border-radius: 0.36rem;
        }

        .project_middle {
          height: 3rem;
          display: flex;
          flex: 6;
          flex-direction: column;
          text-align: left;
          justify-content: space-between;
          margin-left: 0.5rem;
          width: 10rem;

          .project_name {
            color: #3c2504;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 10px;
          }

          .effective {
            color: #874e02;
            font-size: 10px;
          }
        }

        .data_num {
          flex: 2;
          display: flex;
          color: #874e02;
          position: relative;

          .row_data {
            position: absolute;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: flex-start;
            align-items: flex-end;
            height: 100%;
            width: 100%;

            .data {
              font-size: 20px;
              font-weight: bold;
            }

            .num {
              display: flex;
              align-items: flex-end;
            }
          }

          .van-icon-arrow {
            position: absolute;
            top: 0;
            right: 30%;
          }
        }
      }

      .store {
        padding: 0 1rem;
        text-align: left;
        background: #fff;

        .icon_img {
          margin-bottom: 0.5rem;
          padding-top: 0.5rem;
          color: #ce811d;
        }

        img {
          width: 3rem;
          height: 3rem;
          margin: 0;
          border-radius: 0.36rem;
        }

        .store_detail {
          display: flex;
          font-size: 10px;

          .store_row {
            flex: 6;
            margin-left: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name {
              font-weight: bold;
            }

            .date {
              display: flex;
              flex-direction: column;
            }
          }

          .distance {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
        }

        .address {
          margin-top: 1rem;

          .left {
            display: flex;
          }

          .address_name {
            font-size: 10px;
          }
        }
      }

      .line {
        display: block;
        height: 0.03rem;
        background-color: #f5f5f5;
        margin: 0.63rem 1rem;
      }

      .more_detail {
        color: #874e02;
        padding-bottom: 1rem;
        background: #fff;
        border-radius: 0 0 0.47rem 0.47rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }

    .row:first-child {
      margin-left: 1rem !important;
    }
  }
}
</style>
