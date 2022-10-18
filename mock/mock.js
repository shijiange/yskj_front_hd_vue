// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;

let banner_img = [];
for (let i = 0; i < 5; i++) {
  let list = {
    name: Random.cname(),
    id: Random.integer(1, 20),
    imgurl: Random.dataImage('338x140'),
  };
  banner_img.push(list);
}
let data1 = {
  banner_img: banner_img,
  notice: Random.csentence(5, 30),
  property_total: Random.float(2, 100, 0, 2),
  profit_total: Random.float(2, 100, 0, 2),
  deal_quantity: Random.integer(1, 20),
  sell_quantity: Random.integer(1, 20),
  'isClassify|1': ["0", "1"],
};

Mock.mock('asset-details-home-page', 'post', {
  result: 1,
  msg: "成功",
  data: data1,
});

let classify_img = [];
for (let i = 0; i < 10; i++) {
  let list = {
    title: Random.cname(),
    id: Random.integer(1, 20),
    img: Random.dataImage('40x40'),
  };
  classify_img.push(list);
}

Mock.mock('classify-home', 'post', {
  result: 1,
  msg: "成功",
  data: classify_img,
});

let list = [];
for (let i = 0; i < 10; i++) {
  let item = {
    id: Random.integer(1, 10),
    property_name: Random.cname(),
    imgUrl: Random.dataImage('96x96'),
    "issue": Random.float(2, 100, 0, 2),
    "total": Random.float(2, 100, 0, 2),
    'feature': ['核心商圈位置', '高大上'],
  };
  list.push(item);
}
let data2 = {
  last_page: Random.integer(1, 5),
  data: list
};

Mock.mock('asset-details-home-list', 'post', {
  result: 1,
  msg: "成功",
  data: data2,
});


let list1 = [];
for (let i = 0; i < 15; i++) {
  let item = {
    id: Random.integer(1, 20),
    "property_name": Random.cname(),
    "quantity": Random.float(2, 100, 0, 2),
    "price": Random.float(2, 100, 0, 2),
  };
  list1.push(item);
}
let data3 = {
  last_page: Random.integer(1, 5),
  data: list1
};

Mock.mock('asset-list', 'post', {
  result: 1,
  msg: "成功",
  data: data3,
});

let list2 = [];
for (let i = 0; i < 15; i++) {
  let item = {
    id: Random.integer(1, 20),
    "author": Random.cname(),
    "notice_title": Random.csentence(5, 30),
    "date": Random.date('yyyyMMdd'),
  };
  list2.push(item);
}
let data4 = {
  last_page: Random.integer(1, 5),
  "notice": list2
};

Mock.mock('notices-list', 'post', {
  result: 1,
  msg: "成功",
  data: data4,
});

