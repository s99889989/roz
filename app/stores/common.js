import { defineStore } from 'pinia'

export const useCommonStore = defineStore('useFamilyStore', () => {
  // https://madustrialtd.asuscomm.com:9100
  // http://localhost:9100
  // https://madustrialtd.asuscomm.com:8080

  //ROZ
  // https://madustrialtd.asuscomm.com:8000
  // http://localhost:4000
  // https://api.karltw.com
  const data = reactive({
    main_url: 'https://api.karltw.com:8080',
    roz_url:  'https://api.karltw.com:8000',
  })

  const rozUser = reactive({ name: '', email: '', picture: '' })

  const setRozUser = (user) => {
    rozUser.name    = user?.name    ?? ''
    rozUser.email   = user?.email   ?? ''
    rozUser.picture = user?.picture ?? ''
  }

  const clearRozUser = () => {
    rozUser.name    = ''
    rozUser.email   = ''
    rozUser.picture = ''
  }

  return { data, rozUser, setRozUser, clearRozUser }
})