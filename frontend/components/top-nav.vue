<template>
  <div class="navigation lg_992:order-1 lg_992:flex hidden" id="menu-collapse">
    <ul class="navbar-nav" id="navbar-navlist">
      <menu-item label="Home" to=""/>
      <menu-item label="Causes" to="causes"/>
      <menu-item label="Donations" to="donations"/>
      <menu-item label="How It Works" to="work-process"/>
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
