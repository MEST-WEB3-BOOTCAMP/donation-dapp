import {getData, putData} from "~/plugins/helpers";

export const state = () => ({
  menu: getData('menu'),
  toast: getData('toast')
})

export const mutations = {
  setMenu(state, menu) {
    state.menu = menu
    putData('menu', menu)
  },

  setToast(state, {type, title = 'Error', message, toastClass,}) {
    state.toast.type = type
    state.toast.title = title
    state.toast.message = message
    state.toast.class = toastClass
  },
}
