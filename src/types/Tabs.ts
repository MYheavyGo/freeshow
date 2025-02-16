export interface Categories {
  [key: string]: Category
}
export interface Category {
  name: string
  icon?: null | string
  path?: string
  id?: string
  type?: "youtube" | "vimeo"
  url?: string
  default?: boolean
  description?: string
}

export interface TabsObj {
  [key: string]: {
    name: string
    icon: string
    disabled?: boolean
  }
}

export interface DrawerTabs {
  [key: string]: {
    enabled: boolean
    activeSubTab: null | string
  }
}

export type DrawerTabIds = "shows" | "media" | "overlays" | "audio" | "scripture" | "templates" | "player" | "live" | "web"
export type SettingsTabs = "general" | "theme" | "groups" | "outputs" | "connection" | "calendar" | "other"
export type TopViews = "show" | "edit" | "reflow" | "draw" | "stage" | "calendar" | "settings"
