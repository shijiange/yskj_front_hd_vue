import { Toast } from 'vant';
import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show:false,
      search_value:'',
      sort:{
        select:"",
        tab:""
      },
      order_field:'',
      order_by:'',
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      minDate_2: new Date(),
      maxDate_2: new Date(2025, 10, 1),
      currentDate_2: new Date(),
      typeBol:true,
      typeList:[{
        id:1,
        name:"快捷商务",
      },{
        id:2,
        name:"连锁酒店",
      },{
        id:3,
        name:"精品民宿",
      },{
        id:4,
        name:"精品公寓",
      },{
        id:5,
        name:"精品酒店",
      },{
        id:6,
        name:"星级酒店",
      }],
      selIndex:99999999999,
      selid:'',
      //定位
      location: {},
      hotelList:[],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  computed: {

  },
  created() {

  },
  activated() {
    this.initData();
    this.initpageData();
    // this.location = this.$store.state.o2oLocation;
    // this.location = {
    //   city: "上海市",
    //   province: "上海市",
    //   point: {
    //     lat:'31.301071',
    //     lng:"121.487673"
    //   }
    // }
    // if (this.fun.isTextEmpty(this.location.point)) {
    //   this.getLocation();
    // } else {
    //   this.gotoSearch();
    // }

    this.fun.getLocation()
      .then((res)=> {
        this.location = res;
        this.gotoSearch();
      })
      .catch((err)=> {
        console.log(err);
      });
  },
  mounted() {

  },
  methods: {
    getLocation() {
      var that = this;
      // var myLocation = this.$store.state.o2oLocation;
      console.log("route.name", this.$route);

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
        console.log("objjjjj", obj);
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
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        let point = {
          lat: position[1],
          lng: position[0]
        };
        // let address = obj.formattedAddress;
        // let title = obj.formattedAddress;
        let city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province;
        let province = obj.addressComponent.province?obj.addressComponent.province:'';
        var pos = {
          address: obj.formattedAddress,
          city: city,
          title: obj.formattedAddress,
          province:province,
          point: point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        that.location = pos;
        that.gotoSearch();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    },
    typeSelectBtn(){
      this.typeBol = !this.typeBol;
    },
    selBtn(id,index){
      if(this.selIndex===index){
        this.selIndex=99999999;
        this.selid = '';
      }else{
        this.selIndex = index;
        this.selid = id;
      }
      this.typeBol=  true;
      this.initpageData();
      this.gotoSearch();
    },
    selectBtn(n) {
      this.typeBol = true;
      this.sort.tab = n;
      let order_field = '';
      if (n == 1) order_field = 'comment_num';
      if (n == 2) order_field = 'show_sales';
      if (n == 3) order_field = 'distance';
      if (this.sort.select == (n+'_2')) {
        this.sort.select = (n+'_1');
        this.order_field = order_field;
        this.order_by = 'desc';
      } else {
        this.sort.select = (n+'_2');
        this.order_field = order_field;
        this.order_by = 'asc';
      }
      this.initpageData();
      this.gotoSearch();
    },
    gotoSearchBtn(){
      this.initpageData();
      this.gotoSearch();
    },
    gotoSearch() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      let json = {
        lng: p.lng,
        lat: p.lat,
        search:{
          city: this.location.city,
          province:this.location.province,
          name:this.search_value,
          level:this.selid,
          sort:this.order_by
        },
        page: this.page
      };
      $http
        .post("plugin.hotel-supply.frontend.home.index", json)
        .then(res => {
          if (res.result == 1) {
            this.isLoadMore = true;
            this.total_page = res.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.hotelList = res.data.data;
            console.log(this.hotelList);
          }else{
            this.hotelList = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
        let json = {
          lng: p.lng,
          lat: p.lat,
          search:{
            city: this.location.city,
            province:this.location.province,
            name:this.search_value,
            level:this.selid,
            sort:this.order_by
          },
          page: this.page
        };
        $http
          .post("plugin.hotel-supply.frontend.home.index", json)
          .then(res => {
            if (res.result == 1) {
              that.isLoadMore = true;
              if (res.result === 1) {
                var myData = res.data.data;
                that.hotelList = that.hotelList.concat(myData);//数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    initpageData() {
      this.hotelList = [];
      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    initData(){
      this.show=false;
      this.search_value='';
      this.sort = {
        select:"",
        tab:""
      };
      this.order_field = '';
      this.order_by='';

      this.minDate= new Date();
      this.maxDate =  new Date(2025, 10, 1);
      this.currentDate =  new Date();
      this.minDate_2 = new Date();
      this.maxDate_2 = new Date(2025, 10, 1);
      this.currentDate_2= new Date();
      this.typeBol=true;
      this.typeList=[{
        id:1,
        name:"快捷商务",
      },{
        id:2,
        name:"连锁酒店",
      },{
        id:3,
        name:"精品民宿",
      },{
        id:4,
        name:"精品公寓",
      },{
        id:5,
        name:"精品酒店",
      },{
        id:6,
        name:"星级酒店",
      }];
      this.selIndex=99999999999;
      this.selid='';
      //定位
      this.location= {};
      this.hotelList=[];
      this.page= 1; //分页数，当前页数
      this.isLoadMore=true; //判断是否要加载更多的标志
      this.total_page= 0; //总页数
    },
    hotelBtn(id){
      this.$router.push(this.fun.getUrl('HotelSupplyHome',{id:id}));
    }
  },
  components: { cTitle }
};


