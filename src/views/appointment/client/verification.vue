<template>
  <div style="background: #fff;">
    <c-title :hide="false" :text="'核销'">
    </c-title>
    <div class="main" v-if="isReady && !info.worker_name">
      <p>{{appointmentLang.project}}名称： {{info.project_title}}</p>
      <p>已预约次数： {{info.used_count}}次</p>
      <p>{{appointmentLang.project}}总次数： {{info.total_count}}次</p>
      <p>顾客姓名： {{info.realname}}</p>
      <p>顾客电话： {{info.mobile}}</p>
    </div>

    <div class="main" v-if="isReady && info.worker_name">
      <p>{{appointmentLang.project}}名称： {{info.project_title}}</p>
      <p>门店名称： {{info.store_name}}</p>
      <p>{{appointmentLang.worker}}姓名： {{info.worker_name}}</p>
      <p>已预约次数： {{info.used_count}}次</p>
      <p>{{appointmentLang.project}}总次数： {{info.total_count}}次</p>
      <p>顾客姓名： {{info.customer_name}}</p>
      <p>顾客电话： {{info.customer_tel}}</p>
      <p>开始时间： {{info.begin_time}}</p>
      <p>结束时间： {{info.end_time}}</p>
    </div>

    <div style="padding: 1.5rem 0;">
      <p class="btn" @click="Sure">确认核销</p>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
var clicktag = 0;

export default {
  data() {
    return {
      isReady: false,
      service_id: 0,
      url: "",
      json: {},
      sureUrl: "",
      info: {}
    };
  },
  activated() {
    this.isReady = false;
    this.service_id = this.$route.params.service_id;
    if (this.$route.query.tag === "pro") {
      this.url = "plugin.appointment.frontend.appointment-order.close-service-info";
      this.sureUrl = "plugin.appointment.frontend.appointment-order.close-service";
      this.json = {
        order_id: this.service_id
      };
    } else {
      this.url = "plugin.appointment.frontend.appointment-service.close-service-info";
      this.sureUrl = "plugin.appointment.frontend.appointment-service.close-service";
      this.json = {
        service_id: this.service_id
      };
    }
    this.getData();
  },
  computed: {
    appointmentLang() {
      if(this.$store.state.shopLanguage.appointment) {
        return this.$store.state.shopLanguage.appointment;
      }else {
        return {worker: "技师", project: "项目", service: "服务"};
      }
    },
  },
  methods: {
    getData() {
      $http
        .get(this.url, this.json, "加载中")
        .then(response => {
          this.isReady = true;
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    Sure() {
      let that = this;
      if (clicktag === 0) {
        clicktag = 1;
        $http
          .get(this.sureUrl, this.json, "加载中")
          .then(response => {
            if (response.result === 1) {
              clicktag = 0;
              that.$dialog.alert({ message: response.msg})
                .then(() => {
                  if(that.$route.query.tag === "pro"){
                    that.$router.push(this.fun.getUrl("ClientProject"));
                  }else{
                    that.$router.push(this.fun.getUrl("ClientAppointment"));
                  }

                }).catch(() => {});
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .main {
    text-align: left;
    margin: 1rem 2rem 0 2rem;

    p {
      font-size: 16px;
      padding: 0.5rem 0;
    }
  }

  .btn {
    background: #f49f19;
    color: #fff;
    width: 10rem;
    height: 2rem;
    line-height: 2rem;
    border-radius: 10px;
    margin: 0 auto;
  }
</style>