//
let item = {
  company: {
    "product": Random.ctitle(2, 4),
    "company_name": Random.cname(),
    "company_address": Random.city()
  },
  basic_info: {
    "category": Random.ctitle(2, 4),
    "label": Random.ctitle(2, 4),
    "company_name": Random.cname(),
    "company_address": Random.city(),
    "create_time": Random.date('yyyy-MM-dd'),
    "company_type": Random.ctitle(2, 4),
    "capital": Random.natural(1, 100),
    "representative": Random.cname(),
    "deadline": Random.date('yyyy-MM-dd'),
    "business_scope": Random.csentence(5, 10)
  },
  asset_attributes: {
    "building_type": Random.cname(),
    "periodic": Random.natural(1, 100),
    "decoration_standard": Random.cname(),
  },
  "asset_details": Random.cparagraph(20, 30)
}
Mock.mock('introduce-list', 'post', {
  result: 1,
  msg: "成功",
  data: item,
});
let arr1 = [];
for (let i = 0; i < 20; i++) {
  let item = {
    id: Random.integer(1, 20),
    "report_name": Random.ctitle(2, 4),
    "report_time": Random.date('yyyy-MM-dd'),
    "organization": Random.ctitle(2, 4),
    "market_value": Random.float(2, 1000, 0, 3)
  }
  arr1.push(item)
}
let details = {
  "desc": Random.csentence(10, 20),
  "price": Random.float(2, 1000, 0, 3),
  last_page: Random.integer(1, 5),
  "subcompany": arr1
};
Mock.mock('assess-list', 'post', {
  result: 1,
  msg: "成功",
  data: details,
});
let arr2 = [];
for (let i = 0; i < 20; i++) {
  let item = {
    id: Random.integer(1, 20),
    "total_momery": Random.float(900, 1000, 0, 7),
    "single_property": Random.float(800, 1000, 0, 7),
    "usable_total": Random.float(2, 1000, 0, 3),
    "profit_time": Random.datetime("yyyy-MM-dd A HH:mm:ss")
  }
  arr2.push(item)
}
let profit = {
  "profits": {
    "property_total": Random.float(2, 1000, 0, 3),
    "accumulative_time": Random.integer(50, 100),
    "accumulative_people": Random.integer(50, 100),
    "accumulative_top_momery": Random.float(2, 1000, 0, 3),
    "init_accumlative_momery": Random.float(2, 1000, 0, 3)
  },
  "last_page": Random.integer(1, 5),
  "profit_record": arr2
}
Mock.mock('profit-list', 'post', {
  result: 1,
  msg: "成功",
  data: profit,
});
// mock一组数据
// let lists = [];
// for (let i = 0; i < 3; i++) {
let has_many_sell = [];
// for (let i = 0; i < 2; i++) {
let newList = {
  amount: Random.integer(1, 20),
  // order_sn: Random.word() + Random.integer(60, 100),
  coin: Random.float(2, 50, 0, 2),
  checked: false,
  code: "love",
  'name': "爱心值",
};
let newList1 = {
  amount: Random.integer(1, 20),
  // order_sn: Random.word() + Random.integer(60, 100),
  coin: Random.float(2, 50, 0, 2),
  checked: true,
  code: "point",
  'name': "积分",
};
has_many_sell.push(newList);
has_many_sell.push(newList1);
// }
let newListObject = {
  // create_month: Random.date('yyyy-MM'),
  subscribe_name: '芸众科技',
  "subscribe_quantity": Random.float(2, 50, 0, 2),
  "subscribe_money": Random.float(2, 50, 0, 2),
  "available": Random.float(2, 5000, 0, 2),
  "freezeing": Random.float(2, 5000, 0, 2),
  "service_charge": Random.float(2, 50, 0, 2),
  order_deductions: has_many_sell,
  //  Random.csentence( min, max ) 中文5-30个字
  // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
  // Random.cname() 随机生成一个常见的中文姓名
  // date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
};
//   lists.push(newListObject)
// }

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('buying', 'post', {
  result: 1,
  msg: "成功",
  data: newListObject,
});

let data0 = {
  "blockchain_address": '0xd73d7c35a504c34b80696cd6e3671cfff860d8ee',
  transfer_num: Random.float(2, 5000, 0, 2),
  "isPassword|1": [true, false],
};

Mock.mock('sure-buying', 'post', {
  result: 1,
  msg: "成功",
  data: data0,
});


let asset1 = {
  property_name: Random.cname(),
  use: Random.float(2, 500, 0, 2),
  property: Random.float(2, 500, 0, 2),
  profit_total_price: Random.float(2, 500, 0, 2),
  unused_profit: Random.float(2, 500, 0, 2),
  // 'status_name|1': ["已发放", "未发放"],
  // created_at: Random.date() + ' ' + Random.time(),
};

Mock.mock('asset1', 'post', {
  result: 1,
  msg: "成功",
  data: asset1,
});

let asset2 = {
  acquire_use_total: Random.float(2, 500, 0, 2),
  acquire_disabled_total: Random.float(2, 500, 0, 2),
  distribution_price: Random.float(2, 500, 0, 2),
  disabled_active: Random.float(2, 500, 0, 2),
  subscribe_price: Random.float(2, 500, 0, 2),
  buy_price: Random.float(2, 500, 0, 2),
  consumer_incentives: Random.float(2, 500, 0, 2),
  performance_rewards: Random.float(2, 500, 0, 2),
  move_in_price: Random.float(2, 500, 0, 2),
  shark_link: Random.float(2, 500, 0, 2),
};

Mock.mock('asset2', 'post', {
  result: 1,
  msg: "成功",
  data: asset2,
});

let asset3 = {
  deduct_price: Random.float(2, 500, 0, 2),
  sell_price: Random.float(2, 500, 0, 2),
  move_sell_price: Random.float(2, 500, 0, 2),
};

Mock.mock('asset3', 'post', {
  result: 1,
  msg: "成功",
  data: asset3,
});

