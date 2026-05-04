<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[1800px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本組隊</h1>
        <p class="text-[#a6937c] text-sm mt-1">建立隊伍，為每個副本分配角色</p>
      </div>
      <div class="flex gap-2 flex-wrap items-center">
        <div class="flex bg-[#1e150d] border border-[#5e4b37] rounded-lg p-0.5">
          <button @click="viewMode = 'edit'"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="viewMode === 'edit' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            ✏️ 編輯
          </button>
          <button @click="viewMode = 'overview'; loadAllTeamDetails()"
                  class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="viewMode === 'overview' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">
            👁 總覽
          </button>
        </div>
        <button @click="showAcceptTeamModal = true"
                class="bg-[#3d4a6b] hover:bg-[#4a5b8a] text-[#a8c0f0] px-4 py-2 rounded shadow-md transition font-bold border border-[#a8c0f0]/20 text-sm">
          🔗 輸入邀請碼
        </button>
        <button @click="showCreateModal = true"
                class="bg-[#4a7c59] hover:bg-[#3d6849] text-white px-6 py-2.5 rounded shadow-md transition font-bold border border-white/10">
          ＋ 建立隊伍
        </button>
      </div>
    </div>

    <div v-if="loading" class="max-w-[1800px] mx-auto text-center py-20 text-[#a6937c] italic text-lg">讀取中...</div>

    <div v-else class="max-w-[1800px] mx-auto">
      <div v-if="teams.length === 0"
           class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37] mb-4">
        尚未建立任何隊伍，點右上角「建立隊伍」開始
      </div>

      <!-- ══ 總覽模式 ══ -->
      <div v-if="viewMode === 'overview'">
        <div v-if="overviewLoading" class="text-center py-20 text-[#a6937c] italic">載入總覽中...</div>
        <div v-else-if="allOverviewCards.length === 0"
             class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
          所有隊伍尚未分配任何副本
        </div>
        <div v-else>
          <div class="flex flex-wrap gap-2 mb-4 items-center">
            <span class="text-[#a6937c] text-xs shrink-0">顯示隊伍：</span>
            <button v-for="team in teamsWithDetail" :key="team.id"
                    @click="toggleTeamFilter(team.id)"
                    class="text-xs border px-3 py-1 rounded transition font-bold"
                    :class="selectedTeamIds.length === 0 || selectedTeamIds.includes(team.id)
                      ? 'bg-[#5e4b37] border-[#f1d483]/60 text-[#f1d483]'
                      : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c] hover:text-[#e0d3b8]'">
              {{ team.name }}
              <span class="opacity-60 ml-1">{{ assignedDungeons(team).length }} 副本</span>
            </button>
            <button v-if="selectedTeamIds.length > 0"
                    @click="selectedTeamIds.length = 0"
                    class="text-xs text-[#a6937c] hover:text-[#f0a8a8] border border-[#5e4b37] px-2 py-1 rounded transition">
              ✕ 清除篩選
            </button>
          </div>
          <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
            <template v-for="card in allOverviewCards" :key="card.teamId + card.dName">
              <div class="bg-[#f5f1e6] rounded-xl shadow-lg overflow-hidden"
                   :style="{ borderTop: `4px solid ${card.color}` }">
                <div class="px-4 py-3 border-b border-[#dcd2bb] bg-[#ede4cf]">
                  <div class="mb-0.5">
                    <span class="px-1.5 py-0.5 rounded text-white text-[9px] font-bold"
                          :style="{ backgroundColor: card.color }">{{ card.teamName }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <h3 class="font-black text-base text-[#2c1e14]">{{ card.dName }}</h3>
                    <span class="text-[10px] font-bold text-[#8d7a64]">{{ card.inSlots.length }}/12</span>
                  </div>
                </div>
                <div class="px-3 pt-2 pb-1 flex flex-wrap gap-1 min-h-[26px] bg-[#f5f1e6]">
                  <span v-for="(count, job) in getJobComposition(card.inSlots)" :key="job"
                        class="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                        :style="{ backgroundColor: card.color }">
                    {{ job }} ×{{ count }}
                  </span>
                  <span v-if="!card.inSlots.length && !card.buffSlots.length" class="text-[9px] text-[#c2b9a3] italic">尚無成員</span>
                </div>
                <div class="p-3 space-y-1.5">
                  <div v-for="slot in card.inSlots" :key="slot.roleName+slot.accountId"
                       class="bg-white border border-[#e8dfc8] px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <div class="w-9 h-9 bg-[#f8f5ee] rounded-full border border-[#dcd2bb] flex items-center justify-center overflow-hidden shrink-0">
                      <img :src="getJobImg(slot.job)" class="w-6 h-6 object-contain">
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-black text-sm text-[#2c1e14] truncate">{{ slot.roleName }}</div>
                      <div class="text-[10px] text-[#8d7a64]">{{ slot.job }} · {{ slot.accountName }}</div>
                    </div>
                  </div>
                  <div v-for="slot in card.buffSlots" :key="'b'+slot.roleName+slot.accountId"
                       class="bg-[#f0fae8] border border-[#a0c878] px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <div class="w-9 h-9 bg-[#e4f5d4] rounded-full border border-[#a0c878] flex items-center justify-center overflow-hidden shrink-0">
                      <img :src="getJobImg(slot.job)" class="w-6 h-6 object-contain">
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-black text-sm text-[#2c1e14] truncate">{{ slot.roleName }}</div>
                      <div class="text-[10px] text-[#5a8a30]">{{ slot.job }} · {{ slot.accountName }}</div>
                    </div>
                    <span class="text-[10px] bg-[#d4edb8] text-[#3d6818] px-1.5 py-0.5 rounded-full border border-[#a0c878] font-bold shrink-0">🎵</span>
                  </div>
                  <div v-if="!card.inSlots.length && !card.buffSlots.length"
                       class="h-16 flex items-center justify-center text-[#c2b9a3] italic border-2 border-dashed border-[#dcd2bb] rounded-xl text-sm">
                    尚無成員
                  </div>
                </div>
                <div class="px-4 py-2 bg-[#ede4cf] border-t border-[#dcd2bb] flex justify-between items-center">
                  <span class="text-xs text-[#4a3728] font-bold">隊內人數</span>
                  <span class="font-mono font-black text-[#4a3728] text-sm">
                    {{ card.inSlots.length }} <span class="text-xs">人</span>
                    <span v-if="card.buffSlots.length" class="text-[10px] text-[#5a8a30] ml-1">+{{ card.buffSlots.length }} BUFF</span>
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- ══ 編輯模式 ══ -->
      <div v-else class="space-y-3">
        <div v-for="team in teams" :key="team.id"
             class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden"
             :class="activeTeamId === team.id ? 'border-[#f1d483]/50' : 'hover:border-[#8b7a64]'">

          <div class="bg-[#2c1e14] px-4 py-3 flex items-center justify-between border-b border-[#5e4b37] cursor-pointer"
               @click="toggleTeam(team.id)">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span v-if="team.permission === 'owner'" class="text-[#f1d483] text-xs font-bold bg-[#5e4b37] px-2.5 py-1 rounded shrink-0">我的</span>
              <span v-else-if="team.permission === 'edit'" class="text-[#a8f0c8] text-xs font-bold bg-[#2a4a3a] px-2.5 py-1 rounded shrink-0">共享·編輯</span>
              <span v-else class="text-[#a6c8f0] text-xs font-bold bg-[#2a3a4a] px-2.5 py-1 rounded shrink-0">共享·查看</span>
              <span class="text-[#e0d3b8] font-bold text-base truncate">{{ team.name }}</span>
              <span class="text-[#a6937c] text-xs shrink-0">{{ team.dungeonCount }} 個副本</span>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-2" @click.stop>
              <button v-if="team.permission === 'owner'" @click="openTeamShare(team)"
                      class="text-xs bg-[#3d4a6b] hover:bg-[#4a5b8a] text-[#a8c0f0] px-3 py-1 rounded border border-[#a8c0f0]/20 transition">分享</button>
              <button v-if="team.permission === 'owner'" @click="startRenameTeam(team)"
                      class="text-xs bg-[#4a6b5e] hover:bg-[#5b8573] text-[#a8f0c8] px-3 py-1 rounded border border-[#a8f0c8]/20 transition">改名</button>
              <button v-if="team.permission === 'owner'" @click="confirmDeleteTeam(team)"
                      class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-3 py-1 rounded border border-[#f0a8a8]/20 transition">刪除</button>
              <button v-if="team.permission !== 'owner'" @click="confirmLeaveTeam(team)"
                      class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-3 py-1 rounded border border-[#f0a8a8]/20 transition">退出</button>
              <span class="text-[#a6937c] text-sm transition-transform duration-300 select-none"
                    :class="activeTeamId === team.id ? 'rotate-180' : ''">▼</span>
            </div>
          </div>

          <div v-if="activeTeamId === team.id">
            <div v-if="teamDetailLoading" class="py-10 text-center text-[#a6937c] italic">載入中...</div>
            <div v-else-if="teamDetail" class="p-4">
              <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">

                <!-- 左側名冊 -->
                <div class="xl:col-span-4 bg-[#2c1e14] border border-[#5e4b37] rounded-xl overflow-hidden flex flex-col">
                  <div class="px-4 py-3 border-b border-[#5e4b37] flex items-center justify-between">
                    <div>
                      <div v-if="activeDungeon" class="text-[#f1d483] font-bold text-sm">
                        ⚔️ {{ activeDungeon }}
                        <span class="text-[#a6937c] font-normal text-xs ml-1">
                          {{ currentSlots.filter(s => s.status === 'in').length }}/12 人
                        </span>
                      </div>
                      <div v-else class="text-[#a6937c] text-sm">← 請從右側選擇副本</div>
                    </div>
                    <button v-if="activeDungeon && canEdit && currentSlots.length > 0"
                            @click="clearDungeon(activeDungeon)"
                            class="text-[10px] text-[#f0a8a8] hover:text-red-400 border border-[#f0a8a8]/20 px-2 py-0.5 rounded transition">
                      清空
                    </button>
                  </div>
                  <div v-if="activeDungeon" class="flex gap-3 text-[10px] text-[#a6937c] px-4 py-2 border-b border-[#5e4b37]/50 flex-wrap">
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#5b8fa4] inline-block"></span>副本內</span>
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#a0c878] inline-block"></span>場外 BUFF</span>
                  </div>
                  <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    <div v-if="allAccounts.length === 0" class="text-[#6b5a4a] text-sm italic text-center py-8">尚無可用帳號</div>
                    <div v-for="acc in allAccounts" :key="acc.id"
                         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-lg overflow-hidden">
                      <div @click="toggleAccGroup(acc.id)"
                           class="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#4a3828] transition">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span v-if="acc.permission === 'owner'" class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-1.5 py-0.5 rounded shrink-0">帳號</span>
                          <span v-else-if="acc.permission === 'edit'" class="text-[#a8f0c8] text-[10px] font-bold bg-[#2a4a3a] px-1.5 py-0.5 rounded shrink-0">共享·編輯</span>
                          <span v-else class="text-[#a6c8f0] text-[10px] font-bold bg-[#2a3a4a] px-1.5 py-0.5 rounded shrink-0">共享·使用</span>
                          <span class="text-[#e0d3b8] text-sm font-bold truncate">{{ acc.name }}</span>
                        </div>
                        <span class="text-[#a6937c] text-xs ml-1 shrink-0"
                              :class="collapsedAccGroups[acc.id] ? '' : 'rotate-180'">▼</span>
                      </div>
                      <div v-show="!collapsedAccGroups[acc.id]" class="px-2 pb-2 space-y-1">
                        <div v-for="role in acc.roles" :key="role.name"
                             class="flex items-center gap-2 rounded-lg px-2 py-2 transition"
                             :class="getSlotStatusInDungeon(acc, role, activeDungeon)
                               ? getSlotStatusInDungeon(acc, role, activeDungeon) === 'in'
                                 ? 'bg-[#1e3a4a] border border-[#5b8fa4]/40'
                                 : 'bg-[#1e3a1e] border border-[#a0c878]/30'
                               : 'bg-[#2c1e14] hover:bg-[#3d2b1f]'">
                          <div
                              class="w-8 h-8 bg-[#3d2b1f] rounded-full border border-[#5e4b37] flex items-center justify-center overflow-hidden shrink-0">
                            <img :src="getJobImg(role.job)" class="w-5 h-5 object-contain">
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="text-[#e0d3b8] text-sm font-bold truncate">{{ role.name }}</div>
                            <div class="text-[#a6937c] text-[10px]">{{ role.job || '未設定' }}<span v-if="role.level != null" class="ml-1 text-[#c8a84b]">Lv.{{ role.level }}</span></div>
                          </div>
                          <div class="shrink-0">
                            <div v-if="activeDungeon && getSlotStatusInDungeon(acc, role, activeDungeon)"
                                 class="flex items-center gap-1">
                              <span class="text-[10px] px-1.5 py-0.5 rounded font-bold"
                                    :class="getSlotStatusInDungeon(acc, role, activeDungeon) === 'in' ? 'bg-[#2a4a6a] text-[#a8c0f0]' : 'bg-[#2a4a2a] text-[#a0c878]'">
                                {{ getSlotStatusInDungeon(acc, role, activeDungeon) === 'in' ? '副本內' : 'BUFF' }}
                              </span>
                              <button v-if="canEdit" @click="removeSlotInDungeon(acc, role, activeDungeon)"
                                      class="text-[#f0a8a8] hover:text-red-400 transition text-sm leading-none">✕
                              </button>
                            </div>
                            <div v-else-if="activeDungeon && canEdit" class="flex gap-1">
                              <button @click="addSlotInDungeon(acc, role, 'in', activeDungeon)"
                                      :disabled="currentSlots.filter(s => s.status === 'in').length >= 12"
                                      class="text-[10px] px-2 py-1 rounded border font-bold transition bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#5b8fa4] hover:text-[#5b8fa4] disabled:opacity-30">
                                入
                              </button>
                              <button @click="addSlotInDungeon(acc, role, 'buff', activeDungeon)"
                                      class="text-[10px] px-2 py-1 rounded border font-bold transition bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#a0c878] hover:text-[#a0c878]">
                                B
                              </button>
                            </div>
                            <div v-else-if="!activeDungeon" class="flex flex-wrap gap-0.5 justify-end max-w-[80px]">
                              <template v-for="dName in dungeonList" :key="dName">
                                <span v-if="getSlotStatusInDungeon(acc, role, dName)"
                                      class="text-[9px] px-1 py-0.5 rounded font-bold"
                                      :class="getSlotStatusInDungeon(acc, role, dName) === 'in' ? 'bg-[#2a4a6a] text-[#a8c0f0]' : 'bg-[#2a4a2a] text-[#a0c878]'"
                                      :title="dName">
                                  {{ dName.slice(0, 2) }}
                                </span>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右側副本卡片 -->
                <div class="xl:col-span-8">
                  <div v-if="dungeonList.length === 0"
                       class="text-[#6b5a4a] text-sm italic text-center py-10 bg-[#2c1e14] border border-[#5e4b37] rounded-xl">
                    尚未建立副本，請至副本管理新增
                  </div>
                  <div v-else class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
                    <div v-for="dName in dungeonList" :key="dName"
                         class="bg-[#2c1e14] border-2 rounded-xl overflow-hidden transition cursor-pointer"
                         :class="activeDungeon === dName ? 'border-[#f1d483]' : 'border-[#5e4b37] hover:border-[#8b7a64]'"
                         @click="activeDungeon = activeDungeon === dName ? '' : dName">
                      <div class="px-3 py-2 flex items-center justify-between"
                           :class="activeDungeon === dName ? 'bg-[#3a2e10]' : 'bg-[#1e150d]'">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-sm"
                                :class="activeDungeon === dName ? 'text-[#f1d483]' : 'text-[#e0d3b8]'">{{
                              dName
                            }}</span>
                          <span class="text-[#a6937c] text-xs">{{
                              (teamDetail.dungeons?.[dName] || []).filter(s => s.status === 'in').length
                            }}/12</span>
                        </div>
                        <span v-if="activeDungeon === dName" class="text-[#f1d483] text-[10px] font-bold">選中</span>
                      </div>
                      <div class="p-2 space-y-1 min-h-[60px]">
                        <div v-if="!(teamDetail.dungeons?.[dName]?.length)"
                             class="text-[#5e4b37] text-xs italic text-center py-3">未分配
                        </div>
                        <template v-else>
                          <div v-for="slot in (teamDetail.dungeons[dName] || []).filter(s => s.status === 'in')"
                               :key="slot.roleName+slot.accountId" class="flex items-center gap-1.5">
                            <div
                                class="w-6 h-6 bg-[#3d2b1f] rounded-full border border-[#5b8fa4]/40 flex items-center justify-center overflow-hidden shrink-0">
                              <img :src="getJobImg(slot.job)" class="w-3.5 h-3.5 object-contain">
                            </div>
                            <span class="text-[#e0d3b8] text-xs font-bold truncate flex-1">{{ slot.roleName }}</span>
                            <span class="text-[#a6937c] text-[10px] shrink-0">{{ slot.job }}<template v-if="slot.level != null"> · <span class="text-[#c8a84b]">{{ slot.level }}</span></template></span>
                          </div>
                          <div v-if="(teamDetail.dungeons[dName] || []).some(s => s.status === 'buff')"
                               class="border-t border-[#5e4b37]/40 pt-1 mt-1">
                            <div v-for="slot in (teamDetail.dungeons[dName] || []).filter(s => s.status === 'buff')"
                                 :key="'b'+slot.roleName+slot.accountId" class="flex items-center gap-1.5 opacity-70">
                              <div
                                  class="w-6 h-6 bg-[#1e3a1e] rounded-full border border-[#a0c878]/30 flex items-center justify-center overflow-hidden shrink-0">
                                <img :src="getJobImg(slot.job)" class="w-3.5 h-3.5 object-contain">
                              </div>
                              <span class="text-[#a6937c] text-xs truncate flex-1">{{ slot.roleName }}</span>
                              <span class="text-[#6b8a6b] text-[10px] shrink-0">B</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 建立隊伍 Modal ══ -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="showCreateModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">建立新隊伍</h3>
        <input v-model="newTeamName" placeholder="隊伍名稱（例：週常隊）"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition mb-3"/>
        <p v-if="createError" class="text-red-400 text-sm mb-3">{{ createError }}</p>
        <div class="flex gap-2">
          <button @click="createTeam" :disabled="!newTeamName.trim() || isSaving"
                  class="flex-1 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
            {{ isSaving ? '建立中...' : '建立' }}
          </button>
          <button @click="showCreateModal = false"
                  class="flex-1 py-2 bg-[#3d2b1f] border border-[#5e4b37] text-[#a6937c] rounded transition hover:bg-[#5e4b37]">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 改名 Modal ══ -->
    <div v-if="renameModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="renameModal.show = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">隊伍改名</h3>
        <input v-model="renameModal.name"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition mb-3"/>
        <div class="flex gap-2">
          <button @click="submitRename" :disabled="!renameModal.name.trim() || isSaving"
                  class="flex-1 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
            儲存
          </button>
          <button @click="renameModal.show = false"
                  class="flex-1 py-2 bg-[#3d2b1f] border border-[#5e4b37] text-[#a6937c] rounded transition hover:bg-[#5e4b37]">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 刪除隊伍確認 ══ -->
    <div v-if="deleteTeamTarget" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="deleteTeamTarget = null">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認刪除隊伍？</h3>
        <p class="text-[#a6937c] mb-5">隊伍「<span class="text-[#e0d3b8] font-bold">{{ deleteTeamTarget.name }}</span>」及所有副本分配將永久刪除。
        </p>
        <div class="flex gap-3 justify-center">
          <button @click="deleteTeamTarget = null"
                  class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">
            取消
          </button>
          <button @click="deleteTeam" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 退出共享確認 ══ -->
    <div v-if="leaveTeamTarget" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="leaveTeamTarget = null">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">🚪</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認退出共享？</h3>
        <p class="text-[#a6937c] mb-5">退出後將無法再存取隊伍「<span
            class="text-[#e0d3b8] font-bold">{{ leaveTeamTarget?.name }}</span>」。</p>
        <div class="flex gap-3 justify-center">
          <button @click="leaveTeamTarget = null"
                  class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">
            取消
          </button>
          <button @click="leaveTeam" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '退出中...' : '確認退出' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 隊伍分享 Modal ══ -->
    <div v-if="teamShareModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="teamShareModal.show = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[#f1d483] font-bold text-lg">分享隊伍：{{ teamShareModal.teamName }}</h3>
          <button @click="teamShareModal.show = false" class="text-[#a6937c] hover:text-[#f0a8a8] text-xl leading-none">
            ✕
          </button>
        </div>
        <div class="flex gap-2 mb-3">
          <button @click="teamShareModal.permission = 'view'"
                  class="flex-1 py-2 rounded border text-sm font-bold transition"
                  :class="teamShareModal.permission === 'view' ? 'bg-[#2a3a4a] border-[#a8c0f0] text-[#a8c0f0]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c]'">
            查看<br><span class="text-[10px] font-normal">只能看，不能改</span>
          </button>
          <button @click="teamShareModal.permission = 'edit'"
                  class="flex-1 py-2 rounded border text-sm font-bold transition"
                  :class="teamShareModal.permission === 'edit' ? 'bg-[#2a4a3a] border-[#a8f0c8] text-[#a8f0c8]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c]'">
            編輯<br><span class="text-[10px] font-normal">可修改副本分配</span>
          </button>
        </div>
        <button @click="generateTeamInvite" :disabled="teamShareModal.generating"
                class="w-full py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50 mb-3">
          {{ teamShareModal.generating ? '產生中...' : '產生邀請碼' }}
        </button>
        <div v-if="teamShareModal.code" class="bg-[#3d2b1f] border border-[#5e4b37] rounded-lg p-3 text-center mb-4">
          <div class="text-3xl font-black font-mono text-[#f1d483] tracking-[0.3em] mb-1">{{
              teamShareModal.code
            }}
          </div>
          <div class="text-[#a6937c] text-xs">{{ teamShareModal.expiresAt }} 前有效</div>
          <button @click="copyTeamCode" class="mt-2 text-xs text-[#a8f0c8] hover:text-white transition">📋 複製邀請碼
          </button>
        </div>
        <div>
          <p class="text-[#a6937c] text-sm font-bold mb-2">目前共享成員</p>
          <div v-if="teamShareModal.shareList.length === 0" class="text-[#6b5a4a] text-sm italic py-3 text-center">
            尚未分享給任何人
          </div>
          <div v-else class="space-y-2">
            <div v-for="m in teamShareModal.shareList" :key="m.googleId"
                 class="flex items-center justify-between bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2">
              <div>
                <span class="text-[#e0d3b8] text-sm font-bold">{{ m.name || m.email }}</span>
                <span class="ml-2 text-xs px-1.5 py-0.5 rounded"
                      :class="m.permission === 'edit' ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                  {{ m.permission === 'edit' ? '編輯' : '查看' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="updateTeamShare(m)"
                        class="text-xs border px-2 py-0.5 rounded transition"
                        :class="m.permission === 'edit'
                          ? 'border-[#a8c0f0]/40 text-[#a8c0f0] hover:bg-[#2a3a4a]'
                          : 'border-[#a8f0c8]/40 text-[#a8f0c8] hover:bg-[#2a4a3a]'">
                  改為{{ m.permission === 'edit' ? '查看' : '編輯' }}
                </button>
                <button @click="revokeTeamShare(m.googleId)" class="text-xs text-[#f0a8a8] hover:text-red-400 transition">
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 接受隊伍邀請碼 Modal ══ -->
    <div v-if="showAcceptTeamModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="showAcceptTeamModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">輸入隊伍邀請碼</h3>
        <input v-model="acceptTeamCode" placeholder="輸入 6 碼邀請碼" maxlength="6"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-center text-2xl font-black font-mono text-[#f1d483] tracking-[0.3em] outline-none focus:border-[#f1d483] transition mb-3 uppercase"/>
        <p v-if="acceptTeamError" class="text-red-400 text-sm mb-3 text-center">{{ acceptTeamError }}</p>
        <button @click="submitAcceptTeam" :disabled="acceptTeamCode.length < 6 || isAcceptingTeam"
                class="w-full py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
          {{ isAcceptingTeam ? '驗證中...' : '確認加入' }}
        </button>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed bottom-6 right-6 bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
        <span class="text-green-400">✔</span> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
definePageMeta({layout: 'roz', middleware: 'roz-auth'});

import {ref, computed, onMounted} from 'vue';
import {useCommonStore} from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE_TEAM = () => commonStore.data.main_url + '/roz/team';
const BASE_ACCOUNT = () => commonStore.data.main_url + '/roz/account';
const BASE_DUNGEON = () => commonStore.data.main_url + '/roz/dungeon';

const jobFileMap = {
  '祭師': '祭師',
  '鐵匠': '鐵匠',
  '騎士': '騎士',
  '詩人': '詩人',
  '刺客': '刺客',
  '賢者': '賢者',
  '巫師': '巫師',
  '練金': '練金',
  '十字軍': '十字軍',
  '舞孃': '舞孃',
  '武僧': '祭師',
  '獵人': '詩人',
  '流氓': '流氓'
};
const getJobImg = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

const teamColors = ['#5b8fa4', '#8fa45b', '#a47a5b', '#8e5ba4', '#a45b5b', '#5ba48e', '#a4975b', '#5b6fa4'];
const getTeamColor = (idx) => teamColors[idx % teamColors.length];

const getJobComposition = (slots) => {
  const map = {};
  slots.forEach(s => {
    if (s.job) map[s.job] = (map[s.job] || 0) + 1;
  });
  return map;
};

const assignedDungeons = (team) => {
  if (!team.detail?.dungeons) return [];
  return dungeonList.value.filter(d => (team.detail.dungeons[d] || []).length > 0);
};

// ── 狀態 ──────────────────────────────────────────────────────────
const loading = ref(true);
const viewMode = ref('edit');
const teams = ref([]);
const allAccounts = ref([]);
const dungeonList = ref([]);
const activeTeamId = ref(null);
const teamDetail = ref(null);
const teamDetailLoading = ref(false);
const activeDungeon = ref('');
const dungeonMap = ref({});  // name → { name, minLevel, ... }
const collapsedAccGroups = ref({});
const isSaving = ref(false);
const toast = ref({show: false, message: ''});

const overviewLoading = ref(false);
const teamsWithDetail = ref([]);
const selectedTeamIds = ref([]);  // 總覽篩選：空陣列 = 顯示全部

const showCreateModal = ref(false);
const newTeamName = ref('');
const createError = ref('');
const renameModal = ref({show: false, teamId: '', name: ''});
const deleteTeamTarget = ref(null);
const leaveTeamTarget = ref(null);  // 退出共享
const teamShareModal = ref({
  show: false,
  teamId: '',
  teamName: '',
  permission: 'view',
  generating: false,
  code: '',
  expiresAt: '',
  shareList: []
});
const showAcceptTeamModal = ref(false);
const acceptTeamCode = ref('');
const acceptTeamError = ref('');
const isAcceptingTeam = ref(false);

// ── 總覽卡片 ──────────────────────────────────────────────────────
const allOverviewCards = computed(() => {
  const cards = [];
  teamsWithDetail.value.forEach((team, tIdx) => {
    if (selectedTeamIds.value.length > 0 && !selectedTeamIds.value.includes(team.id)) return;
    const color = getTeamColor(tIdx);
    assignedDungeons(team).forEach(dName => {
      const slots = team.detail?.dungeons?.[dName] || [];
      cards.push({
        teamId: team.id, teamName: team.name, dName, color,
        inSlots: slots.filter(s => s.status === 'in'),
        buffSlots: slots.filter(s => s.status === 'buff'),
      });
    });
  });
  return cards;
});

const toggleTeamFilter = (teamId) => {
  const idx = selectedTeamIds.value.indexOf(teamId);
  if (idx === -1) selectedTeamIds.value.push(teamId);
  else selectedTeamIds.value.splice(idx, 1);
};

// ── 計算 ──────────────────────────────────────────────────────────
const canEdit = computed(() => {
  const t = teams.value.find(t => t.id === activeTeamId.value);
  return t && (t.permission === 'owner' || t.permission === 'edit');
});

const currentSlots = computed(() => {
  if (!teamDetail.value || !activeDungeon.value) return [];
  return teamDetail.value.dungeons?.[activeDungeon.value] || [];
});

// ── 載入 ──────────────────────────────────────────────────────────
const loadAll = async () => {
  loading.value = true;
  try {
    const [teamsData, accountsData, dungeonData] = await Promise.all([
      (await fetch(`${BASE_TEAM()}/list`, {credentials: 'include'})).json(),
      (await fetch(`${BASE_ACCOUNT()}/list`, {credentials: 'include'})).json(),
      (await fetch(`${BASE_DUNGEON()}/list`, {credentials: 'include'})).json(),
    ]);
    teams.value = Array.isArray(teamsData) ? teamsData : [];
    allAccounts.value = Array.isArray(accountsData) ? accountsData : [];
    const rawDungeons = Array.isArray(dungeonData) ? dungeonData : [];
    dungeonList.value = rawDungeons.map(d => d.name || d);
    dungeonMap.value  = Object.fromEntries(rawDungeons.map(d => [d.name || d, d]));
    allAccounts.value.forEach(a => {
      collapsedAccGroups.value[a.id] = true;
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadAllTeamDetails = async () => {
  if (teamsWithDetail.value.length > 0) return;
  overviewLoading.value = true;
  try {
    const details = await Promise.all(
        teams.value.map(async t => {
          try {
            const d = await (await fetch(`${BASE_TEAM()}/${t.id}`, {credentials: 'include'})).json();
            return {...t, detail: d};
          } catch {
            return {...t, detail: null};
          }
        })
    );
    teamsWithDetail.value = details;
  } finally {
    overviewLoading.value = false;
  }
};

const openTeamEdit = async (team) => {
  activeTeamId.value = team.id;
  teamDetail.value = null;
  activeDungeon.value = '';
  teamDetailLoading.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/${team.id}`, {credentials: 'include'})).json();
    teamDetail.value = data;
  } finally {
    teamDetailLoading.value = false;
  }
};

const toggleTeam = async (teamId) => {
  if (activeTeamId.value === teamId) {
    activeTeamId.value = null;
    activeDungeon.value = '';
    return;
  }
  activeTeamId.value = teamId;
  activeDungeon.value = '';
  teamDetail.value = null;
  teamDetailLoading.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/${teamId}`, {credentials: 'include'})).json();
    teamDetail.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    teamDetailLoading.value = false;
  }
};

const toggleAccGroup = (accId) => {
  collapsedAccGroups.value = {...collapsedAccGroups.value, [accId]: !collapsedAccGroups.value[accId]};
};

// ── 角色狀態 ──────────────────────────────────────────────────────
const getSlotStatusInDungeon = (acc, role, dName) => {
  if (!teamDetail.value?.dungeons?.[dName]) return null;
  const slot = teamDetail.value.dungeons[dName].find(s => s.accountId === acc.id && s.roleName === role.name);
  return slot ? slot.status : null;
};

// ── 分配操作 ──────────────────────────────────────────────────────
const addSlotInDungeon = async (acc, role, status, dName) => {
  if (!canEdit.value || !dName) return;
  if (status === 'in' && currentSlots.value.filter(s => s.status === 'in').length >= 12) {
    showToast('副本內最多 12 人');
    return;
  }
  // 最低等級檢查（BUFF 不受等級限制）
  if (status === 'in') {
    const minLevel = dungeonMap.value[dName]?.minLevel;
    if (minLevel != null && (role.level == null || role.level < minLevel)) {
      showToast(`${role.name} 等級不足（需 Lv.${minLevel}）`);
      return;
    }
  }
  if (!teamDetail.value.dungeons) teamDetail.value.dungeons = {};
  const current = teamDetail.value.dungeons[dName] || [];
  const newSlots = [...current, {
    ownerGoogleId: acc.ownerGoogleId || '',
    accountId: acc.id,
    accountName: acc.name,
    roleName: role.name,
    job: role.job || '',
    level: role.level ?? null,
    status
  }];
  teamDetail.value.dungeons[dName] = newSlots;
  await saveSlotsInDungeon(newSlots, dName);
};

const removeSlotInDungeon = async (acc, role, dName) => {
  if (!canEdit.value) return;
  const newSlots = (teamDetail.value.dungeons?.[dName] || []).filter(s => !(s.accountId === acc.id && s.roleName === role.name));
  teamDetail.value.dungeons[dName] = newSlots;
  await saveSlotsInDungeon(newSlots, dName);
};

const clearDungeon = async (dName) => {
  try {
    await fetch(`${BASE_TEAM()}/${activeTeamId.value}/dungeon/${encodeURIComponent(dName)}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (teamDetail.value?.dungeons) teamDetail.value.dungeons[dName] = [];
    showToast('已清空');
  } catch {
    showToast('清空失敗');
  }
};

let saveTimers = {};
const saveSlotsInDungeon = async (slots, dName) => {
  clearTimeout(saveTimers[dName]);
  saveTimers[dName] = setTimeout(async () => {
    try {
      await fetch(`${BASE_TEAM()}/${activeTeamId.value}/assign`, {
        method: 'POST', credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({dungeonName: dName, slots})
      });
    } catch {
      showToast('儲存失敗');
    }
  }, 400);
};

// ── 隊伍 CRUD ─────────────────────────────────────────────────────
const createTeam = async () => {
  if (!newTeamName.value.trim()) return;
  isSaving.value = true;
  createError.value = '';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/create`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: newTeamName.value.trim()})
    })).json();
    if (data.error) {
      createError.value = data.error;
      return;
    }
    showCreateModal.value = false;
    newTeamName.value = '';
    teamsWithDetail.value = [];
    await loadAll();
    showToast('隊伍已建立');
  } catch {
    createError.value = '建立失敗';
  } finally {
    isSaving.value = false;
  }
};

const startRenameTeam = (team) => {
  renameModal.value = {show: true, teamId: team.id, name: team.name};
};
const submitRename = async () => {
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/rename/${renameModal.value.teamId}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: renameModal.value.name.trim()})
    })).json();
    if (data.error) {
      showToast(data.error);
      return;
    }
    renameModal.value.show = false;
    teamsWithDetail.value = [];
    await loadAll();
    showToast('隊伍已改名');
  } catch {
    showToast('改名失敗');
  } finally {
    isSaving.value = false;
  }
};

const confirmDeleteTeam = (team) => {
  deleteTeamTarget.value = team;
};
const deleteTeam = async () => {
  isSaving.value = true;
  try {
    await fetch(`${BASE_TEAM()}/remove/${deleteTeamTarget.value.id}`, {method: 'DELETE', credentials: 'include'});
    if (activeTeamId.value === deleteTeamTarget.value.id) activeTeamId.value = null;
    deleteTeamTarget.value = null;
    teamsWithDetail.value = [];
    await loadAll();
    showToast('隊伍已刪除');
  } catch {
    showToast('刪除失敗');
  } finally {
    isSaving.value = false;
  }
};

// ── 退出共享 ──────────────────────────────────────────────────────
const confirmLeaveTeam = (team) => {
  leaveTeamTarget.value = team;
};
const leaveTeam = async () => {
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/leave-share/${leaveTeamTarget.value.id}`, {
      method: 'DELETE', credentials: 'include'
    })).json();
    if (data.error) {
      showToast(data.error);
      return;
    }
    if (activeTeamId.value === leaveTeamTarget.value.id) activeTeamId.value = null;
    leaveTeamTarget.value = null;
    teamsWithDetail.value = [];
    await loadAll();
    showToast('已退出共享');
  } catch {
    showToast('退出失敗');
  } finally {
    isSaving.value = false;
  }
};

// ── 隊伍分享 ──────────────────────────────────────────────────────
const openTeamShare = async (team) => {
  teamShareModal.value = {
    show: true,
    teamId: team.id,
    teamName: team.name,
    permission: 'view',
    generating: false,
    code: '',
    expiresAt: '',
    shareList: []
  };
  try {
    const data = await (await fetch(`${BASE_TEAM()}/share-list/${team.id}`, {credentials: 'include'})).json();
    teamShareModal.value.shareList = Array.isArray(data) ? data : [];
  } catch {
    teamShareModal.value.shareList = [];
  }
};
const generateTeamInvite = async () => {
  teamShareModal.value.generating = true;
  teamShareModal.value.code = '';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/share/${teamShareModal.value.teamId}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({permission: teamShareModal.value.permission})
    })).json();
    if (data.error) {
      showToast(data.error);
      return;
    }
    teamShareModal.value.code = data.code;
    teamShareModal.value.expiresAt = data.expiresAt;
  } catch {
    showToast('產生失敗');
  } finally {
    teamShareModal.value.generating = false;
  }
};
const copyTeamCode = () => {
  navigator.clipboard?.writeText(teamShareModal.value.code);
  showToast('邀請碼已複製');
};
const updateTeamShare = async (member) => {
  const newPerm = member.permission === 'edit' ? 'view' : 'edit';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/update-share/${teamShareModal.value.teamId}/${member.googleId}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({permission: newPerm})
    })).json();
    if (data.error) { showToast(data.error); return; }
    member.permission = newPerm;
    showToast(`已改為${newPerm === 'edit' ? '編輯' : '查看'}權限`);
  } catch {
    showToast('更新失敗');
  }
};

const revokeTeamShare = async (targetGoogleId) => {
  try {
    await fetch(`${BASE_TEAM()}/revoke-share/${teamShareModal.value.teamId}/${targetGoogleId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await (await fetch(`${BASE_TEAM()}/share-list/${teamShareModal.value.teamId}`, {credentials: 'include'})).json();
    teamShareModal.value.shareList = Array.isArray(data) ? data : [];
    showToast('已移除共享');
  } catch {
    showToast('移除失敗');
  }
};

const submitAcceptTeam = async () => {
  if (acceptTeamCode.value.length < 6) return;
  isAcceptingTeam.value = true;
  acceptTeamError.value = '';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/accept-share`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code: acceptTeamCode.value.toUpperCase()})
    })).json();
    if (data.error) {
      acceptTeamError.value = data.error;
      return;
    }
    showAcceptTeamModal.value = false;
    acceptTeamCode.value = '';
    teamsWithDetail.value = [];
    await loadAll();
    showToast(`已加入隊伍「${data.teamName}」`);
  } catch {
    acceptTeamError.value = '驗證失敗，請再試一次';
  } finally {
    isAcceptingTeam.value = false;
  }
};

const showToast = (msg) => {
  toast.value = {show: true, message: msg};
  setTimeout(() => {
    toast.value.show = false;
  }, 2500);
};

onMounted(() => {
  document.title = '副本組隊';
  loadAll();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #2c1e14;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #5e4b37;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #8d7a64;
}

select option {
  background-color: #2c1e14;
  color: #e0d3b8;
}
</style>