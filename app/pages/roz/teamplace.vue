<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[1600px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">副本組隊</h1>
        <p class="text-[#a6937c] text-sm mt-1">建立隊伍，為每個副本分配角色</p>
      </div>
      <div class="flex gap-2 flex-wrap items-center">
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

    <div v-if="loading" class="max-w-[1600px] mx-auto text-center py-20 text-[#a6937c] italic text-lg">讀取中...</div>

    <div v-else class="max-w-[1600px] mx-auto">

      <!-- 空狀態 -->
      <div v-if="teams.length === 0"
           class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37] mb-4">
        尚未建立任何隊伍，點右上角「建立隊伍」開始
      </div>

      <!-- ══ 隊伍清單 ══ -->
      <div class="space-y-3">
        <div v-for="team in teams" :key="team.id"
             class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden"
             :class="activeTeamId === team.id ? 'border-[#f1d483]/50' : 'hover:border-[#8b7a64]'">

          <!-- 隊伍標頭 -->
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
              <span class="text-[#a6937c] text-sm transition-transform duration-300 select-none"
                    :class="activeTeamId === team.id ? 'rotate-180' : ''">▼</span>
            </div>
          </div>

          <!-- 隊伍詳細展開 -->
          <div v-if="activeTeamId === team.id">
            <div v-if="teamDetailLoading" class="py-10 text-center text-[#a6937c] italic">載入中...</div>
            <div v-else-if="teamDetail" class="p-4">

              <!-- 副本分頁 -->
              <div class="flex flex-wrap gap-2 mb-4 items-center">
                <button v-for="dName in dungeonList" :key="dName"
                        @click="activeDungeon = dName"
                        class="px-3 py-1.5 rounded text-sm font-bold border transition"
                        :class="activeDungeon === dName
                          ? 'bg-[#5e4b37] border-[#f1d483] text-[#f1d483]'
                          : 'bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#8b7a64]'">
                  {{ dName }}
                  <span v-if="teamDetail.dungeons[dName]?.length" class="ml-1 text-[10px] opacity-70">
                    {{ teamDetail.dungeons[dName].length }}/12
                  </span>
                </button>
                <span v-if="dungeonList.length === 0" class="text-[#6b5a4a] text-sm italic">尚未建立副本，請至副本管理新增</span>
              </div>

              <!-- 副本分配區 -->
              <div v-if="activeDungeon" class="grid grid-cols-1 xl:grid-cols-12 gap-4">

                <!-- 左：角色名冊 -->
                <div class="xl:col-span-4 bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-3">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-[#f1d483] font-bold text-sm">📜 角色名冊</h3>
                    <span class="text-[#a6937c] text-xs">{{ currentSlots.length }}/12 已分配</span>
                  </div>

                  <div v-if="allAccounts.length === 0" class="text-[#6b5a4a] text-sm italic text-center py-6">
                    尚無可用帳號
                  </div>

                  <div v-else class="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                    <div v-for="acc in allAccounts" :key="acc.id"
                         class="bg-[#3d2b1f] border border-[#5e4b37] rounded-lg overflow-hidden">
                      <!-- 帳號標頭 -->
                      <div @click="toggleAccGroup(acc.id)"
                           class="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#4a3828] transition">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-1.5 py-0.5 rounded shrink-0">帳號</span>
                          <span class="text-[#e0d3b8] text-sm font-bold truncate">{{ acc.name }}</span>
                          <span v-if="acc.sharedFromName" class="text-[#a6937c] text-[10px] truncate">（{{ acc.sharedFromName }}）</span>
                        </div>
                        <span class="text-[#a6937c] text-xs ml-1" :class="collapsedAccGroups[acc.id] ? '' : 'rotate-180'">▼</span>
                      </div>
                      <!-- 角色列表 -->
                      <div v-show="!collapsedAccGroups[acc.id]" class="px-2 pb-2 space-y-1">
                        <div v-for="role in acc.roles" :key="role.name"
                             class="flex items-center justify-between bg-[#2c1e14] rounded-lg px-2 py-1.5 gap-2">
                          <div class="flex items-center gap-2 min-w-0">
                            <div class="w-8 h-8 bg-[#3d2b1f] rounded-full border border-[#5e4b37] flex items-center justify-center overflow-hidden shrink-0">
                              <img :src="getJobImg(role.job)" class="w-5 h-5 object-contain">
                            </div>
                            <div class="min-w-0">
                              <div class="text-[#e0d3b8] text-sm font-bold truncate">{{ role.name }}</div>
                              <div class="text-[#a6937c] text-[10px]">{{ role.job || '未設定' }}</div>
                            </div>
                          </div>
                          <!-- 狀態/分配按鈕 -->
                          <div class="shrink-0">
                            <div v-if="getSlotStatus(acc, role)" class="flex items-center gap-1">
                              <span class="text-[10px] px-1.5 py-0.5 rounded font-bold"
                                    :class="getSlotStatus(acc, role) === 'in' ? 'bg-[#2a4a6a] text-[#a8c0f0]' : 'bg-[#2a4a2a] text-[#a0c878]'">
                                {{ getSlotStatus(acc, role) === 'in' ? '副本內' : 'BUFF' }}
                              </span>
                              <button v-if="canEdit" @click="removeSlot(acc, role)"
                                      class="text-[#f0a8a8] hover:text-red-400 transition text-sm leading-none">✕</button>
                            </div>
                            <div v-else-if="canEdit" class="flex gap-1">
                              <button @click="addSlot(acc, role, 'in')"
                                      :disabled="currentSlots.length >= 12"
                                      class="text-[10px] px-2 py-1 rounded border transition font-bold bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#5b8fa4] hover:text-[#5b8fa4] disabled:opacity-30">
                                入
                              </button>
                              <button @click="addSlot(acc, role, 'buff')"
                                      class="text-[10px] px-2 py-1 rounded border transition font-bold bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#a0c878] hover:text-[#a0c878]">
                                B
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右：副本隊伍 -->
                <div class="xl:col-span-8 bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-3">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-[#f1d483] font-bold text-sm">⚔️ {{ activeDungeon }} 分配</h3>
                    <div class="flex gap-2 items-center">
                      <span class="text-[#a6937c] text-xs">{{ inSlots.length }} 人進副本 · {{ buffSlots.length }} 人 BUFF</span>
                      <button v-if="canEdit && currentSlots.length > 0" @click="clearDungeon"
                              class="text-xs text-[#f0a8a8] hover:text-red-400 border border-[#f0a8a8]/30 px-2 py-0.5 rounded transition">清空</button>
                    </div>
                  </div>

                  <!-- 圖例 -->
                  <div class="flex gap-3 text-[10px] text-[#a6937c] mb-3 flex-wrap">
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#5b8fa4] inline-block"></span>副本內</span>
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#a0c878] inline-block"></span>場外 BUFF</span>
                  </div>

                  <!-- 副本內成員 -->
                  <div class="mb-4">
                    <div class="text-[#a6937c] text-xs font-bold mb-2">副本內（{{ inSlots.length }}/12）</div>
                    <div v-if="inSlots.length === 0" class="text-[#6b5a4a] text-sm italic py-4 text-center border border-dashed border-[#5e4b37] rounded-lg">
                      尚未分配角色進入副本
                    </div>
                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      <div v-for="slot in inSlots" :key="slot.roleName + slot.accountId"
                           class="bg-[#1e3a4a] border border-[#5b8fa4]/40 rounded-xl p-2.5 flex flex-col items-center gap-1 relative group">
                        <div class="w-12 h-12 bg-[#2c1e14] rounded-full border-2 border-[#5b8fa4]/50 flex items-center justify-center overflow-hidden">
                          <img :src="getJobImg(slot.job)" class="w-8 h-8 object-contain">
                        </div>
                        <div class="text-center">
                          <div class="text-[#e0d3b8] text-sm font-bold leading-tight">{{ slot.roleName }}</div>
                          <div class="text-[#a6937c] text-[10px]">{{ slot.job || '—' }}</div>
                          <div class="text-[#6b8fa4] text-[10px]">{{ slot.accountName }}</div>
                        </div>
                        <button v-if="canEdit" @click="removeSlotByRef(slot)"
                                class="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#6b4a4a] text-[#f0a8a8] text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                      </div>
                    </div>
                  </div>

                  <!-- BUFF 成員 -->
                  <div v-if="buffSlots.length > 0 || canEdit">
                    <div class="text-[#a6937c] text-xs font-bold mb-2">場外 BUFF（{{ buffSlots.length }}）</div>
                    <div v-if="buffSlots.length === 0" class="text-[#6b5a4a] text-sm italic py-3 text-center border border-dashed border-[#5e4b37] rounded-lg">
                      尚未分配場外 BUFF 角色
                    </div>
                    <div v-else class="flex flex-wrap gap-2">
                      <div v-for="slot in buffSlots" :key="slot.roleName + slot.accountId"
                           class="bg-[#1e3a1e] border border-[#a0c878]/30 rounded-xl px-3 py-2 flex items-center gap-2 relative group">
                        <div class="w-8 h-8 bg-[#2c1e14] rounded-full border border-[#a0c878]/40 flex items-center justify-center overflow-hidden">
                          <img :src="getJobImg(slot.job)" class="w-5 h-5 object-contain">
                        </div>
                        <div>
                          <div class="text-[#e0d3b8] text-sm font-bold leading-tight">{{ slot.roleName }}</div>
                          <div class="text-[#a6937c] text-[10px]">{{ slot.accountName }}</div>
                        </div>
                        <button v-if="canEdit" @click="removeSlotByRef(slot)"
                                class="ml-1 text-[#f0a8a8] hover:text-red-400 transition text-sm leading-none opacity-0 group-hover:opacity-100">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-10 text-[#a6937c] italic">請選擇上方副本標籤開始分配</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 建立隊伍 Modal ══ -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showCreateModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">建立新隊伍</h3>
        <input v-model="newTeamName" placeholder="隊伍名稱（例：週常隊）"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition mb-3" />
        <p v-if="createError" class="text-red-400 text-sm mb-3">{{ createError }}</p>
        <div class="flex gap-2">
          <button @click="createTeam" :disabled="!newTeamName.trim() || isSaving"
                  class="flex-1 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
            {{ isSaving ? '建立中...' : '建立' }}
          </button>
          <button @click="showCreateModal = false" class="flex-1 py-2 bg-[#3d2b1f] border border-[#5e4b37] text-[#a6937c] rounded transition hover:bg-[#5e4b37]">取消</button>
        </div>
      </div>
    </div>

    <!-- ══ 改名 Modal ══ -->
    <div v-if="renameModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="renameModal.show = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">隊伍改名</h3>
        <input v-model="renameModal.name" placeholder="新的隊伍名稱"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition mb-3" />
        <div class="flex gap-2">
          <button @click="submitRename" :disabled="!renameModal.name.trim() || isSaving"
                  class="flex-1 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">儲存</button>
          <button @click="renameModal.show = false" class="flex-1 py-2 bg-[#3d2b1f] border border-[#5e4b37] text-[#a6937c] rounded transition hover:bg-[#5e4b37]">取消</button>
        </div>
      </div>
    </div>

    <!-- ══ 刪除隊伍確認 ══ -->
    <div v-if="deleteTeamTarget" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="deleteTeamTarget = null">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認刪除隊伍？</h3>
        <p class="text-[#a6937c] mb-5">隊伍「<span class="text-[#e0d3b8] font-bold">{{ deleteTeamTarget.name }}</span>」及所有副本分配將永久刪除。</p>
        <div class="flex gap-3 justify-center">
          <button @click="deleteTeamTarget = null" class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="deleteTeam" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 隊伍分享 Modal ══ -->
    <div v-if="teamShareModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="teamShareModal.show = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[#f1d483] font-bold text-lg">分享隊伍：{{ teamShareModal.teamName }}</h3>
          <button @click="teamShareModal.show = false" class="text-[#a6937c] hover:text-[#f0a8a8] text-xl leading-none">✕</button>
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
          <div class="text-3xl font-black font-mono text-[#f1d483] tracking-[0.3em] mb-1">{{ teamShareModal.code }}</div>
          <div class="text-[#a6937c] text-xs">{{ teamShareModal.expiresAt }} 前有效</div>
          <button @click="copyTeamCode" class="mt-2 text-xs text-[#a8f0c8] hover:text-white transition">📋 複製邀請碼</button>
        </div>
        <!-- 分享清單 -->
        <div>
          <p class="text-[#a6937c] text-sm font-bold mb-2">目前共享成員</p>
          <div v-if="teamShareModal.shareList.length === 0" class="text-[#6b5a4a] text-sm italic py-3 text-center">尚未分享給任何人</div>
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
              <button @click="revokeTeamShare(m.googleId)" class="text-xs text-[#f0a8a8] hover:text-red-400 transition">移除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 接受隊伍邀請碼 Modal ══ -->
    <div v-if="showAcceptTeamModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showAcceptTeamModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">輸入隊伍邀請碼</h3>
        <input v-model="acceptTeamCode" placeholder="輸入 6 碼邀請碼" maxlength="6"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-center text-2xl font-black font-mono text-[#f1d483] tracking-[0.3em] outline-none focus:border-[#f1d483] transition mb-3 uppercase" />
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
definePageMeta({ layout: 'roz', middleware: 'roz-auth' });

import { ref, computed, onMounted } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE_TEAM    = () => commonStore.data.main_url + '/roz/team';
const BASE_ACCOUNT = () => commonStore.data.main_url + '/roz/account';
const BASE_DUNGEON = () => commonStore.data.main_url + '/roz/dungeon';

const jobFileMap = { '祭師':'祭師','鐵匠':'鐵匠','騎士':'騎士','詩人':'詩人','刺客':'刺客','賢者':'賢者','巫師':'巫師','練金':'練金','十字軍':'十字軍','舞孃':'舞孃','武僧':'祭師','獵人':'詩人' };
const getJobImg = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

// ── 狀態 ──────────────────────────────────────────────────────────
const loading           = ref(true);
const teams             = ref([]);
const allAccounts       = ref([]);
const dungeonList       = ref([]);
const activeTeamId      = ref(null);
const teamDetail        = ref(null);
const teamDetailLoading = ref(false);
const activeDungeon     = ref('');
const collapsedAccGroups = ref({});
const isSaving          = ref(false);
const toast             = ref({ show: false, message: '' });

// 建立隊伍
const showCreateModal = ref(false);
const newTeamName     = ref('');
const createError     = ref('');

// 改名
const renameModal = ref({ show: false, teamId: '', name: '' });

// 刪除隊伍
const deleteTeamTarget = ref(null);

// 隊伍分享
const teamShareModal = ref({ show: false, teamId: '', teamName: '', permission: 'view', generating: false, code: '', expiresAt: '', shareList: [] });
const showAcceptTeamModal = ref(false);
const acceptTeamCode  = ref('');
const acceptTeamError = ref('');
const isAcceptingTeam = ref(false);

// ── 計算 ──────────────────────────────────────────────────────────
const canEdit = computed(() => {
  const t = teams.value.find(t => t.id === activeTeamId.value);
  return t && (t.permission === 'owner' || t.permission === 'edit');
});

const currentSlots = computed(() => {
  if (!teamDetail.value || !activeDungeon.value) return [];
  return teamDetail.value.dungeons[activeDungeon.value] || [];
});

const inSlots   = computed(() => currentSlots.value.filter(s => s.status === 'in'));
const buffSlots = computed(() => currentSlots.value.filter(s => s.status === 'buff'));

// ── 載入 ──────────────────────────────────────────────────────────
const loadAll = async () => {
  loading.value = true;
  try {
    const [teamsData, accountsData, dungeonData] = await Promise.all([
      (await fetch(`${BASE_TEAM()}/list`,    { credentials: 'include' })).json(),
      (await fetch(`${BASE_ACCOUNT()}/list`, { credentials: 'include' })).json(),
      (await fetch(`${BASE_DUNGEON()}/list`, { credentials: 'include' })).json(),
    ]);
    teams.value       = Array.isArray(teamsData)   ? teamsData   : [];
    allAccounts.value = Array.isArray(accountsData) ? accountsData : [];
    dungeonList.value = Array.isArray(dungeonData)  ? dungeonData.map(d => d.name || d) : [];
    allAccounts.value.forEach(a => { collapsedAccGroups.value[a.id] = true; });
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const toggleTeam = async (teamId) => {
  if (activeTeamId.value === teamId) { activeTeamId.value = null; return; }
  activeTeamId.value = teamId;
  activeDungeon.value = '';
  teamDetail.value = null;
  teamDetailLoading.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/${teamId}`, { credentials: 'include' })).json();
    teamDetail.value = data;
    // 預設選第一個已分配的副本，或第一個副本
    const assigned = dungeonList.value.find(d => data.dungeons?.[d]?.length > 0);
    activeDungeon.value = assigned || dungeonList.value[0] || '';
  } catch (e) { console.error(e); }
  finally { teamDetailLoading.value = false; }
};

const toggleAccGroup = (accId) => {
  collapsedAccGroups.value[accId] = !collapsedAccGroups.value[accId];
};

// ── 角色狀態 ──────────────────────────────────────────────────────
const getSlotStatus = (acc, role) => {
  const slot = currentSlots.value.find(s => s.accountId === acc.id && s.roleName === role.name);
  return slot ? slot.status : null;
};

// ── 分配操作 ──────────────────────────────────────────────────────
const addSlot = async (acc, role, status) => {
  if (!canEdit.value) return;
  if (status === 'in' && currentSlots.value.filter(s => s.status === 'in').length >= 12) {
    showToast('副本內最多 12 人'); return;
  }
  const newSlots = [
    ...currentSlots.value,
    { ownerGoogleId: acc.ownerGoogleId || '', accountId: acc.id, accountName: acc.name, roleName: role.name, job: role.job || '', status }
  ];
  await saveSlots(newSlots);
};

const removeSlot = async (acc, role) => {
  const newSlots = currentSlots.value.filter(s => !(s.accountId === acc.id && s.roleName === role.name));
  await saveSlots(newSlots);
};

const removeSlotByRef = async (slot) => {
  const newSlots = currentSlots.value.filter(s => !(s.accountId === slot.accountId && s.roleName === slot.roleName));
  await saveSlots(newSlots);
};

const clearDungeon = async () => {
  try {
    await fetch(`${BASE_TEAM()}/${activeTeamId.value}/dungeon/${encodeURIComponent(activeDungeon.value)}`, {
      method: 'DELETE', credentials: 'include'
    });
    if (teamDetail.value?.dungeons) teamDetail.value.dungeons[activeDungeon.value] = [];
    showToast('已清空副本分配');
  } catch { showToast('清空失敗'); }
};

let saveTimer = null;
const saveSlots = async (newSlots) => {
  // 樂觀更新
  if (!teamDetail.value.dungeons) teamDetail.value.dungeons = {};
  teamDetail.value.dungeons[activeDungeon.value] = newSlots;

  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await fetch(`${BASE_TEAM()}/${activeTeamId.value}/assign`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dungeonName: activeDungeon.value, slots: newSlots })
      });
    } catch { showToast('儲存失敗'); }
  }, 400);
};

// ── 隊伍 CRUD ─────────────────────────────────────────────────────
const createTeam = async () => {
  if (!newTeamName.value.trim()) return;
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/create`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTeamName.value.trim() })
    })).json();
    if (data.error) { createError.value = data.error; return; }
    showCreateModal.value = false;
    newTeamName.value = '';
    await loadAll();
    showToast('隊伍已建立');
  } catch { createError.value = '建立失敗'; }
  finally { isSaving.value = false; }
};

const startRenameTeam = (team) => {
  renameModal.value = { show: true, teamId: team.id, name: team.name };
};
const submitRename = async () => {
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE_TEAM()}/rename/${renameModal.value.teamId}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameModal.value.name.trim() })
    })).json();
    if (data.error) { showToast(data.error); return; }
    renameModal.value.show = false;
    await loadAll();
    showToast('隊伍已改名');
  } catch { showToast('改名失敗'); }
  finally { isSaving.value = false; }
};

