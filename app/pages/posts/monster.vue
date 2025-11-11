<script setup>
import { ref, reactive, computed } from "vue"
import {initFlowbite} from "flowbite";

//排序切換
const sortAsc = ref(false) // true = 小→大, false = 大→小

// 搜尋輸入
const search = ref("")
const minLevel = ref("")
const maxLevel = ref("")

// 選取標籤（屬性 / 種族 / 大小）
const type = reactive({
  selectedElement: ['all']
})
const selectedElement = ref(['all'])
const selectedRace = ref(['all'])
const selectedSize = ref(['all'])

// ✅ icon/項目列表
const elementList = [
  { id: "all", name: "ALL", icon: "/assets/element/neutral.png" },
  { id: "無", name: "無", icon: "/assets/element/neutral.png" },
  { id: "水", name: "水", icon: "/assets/element/water.png" },
  { id: "地", name: "地", icon: "/assets/element/earth.png" },
  { id: "火", name: "火", icon: "/assets/element/fire.png" },
  { id: "風", name: "風", icon: "/assets/element/wind.png" },
  { id: "毒", name: "毒", icon: "/assets/element/poison.png" },
  { id: "聖", name: "聖", icon: "/assets/element/holy.png" },
  { id: "暗", name: "暗", icon: "/assets/element/shadow.png" },
  { id: "念", name: "念", icon: "/assets/element/ghost.png" },
  { id: "不死", name: "不死", icon: "/assets/element/undead.png" },
]

const raceList = [
  { id: "all", name: "ALL", icon: "/assets/race/formless.png" },
  { id: "無形", name: "無形", icon: "/assets/race/formless.png" },
  { id: "植物", name: "植物", icon: "/assets/race/plant.png" },
  { id: "動物", name: "動物", icon: "/assets/race/brute.png" },
  { id: "昆蟲", name: "昆蟲", icon: "/assets/race/insect.png" },
  { id: "魚貝", name: "魚貝", icon: "/assets/race/fish.png" },
  { id: "惡魔", name: "惡魔", icon: "/assets/race/demon.png" },
  { id: "天使", name: "天使", icon: "/assets/race/angel.png" },
  { id: "龍族", name: "龍族", icon: "/assets/race/dragon.png" },
  { id: "不死", name: "不死", icon: "/assets/race/undead.png" },
  { id: "人形", name: "人形", icon: "/assets/race/undead.png" }
]

const sizeList = [
  { id: "all", name: "ALL", icon: "/assets/size/small.png" },
  { id: "小型", name: "小型", icon: "/assets/size/small.png" },
  { id: "中型", name: "中型", icon: "/assets/size/medium.png" },
  { id: "大型", name: "大型", icon: "/assets/size/large.png" },
]

// ✅ 怪物資料（示範用）

