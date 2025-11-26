// 性别代码表
export const sexList = [
  { value: '1', label: '男' },
  { value: '2', label: '女' },
]

// 持卡人证件类型代码表
export const cardType = [
  { value: '1', label: '居民身份证' },
  // { value: '5', label: '港澳台居民往来内地通行证' },
  // { value: '6', label: '外国公民所持证件/护照' },
  // { value: '18', label: '港澳台居民居住证' },
  // { value: '07', label: '外国人永久居留身份证' },
  { value: '8', label: '户口簿' },
  // { value: '19', label: '台湾居民居住证' },
]

export const regionList2 = [{ value: 'CHN', label: '中国' }]

// 国家/地区
export const regionList = [
  { value: 'CHN', label: '中国' },
  // { value: 'TWN', label: '中国台湾' },
  // { value: 'HKG', label: '中国香港' },
  // { value: 'MAC', label: '中国澳门' },
  // { value: 'PRK', label: '朝鲜' },
  // { value: 'KOR', label: '韩国' },
  // { value: 'ITA', label: '意大利' },
  // { value: 'GBR', label: '英国' },
  // { value: 'JAM', label: '牙买加' },
  // { value: 'USA', label: '美国' },
  // { value: 'JPN', label: '日本' },
  // { value: 'FIN', label: '芬兰' },
  // { value: 'FRA', label: '法国' },
  // { value: 'SGP', label: '新加坡' },
  // { value: 'AFG', label: '阿富汗' },
  // { value: 'MNG', label: '蒙古' },
  // { value: 'LBY', label: '利比亚' },
  // { value: 'DZA', label: '阿尔及尔' },
  // { value: 'LTU', label: '立陶宛' },
  // { value: 'ARG', label: '阿根廷' },
  // { value: 'MYS', label: '马来西亚' },
  // { value: 'ARM', label: '亚美尼亚' },
  // { value: 'MDV', label: '马尔代夫' },
  // { value: 'ABW', label: '阿鲁巴岛' },
  // { value: 'MLI', label: '马里' },
  // { value: 'AUS', label: '澳大利亚' },
  // { value: 'MLT', label: '马耳他' },
  // { value: 'AUT', label: '奥地利' },
  // { value: 'MHL', label: '马绍尔群岛' },
  // { value: 'AZE', label: '阿塞拜疆' },
  // { value: 'MTQ', label: '马提尼克岛' },
  // { value: 'BHS', label: '巴哈马群岛' },
  // { value: 'MRT', label: '毛利塔尼亚' },
  // { value: 'BHR', label: '巴林群岛' },
  // { value: 'MUS', label: '毛里求斯' },
  // { value: 'BGD', label: '孟加拉国' },
  // { value: 'MYT', label: '马约特岛' },
  // { value: 'BRB', label: '巴巴多斯岛' },
  // { value: 'MEX', label: '墨西哥' },
  // { value: 'BLR', label: '白俄罗斯' },
  // { value: 'FSM', label: '密克罗尼西亚' },
  // { value: 'BEL', label: '比利时' },
  // { value: 'BTN', label: '不丹' },
  // { value: 'MAR', label: '摩洛哥' },
  // { value: 'MMR', label: '缅甸' },
  // { value: 'BRA', label: '巴西' },
  // { value: 'IOT', label: '英属印度洋领地' },
  // { value: 'NPL', label: '尼泊尔' },
  // { value: 'BRN', label: '文莱' },
  // { value: 'NLD', label: '荷兰' },
  // { value: 'BGR', label: '保加利亚' },
  // { value: 'NZL', label: '新西兰' },
  // { value: 'KHM', label: '柬埔寨' },
  // { value: 'NIC', label: '尼加拉瓜' },
  // { value: 'CAN', label: '加拿大' },
  // { value: 'NGA', label: '尼日利亚' },
  // { value: 'CAF', label: '中非共和国' },
  // { value: 'MNP', label: '北马里亚纳群岛自由联邦' },
  // { value: 'SEN', label: '塞内加尔' },
  // { value: 'GMB', label: '冈比亚' },
  // { value: 'SOM', label: '索马里' },
  // { value: 'ZAF', label: '南非' },
  // { value: 'DEU', label: '德国' },
  // { value: 'ESP', label: '西班牙' },
  // { value: 'GRC', label: '希腊' },
  // { value: 'SDN', label: '苏丹' },
  // { value: 'GRL', label: '格陵兰' },
  // { value: 'SUR', label: '苏里南' },
  // { value: 'SWE', label: '瑞典' },
  // { value: 'GTM', label: '危地马拉' },
  // { value: 'CHE', label: '瑞士' },
  // { value: 'GGY', label: '格恩西岛' },
  // { value: 'SYR', label: '叙利亚' },
  // { value: 'GIN', label: '几内亚' },
  // { value: 'TWN', label: '中国台湾' },
  // { value: 'GNB', label: '几内亚比绍' },
  // { value: 'TJK', label: '塔吉克斯坦' },
  // { value: 'GUY', label: '圭亚那' },
  // { value: 'TZA', label: '坦桑尼亚' },
  // { value: 'HTI', label: '海地' },
  // { value: 'THA', label: '泰国' },
  // { value: 'HMD', label: '赫德和麦克唐纳群岛' },
  // { value: 'TLS', label: '东帝汶' },
  // { value: 'VAT', label: '梵蒂冈' },
  // { value: 'TGO', label: '多哥' },
  // { value: 'HND', label: '洪都拉斯' },
  // { value: 'TKL', label: '托克劳群岛' },
  // { value: 'TON', label: '汤加' },
  // { value: 'HUN', label: '匈牙利' },
  // { value: 'TTO', label: '特立尼达和多巴哥' },
  // { value: 'ISL', label: '冰岛' },
  // { value: 'TUN', label: '突尼斯' },
  // { value: 'IND', label: '印度' },
  // { value: 'TUR', label: '土耳其' },
  // { value: 'IDN', label: '印度尼西亚' },
  // { value: 'TKM', label: '土库曼斯坦' },
  // { value: 'IRN', label: '伊朗' },
  // { value: 'TCA', label: '特克斯和凯科斯群岛' },
  // { value: 'IRQ', label: '伊拉克' },
  // { value: 'TUV', label: '图瓦卢' },
  // { value: 'IRL', label: '爱尔兰' },
  // { value: 'UGA', label: '乌干达' },
  // { value: 'IMN', label: '曼恩岛' },
  // { value: 'UKR', label: '乌克兰' },
  // { value: 'ISR', label: '以色列' },
  // { value: 'ARE', label: '阿拉伯联合酋长国' },
  // { value: 'UMI', label: '美属萨摩亚' },
  // { value: 'JEY', label: '泽西岛' },
  // { value: 'URY', label: '乌拉圭' },
  // { value: 'POL', label: '波兰' },
  // { value: 'DNK', label: '丹麦' },
  // { value: 'ROU', label: '罗马尼亚' },
  // { value: 'DJI', label: '吉布提' },
  // { value: 'RUS', label: '俄国' },
  // { value: 'SHN', label: '圣赫勒拿岛' },
  // { value: 'ECU', label: '厄瓜多尔' },
  // { value: 'EGY', label: '埃及' },
  // { value: 'EST', label: '爱沙尼亚' },
  // { value: 'SMR', label: '圣马力诺' },
  // { value: 'ETH', label: '埃塞俄比亚' },
  // { value: 'LAO', label: '老挝' },
  // { value: 'YEM', label: '也门' },
  // { value: 'ZMB', label: '赞比亚' },
  // { value: 'LBN', label: '黎巴嫩' },
  // { value: 'COD', label: '刚果（金）' },
  // { value: 'PER', label: '秘鲁' },
  // { value: 'PHL', label: '菲律宾' },
  // { value: 'KWT', label: '科威特' },
  // { value: 'PSE', label: '巴勒斯坦' },
  // { value: 'COL', label: '哥伦比亚' },
  // { value: 'PAN', label: '巴拿马' },
  // { value: 'COG', label: '刚果' },
  // { value: 'JOR', label: '约旦' },
  // { value: 'UZB', label: '乌兹别克斯坦' },
  // { value: 'KAZ', label: '哈萨克斯坦' },
  // { value: 'KEN', label: '肯尼亚' },
  // { value: 'VEN', label: '委内瑞拉' },
  // { value: 'VNM', label: '越南' },
  // { value: 'NOR', label: '挪威' },
  // { value: 'CHL', label: '智利' },
  // { value: 'OMN', label: '阿曼' },
  // { value: 'PAK', label: '巴基斯坦' },
]

