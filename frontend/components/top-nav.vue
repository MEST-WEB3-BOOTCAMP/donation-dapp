<template>
  <div class="navigation lg_992:order-1 lg_992:flex hidden" id="menu-collapse">
    <ul class="navbar-nav" id="navbar-navlist">
      <menu-item v-if="!isHomePage" label="Home" to=""/>
      <menu-item v-if="isHomePage" label="How It Works?" to="/#how-it-works"/>
      <menu-item label="Causes" to="causes"/>
      <menu-item label="Donations" to="donations"/>
      <menu-item label="Services" to="services"/>
    </ul>
  </div>
</template>

<script>
export default {
  name: "top-nav",
  computed: {
    isHomePage() {
      return this.$store.state.common.menu === 'home'
    }
  }
}
</script>

<style scoped>

</style>