const monsters = ref(
    [
      {
        "monster_name_zh": "甜餅人",
        "monster_name_en": "COOKIE_XMAS",
        "id": 1246,
        "image_url": "https://assets.twroz.wiki/images/monsters/1246.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "聖屬性2",
          "size": "小型"
        },
        "stats": {
          "level": 74,
          "hp": 32895,
          "base_exp": 21930,
          "job_exp": "???",
          "attack_power": "114-142",
          "physical_defense_def": 96,
          "magic_defense_mdef": 72,
          "hit_100_percent": 291,
          "flee_95_percent": 270
        },
        "spawn_locations": [
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_a"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_b"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_z"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_a"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_b"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_z"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xmas_dun01"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xmas_dun02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 8.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "薑餅",
            "rate_percent": 20.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/538.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "禮物箱",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/644.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "珍珠",
            "rate_percent": 0.23,
            "item_image_url": "https://assets.twroz.wiki/images/items/722.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 1.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "XMAS甜餅人卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4235.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "連帽披肩[1]",
            "rate_percent": 0.13,
            "item_image_url": "https://assets.twroz.wiki/images/items/480414.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "連帽披肩[1]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/480414.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "十字弓[3](2-3詞條)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/700116.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "綠餅人",
        "monster_name_en": "COOKIE",
        "id": 1265,
        "image_url": "https://assets.twroz.wiki/images/monsters/1265.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性3",
          "size": "小型"
        },
        "stats": {
          "level": 70,
          "hp": 31457,
          "base_exp": 20971,
          "job_exp": "???",
          "attack_power": "97-121",
          "physical_defense_def": 56,
          "magic_defense_mdef": 28,
          "hit_100_percent": 296,
          "flee_95_percent": 276
        },
        "spawn_locations": [
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_a"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_b"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_z"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_a"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_b"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_z"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xmas_dun01"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xmas_dun02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "糖果",
            "rate_percent": 1.6,
            "item_image_url": "https://assets.twroz.wiki/images/items/529.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "柺杖糖",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/530.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "薑餅",
            "rate_percent": 15.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/538.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "甜餅人卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4293.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "治癒術等級3",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/12001.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "戰士長靴[1]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/470230.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "輕便鞋[1]",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/470257.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)甜甜蜂蜜棒(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/480654.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "十字弓[3](2-3詞條)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/700116.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "菁英甜餅人",
        "monster_name_en": "C3_COOKIE",
        "id": 2865,
        "image_url": "https://assets.twroz.wiki/images/monsters/2865.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性3",
          "size": "小型"
        },
        "stats": {
          "level": 70,
          "hp": 333056,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "106-134",
          "physical_defense_def": 112,
          "magic_defense_mdef": 56,
          "hit_100_percent": 296,
          "flee_95_percent": 276
        },
        "spawn_locations": [
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_a"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_b"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xma_d01_z"
          },
          {
            "map_name_zh": "玩具工廠倉庫",
            "map_code": "xmas_dun01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "糖果",
            "rate_percent": 8.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/529.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "柺杖糖",
            "rate_percent": 3.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/530.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "薑餅",
            "rate_percent": 75.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/538.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 25.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "甜餅人卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4293.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "治癒術等級3",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/12001.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "輕便鞋[1]",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/470257.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "弓箭哥布靈",
        "monster_name_en": "GOBLIN_ARCHER",
        "id": 1258,
        "image_url": "https://assets.twroz.wiki/images/monsters/1258.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "毒屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 66,
          "hp": 5888,
          "base_exp": 3690,
          "job_exp": 1063,
          "attack_power": 136,
          "physical_defense_def": 69,
          "magic_defense_mdef": 0,
          "hit_100_percent": 304,
          "flee_95_percent": 295
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 3.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "葡萄",
            "rate_percent": 1.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/514.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬箭矢",
            "rate_percent": 15.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/1765.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈面具",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2297.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "弓箭哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4157.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "獸人嬰兒",
        "monster_name_en": "ORC_BABY",
        "id": 1686,
        "image_url": "https://assets.twroz.wiki/images/monsters/1686.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "聖屬性2",
          "size": "小型"
        },
        "stats": {
          "level": 51,
          "hp": 2766,
          "base_exp": 2154,
          "job_exp": 567,
          "attack_power": 87,
          "physical_defense_def": 58,
          "magic_defense_mdef": 3,
          "hit_100_percent": 259,
          "flee_95_percent": 263
        },
        "spawn_locations": [
          {
            "map_name_zh": "獸人村莊",
            "map_code": "orc_village"
          },
          {
            "map_name_zh": "獸人地下洞穴1樓",
            "map_code": "orc_d01"
          },
          {
            "map_name_zh": "獸人地下洞穴2樓",
            "map_code": "orc_d02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "牛奶",
            "rate_percent": 25.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/519.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人頭盔",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2299.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人嬰兒卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4375.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨大傑勒比結晶",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/7126.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "圍兜兜",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7269.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "嬰兒的奶瓶",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/7270.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "寵物奶嘴",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/10004.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "艾斯恩魔女",
        "monster_name_en": "ZHERLTHSH",
        "id": 1200,
        "image_url": "https://assets.twroz.wiki/images/monsters/1200.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 105,
          "hp": 61350,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "987-1,385",
          "physical_defense_def": 91,
          "magic_defense_mdef": 99,
          "hit_100_percent": 378,
          "flee_95_percent": 431
        },
        "spawn_locations": [
          {
            "map_name_zh": "地下監獄2樓",
            "map_code": "gl_prison1"
          }
        ],
        "drops": [
          {
            "item_name_zh": "女王的鞭子",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1970.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蝴蝶假面",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2291.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "艾斯恩魔女卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4277.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "行刑者手套",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/7017.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "玫瑰石英",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7293.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "愛麗絲女僕",
        "monster_name_en": "ALICE",
        "id": 1275,
        "image_url": "https://assets.twroz.wiki/images/monsters/1275.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 100,
          "hp": 9230,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "593-799",
          "physical_defense_def": 93,
          "magic_defense_mdef": 73,
          "hit_100_percent": 369,
          "flee_95_percent": 392
        },
        "spawn_locations": [
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_c01_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_c01_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_c01_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_cas01"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_cas02"
          },
          {
            "map_name_zh": "克雷斯特漢姆 室內",
            "map_code": "gl_in01"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_a"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_b"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_z"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_knt01"
          },
          {
            "map_name_zh": "騎士團2樓",
            "map_code": "gl_knt02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "魔物掃把",
            "rate_percent": 0.2,
            "item_image_url": "https://assets.twroz.wiki/images/items/637.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "玻璃鞋",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2407.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "愛麗絲女僕卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4253.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "兩個紅色小髮帶",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/5085.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "愛麗絲的圍裙",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7047.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "流氓",
        "monster_name_en": "MOBSTER",
        "id": 1313,
        "image_url": "https://assets.twroz.wiki/images/monsters/1313.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 58,
          "hp": 5278,
          "base_exp": 2894,
          "job_exp": 840,
          "attack_power": "141",
          "physical_defense_def": 87,
          "magic_defense_mdef": 18,
          "hit_100_percent": 295,
          "flee_95_percent": 274
        },
        "spawn_locations": [
          {
            "map_name_zh": "克克魔海邊",
            "map_code": "cmd_f02_a"
          },
          {
            "map_name_zh": "克克魔海邊",
            "map_code": "cmd_f02_b"
          },
          {
            "map_name_zh": "克克魔海邊",
            "map_code": "cmd_f02_z"
          },
          {
            "map_name_zh": "克克魔海邊",
            "map_code": "cmd_fild02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "萬能藥",
            "rate_percent": 2.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/525.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "藍寶石",
            "rate_percent": 22.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/726.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "力量戒指",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "流氓卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4317.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哈密瓜",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/6264.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鳳梨",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/6265.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "刺錘哥布靈",
        "monster_name_en": "GOBLIN_5",
        "id": 1126,
        "image_url": "https://assets.twroz.wiki/images/monsters/1126.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "水屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 67,
          "hp": 7545,
          "base_exp": 3834,
          "job_exp": 1108,
          "attack_power": "126",
          "physical_defense_def": 64,
          "magic_defense_mdef": 5,
          "hit_100_percent": 306,
          "flee_95_percent": 282
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 1.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "討厭的假面",
            "rate_percent": 0.08,
            "item_image_url": "https://assets.twroz.wiki/images/items/5089.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "橡木魔杖[3](2詞條)",
            "rate_percent": 0.08,
            "item_image_url": "https://assets.twroz.wiki/images/items/550138.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "人魚士兵",
        "monster_name_en": "MERMAN",
        "id": 1264,
        "image_url": "https://assets.twroz.wiki/images/monsters/1264.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "水屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 60,
          "hp": 2324,
          "base_exp": 2230,
          "job_exp": 304,
          "attack_power": "121",
          "physical_defense_def": 62,
          "magic_defense_mdef": 8,
          "hit_100_percent": 291,
          "flee_95_percent": 288
        },
        "spawn_locations": [
          {
            "map_name_zh": "海盜地洞密穴5樓",
            "map_code": "iz_d04_a"
          },
          {
            "map_name_zh": "海盜地洞密穴5樓",
            "map_code": "iz_d04_b"
          },
          {
            "map_name_zh": "海盜地洞密穴5樓",
            "map_code": "iz_d04_z"
          },
          {
            "map_name_zh": "海底洞穴5樓",
            "map_code": "iz_dun04"
          }
        ],
        "drops": [
          {
            "item_name_zh": "檸檬",
            "rate_percent": 2.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/568.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "天藍寶石",
            "rate_percent": 0.2,
            "item_image_url": "https://assets.twroz.wiki/images/items/720.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 1.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "水靈原石",
            "rate_percent": 0.18,
            "item_image_url": "https://assets.twroz.wiki/images/items/995.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "人魚嘴巴",
            "rate_percent": 6.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "德瑞尹長戟[2]",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/1460.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "人魚士兵卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4199.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)防水沐浴帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400863.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "三叉戟[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/630042.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒人魚士兵",
        "monster_name_en": "C4_MERMAN",
        "id": 2757,
        "image_url": "https://assets.twroz.wiki/images/monsters/2757.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "水屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 60,
          "hp": 14700,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "229-293",
          "physical_defense_def": 62,
          "magic_defense_mdef": 8,
          "hit_100_percent": 299,
          "flee_95_percent": 288
        },
        "spawn_locations": [
          {
            "map_name_zh": "海盜地洞密穴5樓",
            "map_code": "iz_d04_a"
          },
          {
            "map_name_zh": "海盜地洞密穴5樓",
            "map_code": "iz_d04_b"
          },
          {
            "map_name_zh": "海盜地洞密穴5樓",
            "map_code": "iz_d04_z"
          },
          {
            "map_name_zh": "海底洞穴5樓",
            "map_code": "iz_dun04"
          }
        ],
        "drops": [
          {
            "item_name_zh": "檸檬",
            "rate_percent": 10.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/568.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "天藍寶石",
            "rate_percent": 1.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/720.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 5.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "水靈原石",
            "rate_percent": 0.9,
            "item_image_url": "https://assets.twroz.wiki/images/items/995.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "人魚嘴巴",
            "rate_percent": 32.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "德瑞尹長戟[2]",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1460.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "人魚士兵卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4199.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "三叉戟[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/630042.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "伍坦彈弓手",
        "monster_name_en": "WOOTAN_SHOOTER",
        "id": 1498,
        "image_url": "https://assets.twroz.wiki/images/monsters/1498.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 87,
          "hp": 14804,
          "base_exp": 7566,
          "job_exp": 2139,
          "attack_power": "287",
          "physical_defense_def": 91,
          "magic_defense_mdef": 21,
          "hit_100_percent": 312,
          "flee_95_percent": 336
        },
        "spawn_locations": [
          {
            "map_name_zh": "汶巴拉嚕嚕卡森林",
            "map_code": "um_fild01"
          },
          {
            "map_name_zh": "汶巴拉滬家森林",
            "map_code": "um_fild02"
          },
          {
            "map_name_zh": "汶巴拉卡拉拉森林",
            "map_code": "um_fild03"
          },
          {
            "map_name_zh": "汶巴拉滬家叢林",
            "map_code": "um_fild04"
          }
        ],
        "drops": [
          {
            "item_name_zh": "香蕉",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/513.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "伍坦彈弓手卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4260.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "香蕉帽",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/5116.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "石頭",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7049.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "可可",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7182.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "彈弓",
            "rate_percent": 22.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7195.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "橡皮筋",
            "rate_percent": 17.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7200.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼斧[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/620049.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "榔頭哥布靈",
        "monster_name_en": "GOBLIN_4",
        "id": 1125,
        "image_url": "https://assets.twroz.wiki/images/monsters/1125.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 58,
          "hp": 4443,
          "base_exp": 2832,
          "job_exp": 762,
          "attack_power": "127",
          "physical_defense_def": 70,
          "magic_defense_mdef": 3,
          "hit_100_percent": 287,
          "flee_95_percent": 265
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_a"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_b"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild11"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "地靈礦石",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/993.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "時髦眼罩",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2263.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "無表情的假面",
            "rate_percent": 0.08,
            "item_image_url": "https://assets.twroz.wiki/images/items/5087.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)無表情的假面(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/436012.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "銀盾[1]",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/460070.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "獸人女戰士",
        "monster_name_en": "ORC_LADY",
        "id": 1273,
        "image_url": "https://assets.twroz.wiki/images/monsters/1273.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 54,
          "hp": 3709,
          "base_exp": 2390,
          "job_exp": 614,
          "attack_power": "111",
          "physical_defense_def": 99,
          "magic_defense_mdef": 20,
          "hit_100_percent": 266,
          "flee_95_percent": 282
        },
        "spawn_locations": [
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_a"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_b"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild03"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_fild10"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "婚禮頭紗",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2206.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "結婚禮服",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2338.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "智力耳環",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2602.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人女戰士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4255.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "賽依伐",
            "rate_percent": 23.28,
            "item_image_url": "https://assets.twroz.wiki/images/items/7053.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "6等料理書",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/7477.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)派對廚師帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400858.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "皎潔長袍[1](2-3詞條)",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/450312.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "圓柄馬刀[3]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/500112.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "雄壯獸人女戰士",
        "monster_name_en": "C2_ORC_LADY",
        "id": 2725,
        "image_url": "https://assets.twroz.wiki/images/monsters/2725.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 54,
          "hp": "37,090",
          "base_exp": "35,850",
          "job_exp": "9,506",
          "attack_power": "133",
          "physical_defense_def": 99,
          "magic_defense_mdef": 20,
          "hit_100_percent": 266,
          "flee_95_percent": 282
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild03"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "婚禮頭紗",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2206.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "結婚禮服",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2338.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "智力耳環",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2602.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人女戰士卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4255.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "賽依伐",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/7053.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "6等料理書",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/7477.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "皎潔長袍[1](2-3詞條)",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/450312.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "獸人戰士",
        "monster_name_en": "ORK_WARRIOR",
        "id": 1272,
        "image_url": "https://assets.twroz.wiki/images/monsters/1023.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 52,
          "hp": "3,266",
          "base_exp": "2,252",
          "job_exp": "594",
          "attack_power": "100",
          "physical_defense_def": "62",
          "magic_defense_mdef": "3",
          "hit_100_percent": "269",
          "flee_95_percent": "241"
        },
        "spawn_locations": [
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_a"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_b"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild03"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_fild10"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 0.2,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人戰士之證",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/931.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人斧[4]",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/1309.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "香菸",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2267.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人戰士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4066.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)香菸(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/420456.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒獸人戰士",
        "monster_name_en": "C4_ORK_WARRIOR",
        "id": 2724,
        "image_url": "https://assets.twroz.wiki/images/monsters/2722.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 65,
          "hp": 19000,
          "base_exp": 15225,
          "job_exp": 4300,
          "attack_power": "683",
          "physical_defense_def": 96,
          "magic_defense_mdef": 12,
          "hit_100_percent": 273,
          "flee_95_percent": 241
        },
        "spawn_locations": [
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_a"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_b"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_f10_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild03"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "gef_fild10"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人戰士之證",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/931.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人斧[4]",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/1309.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "香菸",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/2267.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人戰士卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4066.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨斧[4]",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/620039.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "帕莎納",
        "monster_name_en": "PASANA",
        "id": 1154,
        "image_url": "https://assets.twroz.wiki/images/monsters/1154.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 118,
          "hp": "???",
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "505-681",
          "physical_defense_def": 139,
          "magic_defense_mdef": 52,
          "hit_100_percent": 355,
          "flee_95_percent": 369
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "in_sphinx3"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "in_sphinx4"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "in_sphinx5"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_a"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_b"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_z"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_a"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_b"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_z"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_a"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_b"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "襯衫",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/2522.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "帕莎納卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4099.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "破裂之劍",
            "rate_percent": 21.83,
            "item_image_url": "https://assets.twroz.wiki/images/items/7110.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蜂蜜罐",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7121.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)吹口哨(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/420463.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "流星錘[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/590082.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "迅捷帕莎納",
        "monster_name_en": "C1_PASANA",
        "id": 2719,
        "image_url": "https://assets.twroz.wiki/images/monsters/2719.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 118,
          "hp": "未知",
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "575-785",
          "physical_defense_def": 93,
          "magic_defense_mdef": 35,
          "hit_100_percent": 355,
          "flee_95_percent": 369
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "in_sphinx5"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_a"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_b"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "襯衫",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/2522.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "帕莎納卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4099.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "破裂之劍",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/7110.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蜂蜜罐",
            "rate_percent": 62.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7121.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "傑洛米",
        "monster_name_en": "ZEROM",
        "id": 1178,
        "image_url": "https://assets.twroz.wiki/images/monsters/1178.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 105,
          "hp": "83,926",
          "base_exp": "57,385",
          "job_exp": "???",
          "attack_power": "389-521",
          "physical_defense_def": 139,
          "magic_defense_mdef": 22,
          "hit_100_percent": 358,
          "flee_95_percent": 343
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "in_sphinx1"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "in_sphinx2"
          },
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "sp_d01_a"
          },
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "sp_d01_b"
          },
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "sp_d01_z"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_a"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_b"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鐵",
            "rate_percent": 0.95,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵礦石",
            "rate_percent": 1.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1002.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "強化武器金屬-級數二",
            "rate_percent": 0.28,
            "item_image_url": "https://assets.twroz.wiki/images/items/1011.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "侍衛口罩",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2265.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "三角褲",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/2339.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "腳鍊",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2408.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "傑洛米卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4064.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "伍坦戰士",
        "monster_name_en": "WOOTAN_FIGHTER",
        "id": 1499,
        "image_url": "https://assets.twroz.wiki/images/monsters/1499.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 87,
          "hp": "11,988",
          "base_exp": "7214",
          "job_exp": "2,139",
          "attack_power": "250",
          "physical_defense_def": 103,
          "magic_defense_mdef": 8,
          "hit_100_percent": 304,
          "flee_95_percent": 324
        },
        "spawn_locations": [
          {
            "map_name_zh": "汶巴拉嚕嚕卡森林",
            "map_code": "um_fild01"
          },
          {
            "map_name_zh": "汶巴拉滬家森林",
            "map_code": "um_fild02"
          },
          {
            "map_name_zh": "汶巴拉卡拉拉森林",
            "map_code": "um_fild03"
          },
          {
            "map_name_zh": "汶巴拉滬家叢林",
            "map_code": "um_fild04"
          }
        ],
        "drops": [
          {
            "item_name_zh": "肉",
            "rate_percent": 22.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/517.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "虎爪拳套[3]",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/1801.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "伍坦戰士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4261.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "香蕉帽",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/5116.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨大葉子",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/7198.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)血戰之痕帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400876.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鷹爪拳套[2]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/560062.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雙手劍[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/600058.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "伍坦戰士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4117.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒伍坦戰士",
        "monster_name_en": "C4_WOOTAN_FIGHTER",
        "id": 2611,
        "image_url": "https://assets.twroz.wiki/images/monsters/2611.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 87,
          "hp": "59,940",
          "base_exp": "108,210",
          "job_exp": "32,075",
          "attack_power": "300",
          "physical_defense_def": 103,
          "magic_defense_mdef": 8,
          "hit_100_percent": 308,
          "flee_95_percent": 324
        },
        "spawn_locations": [
          {
            "map_name_zh": "汶巴拉滬家森林",
            "map_code": "um_fild02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "肉",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/517.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "虎爪拳套[3]",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1801.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "伍坦戰士卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4261.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "香蕉帽",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/5116.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "木製護肩",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/7197.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨大葉子",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/7198.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鷹爪拳套[2]",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/560062.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "鏈錘哥布靈",
        "monster_name_en": "GOBLIN_2",
        "id": 1123,
        "image_url": "https://assets.twroz.wiki/images/monsters/1123.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 52,
          "hp": "2,942",
          "base_exp": "2,146",
          "job_exp": 594,
          "attack_power": 92,
          "physical_defense_def": 52,
          "magic_defense_mdef": 5,
          "hit_100_percent": 270,
          "flee_95_percent": 283
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_a"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_b"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild11"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈面具",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2297.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "印地安髮箍",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/5010.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)笑臉面具(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/436013.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "銀盾[1]",
            "rate_percent": "0.03",
            "item_image_url": "https://assets.twroz.wiki/images/items/460070.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "噴射哥布靈",
        "monster_name_en": "STEAM_GOBLIN",
        "id": 1280,
        "image_url": "https://assets.twroz.wiki/images/monsters/1280.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "風屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 66,
          "hp": 12746,
          "base_exp": "6,906",
          "job_exp": "2,043",
          "attack_power": "243",
          "physical_defense_def": 85,
          "magic_defense_mdef": 5,
          "hit_100_percent": 332,
          "flee_95_percent": 334
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.62,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 1.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵",
            "rate_percent": 0.28,
            "item_image_url": "https://assets.twroz.wiki/images/items/999.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "煤礦",
            "rate_percent": 1.6,
            "item_image_url": "https://assets.twroz.wiki/images/items/1003.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "噴射哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4156.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "賽依伐",
            "rate_percent": 19.4,
            "item_image_url": "https://assets.twroz.wiki/images/items/7053.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "哥布靈首領",
        "monster_name_en": "GOBLIN_LEADER",
        "id": 1299,
        "image_url": "https://assets.twroz.wiki/images/monsters/1299.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "風屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 66,
          "hp": 85900,
          "base_exp": "277,516",
          "job_exp": "64,427",
          "attack_power": "207",
          "physical_defense_def": 72,
          "magic_defense_mdef": 30,
          "hit_100_percent": 337,
          "flee_95_percent": 316
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_a"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_b"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 3.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 0.6,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵",
            "rate_percent": 4.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/999.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈首領卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4155.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈首領假面",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/5090.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "憤怒的嘴",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/5113.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼盾[1]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/460071.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "狂暴哥布靈",
        "monster_name_en": "PANZER_GOBLIN",
        "id": 1308,
        "image_url": "https://assets.twroz.wiki/images/monsters/1308.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "風屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 62,
          "hp": "5,472",
          "base_exp": "1,740",
          "job_exp": "609",
          "attack_power": "153",
          "physical_defense_def": 60,
          "magic_defense_mdef": 25,
          "hit_100_percent": 328,
          "flee_95_percent": 317
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "火靈原石",
            "rate_percent": 0.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/994.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 1.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵",
            "rate_percent": 0.9,
            "item_image_url": "https://assets.twroz.wiki/images/items/999.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "煤礦",
            "rate_percent": 2.9,
            "item_image_url": "https://assets.twroz.wiki/images/items/1003.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "狂暴哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4157.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "賽依伐",
            "rate_percent": 19.4,
            "item_image_url": "https://assets.twroz.wiki/images/items/7053.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 17.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "刺刀哥布靈",
        "monster_name_en": "GOBLIN_1",
        "id": 1122,
        "image_url": "https://assets.twroz.wiki/images/monsters/1122.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "風屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 57,
          "hp": 3785,
          "base_exp": 2592,
          "job_exp": "1,836",
          "attack_power": "219-313",
          "physical_defense_def": 85,
          "magic_defense_mdef": 5,
          "hit_100_percent": 332,
          "flee_95_percent": 334
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_a"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_b"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild11"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 9,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 0.22,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈面具",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2297.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)笑臉面具(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/436013.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "圓盾[1]",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/460069.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "德克短劍[3]",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/510143.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "狡猾刺刀哥布靈",
        "monster_name_en": "GOBLIN_KNIFE_MJ",
        "id": 2813,
        "image_url": "https://assets.twroz.wiki/images/monsters/2813.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "風屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 57,
          "hp": 18925,
          "base_exp": 38880,
          "job_exp": 10930,
          "attack_power": 133,
          "physical_defense_def": 56,
          "magic_defense_mdef": 5,
          "hit_100_percent": 313,
          "flee_95_percent": 266
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 1.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 100.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈面具",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/2297.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "圓盾[1]",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/460069.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "德克短劍[3]",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/510143.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "迅捷刺刀哥布靈",
        "monster_name_en": "C1_GOBLIN_1",
        "id": 2814,
        "image_url": "https://assets.twroz.wiki/images/monsters/2814.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "風屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 57,
          "hp": 18925,
          "base_exp": 38880,
          "job_exp": 10930,
          "attack_power": "133",
          "physical_defense_def": 56,
          "magic_defense_mdef": 5,
          "hit_100_percent": 313,
          "flee_95_percent": 266
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 1.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 100.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈面具",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/2297.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "圓盾[1]",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/460069.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "德克短劍[3]",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/510143.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "大斧哥布靈",
        "monster_name_en": "GOBLIN_3",
        "id": 1124,
        "image_url": "https://assets.twroz.wiki/images/monsters/1124.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形" ,
          "element": "毒屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 52 ,
          "hp": 3266 ,
          "base_exp": 2146 ,
          "job_exp": 594 ,
          "attack_power": "92",
          "physical_defense_def": 47 ,
          "magic_defense_mdef": 5 ,
          "hit_100_percent": 270 ,
          "flee_95_percent": 242
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_a"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_b"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_f11_z"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "gef_fild11"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 1.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "頭巾",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/2275.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4060.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "嚇壞眼的假面",
            "rate_percent": 0.08,
            "item_image_url": "https://assets.twroz.wiki/images/items/5088.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)嚇壞眼的假面(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/436014.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "圓盾[1]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/460069.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "諾可伊",
        "monster_name_en": "REQUIEM",
        "id": 1164,
        "image_url": "https://assets.twroz.wiki/images/monsters/1164.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 106,
          "hp": 129227,
          "base_exp": 77537,
          "job_exp": "???",
          "attack_power": "407-547",
          "physical_defense_def": 132,
          "magic_defense_mdef": 30,
          "hit_100_percent": 342,
          "flee_95_percent": 329
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "in_sphinx1"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "in_sphinx2"
          },
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "sp_d01_a"
          },
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "sp_d01_b"
          },
          {
            "map_name_zh": "人面獅身像地下1樓",
            "map_code": "sp_d01_z"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_a"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_b"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 0.18,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "華麗金屬",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/714.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "亡者遺物",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/934.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "亡者牙齒",
            "rate_percent": 17.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/958.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "諾可伊卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4104.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "6等料理書",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/7477.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)葬禮帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400871.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "大衣[1]",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/450349.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "雄壯諾可伊",
        "monster_name_en": "C2_REQUIEM",
        "id": 2687,
        "image_url": "https://assets.twroz.wiki/images/monsters/2687.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 106,
          "hp": "未知",
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "462-630",
          "physical_defense_def": 88,
          "magic_defense_mdef": 20,
          "hit_100_percent": 342,
          "flee_95_percent": 329
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "in_sphinx2"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_a"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_b"
          },
          {
            "map_name_zh": "人面獅身像地下2樓",
            "map_code": "sp_d02_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 0.9,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "華麗金屬",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/714.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 62.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "亡者遺物",
            "rate_percent": 37.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/934.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "亡者牙齒",
            "rate_percent": 87.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/958.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "諾可伊卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4104.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "6等料理書",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/7477.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "大衣[1]",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/450349.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "茲諾克",
        "monster_name_en": "ZENORC",
        "id": 1177,
        "image_url": "https://assets.twroz.wiki/images/monsters/1177.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性1",
          "size": "中型"
        },
        "stats": {
          "level": 54,
          "hp": 3320,
          "base_exp": 2462,
          "job_exp": 707,
          "attack_power": "109",
          "physical_defense_def": 69,
          "magic_defense_mdef": 5,
          "hit_100_percent": 273,
          "flee_95_percent": 253
        },
        "spawn_locations": [
          {
            "map_name_zh": "獸人地下洞窟2樓",
            "map_code": "orc_d02_a"
          },
          {
            "map_name_zh": "獸人地下洞窟2樓",
            "map_code": "orc_d02_b"
          },
          {
            "map_name_zh": "獸人地下洞窟2樓",
            "map_code": "orc_d02_z"
          },
          {
            "map_name_zh": "獸人地下洞窟2樓",
            "map_code": "orcsdun02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "閃爍之石",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/640.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 0.35,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "粘稠液體",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/938.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "古魔法書",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/1006.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "茲諾克之牙",
            "rate_percent": 27.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1044.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "茲諾克卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4096.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "越獄腐屍",
        "monster_name_en": "RAGGED_ZOMBIE_MJ",
        "id": 20371,
        "image_url": "https://assets.twroz.wiki/images/monsters/20371.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "不死屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 109,
          "hp": 2375279,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "2,871-4,145",
          "physical_defense_def": 297,
          "magic_defense_mdef": 105,
          "hit_100_percent": 392,
          "flee_95_percent": 455
        },
        "spawn_locations": [
          {
            "map_name_zh": "地下監獄2樓",
            "map_code": "gl_prison1"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "手銬",
            "rate_percent": 17.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1098.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "老舊湯匙",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7016.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "囚犯日記本[1]",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/28619.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "阿修羅狂戰士",
        "monster_name_en": "PHENDARK",
        "id": 1202,
        "image_url": "https://assets.twroz.wiki/images/monsters/1202.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 102,
          "hp": 11000,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "910-1,260",
          "physical_defense_def": 440,
          "magic_defense_mdef": 50,
          "hit_100_percent": 373,
          "flee_95_percent": 391
        },
        "spawn_locations": [
          {
            "map_name_zh": "地下監獄2樓",
            "map_code": "gl_prison1"
          }
        ],
        "drops": [
          {
            "item_name_zh": "白色藥草",
            "rate_percent": 9.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/509.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/984.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "細長舌頭",
            "rate_percent": 19.4,
            "item_image_url": "https://assets.twroz.wiki/images/items/1015.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "電線",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1971.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "阿修羅狂戰士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4329.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "行刑者手套",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/7017.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "騎士監護人",
        "monster_name_en": "KNIGHT_GUARDIAN",
        "id": 1286,
        "image_url": "https://assets.twroz.wiki/images/monsters/1286.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 86,
          "hp": 30214,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "1,322-1,886",
          "physical_defense_def": 88,
          "magic_defense_mdef": 30,
          "hit_100_percent": 339,
          "flee_95_percent": 427
        },
        "spawn_locations": [],
        "drops": []
      },
      {
        "monster_name_zh": "弓手監護人",
        "monster_name_en": "ARCHER_GUARDIAN",
        "id": 1285,
        "image_url": "https://assets.twroz.wiki/images/monsters/1285.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 74,
          "hp": 28634,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "1,154-1,648",
          "physical_defense_def": 56,
          "magic_defense_mdef": 60,
          "hit_100_percent": 365,
          "flee_95_percent": 460
        },
        "spawn_locations": [],
        "drops": []
      },
      {
        "monster_name_zh": "士兵監護人",
        "monster_name_en": "SOLDIER_GUARDIAN",
        "id": 1287,
        "image_url": "https://assets.twroz.wiki/images/monsters/1287.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "無屬性1",
          "size": "大型"
        },
        "stats": {
          "level": 56,
          "hp": 15670,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "839-1,189",
          "physical_defense_def": 56,
          "magic_defense_mdef": 0,
          "hit_100_percent": 320,
          "flee_95_percent": 343
        },
        "spawn_locations": [],
        "drops": []
      },
      {
        "monster_name_zh": "古埃及王",
        "monster_name_en": "AMON_RA",
        "id": 1511,
        "image_url": "https://assets.twroz.wiki/images/monsters/1511.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性3",
          "size": "大型"
        },
        "stats": {
          "level": 69,
          "hp": "34,810,500",
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "1,827-2,663",
          "physical_defense_def": 213,
          "magic_defense_mdef": 123,
          "hit_100_percent": 376,
          "flee_95_percent": 370
        },
        "spawn_locations": [
          {
            "map_name_zh": "金字塔4樓",
            "map_code": "b_pry_d04_z"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "b_pry_d06_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "天地樹果實",
            "rate_percent": 15,
            "item_image_url": "https://assets.twroz.wiki/images/items/607.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "老舊卡冊",
            "rate_percent": 2,
            "item_image_url": "https://assets.twroz.wiki/images/items/616.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁",
            "rate_percent": 19.4,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "防禦戒指",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/2615.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "古埃及王卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4236.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "人面獅身帽",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/5053.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "羅誡塔石頭碎片",
            "rate_percent": 38.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/7211.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "獸人酋長",
        "monster_name_en": "ORC_LORD",
        "id": 1190,
        "image_url": "https://assets.twroz.wiki/images/monsters/1190.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 66,
          "hp": "???",
          "base_exp": "9,280,656",
          "job_exp": "1,579,921",
          "attack_power": "936",
          "physical_defense_def": 256,
          "magic_defense_mdef": 92,
          "hit_100_percent": 378,
          "flee_95_percent": 419
        },
        "spawn_locations": [
          {
            "map_name_zh": "獸人村",
            "map_code": "b_gef_f10"
          },
          {
            "map_name_zh": "獸人村",
            "map_code": "b_gef_f10_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁",
            "rate_percent": 21.34,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "血斧",
            "rate_percent": 2,
            "item_image_url": "https://assets.twroz.wiki/images/items/1363.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "力量戒指",
            "rate_percent": 2,
            "item_image_url": "https://assets.twroz.wiki/images/items/2601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人酋長卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4135.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "領導者頭箍",
            "rate_percent": 2,
            "item_image_url": "https://assets.twroz.wiki/images/items/5007.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "獸人英雄",
        "monster_name_en": "ORK_HERO",
        "id": 1087,
        "image_url": "https://assets.twroz.wiki/images/monsters/1087.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "地屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 60,
          "hp": "???",
          "base_exp": "5,773,680",
          "job_exp": "1,137,240",
          "attack_power": "794",
          "physical_defense_def": 197,
          "magic_defense_mdef": 70,
          "hit_100_percent": 350,
          "flee_95_percent": 388
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬區域",
            "map_code": "b_gef_f03"
          },
          {
            "map_name_zh": "吉芬區域",
            "map_code": "b_gef_f03_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "獸人英雄之證",
            "rate_percent": 48.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/968.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁",
            "rate_percent": 22.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "智天使之斧",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/1366.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人英雄卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4143.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "猴子髮箍",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/10018.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "獸人刀[4]",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/13437.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼盾[1]",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/460071.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "馬爾杜克",
        "monster_name_en": "MARDUK",
        "id": 1140,
        "image_url": "https://assets.twroz.wiki/images/monsters/1140.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性1",
          "size": "大型"
        },
        "stats": {
          "level": 109,
          "hp": 126671,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "297-377",
          "physical_defense_def": 99,
          "magic_defense_mdef": 64,
          "hit_100_percent": 390,
          "flee_95_percent": 366
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "in_sphinx3"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_a"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_b"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "惡魔召喚書",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/642.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火箭術等級5",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/691.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火靈原石",
            "rate_percent": 0.18,
            "item_image_url": "https://assets.twroz.wiki/images/items/994.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖殿士面具",
            "rate_percent": 21.83,
            "item_image_url": "https://assets.twroz.wiki/images/items/1045.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖杖 英靈",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/1614.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "智慧手套",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2617.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "馬爾杜克卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4112.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "狡猾馬爾杜克",
        "monster_name_en": "C5_MARDUK",
        "id": 2763,
        "image_url": "https://assets.twroz.wiki/images/monsters/2763.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "火屬性1",
          "size": "大型"
        },
        "stats": {
          "level": 109,
          "hp": "未知",
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "328-424",
          "physical_defense_def": 66,
          "magic_defense_mdef": 43,
          "hit_100_percent": 363,
          "flee_95_percent": 366
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "in_sphinx3"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_a"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_b"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "惡魔召喚書",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/642.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火箭術等級5",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/691.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火靈原石",
            "rate_percent": 0.9,
            "item_image_url": "https://assets.twroz.wiki/images/items/994.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖殿士面具",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/1045.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖杖 英靈",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1614.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "智慧手套",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2617.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "馬爾杜克卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4112.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "深淵騎士",
        "monster_name_en": "KNIGHT_OF_ABYSS",
        "id": 1219,
        "image_url": "https://assets.twroz.wiki/images/monsters/1219.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 122,
          "hp": 23297,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "1,630-2,324",
          "physical_defense_def": 102,
          "magic_defense_mdef": 50,
          "hit_100_percent": 384,
          "flee_95_percent": 440
        },
        "spawn_locations": [
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_cas02"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_a"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_b"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_z"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_knt01"
          },
          {
            "map_name_zh": "騎士團2樓",
            "map_code": "gl_knt02"
          },
          {
            "map_name_zh": "克雷斯特漢姆",
            "map_code": "glast_01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁",
            "rate_percent": 1.85,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鞭繩",
            "rate_percent": 26.68,
            "item_image_url": "https://assets.twroz.wiki/images/items/1064.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "戰鬥鉤槍[1]",
            "rate_percent": 0.13,
            "item_image_url": "https://assets.twroz.wiki/images/items/1421.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "秘衣 美德[1]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2318.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "深淵騎士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4140.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "斷柄之刀",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/7023.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)深淵騎士帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/401072.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "汙染幽靈劍士",
        "monster_name_en": "RAYDRIC_MJ",
        "id": 20367,
        "image_url": "https://assets.twroz.wiki/images/monsters/20367.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 120,
          "hp": 2372683,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "2,993-4,325",
          "physical_defense_def": 494,
          "magic_defense_mdef": 101,
          "hit_100_percent": 462,
          "flee_95_percent": 451
        },
        "spawn_locations": [
          {
            "map_name_zh": "騎士團2樓",
            "map_code": "gl_knt02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.35,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 37.74,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "王室騎士長矛[1]",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/26016.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "幽靈劍士",
        "monster_name_en": "RAYDRIC",
        "id": 1163,
        "image_url": "https://assets.twroz.wiki/images/monsters/1163.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 85,
          "hp": 18408,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "964-1,326",
          "physical_defense_def": 89,
          "magic_defense_mdef": 15,
          "hit_100_percent": 377,
          "flee_95_percent": 370
        },
        "spawn_locations": [
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_cas02"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_a"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_b"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_z"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_knt01"
          },
          {
            "map_name_zh": "騎士團2樓",
            "map_code": "gl_knt02"
          },
          {
            "map_name_zh": "樓梯迷宮",
            "map_code": "gl_step"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁",
            "rate_percent": 0.53,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "忠誠之證",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/1004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "金屬口罩",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2266.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "幽靈劍士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4133.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 24.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)公會會員招募帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/401080.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵鎖子甲[1]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/450310.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "雄壯幽靈劍士",
        "monster_name_en": "RAYDRIC_L",
        "id": 2691,
        "image_url": "https://assets.twroz.wiki/images/monsters/2691.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "暗屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 120,
          "hp": 259500,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "1,961-2,714",
          "physical_defense_def": 130,
          "magic_defense_mdef": 61,
          "hit_100_percent": 396,
          "flee_95_percent": 468
        },
        "spawn_locations": [
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_a"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_b"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_z"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_knt01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁",
            "rate_percent": 2.65,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "忠誠之證",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "金屬口罩",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2266.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "幽靈劍士卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4133.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵鎖子甲[1]",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/450310.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "胡狼頭神",
        "monster_name_en": "ANUBIS",
        "id": 1098,
        "image_url": "https://assets.twroz.wiki/images/monsters/1098.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "不死屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 105,
          "hp": 203836,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "980-1,374",
          "physical_defense_def": 310,
          "magic_defense_mdef": 88,
          "hit_100_percent": 383,
          "flee_95_percent": 400
        },
        "spawn_locations": [
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "in_sphinx4"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "in_sphinx5"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_a"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_b"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_z"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_a"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_b"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "神之金屬",
            "rate_percent": 0.53,
            "item_image_url": "https://assets.twroz.wiki/images/items/984.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖殿士面具",
            "rate_percent": 21.83,
            "item_image_url": "https://assets.twroz.wiki/images/items/1045.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖杖 英靈",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/1614.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "智慧手套",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2617.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "安畢斯卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4138.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "寶物箱子",
        "monster_name_en": "TREASURE_BOX1",
        "id": 1324,
        "image_url": "https://assets.twroz.wiki/images/monsters/1324.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 99,
          "hp": 1,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "100",
          "physical_defense_def": 0,
          "magic_defense_mdef": 0,
          "hit_100_percent": 300,
          "flee_95_percent": 1468
        },
        "spawn_locations": [],
        "drops": [
          {
            "item_name_zh": "天地樹果實",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/607.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "天地樹芽",
            "rate_percent": 15,
            "item_image_url": "https://assets.twroz.wiki/images/items/608.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "老舊卡冊",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/616.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "3克拉鑽石",
            "rate_percent": 38.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/732.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "城戰紫色藥水箱",
            "rate_percent": 4,
            "item_image_url": "https://assets.twroz.wiki/images/items/12676.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "城戰白色藥水箱",
            "rate_percent": 4,
            "item_image_url": "https://assets.twroz.wiki/images/items/12679.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "城戰藍色藥水箱",
            "rate_percent": 4,
            "item_image_url": "https://assets.twroz.wiki/images/items/12680.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "寶物箱子",
        "monster_name_en": "TREASURE_BOX2",
        "id": 1325,
        "image_url": "https://assets.twroz.wiki/images/monsters/1325.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 99,
          "hp": 1,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "100",
          "physical_defense_def": 0,
          "magic_defense_mdef": 0,
          "hit_100_percent": 300,
          "flee_95_percent": 1468
        },
        "spawn_locations": [],
        "drops": [
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "天地樹果實",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/607.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "老舊卡冊",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/616.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "組織的團結力",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/658.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神級材料寶箱",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/12674.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "寶物箱子",
        "monster_name_en": "TREASURE_BOX40",
        "id": 1363,
        "image_url": "https://assets.twroz.wiki/images/monsters/1363.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 99,
          "hp": 1,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "100",
          "physical_defense_def": 0,
          "magic_defense_mdef": 0,
          "hit_100_percent": 300,
          "flee_95_percent": 1468
        },
        "spawn_locations": [],
        "drops": [
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "天地樹果實",
            "rate_percent": 25,
            "item_image_url": "https://assets.twroz.wiki/images/items/607.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "老舊卡冊",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/616.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "組織的團結力",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/658.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神級材料寶箱",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/12674.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "飛行魔書",
        "monster_name_en": "RIDEWORD",
        "id": 1195,
        "image_url": "https://assets.twroz.wiki/images/monsters/1195.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "小型"
        },
        "stats": {
          "level": 74,
          "hp": 3222,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "450-606",
          "physical_defense_def": 61,
          "magic_defense_mdef": 38,
          "hit_100_percent": 328,
          "flee_95_percent": 370
        },
        "spawn_locations": [
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_c01_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_c01_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_c01_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城1樓",
            "map_code": "gl_cas01"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_cas02"
          },
          {
            "map_name_zh": "克雷斯特漢姆 室內",
            "map_code": "gl_in01"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_a"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_b"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_k01_z"
          },
          {
            "map_name_zh": "騎士團1樓",
            "map_code": "gl_knt01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "古魔法書",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1006.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "破舊書頁",
            "rate_percent": 24.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1097.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "水靈之書",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/1553.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "地靈之書",
            "rate_percent": 0.02,
            "item_image_url": "https://assets.twroz.wiki/images/items/1554.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火靈之書",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/1555.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "風靈之書",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/1556.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "飛行魔書卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4185.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "白蟻幼蟲",
        "monster_name_en": "ANT_EGG",
        "id": 1097,
        "image_url": "https://assets.twroz.wiki/images/monsters/1097.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 30,
          "hp": 773,
          "base_exp": 722,
          "job_exp": 183,
          "attack_power": "1",
          "physical_defense_def": 68,
          "magic_defense_mdef": 45,
          "hit_100_percent": 237,
          "flee_95_percent": 220
        },
        "spawn_locations": [
          {
            "map_name_zh": "螞蟻地獄密穴1樓",
            "map_code": "an_d01_a"
          },
          {
            "map_name_zh": "螞蟻地獄密穴1樓",
            "map_code": "an_d01_b"
          },
          {
            "map_name_zh": "螞蟻地獄密穴1樓",
            "map_code": "an_d01_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "傑勒比結晶",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/909.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "堅硬外殼",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/935.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "粘稠液體",
            "rate_percent": 3.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/938.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵礦石",
            "rate_percent": 10.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1002.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "強化武器金屬-級數一",
            "rate_percent": 1.6,
            "item_image_url": "https://assets.twroz.wiki/images/items/1010.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蟻卵卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4013.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "大駒短劍[3](3詞條)",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/510130.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "大嘴鳥蛋",
        "monster_name_en": "PECOPECO_EGG",
        "id": 1047,
        "image_url": "https://assets.twroz.wiki/images/monsters/1047.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "小型"
        },
        "stats": {
          "level": 7,
          "hp": 70,
          "base_exp": 304,
          "job_exp": 46,
          "attack_power": "1",
          "physical_defense_def": 16,
          "magic_defense_mdef": 5,
          "hit_100_percent": 218,
          "flee_95_percent": 188
        },
        "spawn_locations": [
          {
            "map_name_zh": "斐揚樹林",
            "map_code": "prt_fild03"
          },
          {
            "map_name_zh": "斐揚樹林",
            "map_code": "prt_fild04"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 2,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "白色盤子",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/736.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "堅硬外殼",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/935.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "強化武器金屬-級數一",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1010.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "大嘴鳥蛋卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4007.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵盾[1]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/460068.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "強化冰波利",
        "monster_name_en": "MD_MARIN",
        "id": 3816,
        "image_url": "https://assets.twroz.wiki/images/monsters/3816.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "水屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 33,
          "hp": 960,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "95-117",
          "physical_defense_def": 10,
          "magic_defense_mdef": 10,
          "hit_100_percent": 257,
          "flee_95_percent": 229
        },
        "spawn_locations": [
          {
            "map_name_zh": "暫無出沒資料",
            "map_code": ""
          }
        ],
        "drops": [
          {
            "item_name_zh": "藍色藥草",
            "rate_percent": 0.38,
            "item_image_url": "https://assets.twroz.wiki/images/items/510.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "糖果",
            "rate_percent": 1.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/529.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "冰凍術等級1",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/700.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "加勒結晶",
            "rate_percent": 16,
            "item_image_url": "https://assets.twroz.wiki/images/items/910.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "粘稠液體",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/938.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "冰波利卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4196.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波利帽",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/5035.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "強化波利",
        "monster_name_en": "MD_PORING",
        "id": 3815,
        "image_url": "https://assets.twroz.wiki/images/monsters/3815.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 34,
          "hp": 1023,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "100-124",
          "physical_defense_def": 10,
          "magic_defense_mdef": 12,
          "hit_100_percent": 258,
          "flee_95_percent": 230
        },
        "spawn_locations": [
          {
            "map_name_zh": "暫無出沒資料",
            "map_code": null
          }
        ],
        "drops": [
          {
            "item_name_zh": "蘋果",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/512.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蘋果",
            "rate_percent": 1.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/512.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "青澀蘋果",
            "rate_percent": 0.4,
            "item_image_url": "https://assets.twroz.wiki/images/items/619.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "傑勒比結晶",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/909.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "粘稠液體",
            "rate_percent": 4,
            "item_image_url": "https://assets.twroz.wiki/images/items/938.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "短劍[4]",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1202.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波利卡片",
            "rate_percent": 0.2,
            "item_image_url": "https://assets.twroz.wiki/images/items/4001.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "青蘋果",
            "rate_percent": 0.4,
            "item_image_url": "https://assets.twroz.wiki/images/items/12846.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "強化土波利",
        "monster_name_en": null,
        "id": 3813,
        "image_url": "https://assets.twroz.wiki/images/monsters/3813.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "火屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 35,
          "hp": 1095,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "104-130",
          "physical_defense_def": 10,
          "magic_defense_mdef": 10,
          "hit_100_percent": 259,
          "flee_95_percent": 231
        },
        "spawn_locations": [
          {
            "map_name_zh": "暫無出沒資料",
            "map_code": null
          }
        ],
        "drops": [
          {
            "item_name_zh": "蘋果",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/512.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蘋果",
            "rate_percent": 4,
            "item_image_url": "https://assets.twroz.wiki/images/items/512.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "濃縮柳橙汁",
            "rate_percent": 0.2,
            "item_image_url": "https://assets.twroz.wiki/images/items/620.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "傑勒比結晶",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/909.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "粘稠液體",
            "rate_percent": 6,
            "item_image_url": "https://assets.twroz.wiki/images/items/938.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土波利卡片",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/4004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "手杖[4]",
            "rate_percent": 0.8,
            "item_image_url": "https://assets.twroz.wiki/images/items/550139.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "鬼火",
        "monster_name_en": "HORONG",
        "id": 1129,
        "image_url": "https://assets.twroz.wiki/images/monsters/1129.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "火屬性4",
          "size": "小型"
        },
        "stats": {
          "level": 66,
          "hp": 5613,
          "base_exp": 4124,
          "job_exp": 1220,
          "attack_power": "169",
          "physical_defense_def": 84,
          "magic_defense_mdef": 35,
          "hit_100_percent": 303,
          "flee_95_percent": 306
        },
        "spawn_locations": [
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_d04_a"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_d04_b"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_d04_z"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_dun04"
          }
        ],
        "drops": [
          {
            "item_name_zh": "魔物番薯",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/633.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.59,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "石心",
            "rate_percent": 32.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/953.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "酒精",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/970.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火箭矢",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/1752.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火線頭飾",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/2279.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鬼火卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4103.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "強化波波利",
        "monster_name_en": "MD_POPORING",
        "id": 3814,
        "image_url": "https://assets.twroz.wiki/images/monsters/3814.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "風屬性1",
          "size": "小型"
        },
        "stats": {
          "level": 36,
          "hp": 1167,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "109-137",
          "physical_defense_def": 10,
          "magic_defense_mdef": 12,
          "hit_100_percent": 260,
          "flee_95_percent": 232
        },
        "spawn_locations": [
          {
            "map_name_zh": "暫無出沒資料",
            "map_code": null
          }
        ],
        "drops": [
          {
            "item_name_zh": "綠色藥水",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/506.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "綠色藥草",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/511.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "葡萄",
            "rate_percent": 2,
            "item_image_url": "https://assets.twroz.wiki/images/items/514.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "加勒結晶",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/910.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "粘稠液體",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/938.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波波利卡片",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/4033.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "笨拙短劍[4]",
            "rate_percent": 0.2,
            "item_image_url": "https://assets.twroz.wiki/images/items/510129.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "邪惡箱",
        "monster_name_en": "MIMIC",
        "id": 1191,
        "image_url": "https://assets.twroz.wiki/images/monsters/1191.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 56,
          "hp": 1707,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "290-384",
          "physical_defense_def": 63,
          "magic_defense_mdef": 15,
          "hit_100_percent": 376,
          "flee_95_percent": 335
        },
        "spawn_locations": [
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_a"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_b"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_c02_z"
          },
          {
            "map_name_zh": "克雷斯特漢姆古城2樓",
            "map_code": "gl_cas02"
          },
          {
            "map_name_zh": "修道院",
            "map_code": "gl_chu_a"
          },
          {
            "map_name_zh": "修道院",
            "map_code": "gl_chu_b"
          },
          {
            "map_name_zh": "修道院",
            "map_code": "gl_chu_z"
          },
          {
            "map_name_zh": "修道院",
            "map_code": "gl_church"
          },
          {
            "map_name_zh": "地下公墓",
            "map_code": "gl_chy_a"
          },
          {
            "map_name_zh": "地下公墓",
            "map_code": "gl_chy_b"
          },
          {
            "map_name_zh": "地下公墓",
            "map_code": "gl_chy_z"
          },
          {
            "map_name_zh": "地下公墓",
            "map_code": "gl_chyard"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "in_sphinx3"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "in_sphinx4"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "in_sphinx5"
          },
          {
            "map_name_zh": "金字塔3樓",
            "map_code": "moc_pryd03"
          },
          {
            "map_name_zh": "金字塔4樓",
            "map_code": "moc_pryd04"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "moc_pryd06"
          },
          {
            "map_name_zh": "金字塔3樓",
            "map_code": "pry_d03_a"
          },
          {
            "map_name_zh": "金字塔3樓",
            "map_code": "pry_d03_b"
          },
          {
            "map_name_zh": "金字塔3樓",
            "map_code": "pry_d03_z"
          },
          {
            "map_name_zh": "金字塔4樓",
            "map_code": "pry_d04_a"
          },
          {
            "map_name_zh": "金字塔4樓",
            "map_code": "pry_d04_b"
          },
          {
            "map_name_zh": "金字塔4樓",
            "map_code": "pry_d04_z"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "pry_d06_a"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "pry_d06_b"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "pry_d06_z"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_a"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_b"
          },
          {
            "map_name_zh": "人面獅身像地下3樓",
            "map_code": "sp_d03_z"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_a"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_b"
          },
          {
            "map_name_zh": "人面獅身像地下4樓",
            "map_code": "sp_d04_z"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_a"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_b"
          },
          {
            "map_name_zh": "人面獅身像地下5樓",
            "map_code": "sp_d05_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 0.23,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 1.35,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "設置用陷阱道具",
            "rate_percent": 6.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/1065.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "邪惡箱卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4205.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "書[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/540106.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖言之書[2]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/540107.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "賢者的日記[2]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/540112.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "狡猾邪惡箱",
        "monster_name_en": "C5_MIMIC",
        "id": 2753,
        "image_url": "https://assets.twroz.wiki/images/monsters/2753.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 56,
          "hp": 9695,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "327-439",
          "physical_defense_def": 63,
          "magic_defense_mdef": 15,
          "hit_100_percent": 376,
          "flee_95_percent": 335
        },
        "spawn_locations": [
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "moc_pryd06"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "pry_d06_a"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "pry_d06_b"
          },
          {
            "map_name_zh": "金字塔地下2樓",
            "map_code": "pry_d06_z"
          }
        ],
        "drops": [
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 1.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 6.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "設置用陷阱道具",
            "rate_percent": 30.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/1065.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "邪惡箱卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4205.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "邪惡禮盒",
        "monster_name_en": "MYSTCASE",
        "id": 1249,
        "image_url": "https://assets.twroz.wiki/images/monsters/1249.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 78,
          "hp": 70200,
          "base_exp": 42121,
          "job_exp": "???",
          "attack_power": "119-147",
          "physical_defense_def": 100,
          "magic_defense_mdef": 22,
          "hit_100_percent": 302,
          "flee_95_percent": 287
        },
        "spawn_locations": [
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_a"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_b"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_z"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xmas_dun02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "糖果",
            "rate_percent": 1.7,
            "item_image_url": "https://assets.twroz.wiki/images/items/529.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "柺杖糖",
            "rate_percent": 0.45,
            "item_image_url": "https://assets.twroz.wiki/images/items/530.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "小蛋糕",
            "rate_percent": 10.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/539.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "珍珠",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/722.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "2克拉鑽石",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/731.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "邪惡禮盒卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4206.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)天使小禮帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/401035.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "聖職之衣[1](2-3詞條)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/450354.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒邪惡禮盒",
        "monster_name_en": "C4_MYSTCASE",
        "id": 2737,
        "image_url": "https://assets.twroz.wiki/images/monsters/2737.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 78,
          "hp": 439065,
          "base_exp": 44281,
          "job_exp": "???",
          "attack_power": "129-161",
          "physical_defense_def": 100,
          "magic_defense_mdef": 22,
          "hit_100_percent": 307,
          "flee_95_percent": 287
        },
        "spawn_locations": [
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_a"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_b"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_z"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xmas_dun02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "糖果",
            "rate_percent": 8.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/529.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "柺杖糖",
            "rate_percent": 2.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/530.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "小蛋糕",
            "rate_percent": 50.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/539.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 25.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神秘藍箱",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/603.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "珍珠",
            "rate_percent": 3.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/722.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "2克拉鑽石",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/731.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "邪惡禮盒卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4206.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "玩具士兵",
        "monster_name_en": "CRUISER",
        "id": 1248,
        "image_url": "https://assets.twroz.wiki/images/monsters/1248.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "人形",
          "element": "聖屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 82,
          "hp": 73800,
          "base_exp": 44281,
          "job_exp": "???",
          "attack_power": "102-124",
          "physical_defense_def": 40,
          "magic_defense_mdef": 36,
          "hit_100_percent": 294,
          "flee_95_percent": 289
        },
        "spawn_locations": [
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_a"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_b"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xma_d02_z"
          },
          {
            "map_name_zh": "玩具分類場",
            "map_code": "xmas_dun02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 0.44,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 17.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "風靈原石",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/996.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "手銬",
            "rate_percent": 4.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/1098.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神聖之帽",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2251.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "玩具士兵卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4297.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火焰纏繞的符石",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/1002451.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "汙染史汀",
        "monster_name_en": "STING_MJ",
        "id": 20370,
        "image_url": "https://assets.twroz.wiki/images/monsters/20370.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 109,
          "hp": 2297907,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "3,467-5,025",
          "physical_defense_def": 276,
          "magic_defense_mdef": 100,
          "hit_100_percent": 420,
          "flee_95_percent": 471
        },
        "spawn_locations": [
          {
            "map_name_zh": "地下洞穴1樓",
            "map_code": "gl_dun01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.3,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "煤礦",
            "rate_percent": 1.6,
            "item_image_url": "https://assets.twroz.wiki/images/items/1003.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥團",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/7004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "寵物髮帶",
            "rate_percent": 0.13,
            "item_image_url": "https://assets.twroz.wiki/images/items/10007.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "史汀",
        "monster_name_en": "STING",
        "id": 1207,
        "image_url": "https://assets.twroz.wiki/images/monsters/1207.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 104,
          "hp": 10143,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "847-1,165",
          "physical_defense_def": 146,
          "magic_defense_mdef": 34,
          "hit_100_percent": 357,
          "flee_95_percent": 401
        },
        "spawn_locations": [
          {
            "map_name_zh": "地下洞穴1樓",
            "map_code": "gl_dun01"
          },
          {
            "map_name_zh": "地下水道3樓",
            "map_code": "gl_sew03"
          }
        ],
        "drops": [
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.13,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "煤礦",
            "rate_percent": 0.65,
            "item_image_url": "https://assets.twroz.wiki/images/items/1003.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "史汀卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4226.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥團",
            "rate_percent": 24.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/7004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "寵物髮帶",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/10007.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)史汀帽子(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/401083.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "狡猾史汀",
        "monster_name_en": "C5_STING",
        "id": 2640,
        "image_url": "https://assets.twroz.wiki/images/monsters/2640.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 104,
          "hp": 50715,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "973-1,355",
          "physical_defense_def": 146,
          "magic_defense_mdef": 34,
          "hit_100_percent": 357,
          "flee_95_percent": 401
        },
        "spawn_locations": [
          {
            "map_name_zh": "地下水道3樓",
            "map_code": "gl_sew03"
          }
        ],
        "drops": [
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.65,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "煤礦",
            "rate_percent": 3.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1003.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "史汀卡片",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/4226.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥團",
            "rate_percent": 100,
            "item_image_url": "https://assets.twroz.wiki/images/items/7004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "寵物髮帶",
            "rate_percent": 0.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/10007.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "泥人",
        "monster_name_en": "SAND_MAN",
        "id": 1165,
        "image_url": "https://assets.twroz.wiki/images/monsters/1165.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 79,
          "hp": 11933,
          "base_exp": 6075,
          "job_exp": 1695,
          "attack_power": 244,
          "physical_defense_def": 126,
          "magic_defense_mdef": 24,
          "hit_100_percent": 292,
          "flee_95_percent": 291
        },
        "spawn_locations": [
          {
            "map_name_zh": "蘇克拉特沙漠",
            "map_code": "moc_fild16"
          },
          {
            "map_name_zh": "蘇克拉特沙漠",
            "map_code": "moc_fild17"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.59,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.18,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "星星的粉末",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1001.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃玉碎片",
            "rate_percent": 26.68,
            "item_image_url": "https://assets.twroz.wiki/images/items/1056.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥人卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4101.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃晶沙",
            "rate_percent": 1.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/7043.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)沙灘排球(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400873.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "塔勒拳刃[2](2-3詞條)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/610082.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒泥人",
        "monster_name_en": "C4_SAND_MAN",
        "id": 2674,
        "image_url": "https://assets.twroz.wiki/images/monsters/2674.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "地屬性3",
          "size": "中型"
        },
        "stats": {
          "level": 79,
          "hp": 59665,
          "base_exp": 91170,
          "job_exp": 25428,
          "attack_power": 292,
          "physical_defense_def": 126,
          "magic_defense_mdef": 24,
          "hit_100_percent": 294,
          "flee_95_percent": 291
        },
        "spawn_locations": [
          {
            "map_name_zh": "蘇克拉特沙漠",
            "map_code": "moc_fild16"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.59,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.18,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "星星的粉末",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/1001.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃玉碎片",
            "rate_percent": 26.68,
            "item_image_url": "https://assets.twroz.wiki/images/items/1056.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥人卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4101.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃晶沙",
            "rate_percent": 1.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/7043.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "將軍魔碑",
        "monster_name_en": "GREATEST_GENERAL",
        "id": 1277,
        "image_url": "https://assets.twroz.wiki/images/monsters/1277.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 66,
          "hp": 5563,
          "base_exp": 3690,
          "job_exp": 1063,
          "attack_power": 151,
          "physical_defense_def": 114,
          "magic_defense_mdef": 36,
          "hit_100_percent": 300,
          "flee_95_percent": 270
        },
        "spawn_locations": [
          {
            "map_name_zh": "斐揚洞穴4樓廢村",
            "map_code": "pay_d03_a"
          },
          {
            "map_name_zh": "斐揚洞穴4樓廢村",
            "map_code": "pay_d03_b"
          },
          {
            "map_name_zh": "斐揚洞穴4樓廢村",
            "map_code": "pay_d03_z"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_d04_a"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_d04_b"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_d04_z"
          },
          {
            "map_name_zh": "斐揚洞穴4樓廢村",
            "map_code": "pay_dun03"
          },
          {
            "map_name_zh": "斐揚洞穴5樓廢村",
            "map_code": "pay_dun04"
          },
          {
            "map_name_zh": "斐揚森林",
            "map_code": "pay_fild10"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "馬牌",
            "rate_percent": 1.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/662.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "地震術等級3",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/686.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "瑪哪樹枝",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/1019.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "停止標誌頭飾",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2272.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "將軍魔碑卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4283.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 10,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)判官帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/430012.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "木錘[4](2-3詞條)",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/590072.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "迅捷將軍魔碑",
        "monster_name_en": "C1_GREATEST_GENERAL",
        "id": 2809,
        "image_url": "https://assets.twroz.wiki/images/monsters/2809.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 66,
          "hp": 27815,
          "base_exp": 55350,
          "job_exp": 15941,
          "attack_power": 181,
          "physical_defense_def": 114,
          "magic_defense_mdef": 36,
          "hit_100_percent": 300,
          "flee_95_percent": 270
        },
        "spawn_locations": [
          {
            "map_name_zh": "斐揚森林",
            "map_code": "pay_fild10"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 6.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "馬牌",
            "rate_percent": 7.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/662.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "地震術等級3",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/686.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "瑪哪樹枝",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/1019.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "停止標誌頭飾",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/2272.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "將軍魔碑卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4283.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 50,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "木錘[4](2-3詞條)",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/590072.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "南瓜先生",
        "monster_name_en": "JAKK",
        "id": 1130,
        "image_url": "https://assets.twroz.wiki/images/monsters/1130.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "火屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 63,
          "hp": 29940,
          "base_exp": 18863,
          "job_exp": "???",
          "attack_power": 169,
          "physical_defense_def": 90,
          "magic_defense_mdef": 25,
          "hit_100_percent": 309,
          "flee_95_percent": 299
        },
        "spawn_locations": [
          {
            "map_name_zh": "吉芬地下密穴2樓",
            "map_code": "gef_d01_a"
          },
          {
            "map_name_zh": "吉芬地下密穴2樓",
            "map_code": "gef_d01_b"
          },
          {
            "map_name_zh": "吉芬地下密穴2樓",
            "map_code": "gef_d01_z"
          },
          {
            "map_name_zh": "吉芬地下密穴2樓",
            "map_code": "gef_dun01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "南瓜",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/535.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 4.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁",
            "rate_percent": 0.16,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泯滅之心",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/1008.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "南瓜頭",
            "rate_percent": 45,
            "item_image_url": "https://assets.twroz.wiki/images/items/1062.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "南瓜先生卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4109.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "緊身便衣[1]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/450313.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "三叉戟[3]",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/630042.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "轉轉蛋",
        "monster_name_en": "EGGYRA",
        "id": 1116,
        "image_url": "https://assets.twroz.wiki/images/monsters/1116.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "念屬性2",
          "size": "中型"
        },
        "stats": {
          "level": 53,
          "hp": 3275,
          "base_exp": 2130,
          "job_exp": 714,
          "attack_power": 116,
          "physical_defense_def": 85,
          "magic_defense_mdef": 20,
          "hit_100_percent": 282,
          "flee_95_percent": 286
        },
        "spawn_locations": [
          {
            "map_name_zh": "斐揚洞穴2樓",
            "map_code": "pay_d01_a"
          },
          {
            "map_name_zh": "斐揚洞穴2樓",
            "map_code": "pay_d01_b"
          },
          {
            "map_name_zh": "斐揚洞穴2樓",
            "map_code": "pay_d01_z"
          },
          {
            "map_name_zh": "斐揚洞穴2樓",
            "map_code": "pay_dun01"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "攜帶用孵蛋器",
            "rate_percent": 1.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/643.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "集中藥水",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/645.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.29,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "雪勒結晶",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/911.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "轉轉蛋卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4070.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蛋殼帽",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/5015.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "蛋殼碎片",
            "rate_percent": 2.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/7032.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "騎兵之劍[3](2詞條)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/500116.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "巨石怪",
        "monster_name_en": "GOLEM",
        "id": 1040,
        "image_url": "https://assets.twroz.wiki/images/monsters/1040.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "大型"
        },
        "stats": {
          "level": 79,
          "hp": 11933,
          "base_exp": "5,792",
          "job_exp": "1,695",
          "attack_power": "223",
          "physical_defense_def": 190,
          "magic_defense_mdef": 12,
          "hit_100_percent": 307,
          "flee_95_percent": 284
        },
        "spawn_locations": [
          {
            "map_name_zh": "山特樂曼西區",
            "map_code": "cmd_fild06"
          },
          {
            "map_name_zh": "山特樂曼東區",
            "map_code": "cmd_fild08"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色魔力礦石",
            "rate_percent": 1.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/715.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 0.35,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 1.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "石心",
            "rate_percent": 45.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/953.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 1.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/999.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨石怪卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4072.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)草原風(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400856.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "銀盾[1]",
            "rate_percent": 0.03,
            "item_image_url": "https://assets.twroz.wiki/images/items/460070.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒巨石怪",
        "monster_name_en": "C4_GOLEM",
        "id": 2812,
        "image_url": "https://assets.twroz.wiki/images/monsters/2812.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性3",
          "size": "大型"
        },
        "stats": {
          "level": 79,
          "hp": 59665,
          "base_exp": "86,880",
          "job_exp": "25,428",
          "attack_power": "267",
          "physical_defense_def": 190,
          "magic_defense_mdef": 12,
          "hit_100_percent": 315,
          "flee_95_percent": 284
        },
        "spawn_locations": [
          {
            "map_name_zh": "山特樂曼西區",
            "map_code": "cmd_fild06"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色魔力礦石",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/715.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 1.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 5.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "石心",
            "rate_percent": 100.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/953.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐵",
            "rate_percent": 8.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/998.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵",
            "rate_percent": 3.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/999.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨石怪卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4072.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "銀盾[1]",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/460070.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "鐘乳巨石怪",
        "monster_name_en": "STALACTIC_GOLEM",
        "id": 1278,
        "image_url": "https://assets.twroz.wiki/images/monsters/1278.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 68,
          "hp": 7183,
          "base_exp": 4426,
          "job_exp": 1315,
          "attack_power": "218",
          "physical_defense_def": 230,
          "magic_defense_mdef": 5,
          "hit_100_percent": 316,
          "flee_95_percent": 308
        },
        "spawn_locations": [
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_a"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_b"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_z"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "beach_dun2"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁",
            "rate_percent": 0.82,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.15,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "星星的角",
            "rate_percent": 1.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1000.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐘乳巨石怪卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4223.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥團",
            "rate_percent": 10.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/7004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 24.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)單色無邊帽(歸屬)",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/400934.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "憤怒鐘乳巨石怪",
        "monster_name_en": "C4_STALACTIC_GOLEM",
        "id": 2644,
        "image_url": "https://assets.twroz.wiki/images/monsters/2644.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 68,
          "hp": 35915,
          "base_exp": 66390,
          "job_exp": 19724,
          "attack_power": 261,
          "physical_defense_def": 230,
          "magic_defense_mdef": 5,
          "hit_100_percent": 330,
          "flee_95_percent": 308
        },
        "spawn_locations": [
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_a"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_b"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_z"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "beach_dun2"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 6.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁",
            "rate_percent": 4.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土靈原石",
            "rate_percent": 0.75,
            "item_image_url": "https://assets.twroz.wiki/images/items/997.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "星星的角",
            "rate_percent": 6.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/1000.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐘乳巨石怪卡片",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/4255.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "泥團",
            "rate_percent": 50.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/7004.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 100.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "邪惡摩艾",
        "monster_name_en": "MEGALITH",
        "id": 1274,
        "image_url": "https://assets.twroz.wiki/images/monsters/1274.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 68,
          "hp": 6335,
          "base_exp": 3978,
          "job_exp": 1175,
          "attack_power": 199,
          "physical_defense_def": 66,
          "magic_defense_mdef": 18,
          "hit_100_percent": 279,
          "flee_95_percent": 335
        },
        "spawn_locations": [
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_a"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_b"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "bea_d02_z"
          },
          {
            "map_name_zh": "北邊洞穴盧安達",
            "map_code": "beach_dun2"
          }
        ],
        "drops": [
          {
            "item_name_zh": "鋁原石",
            "rate_percent": 1.04,
            "item_image_url": "https://assets.twroz.wiki/images/items/757.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 0.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋁",
            "rate_percent": 0.31,
            "item_image_url": "https://assets.twroz.wiki/images/items/985.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "邪惡摩艾卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4200.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "石頭",
            "rate_percent": 5.0,
            "item_image_url": "https://assets.twroz.wiki/images/items/7049.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "國王波利",
        "monster_name_en": "MD_KING_PORING",
        "id": 3810,
        "image_url": "https://assets.twroz.wiki/images/monsters/3810.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "無屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 68,
          "hp": 7183,
          "base_exp": "4,426",
          "job_exp": "1,315",
          "attack_power": "218",
          "physical_defense_def": 230,
          "magic_defense_mdef": 5,
          "hit_100_percent": 316,
          "flee_95_percent": 284
        },
        "spawn_locations": [
          {
            "map_name_zh": "波利村副本",
            "map_code": "N/A"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "白色藥草",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/509.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "藍色藥草",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/510.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "綠色藥草",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/511.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "光澤傑勒比結晶",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/6498.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨大傑勒比結晶",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/7126.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波利村大蔥",
            "rate_percent": "寶箱機率獲得",
            "item_image_url": "https://assets.twroz.wiki/images/items/19238.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波利村紅蘿蔔",
            "rate_percent": "寶箱機率獲得",
            "item_image_url": "https://assets.twroz.wiki/images/items/19239.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "果凍碎片箱子",
            "rate_percent": "寶箱獎勵之一",
            "item_image_url": "https://assets.twroz.wiki/images/items/23649.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波利果凍碎片",
            "rate_percent": "寶箱獎勵之一",
            "item_image_url": "https://assets.twroz.wiki/images/items/25465.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "波波利果凍碎片",
            "rate_percent": "寶箱獎勵之一",
            "item_image_url": "https://assets.twroz.wiki/images/items/25466.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土波利果凍碎片",
            "rate_percent": "寶箱獎勵之一",
            "item_image_url": "https://assets.twroz.wiki/images/items/25467.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "土波利果凍碎片",
            "rate_percent": "寶箱獎勵之一",
            "item_image_url": "https://assets.twroz.wiki/images/items/25466.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "惡魔波利果凍碎片",
            "rate_percent": "寶箱獎勵之一",
            "item_image_url": "https://assets.twroz.wiki/images/items/25467.gif?w=24&h=24&auto=compress&format=webp"
          },
        ]
      },
      {
        "monster_name_zh": "直升機哥布靈",
        "monster_name_en": "ROTAR_ZAIRO",
        "id": 1392,
        "image_url": "https://assets.twroz.wiki/images/monsters/1392.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "風屬性2",
          "size": "大型"
        },
        "stats": {
          "level": 57,
          "hp": 4411,
          "base_exp": 2592,
          "job_exp": 729,
          "attack_power": "122",
          "physical_defense_def": 57,
          "magic_defense_mdef": 34,
          "hit_100_percent": 328,
          "flee_95_percent": 289
        },
        "spawn_locations": [
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_a"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_b"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_f11_z"
          },
          {
            "map_name_zh": "普隆德拉區域",
            "map_code": "prt_fild11"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "加勒結晶",
            "rate_percent": 27.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/910.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "剎勒空結晶",
            "rate_percent": 12.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/912.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鋼鐵",
            "rate_percent": 2.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/999.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "直升機哥布靈卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4192.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "賽依伐",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7053.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "巨大傑勒比結晶",
            "rate_percent": 2.5,
            "item_image_url": "https://assets.twroz.wiki/images/items/7126.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "(服飾)嚇壞眼的假面(歸屬)",
            "rate_percent": null,
            "item_image_url": "https://assets.twroz.wiki/images/items/436014.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "麥斯特",
        "monster_name_en": "MYST",
        "id": 1151,
        "image_url": "https://assets.twroz.wiki/images/monsters/1151.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "毒屬性1",
          "size": "大型"
        },
        "stats": {
          "level": 98,
          "hp": 137592,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "160-200",
          "physical_defense_def": 122,
          "magic_defense_mdef": 20,
          "hit_100_percent": 337,
          "flee_95_percent": 312
        },
        "spawn_locations": [
          {
            "map_name_zh": "妙勒尼廢棄礦場3樓",
            "map_code": "mjo_d03_a"
          },
          {
            "map_name_zh": "妙勒尼廢棄礦場3樓",
            "map_code": "mjo_d03_b"
          },
          {
            "map_name_zh": "妙勒尼廢棄礦場3樓",
            "map_code": "mjo_d03_z"
          },
          {
            "map_name_zh": "妙勒尼廢棄礦場3樓",
            "map_code": "mjo_dun03"
          }
        ],
        "drops": [
          {
            "item_name_zh": "蒼蠅翅膀",
            "rate_percent": 5,
            "item_image_url": "https://assets.twroz.wiki/images/items/601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "曼特療傷藥",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/605.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "神之金屬原石",
            "rate_percent": 0.33,
            "item_image_url": "https://assets.twroz.wiki/images/items/756.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "瑪哪樹枝",
            "rate_percent": 4,
            "item_image_url": "https://assets.twroz.wiki/images/items/1019.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "力量戒指",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/2601.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "麥斯特卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/4108.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "防毒面具",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/5005.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "三色假髮",
            "rate_percent": 0.05,
            "item_image_url": "https://assets.twroz.wiki/images/items/10005.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "火焰纏繞的原木",
            "rate_percent": "???",
            "item_image_url": "https://assets.twroz.wiki/images/items/1002445.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "巨大萌萌波利",
        "monster_name_en": "MD_AMERING",
        "id": 3812,
        "image_url": "https://assets.twroz.wiki/images/monsters/3812.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "毒屬性1",
          "size": "大型"
        },
        "stats": {
          "level": 35,
          "hp": 72810,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "152-192",
          "physical_defense_def": 10,
          "magic_defense_mdef": 10,
          "hit_100_percent": 283,
          "flee_95_percent": 258
        },
        "spawn_locations": [
          {
            "map_name_zh": "暫無出沒資料",
            "map_code": "暫無出沒資料"
          }
        ],
        "drops": [
          {
            "item_name_zh": "紅色藥草",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/507.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "藍色藥草",
            "rate_percent": 1,
            "item_image_url": "https://assets.twroz.wiki/images/items/510.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "紫寶石",
            "rate_percent": 0.1,
            "item_image_url": "https://assets.twroz.wiki/images/items/719.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "光澤傑勒比結晶",
            "rate_percent": 30,
            "item_image_url": "https://assets.twroz.wiki/images/items/6498.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "巨大黃金波利",
        "monster_name_en": "MD_GOLDRING",
        "id": 3811,
        "image_url": "https://assets.twroz.wiki/images/monsters/3811.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形" ,
          "element": "聖屬性1" ,
          "size": "大型"
        },
        "stats": {
          "level": 35 ,
          "hp": 72118 ,
          "base_exp": "???" ,
          "job_exp": "???" ,
          "attack_power": "153-193" ,
          "physical_defense_def": 10 ,
          "magic_defense_mdef": 10 ,
          "hit_100_percent": 283 ,
          "flee_95_percent": 258
        },
        "spawn_locations": [
          {
            "map_name_zh": "暫無出沒資料",
            "map_code": "N/A"
          }
        ],
        "drops": [
          {
            "item_name_zh": "黃色藥草",
            "rate_percent": 30 ,
            "item_image_url": "https://assets.twroz.wiki/images/items/508.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃色纖細藥水",
            "rate_percent": 0.1 ,
            "item_image_url": "https://assets.twroz.wiki/images/items/546.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "黃寶石",
            "rate_percent": 0.1 ,
            "item_image_url": "https://assets.twroz.wiki/images/items/728.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "光澤傑勒比結晶",
            "rate_percent": 30 ,
            "item_image_url": "https://assets.twroz.wiki/images/items/6498.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
      {
        "monster_name_zh": "血腥騎士",
        "monster_name_en": "BLOODY_KNIGHT",
        "id": 1268,
        "image_url": "https://assets.twroz.wiki/images/monsters/1268.gif?w=80&h=80&auto=compress&format=webp",
        "attributes": {
          "race": "無形",
          "element": "暗屬性4",
          "size": "大型"
        },
        "stats": {
          "level": 116,
          "hp": 68500,
          "base_exp": "???",
          "job_exp": "???",
          "attack_power": "1,303-1,831",
          "physical_defense_def": 122,
          "magic_defense_mdef": 50,
          "hit_100_percent": 384,
          "flee_95_percent": 438
        },
        "spawn_locations": [
          {
            "map_name_zh": "騎士團2樓",
            "map_code": "gl_knt02"
          }
        ],
        "drops": [
          {
            "item_name_zh": "亞藍斯之劍",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/1170.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "鐮戟[1]",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/1417.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "金屬頭盔[1]",
            "rate_percent": 0.23,
            "item_image_url": "https://assets.twroz.wiki/images/items/2229.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "布里刊",
            "rate_percent": 24.25,
            "item_image_url": "https://assets.twroz.wiki/images/items/7054.gif?w=24&h=24&auto=compress&format=webp"
          },
          {
            "item_name_zh": "血腥騎士卡片",
            "rate_percent": 0.01,
            "item_image_url": "https://assets.twroz.wiki/images/items/27275.gif?w=24&h=24&auto=compress&format=webp"
          }
        ]
      },
    ]
)

// ✅ 過濾結果
const filteredMonsters = computed(() => {
  return monsters.value.filter(m => {
    // ✅ 名稱 / 地圖搜尋
    const matchesName =
        search.value === "" ||
        m.monster_name_zh.includes(search.value) ||
        m.spawn_locations.some(loc =>
            loc.map_name_zh.includes(search.value) ||
            loc.map_code.includes(search.value)
        )

    // ✅ 等級範圍
    const matchesLevel =
        (!minLevel.value || m.stats.level >= parseInt(minLevel.value)) &&
        (!maxLevel.value || m.stats.level <= parseInt(maxLevel.value))

    // ✅ 屬性篩選
    const matchesElement =
        selectedElement.value.length === 0 ||
        selectedElement.value.includes("all") ||
        selectedElement.value.some(e => m.attributes.element.includes(e))

    // ✅ 種族篩選
    const matchesRace =
        selectedRace.value.length === 0 ||
        selectedRace.value.includes("all") ||
        selectedRace.value.some(r => m.attributes.race.includes(r))

    // ✅ 大小篩選
    const matchesSize =
        selectedSize.value.length === 0 ||
        selectedSize.value.includes("all") ||
        selectedSize.value.includes(m.attributes.size)

    return matchesName && matchesLevel && matchesElement && matchesRace && matchesSize
  })
      // ✅ 排序 (依 sortAsc)
      .sort((a, b) => sortAsc.value
          ? a.stats.level - b.stats.level  // 小 → 大
          : b.stats.level - a.stats.level  // 大 → 小
      )


})

watch(filteredMonsters, () => {
  nextTick(() => {
    initFlowbite()
  })
})

// ✅ 切換種族
function toggleRace(id) {
// 如果點擊 ALL
  // 如果有選 ALL，先清除
  if (id === 'all') {
    selectedRace.value = ['all']
    return
  }

  // 如果列表包含 ALL，先移除 ALL
  if (selectedRace.value.includes('all')) {
    selectedRace.value = []
  }

  // ✅ 如果已存在 → 取消選取
  if (selectedRace.value.includes(id)) {
    selectedRace.value = selectedRace.value.filter(e => e !== id)
  } else {
    // 加入新選項
    selectedRace.value.push(id)
  }

  //如果空 → 設置為all
  if(selectedRace.value.length === 0){
    selectedRace.value.push('all')
  }
}

// ✅ 切換體型
function toggleSize(id) {
// 如果點擊 ALL
  // 如果有選 ALL，先清除
  if (id === 'all') {
    selectedSize.value = ['all']
    return
  }

  // 如果列表包含 ALL，先移除 ALL
  if (selectedSize.value.includes('all')) {
    selectedSize.value = []
  }

  // ✅ 如果已存在 → 取消選取
  if (selectedSize.value.includes(id)) {
    selectedSize.value = selectedSize.value.filter(e => e !== id)
  } else {
    // 加入新選項
    selectedSize.value.push(id)
  }

  //如果空 → 設置為all
  if(selectedSize.value.length === 0){
    selectedSize.value.push('all')
  }
}

// ✅ 切換屬性
function toggleElement(id) {

  // 如果點擊 ALL
  // 如果有選 ALL，先清除
  if (id === 'all') {
    selectedElement.value = ['all']
    return
  }

  // 如果列表包含 ALL，先移除 ALL
  if (selectedElement.value.includes('all')) {
    selectedElement.value = []
  }

  // ✅ 如果已存在 → 取消選取
  if (selectedElement.value.includes(id)) {
    selectedElement.value = selectedElement.value.filter(e => e !== id)
  } else {
    // 加入新選項
    selectedElement.value.push(id)
  }

  //如果空 → 設置為all
  if (selectedElement.value.length === 0) {
    selectedElement.value.push('all')
  }

}

// 清除所有篩選
function clearFilters() {
  search.value = ""
  minLevel.value = ""
  maxLevel.value = ""
  selectedElement.value = ['all']
  selectedRace.value = ['all']
  selectedSize.value = ['all']


}

function displayValue(value) {
  // 如果可以轉成數字，且不是 NaN，就做千分位格式化
  if (!isNaN(value)) {
    return Number(value).toLocaleString();
  }

  // 否則當字串回傳
  return value;
}

function selectMap(value) {
  search.value = value
}

</script>

<template>
  <!--   bg-[#3a2c1f]-->
  <div class="p-4 text-white min-h-screen">

    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-yellow-400">搜尋</h1>

    </div>

    <!-- 搜尋區 -->
    <div class="mb-4 grid gap-2">
      <div class="flex mb-2 flex-wrap gap-2">
        <input
            v-model="search"
            type="text"
            placeholder="輸入怪物名稱..."
            class="bg-[#2b1e12] w-1/2 border border-yellow-600 rounded px-3 py-2 text-white placeholder-gray-400"
        />

        <button
            @click="clearFilters"
            class="bg-[#2b1e12] hover:bg-red-700 px-4 py-2 rounded text-sm font-bold"
        >
          清除篩選條件
        </button>
      </div>


      <div class="flex items-center gap-2">
        <span class="text-xl text-yellow-400 font-bold">等級：</span>
        <input
            v-model="minLevel"
            type="number"
            class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white"
            placeholder="MIN"
        >
        <span>-</span>
        <input
            v-model="maxLevel"
            type="number"
            class="w-20 bg-[#2b1e12] border border-yellow-600 rounded px-2 py-1 text-white"
            placeholder="MAX"
        >
        <button
            @click="sortAsc = !sortAsc"
            class="bg-[#2b1e12] hover:bg-red-700 px-4 py-2 rounded text-sm font-bold"
        >
          切換排序
        </button>
      </div>
    </div>

    <!-- 屬性篩選 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-yellow-400 font-bold mb-2">屬性</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="e in elementList"
            :key="e.id"
            @click="toggleElement(e.id)"
            class="px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedElement.includes(e.id)
              ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ e.name }}
        </button>
      </div>

    </div>

    <!-- 種族篩選 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-yellow-400 font-bold mb-2">種族</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="r in raceList"
            :key="r.id"
            @click="toggleRace(r.id)"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedRace.includes(r.id)
              ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ r.name }}
        </button>
      </div>
    </div>

    <!-- 大小 -->
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-yellow-400 font-bold mb-2">大小</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
            v-for="s in sizeList"
            :key="s.id"
            @click="toggleSize(s.id)"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform"
            :class="selectedSize.includes(s.id)
             ? 'bg-[#FAD2A8] to-yellow-600 text-black shadow-xl'
              : 'bg-[#6C5543] text-white hover:bg-[#8C5843]'"
        >
          {{ s.name }}
        </button>
      </div>
    </div>

    <!-- 結果統計 -->
    <div class="mb-4 p-3 bg-[#2b1e12] border border-yellow-600 rounded">
      <span class="text-yellow-400 font-bold">搜尋結果：</span>
      <span class="text-white">共 {{ filteredMonsters.length }} 隻怪物</span>
    </div>

    <!-- 怪物結果 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      <div v-for="m in filteredMonsters" :key="m.id"
           class="bg-[#f0e4d6] rounded p-4 text-black shadow-lg hover:shadow-xl transition-all">

        <div class="flex justify-between">
          <!-- 圖片觸發 dropdown -->
          <img
              :id="'dropdownHoverButton' + m.id"
              :data-dropdown-toggle="'dropdownHover' + m.id"
              data-dropdown-placement="right"
              data-dropdown-trigger="hover"
              src="assets/image/icon/map.png"
              alt="map icon"
              class="w-10 h-10 cursor-pointer"
          />

          <!-- Dropdown menu -->
          <div
              :id="'dropdownHover' + m.id"
              class="z-10 hidden bg-black rounded-xs shadow-sm w-44 "
          >
            <ul class="py-2 text-sm text-gray-200 "
                :aria-labelledby="'dropdownHoverButton'+m.id" v-for="map in m.spawn_locations">
              <li>
                <a @click="selectMap(map.map_code)"
                   class=" px-2 py-1 hover:bg-gray-600 hover:text-white pointer cursor-pointer">
                  {{ map.map_name_zh }}({{ map.map_code }})
                </a>
              </li>

            </ul>
          </div>


          <div class="flex h-6">
            <p style="border-radius: 2px" class="bg-[#DCD692] text-xs pt-1 ps-2 pe-2 me-1">{{ m.attributes.race }}</p>
            <p style="border-radius: 2px" class="bg-[#C5DCBC] text-xs pt-1 ps-2 pe-2 me-1">{{
                m.attributes.element
              }}</p>
            <p style="border-radius: 2px" class="bg-[#DCD6B8] text-xs pt-1 ps-2 pe-2">{{ m.attributes.size }}</p>
          </div>

        </div>

        <img :src="m.image_url" alt="" class="w-full h-12 object-contain mb-3 rounded">

        <h2 class="font-bold text-lg text-yellow-800">{{ m.monster_name_zh }}</h2>
        <h2 class="text-xs text-gray-500">{{ m.id }}</h2>
        <h2 class="text-xs text-gray-500">{{ m.monster_name_en }}</h2>

        <p class="text-sm flex justify-center"><strong>等級：</strong><span class="statsColor">{{ m.stats.level }}</span>
        </p>
        <p class="text-sm flex justify-center"><strong>血量：</strong><span
            class="statsColor">{{ displayValue(m.stats.hp) }}</span></p>
        <p class="text-sm flex justify-center"><strong>經驗值：</strong><span
            class="statsColor">{{ displayValue(m.stats.base_exp) }}</span></p>
        <p class="text-sm flex justify-center"><strong>職業經驗值：</strong><span
            class="statsColor">{{ displayValue(m.stats.job_exp) }}</span></p>
        <p class="text-sm flex justify-center"><strong>攻擊力：</strong><span class="statsColor">{{
            m.stats.attack_power
          }}</span></p>
        <p class="text-sm flex justify-center"><strong>物理防禦：</strong><span
            class="statsColor">{{ m.stats.physical_defense_def }}</span></p>
        <p class="text-sm flex justify-center"><strong>魔法防禦：</strong><span
            class="statsColor">{{ m.stats.magic_defense_mdef }}</span></p>
        <p class="text-sm flex justify-center"><strong>100%命中：</strong><span
            class="statsColor">{{ m.stats.hit_100_percent }}</span></p>
        <p class="text-sm flex justify-center"><strong>95%迴避：</strong><span
            class="statsColor">{{ m.stats.flee_95_percent }}</span></p>

        <hr class="my-3 border-yellow-700">

        <h3 class="font-bold text-yellow-700 mb-2">掉落物品</h3>
        <ul class="text-sm">
          <li v-for="drop in m.drops" :key="drop.item" class="flex justify-between">
            <div class="flex">
              <img :src="drop.item_image_url" alt="" class="w-5 h-5">
              <span>{{ drop.item_name_zh }}</span>
            </div>
            <span class="text-red-600 font-bold">{{ drop.rate_percent }}%</span>
          </li>
        </ul>
      </div>
    </div>


    <!-- 無結果提示 -->
    <div v-if="filteredMonsters.length === 0" class="text-center py-20">
      <p class="text-2xl text-yellow-400 mb-4">😢 找不到符合條件的怪物</p>
      <button
          @click="clearFilters"
          class="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded font-bold text-black"
      >
        清除篩選條件
      </button>
    </div>

  </div>
</template>

<style scoped>
/* 添加平滑過渡效果 */
button {
  transition: all 0.2s ease;
}

/* 輸入框樣式 */
input[type="text"],
input[type="number"] {
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
}

.statsColor {
  font-weight: bold;
  color: #d2851d;
}

</style>