let list3 = [];
for (let i = 0; i < 10; i++) {
  let item = {
    id: Random.integer(1, 10),
    property_name: Random.cname(),
    total: Random.float(2, 10000, 0, 2),
    gross: Random.float(2, 10000, 0, 2),
    usable: Random.float(2, 10000, 0, 2),
    property_price: Random.float(2, 10000, 0, 2),
    profit_date: Random.date() + ' ' + Random.time(),
  };
  list3.push(item);
}
let data6 = {
  "property_profit_total": Random.float(2, 10000, 0, 2),
  "own_profit_total": Random.float(2, 10000, 0, 2),
  last_page: Random.integer(1, 5),
  data: list3
};

Mock.mock('record-profit', 'post', {
  result: 1,
  msg: "成功",
  data: data6,
});

let list4 = [];
for (let i = 0; i < 10; i++) {
  let item = {
    id: Random.integer(1, 5000),
    property_name: Random.cname(),
    subscribe_order_munber: '3671cfff86',
    subscribe_monery: Random.float(2, 10000, 0, 2),
    subscribe_price: Random.float(2, 10000, 0, 2),
    sell_monery: Random.float(2, 10000, 0, 2),
    sell_price: Random.float(2, 10000, 0, 2),
    'sell_status|1': ['出售中', '已出售', '已撤回'],
    'trans_status|1': ['转入', '转出'],
    'status|1': ['买入', '售出'],
    'cost_status|1': ['可用', '冻结'],
    'cost_name|1': ['全部', '后台配发', '认购', '转让-转出', '转让-转入', '冻结激活', '出售', '奖励', '购买'],
    subscribe_date: Random.date() + ' ' + Random.time(),
  };
  list4.push(item);
}
let data7 = {
  last_page: Random.integer(1, 5),
  data: list4
};

Mock.mock('record-buying', 'post', {
  result: 1,
  msg: "成功",
  data: data7,
});

let data = {
  asset_name: Random.cname(),
  "subscribe_total": Random.float(2, 10000, 0, 2),
  "sell_total": Random.float(2, 10000, 0, 2),
};

Mock.mock('classify-profit', 'post', {
  result: 1,
  msg: "成功",
  data: data,
});

let detail = {
  subscribe_name: Random.cname(),
  subscribe_munber: Random.float(2, 10000, 0, 2),
  subscribe_price: Random.float(2, 10000, 0, 2),
  subscribe_total_monery: Random.float(2, 10000, 0, 2),
  love_pledge: Random.float(2, 10000, 0, 2),
  integral_pledge: Random.float(2, 10000, 0, 2),
  payment_monery: Random.float(2, 10000, 0, 2),
  subscribe_order_munber: 'SK20181122NK',
  'sell_status|1': ['出售中'],
  // 'sell_status|1': ['出售中', '已出售', '已撤回'],
};

Mock.mock('detail', 'post', {
  result: 1,
  msg: "成功",
  data: detail,
});

let worker_orderlist_datalist = [];
for (let i = 0; i < 20; i++) {
  let item = {
    id: i + 1,
    order_sn: `sn37994595843_${i}`,
    status: 1,
    reserve_time: '2020-08-14',
    person: '吃烧烤',
    phone: '15603091690',
    adress: '广东省顺德xxxxxx',
    total: '3',
    money: '20.00',
    button_models: [
      {
        api: "xxx.xxxxxxx",
        name: "完成",
        value: 1
      }
    ]
  };
  worker_orderlist_datalist.push(item);
}
let worker_orderlist = {
  total: 0,
  per_page: 20,
  current_page: 1,
  last_page: 2,
  data: worker_orderlist_datalist
}
Mock.mock('install_service/worker_orderlist', 'get', {
  result: 1,
  msg: "成功",
  data: worker_orderlist,
});

let worker_orderDetail = {
  id: 1,
  order_sn: 'sn37994595843',
  status: 1,
  total: '3',
  person: '吃烧烤',
  phone: '131323232',
  reserve_time: '2020-08-14',
  adress: '广东省顺德xxxxxx',
  money: '20.00',
  remark: '这是备注信息。。。。',
  sendOrder_time: '2020-05-01 14:45:44',
  install_time: null,
  finish_time: null,
  has_many_order_goods: [
    {
      goods_id: 454,
      title: '标题',
      image: 'https://dev3.yunzmall.com/addons/yun_shop/plugins/designer/assets/images/init-data/init-icon.png',
      total: 2,
    }
  ],
  button_models: [
    {
      api: "xxx.xxxxxxx",
      name: "完成",
      value: 1
    }
  ]
}
Mock.mock('install_service/worker_orderDetail', 'get', {
  result: 1,
  msg: "成功",
  data: worker_orderDetail,
});

