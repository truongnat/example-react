import { Store } from '@tanstack/store'

export type TabType = 'todos' | 'posts' | 'users'
export type ViewMode = 'table' | 'virtual'

export interface AppState {
  activeTab: TabType
  viewMode: ViewMode
  searchQuery: string
}

export const appStore = new Store<AppState>({
  activeTab: 'todos',
  viewMode: 'table',
  searchQuery: '',
})

export function setTab(tab: TabType) {
  appStore.setState(s => ({ ...s, activeTab: tab }))
}
export function setViewMode(mode: ViewMode) {
  appStore.setState(s => ({ ...s, viewMode: mode }))
}
export function setSearchQuery(q: string) {
  appStore.setState(s => ({ ...s, searchQuery: q }))
}
