import { defineStore } from 'pinia';

export const useHidePaneltoreStore = defineStore({
  id: 'hidePanel',
  state: () => ({
    hidePanelAdvisor: true
  }),
  actions: {
    updatePanelState(panel: any){
        this.hidePanelAdvisor = panel;
    }
  }
});