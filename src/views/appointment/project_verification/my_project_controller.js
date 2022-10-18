import DList from "@/components/dlist";
import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
import serviceCard from "./service_card";
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      active: 2,
      address: "",
      lng: "",
      lat: "",
      location: "",
      incompleteList: [],
      // 未完成
      upgradeCodePage: 1,
      loading: false,
      finished: false,
      // 已完成
      upgradeCodePage_completed: 1,
      loading_completed: false,
      finished_completed: false,
      completed: [],
      // tab切换
      tabsShow: true,
      projectName: "",
      titled: "",
      titleIng: "",
      // 赠送
      giveInfo: '',
      showGivePop: false,
      nickname: '',
      giveUserId: '',
      giveNum: '',
      errorNum: '',
      // 排序
      orderby:0,
      orderbyList:[{
        name:'购买时间',
        state:'drop',
      },{
        name:'到期时间',
        state:'',
      }],
    };
  },
  watch: {
    "$route"(to, from) {
      if (from.name === "MoreStores" && to.name === "MyProject") {
        this.$router.go(0);
      }
      if (from.name === "StoreVerification") {
        this.$router.go(0);
      }
    }
  },
  activated() {
    this.projectName = this.fun.getCustomTextLang("store_projects.project", "项目");
    this.titled = "可使用" + this.projectName;
    this.titleIng = "已完成" + this.projectName;
    this.active = '';
    this.fun.getLocation()
      .then(res => {
        this.location = res;
        this.address = res.title;
        this.initData();
        this.getIncomplete();
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    initData() {
      this.upgradeCodePage = 1;
      this.upgradeCodePage_completed = 1;
      this.loading = false;
      this.loading_completed = false;
      this.finished = false;
      this.finished_completed = false;
      this.incompleteList = [];
      this.completed = [];
    },
    // 获取未完成项目列表
    getIncomplete() {
      if (!this.location) {
        return;
      }
      this.loading = true;
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      this.lng = p.lng;
      this.lat = p.lat;
      $http
        .get("plugin.store-projects.frontend.project-order.get-un-finish-list", {
          lng: this.lng,
          lat: this.lat,
          page: this.upgradeCodePage,
          orderby:this.orderby
        })
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.finished = true;
            }
            this.loading = false;
            this.incompleteList.push(...data);
            this.upgradeCodePage++;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取已完成数据
    getCompleted() {
      // if(this.loading_completed ){ return; }
      this.loading_completed = true;
      $http
        .get("plugin.store-projects.frontend.project-order.get-finish-list", { page: this.upgradeCodePage_completed }, "load")
        .then(response => {
          if (response.result === 1) {
            const { data: data, current_page, last_page } = response.data;
            if (data.length === 0 || current_page === last_page) {
              this.finished_completed = true;
            }
            this.loading_completed = false;
            this.completed.push(...data);
            this.upgradeCodePage_completed++;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转会员核销页面
    btnVerUser(data) {
      this.$router.push(this.fun.getUrl("WriteOffRecord", { project_title: data }));
    },
    //跳转核销使用
    btnUsere(data) {
      this.$router.push(this.fun.getUrl("WriteOff", { item: data }));
    },
    // 点击跳转查看更多商户
    seeMore(data) {
      this.initData();
      this.$router.push(this.fun.getUrl("MoreStores", { id: data.id, project_id: data.project_id, name: "myProject" }));
    },
    // van-tabs选中状态
    btnSelect(data) {
      this.initData();
      if (data === 1) {

        // this.upgradeCodePage_completed = 1
        this.loading_completed = false;
        this.finished_completed = false;
        this.tabsShow = false;
        // this.completed = []
        this.getCompleted();
      } else {
        // this.upgradeCodePage = 1
        this.loading = false;
        this.finished = false;
        this.tabsShow = true;
        // this.incompleteList = []
        this.getIncomplete();
      }
    },
    btnValue(data) {
      this.value = data;
    },
    tolocation() {
      this.$store.commit("setReferer", window.location.href);
      this.$router.push(this.fun.getUrl("o2oLocation"));
    },
    // 获取地址
    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
      });

      function onComplete(obj) {
        // var res =
        //   "经纬度：" +
        //   obj.position +
        //   "\n精度范围：" +
        //   obj.accuracy +
        //   "米\n定位结果的来源：" +
        //   obj.location_type +
        //   "\n状态信息：" +
        //   obj.info +
        //   "\n地址：" +
        //   obj.formattedAddress +
        //   "\n地址信息：" +
        //   JSON.stringify(obj.addressComponent, null, 4);
        //alert(res);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        that.lng = pos.point.lng;
        that.lat = pos.point.lat;
        that.getIncomplete();
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        // that.getCommunityStores();
      }

      function onError(obj) {
        alert(obj.message);
        // alert(obj.info + '--' + obj.message);
        // console.log(obj, "定位失败");
      }
    },

    tapBtnGive (obj) {
      this.showGivePop = true;
      this.giveInfo = obj;
    },
    // 关闭弹框
    closeGivePop () {
      this.showGivePop = false;
      this.errorNum = '';
      this.giveUserId = '';
      this.giveNum = '';
    },
    throttleFn(event) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      let that = this;
      this.timeoutId = setTimeout(function () {
        that.searchUser(event);
      }, 800);
    },
    changeNumInput (event) {
      console.log(event);
      let num = event * 1;
      if (this.fun.isTextEmpty(num)) {
        this.errorNum = "转增次数不能为空";
        return;
      }
      console.log(this.giveInfo.rest_count, num);
      if (this.giveInfo.rest_count < num) {
        this.errorNum = "输入转赠次数大于拥有的次数";
        return;
      }
      this.errorNum = '';
    },
    // 搜索用户
    searchUser (event) {
      this.nickname = null;
      var reSearch = event.target.value;
      if (reSearch) {
        $http.get("member.member.memberInfo", { uid: reSearch }, "loading")
          .then(response => {
            if (response.result === 1) {
              this.giveUserId = reSearch;
              this.nickname = response.data ? response.data.nickname : '查无此用户';
            } else {
              this.nickname = null;
              Toast(response.msg);
            }
          })
          .catch(error => {
            this.giveUserId = '';
          });
      } else {
        this.nickname = "用户id不能为空";
      }
    },

    // 赠送
    giveProject() {
      if (!this.giveUserId) {
        this.nickname = "用户id不能为空";
        return;
      }
      if (this.nickname === '查无此用户') {
        return;
      }
      if (!this.giveNum) {
        this.errorNum = "转增次数不能为空";
        return;
      }
      if (this.giveInfo.rest_count < this.giveNum) {
        this.errorNum = "输入转赠次数大于拥有的次数";
        return;
      }

      $http.get("plugin.store-projects.frontend.project-order.transfer",
        {
          id: this.giveInfo.id,
          transfer_uid: this.giveUserId,
          transfer_count: this.giveNum
        }, "赠送中")
        .then((res) => {
          if (res.result !== 1) {
            Toast(res.msg);
          }
          this.initData();
          this.loading_completed = false;
          this.finished_completed = false;
          this.tabsShow = false;
          this.getIncomplete();
          this.closeGivePop();
          Toast('赠送成功');
        });
    },

    // 排序
    orderBy(name,state){
      // 排序方式:0-购买时间降序,1-购买时间升序,2-到期时间降序,3-到期时间升序
      if(name == '购买时间'){
        this.orderbyList[0].state = state;
        this.orderbyList[1].state = '';
        if(state == 'rise'){
          this.orderby = '1';
        }else{
          this.orderby = '0';
        }
      }
      if(name == '到期时间'){
        this.orderbyList[1].state = state;
        this.orderbyList[0].state = '';
        if(state == 'rise'){
          this.orderby = '3';
        }else{
          this.orderby = '2';
        }
      }
      this.initData();
      this.getIncomplete();
    }
  },
  components: { DList, DConnectCustomerService, serviceCard, cTitle }
};
