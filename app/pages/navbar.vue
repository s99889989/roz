<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCommonStore } from '~/stores/common.js';

const route       = useRoute();
const router      = useRouter();
const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/user';

const open    = ref(false);
const menuRef = ref(null);
const user    = ref({ name: '', email: '', picture: '' });

const navItems = [
  { to: '/roz/accounts',    icon: '👤', label: '帳號管理'     },
  { to: '/roz/teamplace',   icon: '⚔️', label: '副本組隊'     },
  { to: '/roz/teamclassic', icon: '🏰', label: '經典組隊'     },
  { to: '/roz/dungeons',    icon: '🗺️', label: '副本管理'     },
  { to: '/roz/taskcd',      icon: '⏱️', label: '任務 CD 追蹤' },
];

const logout = async () => {
  try { await fetch(`${BASE()}/logout`, { method: 'POST', credentials: 'include' }); } catch {}
  open.value = false;
  router.push('/roz/login');
};

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) open.value = false;
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  try {
    const res  = await fetch(`${BASE()}/me`, { credentials: 'include' });
    const data = await res.json();
    if (!data.error) user.value = data;
  } catch {}
});

onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <nav style="background-color: #606753"
       class="sticky top-0 z-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">

      <!-- 左側：漢堡按鈕（手機）+ 選單 -->
      <div class="flex items-center gap-2">
        <button data-collapse-toggle="navbar-multi-level" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-multi-level" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <div class="hidden w-full md:block md:w-auto" id="navbar-multi-level">
          <ul style="background-color: #606753"
              class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50
                     md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white
                     dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

            <li>
              <NuxtLink to="/monster/monster"
                        class="block font-bold text-lg py-2 px-3 text-gray-200 rounded-sm hover:bg-[#7f6753]
                               md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                               dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700
                               dark:hover:text-white md:dark:hover:bg-transparent">
                魔物查詢
              </NuxtLink>
            </li>

            <li>
              <NuxtLink to="/item/ItemViewer"
                        class="block font-bold text-lg py-2 px-3 text-gray-200 rounded-sm hover:bg-[#7f6753]
                               md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                               dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700
                               dark:hover:text-white md:dark:hover:bg-transparent">
                物品查詢
              </NuxtLink>
            </li>

            <!-- 物品 dropdown -->
            <li>
              <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownItem"
                      class="flex font-bold text-lg items-center justify-between w-full py-2 px-3 text-gray-200
                             hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                             md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white
                             dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                物品
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              <div id="dropdownItem"
                   class="z-10 hidden font-normal bg-[#6c5543] divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-200 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li><NuxtLink to="/item/ActivatedWeapons"    class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">活化武器系統(★武器)</NuxtLink></li>
                  <li><NuxtLink to="/item/DungeonEquipment"    class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">副本裝備</NuxtLink></li>
                  <li><NuxtLink to="/item/refining"            class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">精煉</NuxtLink></li>
                  <li><NuxtLink to="/item/feeding_ring"        class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">飼養戒指</NuxtLink></li>
                  <li><NuxtLink to="/item/cuisine"             class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">料理</NuxtLink></li>
                  <li><NuxtLink to="/item/ItemCrafting"        class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">物品製作</NuxtLink></li>
                  <li><NuxtLink to="/item/CardEntries"         class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">卡片詞條</NuxtLink></li>
                  <li><NuxtLink to="/other/equipment_attributes/EquipmentDataPage" class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">裝備詞條</NuxtLink></li>
                  <li><NuxtLink to="/item/sacred"              class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">聖物</NuxtLink></li>
                  <li><NuxtLink href="https://roz.gnjoy.com.tw/Notice/Notice_Info?id=217523" target="_blank" class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">服飾附魔石箱子內容</NuxtLink></li>
                </ul>
              </div>
            </li>

            <!-- 職業 dropdown -->
            <li>
              <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownProfession"
                      class="flex font-bold text-lg items-center justify-between w-full py-2 px-3 text-gray-200
                             hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                             md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white
                             dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                職業
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              <div id="dropdownProfession"
                   class="z-10 hidden font-normal bg-[#6c5543] divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-200 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
