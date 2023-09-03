<template>
  <div class="">

    <!-- Start -->
    <section
      class="py-36 md:h-screen h-auto items-center flex relative bg-[url('/assets/images/bg/bg4.html')] bg-bottom bg-cover"
      id="home">
      <div
        class="absolute inset-0 -z-1 bg-gradient-to-b from-orange-600/20 dark:from-orange-600/40 via-orange-600/10 dark:via-orange-600/20 to-transparent"></div>
      <div class="container relative">
        <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
          <div class="lg:col-span-7 md:col-span-6 mt-14 md:mt-0">
            <h4
              class="lg:text-5xl text-4xl lg:leading-normal leading-normal font-medium mb-7 position-relative dark:text-white">
              Empower Change <br>
              <span class="text-blue-400">One Click at a Time</span>
            </h4>

            <p class="text-slate-400 dark:text-white/70 mb-0 max-w-2xl text-lg">
              Your gateway to effortless and secure cryptocurrency donations.
              Join our community of changemakers today and help create a better world, one donation at a time..
            </p>

            <div class="subcribe-form mt-10">
              <div class="relative mt-10">
                <button v-if="!walletIsConnected" @click.prevent="connectWallet"
                        type="button"
                        class="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-full me-1">
                  Connect Wallet
                </button>

                <form v-if="walletIsConnected" class="relative">
                  <input type="text" name="address"
                         class="rounded-full bg-white opacity-70 border text-orange-600 px-10" v-model="wallet.address"
                         disabled>
                  <button @click.prevent="listCauses" type="button"
                          class="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-full">
                    Donate <i class="uil uil-arrow-right"></i></button>
                </form>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 md:col-span-6">
            <div class="relative">
              <div class="relative flex justify-end">
                <img src="assets/images/ab01.jpg" class="lg:w-[400px] w-[280px] rounded-xl shadow dark:shadow-gray-700"
                     alt="">
                <div class="absolute top-0 translate-y-2/4 start-0 text-center">
                  <a href="#!" data-type="youtube" data-id="yba7hPeTSjk"
                     class="lightbox h-20 w-20 rounded-full shadow-lg shadow-slate-100 dark:shadow-slate-800 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-orange-600">
                    <i class="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
                  </a>
                </div>
              </div>
              <div class="absolute md:-start-5 start-0 -bottom-16">
                <img src="assets/images/ab02.jpg"
                     class="lg:w-[280px] w-[200px] border-8 border-white dark:border-slate-900 rounded-xl" alt="">
              </div>
            </div>
          </div>
        </div>
      </div><!--end container-->
    </section><!--end section-->
    <!-- End -->
  </div>
</template>

<script>
import {setPageName, setToast} from "~/plugins/helpers";

export default {
  name: 'IndexPage',
  data() {
    return {
      wallet: {}
    }
  },
  computed: {
    walletAddress() {
      return this.$store.getters['wallet/walletAddress'];
    },
    walletIsConnected() {
      const wallet = {...this.$store.getters['wallet/getConnectedWallet']}
      return wallet.connected;
    },
    getButtonText() {
      const wallet = {...this.$store.getters['wallet/getConnectedWallet']}
      return wallet.address ? `Wallet Address` : "Connect Wallet";
    }
  },
  mounted() {
    setToast(this, '', '', '')
    setPageName(this, 'home')
    this.setWallet()
  },
  methods: {
    toTopFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    async connectWallet() {
      try {
        this.wallet = await this.$store.dispatch('wallet/connectWallet');
      } catch (error) {
        console.error('Error connecting to wallet:', error.message);
      }
    },
    async listCauses() {
      this.$store.commit('common/setMenu', 'causes');
      return this.$router.push('/causes');
    },
    setWallet() {
      this.wallet = this.$store.getters['wallet/getConnectedWallet'];
    }
  },
}
</script>