let user_orderlist = {
  total: 20,
  per_page: 20,
  current_page: 1,
  last_page: 2,
  data: [
    {
      id: 1,
      order_sn: 'sn37994595843',
      status: 1,
      reserve_time: '2020-08-14',
      has_many_order_goods: [{
        goods_id: 454,
        title: '标题',
        image: 'https://dev3.yunzmall.com/addons/yun_shop/plugins/designer/assets/images/init-data/init-icon.png',
        total: 2,
      }],
      button_models: [
        {
          api: "xxx.xxxxxxx",
          name: "完成",
          value: 1
        }
      ]
    },
    {
      id: 1,
      order_sn: 'sn3799459584sass',
      status: 0,
      reserve_time: '',
      has_many_order_goods: [{
        goods_id: 454,
        title: '标题',
        image: 'https://dev3.yunzmall.com/addons/yun_shop/plugins/designer/assets/images/init-data/init-icon.png',
        total: 2,
      }],
      button_models: [
        {
          api: "xxx.xxxxxxx",
          name: "预约安装",
          value: 0
        }
      ]
    }
  ]
}
Mock.mock('install_service/user_orderlist', 'get', {
  result: 1,
  msg: "成功",
  data: user_orderlist,
});

let user_orderDetail_1 = {
  order_sn: 'sn37994595843',
  status: 1,
  schedule_status: 1,
  time: '2020-10-25 10:55:44',
  remark: '上门安装前请联系以便确认是否在家 麻烦进门的时候脚步放轻',
  has_many_order_goods: [
    {
      goods_id: 454,
      title: '标题',
      image: 'https://dev3.yunzmall.com/addons/yun_shop/plugins/designer/assets/images/init-data/init-icon.png',
      total: 2
    }
  ],
  button_models: [
    {
      api: "xxx.xxxxxxx",
      name: "完成",
      value: 1
    }
  ],
  schedule: {
    appointment_time: '2020-50-50 41:44:44',
    sendOrder_time: '2020-05-01 14:45:44',
    install_time: '2020-05-01 14:45:44',
    finish_time: '2020-05-01 14:45:44',
    worker_info: {
      name: '成师傅',
      phone: '1234456666'
    }
  }
}

let user_orderDetail_2 = {
  order_sn: 'sn37994595843',
  status: 0,
  schedule_status: 0,
  time: null,
  remark: null,
  has_many_order_goods: [
    {
      goods_id: 454,
      title: '标题',
      image: 'https://dev3.yunzmall.com/addons/yun_shop/plugins/designer/assets/images/init-data/init-icon.png',
      total: 2
    }
  ],
  button_models: [
    {
      api: "xxx.xxxxxxx",
      name: "完成",
      value: 1
    }
  ],
  schedule: {}
}

Mock.mock('install_service/user_orderDetail', 'get', {
  result: 1,
  msg: "成功",
  data: user_orderDetail_2,
});


let install_income = {
  nickname: '沙发垫',
  avatar: 'https://dev3.yunzmall.com/addons/yun_shop/plugins/designer/assets/images/init-data/init-icon.png',
  grand_total: '150.00',
  unsettlement_total: '3.55',
  settlement_total: '50.00',
  Identity: 1
}

Mock.mock('install_service/install_income', 'get', {
  result: 1,
  msg: "成功",
  data: install_income,
});

let install_income_list_1 = [];
for (let i = 0; i < 20; i++) {
  let item = {
    id: 1,
    order_sn: 'sn37994595843',
    total: '250.00',
    time: '2020-08-14 14:54:44',
    status: 1
  };
  install_income_list_1.push(item);
}
let install_income_list = {
  total: 20,
  per_page: 20,
  current_page: 1,
  last_page: 2,
  data: install_income_list_1
}

Mock.mock('install_service/install_income_list', 'get', {
  result: 1,
  msg: "成功",
  data: install_income_list,
});


Mock.setup({
  timeout: '200-600'
})