<!--                  <li><NuxtLink href="https://rz.fharr.com/db/skilltree" target="_blank"          class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">技能樹</NuxtLink></li>-->
                  <li><NuxtLink href="/profession/profession-skills"                               class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">技能樹</NuxtLink></li>
                  <li><NuxtLink to="/profession/Alchemy"                                          class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">煉金資訊</NuxtLink></li>
                  <li><NuxtLink to="/profession/AdvancedSecondJobOutfit"                          class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">進階二轉服飾</NuxtLink></li>
                </ul>
              </div>
            </li>

            <!-- 地圖 dropdown -->
            <li>
              <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownMap"
                      class="flex font-bold text-lg items-center justify-between w-full py-2 px-3 text-gray-200
                             hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                             md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white
                             dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                地圖
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              <div id="dropdownMap"
                   class="z-10 hidden font-normal bg-[#6c5543] divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-200 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li><NuxtLink to="/map/DungeonGuide" class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">副本</NuxtLink></li>
                  <li><NuxtLink to="/map/SpecialMap"   class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">特蘇地圖</NuxtLink></li>
                  <li><NuxtLink to="/map/WorldMap"     class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">世界地圖</NuxtLink></li>
                </ul>
              </div>
            </li>

            <!-- 計算工具 dropdown -->
            <li>
              <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownCalculate"
                      class="flex font-bold text-lg items-center justify-between w-full py-2 px-3 text-gray-200
                             hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                             md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white
                             dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                計算工具
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              <div id="dropdownCalculate"
                   class="z-10 hidden font-normal bg-[#6c5543] divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-200 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li><NuxtLink to="/calculate/RestoreMagic"          class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">回魔計算</NuxtLink></li>
                  <li><NuxtLink to="/calculate/state"                 class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">素質計算</NuxtLink></li>
                  <li><NuxtLink to="/calculate/level"                 class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">升級計算</NuxtLink></li>
                  <li><NuxtLink to="/calculate/DefenseCalculation"    class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">防禦計算</NuxtLink></li>
                  <li><NuxtLink to="/calculate/ReincarnationTechnique" class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">轉生術計算</NuxtLink></li>
                  <li><NuxtLink to="/calculate/HitCalc"               class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">命中迴避計算</NuxtLink></li>
                </ul>
              </div>
            </li>

            <!-- 其他 dropdown -->
            <li>
              <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownKnow"
                      class="flex font-bold text-lg items-center justify-between w-full py-2 px-3 text-gray-200
                             hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0
                             md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white
                             dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                其他
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
              <div id="dropdownKnow"
                   class="z-10 hidden font-normal bg-[#6c5543] divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-200 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li><NuxtLink to="/other/OtherWeb"          class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">樂園相關網站</NuxtLink></li>
                  <li><NuxtLink href="https://event.gnjoy.com.tw/RoZ/RoZ_ShopSearch" target="_blank" class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">露天網頁查詢</NuxtLink></li>
                  <li><NuxtLink to="/other/time_experience"   class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">定時經驗加倍</NuxtLink></li>
                  <li><NuxtLink to="/other/pet"               class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">寵物</NuxtLink></li>
                  <li><NuxtLink to="/other/tonic"             class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">補品效率</NuxtLink></li>
                  <li><NuxtLink to="/other/AttributeCounter"  class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">屬性相剋</NuxtLink></li>
                  <li><NuxtLink to="/other/WeaponSize"        class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">武器體型</NuxtLink></li>
                  <li><NuxtLink to="/other/Command"           class="block font-bold text-lg px-4 py-2 hover:bg-[#7f6753] dark:hover:bg-gray-600 dark:hover:text-white">指令</NuxtLink></li>
                </ul>
              </div>
            </li>

          </ul>
        </div>
      </div>

      <!-- 右側：頭像選單 -->
      <div class="relative shrink-0" ref="menuRef">

        <!-- 頭像按鈕 -->
        <button @click="open = !open"
                class="w-9 h-9 rounded-full overflow-hidden border-2 transition"
                :class="open ? 'border-[#f1d483]' : 'border-[#5e4b37] hover:border-[#8b7a64]'">
          <img v-if="user.picture" :src="user.picture"
               class="w-full h-full object-cover"
               referrerpolicy="no-referrer" />
          <div v-else
               class="w-full h-full bg-[#5e4b37] flex items-center justify-center text-[#f1d483] font-bold text-sm">
            {{ user.name?.charAt(0) ?? '?' }}
          </div>
        </button>

        <!-- 下拉選單 -->
        <Transition name="dropdown">
          <div v-if="open"
               class="absolute right-0 mt-2 w-56 bg-[#1e150d] border border-[#5e4b37] rounded-xl shadow-2xl overflow-hidden">

            <!-- 使用者資訊 -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-[#5e4b37]">
              <img v-if="user.picture" :src="user.picture" class="w-9 h-9 rounded-full" />
              <div class="min-w-0">
                <p class="text-[#f1d483] font-bold text-sm truncate">{{ user.name }}</p>
                <p class="text-[#a6937c] text-xs truncate">{{ user.email }}</p>
              </div>
            </div>

            <!-- 導覽 -->
            <nav class="py-1">
              <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                        @click="open = false"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm transition"
                        :class="route.path === item.to
                          ? 'bg-[#3d2b1f] text-[#f1d483] font-bold'
                          : 'text-[#e0d3b8] hover:bg-[#3d2b1f] hover:text-[#f1d483]'">
                <span class="w-5 text-center">{{ item.icon }}</span>
                {{ item.label }}
              </NuxtLink>
            </nav>

            <!-- 登出 -->
            <div class="border-t border-[#5e4b37] py-1">
              <button @click="logout"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#a6937c] hover:bg-[#3d2b1f] hover:text-[#f0a8a8] transition">
                <span class="w-5 text-center">🚪</span>
                登出
              </button>
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>