// 社会保障卡应用状态
export const socialSecurity = [
  { value: '0', label: '封存' },
  { value: '1', label: '正常' },
  { value: '2', label: '正式挂失' },
  { value: '3', label: '应用锁定' },
  { value: '4', label: '临时挂失' },
  { value: '9', label: '注销' },
]

// 雄安发卡银行代码
export const bankCodeList = [
  { value: '102', label: '工商银行' },
  { value: '103', label: '农业银行' },
  { value: '104', label: '中国银行' },
  { value: '105', label: '建设银行' },
  { value: '301', label: '交通银行' },
  { value: '302', label: '中信银行' },
  { value: '303', label: '光大银行' },
  { value: '402', label: '河北省农信社' },
]

// 职业
export const occupationList = [
  { value: '10000', label: '国家机关、党群组织、企业、事业单位负责人' },
  { value: '20000', label: '专业技术人员' },
  { value: '30000', label: '办事人员和有关人员' },
  { value: '40000', label: '社会生产服务和生活服务人员' },
  { value: '50000', label: '农、林、牧、渔业生产及辅助人员' },
  { value: '60000', label: '生产、运输设备操作人员及有关人员' },
  { value: '70000', label: '军人' },
  { value: '80000', label: '无职业/自由职业者/学生等其他类人员' },
]

