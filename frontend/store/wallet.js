import {getData, putData} from "~/plugins/helpers";

export const state = () => ({
  wallet: getData('wallet'),
});

export const mutations = {
  setWallet(state, data) {
    state.wallet = data;
    putData('wallet', state.wallet)
  },
};

// Actions
export const actions = {
  async connectWallet({commit}) {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request wallet access from MetaMask
        await window.ethereum.request({method: 'eth_requestAccounts'});

        // Get the connected wallet's address
        const accounts = await window.ethereum.request({method: 'eth_accounts'});
        const wallet = {
          address: accounts[0],
          connected: true
        };

        // Update store state with wallet details
        commit('setWallet', wallet);

        return wallet;
      } else {
        return new Error('MetaMask is not installed or not available.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  },
};

// Getters
export const getters = {
  getConnectedWallet: (state) => state.wallet,
  isWalletConnected: (state) => state.wallet.connected ?? false,
};
