import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin"; //引入加载更多
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      active:0,
      address: "",
      city:"",
      point:"",
      title:'',
      worker_id:'',
      worker:'',
      store:'',
      projects:'',
      // more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      titleInfo: '', // 标题
      commentList:[],
      pullDownBtnShow:true
    };
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
  activated() {
    if(this.$route.params.worker_id){
      this.worker_id = this.$route.params.worker_id;
    }
    this.ready();
    let that = this;
    setTimeout(() => {
      window.scrollTo(0, 0);
      that.display = false;
    }, 20);
  },
  methods: {
    goProject(id){
      this.$router.push(this.fun.getUrl("ProjectDetails", { project_id: id }));
    },
    pullDownBtn(){
      this.pullDownBtnShow = !this.pullDownBtnShow;
    },
    toUrl(str, params) {
      this.$router.push(this.fun.getUrl(str,params));
    },
    tabDataBtn(e){
      if( e==2 && this.commentList==0){
        this.getComment();
      }
    },
    //获取更多数据
    getMoreData() {
      if(this.active != 2) {
        return;
      }
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.appointment.frontend.comment.get-comment-by-worker-id",
            {
              worker_id:this.worker_id,
              page:this.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.commentList = that.commentList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    getComment(){
      $http
        .get(
          "plugin.appointment.frontend.comment.get-comment-by-worker-id",
          {
            worker_id:this.worker_id,
            page:this.page
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.commentList =  response.data.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getData() {
      $http
        .get(
          "plugin.appointment.frontend.worker.get-detail-by-id",
          {
            lng:this.point.lng,
            lat:this.point.lat,
            worker_id:this.worker_id
          },
          "获取中"
        )
        .then(response => {
          this.fun.setWXTitle(this.appointmentLang.worker+"详情");
          if (response.result === 1) {
            this.worker = response.data.worker;
            this.store = response.data.store;
            this.projects = response.data.projects;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    ready() {
      // let myLocation = this.$store.state.o2oLocation;
      this.initData();
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   //初始化数据
      //   this.getData();
      // } else {
      //   console.log("location不存在");
      //   this.getLocation();
      // }
      this.fun.getLocation()
        .then((res)=> {
          this.point = res.point;
          this.address = res.title;
          this.city = res.city;
          this.getData();
        })
        .catch((err)=> {
          console.log(err);
        });
    },
    initData() {
      this.active = 0;
      this.isLoadMore= true;
      this.page= 1;
      this.total_page= 0;
      this.titleInfo= '';
      this.commentList=[];
      this.pullDownBtnShow=true;
    },
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
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        that.getData();
      }
      function onError(obj) {
        console.log(obj);
        Toast("定位失败");
      }
    },
    toRouter(id) {
      this.$router.push(this.fun.getUrl("HomeSeller", { store_id: id, fromHome: 1 }));
    },
  },
  components: { cTitle }
};