// 民族代码表export const
export const ethniCodeList = [
  { value: '01', label: '汉族' },
  { value: '02', label: '蒙古族' },
  { value: '03', label: '回族' },
  { value: '04', label: '藏族' },
  { value: '05', label: '维吾尔族' },
  { value: '06', label: '苗族' },
  { value: '07', label: '彝族' },
  { value: '08', label: '壮族' },
  { value: '09', label: '布依族' },
  { value: '10', label: '朝鲜族' },
  { value: '11', label: '满族' },
  { value: '12', label: '侗族' },
  { value: '13', label: '瑶族' },
  { value: '14', label: '白族' },
  { value: '15', label: '土家族' },
  { value: '16', label: '哈尼族' },
  { value: '17', label: '哈萨克族' },
  { value: '18', label: '傣族' },
  { value: '19', label: '黎族' },
  { value: '20', label: '傈僳族' },
  { value: '21', label: '佤族' },
  { value: '22', label: '畲族' },
  { value: '23', label: '高山族' },
  { value: '24', label: '拉祜族' },
  { value: '25', label: '水族' },
  { value: '26', label: '东乡族' },
  { value: '27', label: '纳西族' },
  { value: '28', label: '景颇族' },
  { value: '29', label: '柯尔克孜族' },
  { value: '30', label: '土族' },
  { value: '31', label: '达斡尔族' },
  { value: '32', label: '仫佬族' },
  { value: '33', label: '羌族' },
  { value: '34', label: '布朗族' },
  { value: '35', label: '撒拉族' },
  { value: '37', label: '仡佬族' },
  { value: '38', label: '锡伯族' },
  { value: '39', label: '阿昌族' },
  { value: '40', label: '普米族' },
  { value: '41', label: '塔吉克族' },
  { value: '42', label: '怒族' },
  { value: '43', label: '乌孜别克族' },
  { value: '44', label: '俄罗斯族' },
  { value: '46', label: '德昂族' },
  { value: '47', label: '保安族' },
  { value: '48', label: '裕固族' },
  { value: '49', label: '京族' },
  { value: '50', label: '塔塔尔族' },
  { value: '51', label: '独龙族' },
  { value: '52', label: '鄂伦春族' },
  { value: '53', label: '赫哲族' },
  { value: '54', label: '门巴族' },
  { value: '55', label: '珞巴族' },
  { value: '56', label: '基诺族' },
  { value: 99, label: '其他' },
]

