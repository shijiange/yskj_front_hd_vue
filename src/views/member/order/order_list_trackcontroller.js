import cTitle from 'components/title';
import AMap from "AMap";
var map, marker;
var num = [];
// var numIndex = 0;

// var lineArr;
export default {
  data() {
    
    return {
      center: { lng: 0, lat: 0 },
      num: num,
      marker: null,
      toi: this.fun.getKeyByI(),
      value: '',
      // express_info: [],
      // company_name: '',
      // express_sn: '',
      amap_coordinate: [], //轨迹数组
      thumb: '', //商品头像
      phone: '', //司机电话
      driver_name: '', //司机名称
      status_name: '', //物流状态
      amap_status: 0, //轨迹是否为空
      speed:0,//速度
      // map: '',
      // self: '',
      // marker: '',
      // num: [],
      // numIndex: '',
      // lineArr: [],

    };
  },
  methods: {
    init() {
      this.amap_coordinate = [];
      this.phone = '';
      this.status_name = '';
      this.thumb = '';
      this.driver_name = '';
      this.amap_status = 0;
    },
    getExpress() {
      var that = this;
      $http.get('plugin.delivery-driver.home.delivery-info.index', {
        // order_id: this.$route.params.order.id,
        order_id: this.$route.params.id,

      }, '正在获取快递信息...').then(function (response) {

        if (response.result === 1) {
          var myData = response.data;
          that.amap_coordinate = myData.amap_coordinate;
          that.phone = myData.phone;
          that.status_name = myData.give_status;
          that.thumb = myData.thumb;
          that.driver_name = myData.driver_name;
          that.amap_status = myData.amap_status;
          if(that.amap_coordinate.length>0) {
            that.setMap();
          }
        } else {
          that.$dialog.alert({message:response.msg});
          
        }
      }, function (response) {
        // error callback
      });

    },
    setMap: function (p) {
      
      let that = this;
      console.log(that.amap_coordinate);
      map = new AMap.Map("container", {
        resizeEnable: true,
        center: that.amap_coordinate[0],
        zoom: 17
      });
      // var icon = new AMap.Icon({
      //   image: "http://vdata.amap.com/icons/b18/1/2.png",
      //   size: new AMap.Size(24, 24)
      // });
      marker = new AMap.Marker({
        map: map,
        position: that.amap_coordinate[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
      });
      map.add(marker);
      // var text = new AMap.Text({
      //   text: '纯文本标记',
      //   anchor: 'center', // 设置文本标记锚点
      //   draggable: true,
      //   cursor: 'pointer',
      //   angle: 0,
      //   style: {
      //     'padding': '.25rem .25rem',
      //     'margin-bottom': '.1rem',
      //     'background-color': 'white',
      //     'border-width': 0,
      //     'text-align': 'center',
      //     'font-size': '12px',
      //     'color': 'blue'
      //   },
      //   position: [116.478935, 39.997761]
      // });

      // text.setMap(map);
      AMap.plugin(
        ["AMap.Geolocation", "AMap.PlaceSearch", "AMap.ToolBar"],
        function () {
          map.addControl(new AMap.ToolBar());
        }
      );

      // 绘制轨迹
      // var polyline = new AMap.Polyline({
      //   map: map,
      //   path: that.amap_coordinate,
      //   showDir: true,
      //   strokeColor: "#28F", //线颜色
      //   // strokeOpacity: 1,     //线透明度
      //   strokeWeight: 6, //线宽
      //   // strokeStyle: "solid"  //线样式
      // });

      var passedPolyline = new AMap.Polyline({
        map: map,
        path: that.amap_coordinate,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });


      marker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
      });

      map.setFitView();
      let long1 = Math.round(AMap.GeometryUtil.distanceOfLine(that.amap_coordinate));//获得总路径长度
      this.speed = long1/1000*1200;//3秒走完
      console.log(long1);
      this.marker = marker;
      this.startAnimation();

    },
    
    startAnimation () {
      this.marker.moveAlong(this.amap_coordinate, this.speed);
    },

  },
  activated() {
    this.init();
    this.toi = this.fun.getKeyByI();
    this.getExpress();
    // this.setMap();
  },
  components: {
    cTitle
  }
};