<script setup lang="ts">

</script>

<template>


  <nav style="background-color: #606753" class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-start mx-auto p-4">

      <button data-collapse-toggle="navbar-multi-level" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-multi-level" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-multi-level">
        <ul  style="background-color: #606753" class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

          <li>
            <NuxtLink to="/monster/monster" href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              魔物查詢</NuxtLink>
          </li>

          <li>
            <NuxtLink to="/item/ItemViewer" href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              物品查詢</NuxtLink>
          </li>

<!--          <li>-->
<!--            <NuxtLink to="/map/WorldMap" href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">-->
<!--              世界地圖</NuxtLink>-->
<!--          </li>-->


          <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownItem" class="flex items-center justify-between w-full py-2 px-3 text-white hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              物品 <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg></button>
            <!-- Dropdown menu -->
            <div id="dropdownItem" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                <li>
                  <NuxtLink to="/item/DungeonEquipment" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    副本裝備</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/item/refining" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    精煉</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/item/feeding_ring" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    飼養戒指</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/item/cuisine" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    料理</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/item/ItemCrafting" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    物品製作</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/item/CardEntries" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    卡片詞條</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/item/sacred" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    聖物</NuxtLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownProfession" class="flex items-center justify-between w-full py-2 px-3 text-white hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              職業<svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg></button>
            <!-- Dropdown menu -->
            <div id="dropdownProfession" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                <li>
                  <NuxtLink href="https://rz.fharr.com/db/skilltree" target="_blank" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    技能樹</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/profession/Alchemy" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    煉金資訊</NuxtLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownMap" class="flex items-center justify-between w-full py-2 px-3 text-white hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              地圖<svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg></button>
            <!-- Dropdown menu -->
            <div id="dropdownMap" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                <li>
                  <NuxtLink to="/map/DungeonGuide" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    副本</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/map/SpecialMap" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    特蘇地圖</NuxtLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownCalculate" class="flex items-center justify-between w-full py-2 px-3 text-white hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              計算工具 <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg></button>
            <!-- Dropdown menu -->
            <div id="dropdownCalculate" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                <li>
                  <NuxtLink to="/calculate/RestoreMagic" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    回魔計算</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/calculate/state" href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    素質計算</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/calculate/level" href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    升級計算</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/calculate/DefenseCalculation" href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    防禦計算</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/calculate/ReincarnationTechnique" href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    轉生術計算</NuxtLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownKnow" class="flex items-center justify-between w-full py-2 px-3 text-white hover:text-black md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
              其他<svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg></button>
            <!-- Dropdown menu -->
            <div id="dropdownKnow" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                <li>
                  <NuxtLink to="/other/OtherWeb" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    樂園相關網站</NuxtLink>
                </li>
                <li>
                  <NuxtLink href="https://event.gnjoy.com.tw/RoZ/RoZ_ShopSearch" target="_blank" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    露天網頁查詢</NuxtLink>
                </li>

                <li>
                  <NuxtLink to="/other/time_experience" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    定時經驗加倍</NuxtLink>
                </li>

                <li>
                  <NuxtLink to="/other/pet" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    寵物</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/other/tonic" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    補品效率</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/other/Command" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    指令</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/other/equipment_attributes/EquipmentDataPage" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    裝備詞條</NuxtLink>
                </li>
<!--                <li>-->
<!--                  <NuxtLink to="/test/Test" href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">-->
<!--                    測試</NuxtLink>-->
<!--                </li>-->
              </ul>
            </div>
          </li>


        </ul>
      </div>
    </div>
  </nav>

</template>

<style scoped>

</style>