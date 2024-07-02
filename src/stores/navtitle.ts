import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useNavTitle = defineStore('navtitle', {
	
	state: () => ({
		title: useLocalStorage('navtitle', 'Visión general'),
	}),
	actions: {
		updateTitle(title: string){
			this.title = title
		},
		resetState() {
			this.title = 'Visión general';
		},
	}
})