const confirmDeleteTeam = (team) => { deleteTeamTarget.value = team; };
const deleteTeam = async () => {
  isSaving.value = true;
  try {
    await fetch(`${BASE_TEAM()}/remove/${deleteTeamTarget.value.id}`, { method: 'DELETE', credentials: 'include' });
    deleteTeamTarget.value = null;
    if (activeTeamId.value === deleteTeamTarget?.value?.id) activeTeamId.value = null;
    await loadAll();
    showToast('隊伍已刪除');
  } catch { showToast('刪除失敗'); }
  finally { isSaving.value = false; }
};

// ── 隊伍分享 ──────────────────────────────────────────────────────
const openTeamShare = async (team) => {
  teamShareModal.value = { show: true, teamId: team.id, teamName: team.name, permission: 'view', generating: false, code: '', expiresAt: '', shareList: [] };
  await loadTeamShareList();
};
const loadTeamShareList = async () => {
  try {
    const data = await (await fetch(`${BASE_TEAM()}/share-list/${teamShareModal.value.teamId}`, { credentials: 'include' })).json();
    teamShareModal.value.shareList = Array.isArray(data) ? data : [];
  } catch { teamShareModal.value.shareList = []; }
};
const generateTeamInvite = async () => {
  teamShareModal.value.generating = true;
  teamShareModal.value.code = '';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/share/${teamShareModal.value.teamId}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permission: teamShareModal.value.permission })
    })).json();
    if (data.error) { showToast(data.error); return; }
    teamShareModal.value.code = data.code;
    teamShareModal.value.expiresAt = data.expiresAt;
  } catch { showToast('產生失敗'); }
  finally { teamShareModal.value.generating = false; }
};
const copyTeamCode = () => { navigator.clipboard?.writeText(teamShareModal.value.code); showToast('邀請碼已複製'); };
const revokeTeamShare = async (targetGoogleId) => {
  try {
    await fetch(`${BASE_TEAM()}/revoke-share/${teamShareModal.value.teamId}/${targetGoogleId}`, { method: 'DELETE', credentials: 'include' });
    await loadTeamShareList();
    showToast('已移除共享');
  } catch { showToast('移除失敗'); }
};

const submitAcceptTeam = async () => {
  if (acceptTeamCode.value.length < 6) return;
  isAcceptingTeam.value = true;
  acceptTeamError.value = '';
  try {
    const data = await (await fetch(`${BASE_TEAM()}/accept-share`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: acceptTeamCode.value.toUpperCase() })
    })).json();
    if (data.error) { acceptTeamError.value = data.error; return; }
    showAcceptTeamModal.value = false;
    acceptTeamCode.value = '';
    await loadAll();
    showToast(`已加入隊伍「${data.teamName}」`);
  } catch { acceptTeamError.value = '驗證失敗，請再試一次'; }
  finally { isAcceptingTeam.value = false; }
};

// ── 工具 ──────────────────────────────────────────────────────────
const showToast = (msg) => { toast.value = { show: true, message: msg }; setTimeout(() => { toast.value.show = false; }, 2500); };

onMounted(() => { document.title = '副本組隊'; loadAll(); });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c1e14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5e4b37; border-radius: 10px; }
select option { background-color: #2c1e14; color: #e0d3b8; }
</style>
