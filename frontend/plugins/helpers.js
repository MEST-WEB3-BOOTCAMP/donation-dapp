export const getData = (name) => {
  const data = JSON.parse(localStorage.getItem(name))
  if (!data) return {
    wallet: null,
    causes: null,
    donations: null
  }
  return data
}

export const putData = (name, data) => localStorage.setItem(name, JSON.stringify(data))
export const clearLocalStorage = () => localStorage.clear()

export const setPageName = (context, name = '') => context.$store.commit('common/setMenu', name)

export const setToast = (ref, type, title, message) => ref.$store.commit('common/setToast', {
  type: type, title: title ?? type, message: message,
})

export const getError = (error) => {
  if (error.response) {
    const data = error.response.data
    return {
      status: error.response.statusText, code: data.status, message: data.message,
    }
  }

  if (error.errors || error.message) {
    return {
      status: 'Error', code: 422, message: error.message,
    }
  }

  if (error.data) {
    return {
      status: 'Error', code: error.status, message: error.data.message,
    }
  }

  return {
    statusText: 'Error', statusCode: 500, message: 'Something went wrong! Please try again later.',
  }
}

export const ucWords = (words) => {
  return words.toUpperCase()
}

export const camelCase = (words) => {
  return words.replace(/\s+(.)/g, (match, text) => text.toUpperCase())
}