// 雄安发卡地区行政区划代码

export const areaCodeList = [
  { value: '130632', label: '安新县' },
  { value: '130629', label: '容城县' },
  { value: '130638', label: '雄县' },
  { value: '133199', label: '雄安新区本级' },
]

// 代办人与申请人关系
export const applicantList = [
  { value: '21', label: '父子' },
  { value: '22', label: '父女' },
  { value: '31', label: '母子' },
  { value: '32', label: '母女' },
]
// 代办人与申请人关系
export const applicantList3 = [
  { value: '21', label: '父子' },
  { value: '22', label: '父女' },
  { value: '31', label: '母子' },
  { value: '32', label: '母女' },
  { value: '0', label: '其他' },
]

// 待遇资格认证
export const applicantList2 = [
  { value: '1', label: '父母' },
  { value: '2', label: '配偶' },
  { value: '3', label: '子女' },
  { value: '4', label: '其他' },
]

// 办卡进度代码表
export const speedList = [
  { value: '1', label: '待审核' },
  { value: '2', label: '已审核,正在制卡' },
  { value: '3', label: '制卡完成(待激活)' },
  { value: '4', label: '个人已领卡(发卡激活)' },
]

// 数据状态

export const dataStatusList = [
  { value: '10', label: '未受理' },
  { value: '11', label: '已受理' },

  { value: '12', label: '已修改信息' },
  { value: '15', label: '补卡' },

  { value: '16', label: '换卡' },
  { value: '17', label: '换发' },

  { value: '21', label: '已生成制卡批次、待报银行' },
  { value: '22', label: '已报银行未回盘' },

  { value: '23', label: '银行回盘待报卡商' },
  { value: '24', label: '已报卡商待回盘' },

  { value: '25', label: '卡商已回盘、本地流转中' },
  { value: '26', label: '卡商已回盘、金融待加载' },

  { value: '27', label: '金融已加载、本地流转中' },
  { value: '30', label: '分行领卡' },

  { value: '31', label: '发卡网点领卡' },
  { value: '32', label: '个人已领卡' },

  { value: '33', label: '单位已领卡' },
  { value: '41', label: '已生成快速制卡网点批次' },

  { value: '42', label: '制卡数据已下载、设备制卡中' },
  { value: '45', label: '快速制卡完成、待领取' },

  { value: '80', label: '开户失败,信息待修改' },
  { value: '85', label: '制卡失败' },
]

// 是否邮寄
export const isMailList = [
  { value: '1', label: '网点邮寄' },
  { value: '0', label: '网点自取' },
]
//
export const isDbbs = [
  { value: '0', label: '否' },
  { value: '1', label: '是' },
]
// 补换卡原因
// export const reason = [
//   { value: '1', label: '卡损坏', type: ['2', '3'] },
//   { value: '2', label: '卡丢失', type: ['1'] },
//   { value: '7', label: '卡面信息变更', type: ['2', '3'] },
//   { value: '6', label: '卡到期', type: ['3'] },
//   { value: '5', label: '其他', type: ['2', '3'] },
// ]
export const reason = [
  { value: '1', label: '卡损坏', type: ['3'] },
  { value: '7', label: '卡面信息变更', type: ['3'] },
  { value: '6', label: '卡到期', type: ['3'] },
  { value: '5', label: '其他', type: ['3'] },
]

// 业务类型

export const businessTypeList = [
  // { value: '1', label: '补卡' },
  // { value: '2', label: '换卡' },
  { value: '3', label: '换发' },
]
