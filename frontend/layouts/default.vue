<template>
  <div class="font-rubik text-base text-slate-900 dark:text-white dark:bg-slate-900">
    <nav class="navbar" id="navbar">
      <div class="container flex flex-wrap items-center justify-end">
        <NuxtLink class="navbar-brand" to="/">
          <img src="assets/images/logo-dark.png" class="inline-block dark:hidden" alt="">
          <img src="assets/images/logo-light.png" class="hidden dark:inline-block" alt="">
        </NuxtLink>

        <div class="nav-icons flex items-center lg_992:order-2 ms-auto">
          <!-- Navbar Button -->
          <ul class="list-none menu-social mb-0">
            <li class="inline">
              <NuxtLink to="#"
                 class="btn btn-sm btn-icon rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white"><i
                class="uil uil-github"></i></NuxtLink>
            </li>
            <li class="inline">
              <NuxtLink to="#"
                 class="btn btn-sm btn-icon rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white"><i
                class="uil uil-twitter"></i></NuxtLink>
            </li>
            <li class="inline">
              <NuxtLink to="#">
                <a href="#"
                   class="btn btn-sm btn-icon rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white"><i
                  class="uil uil-instagram"></i></a>
              </NuxtLink>
            </li>
          </ul>
          <!-- Navbar Collapse Manu Button -->
          <button data-collapse="menu-collapse" type="button"
                  class="collapse-btn inline-flex items-center ms-3 text-dark dark:text-white lg_992:hidden"
                  aria-controls="menu-collapse" aria-expanded="false">
            <span class="sr-only">Navigation Menu</span>
            <i class="mdi mdi-menu mdi-24px"></i>
          </button>
        </div>

        <!-- Navbar Menu -->
        <top-nav/>
        <!-- Navbar Menu -->
      </div>
    </nav>

    <section class="relative bg-gray-50 dark:bg-slate-800">
      <Nuxt/>
    </section>
  </div>
</template>

<script>
export default {
  name: "default",
  head() {
    return {
      bodyAttrs: {
        'data-sidebar': 'dark',
        'data-layout-mode': 'light'
      }
    }
  },
  computed: {},
  mounted() {

  },
  methods: {}
}
</script>

<style scoped>

</style>
