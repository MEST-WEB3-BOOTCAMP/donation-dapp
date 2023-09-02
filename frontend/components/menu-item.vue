<template>
  <div class="">
    <li class="nav-item">
      <NuxtLink @click.native="toggleActiveMenu" :to="`/${to}`"
                class="nav-link"
      >
        <span v-if="label || to" :class="isActiveMenu ? 'text-orange-600' : ''">{{ label ?? to }}</span>
        <slot/>
      </NuxtLink>
    </li>
  </div>
</template>

<script>
export default {
  name: "menu-item",
  props: {
    to: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    isActiveMenu() {
      return this.$store.state.common.menu === this.$props.to
    },
  },
  methods: {
    toggleActiveMenu() {
      this.$store.commit('common/setMenu', this.$props.to)
    },
  },
}
</script>

<style scoped>

.active {
  color: #f0f0f0 !important;
}
</style>
