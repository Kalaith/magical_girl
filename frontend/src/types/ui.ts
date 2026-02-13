export type ViewType =
  | "dashboard"
  | "collection"
  | "recruitment"
  | "combat"
  | "training"
  | "missions"
  | "achievements"
  | "skill-tree"
  | "customization"
  | "prestige"
  | "save-system"
  | "enhanced-settings"
  | "settings";

export type ModalType =
  | "magical-girl-details"
  | "training-session"
  | "mission-details"
  | "settings"
  | "achievement-details"
  | "confirmation"
  | null;

export type ModalData = {
  "magical-girl-details": { girlId: string };
  "training-session": { trainingId: string; girlId?: string };
  "mission-details": { missionId: string };
  settings: Record<string, never>;
  "achievement-details": { achievementId: string };
  confirmation: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
};

export interface UIState {
  // Current view and navigation
  currentView: ViewType;
  previousView: ViewType | null;
  isLoading: boolean;

  // Modal system
  activeModal: ModalType;
  modalData: ModalData[keyof ModalData] | null;

  // Panel states
  sidebarCollapsed: boolean;
  resourcePanelVisible: boolean;
  notificationPanelVisible: boolean;
  quickActionsPanelVisible: boolean;

  // Theme and appearance
  theme: "light" | "dark" | "auto";
  colorScheme: string;
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;

  // Interaction states
  dragDropActive: boolean;
  contextMenuVisible: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  contextMenuData: Record<string, unknown> | null;

  // Animation and transition states
  animationsEnabled: boolean;
  reducedMotion: boolean;
  currentTransition: string | null;

  // Mobile and responsive states
  mobileMenuOpen: boolean;
  orientationPortrait: boolean;
  screenSize: "mobile" | "tablet" | "desktop";

  // Focus and accessibility
  focusVisible: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;

  // Performance and rendering
  lowPerformanceMode: boolean;
  gpuAcceleration: boolean;
  renderQuality: "low" | "medium" | "high";

  // Gaming specific UI states
  pauseMenuOpen: boolean;
  inventoryOpen: boolean;
  characterSheetOpen: boolean;
  mapOpen: boolean;
  questLogOpen: boolean;

  // Notification and message states
  toastMessages: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
    persistent?: boolean;
  }>;
  bannerMessage: {
    type: "info" | "warning" | "error" | "success";
    message: string;
    visible: boolean;
  } | null;

  // Layout and positioning
  layoutMode: "classic" | "modern" | "compact";
  panelLayout: "left" | "right" | "bottom" | "floating";
  toolbarPosition: "top" | "bottom" | "hidden";
}

export interface UIActions {
  // Navigation actions
  setCurrentView: (view: ViewType) => void;
  goBack: () => void;
  setLoading: (loading: boolean) => void;

  // Modal actions
  openModal: <T extends ModalType>(
    type: T,
    data?: T extends keyof ModalData ? ModalData[T] : never,
  ) => void;
  closeModal: () => void;
  setModalData: (data: ModalData[keyof ModalData] | null) => void;

  // Panel actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleResourcePanel: () => void;
  toggleNotificationPanel: () => void;
  toggleQuickActionsPanel: () => void;

  // Theme actions
  setTheme: (theme: UIState["theme"]) => void;
  setColorScheme: (scheme: string) => void;
  setFontSize: (size: UIState["fontSize"]) => void;
  toggleCompactMode: () => void;

  // Interaction actions
  setDragDropActive: (active: boolean) => void;
  showContextMenu: (
    x: number,
    y: number,
    data?: Record<string, unknown>,
  ) => void;
  hideContextMenu: () => void;

  // Animation actions
  setAnimationsEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setCurrentTransition: (transition: string | null) => void;

  // Mobile actions
  setMobileMenuOpen: (open: boolean) => void;
  setOrientation: (portrait: boolean) => void;
  setScreenSize: (size: UIState["screenSize"]) => void;

  // Accessibility actions
  setFocusVisible: (visible: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  setScreenReader: (enabled: boolean) => void;

  // Performance actions
  setLowPerformanceMode: (enabled: boolean) => void;
  setGpuAcceleration: (enabled: boolean) => void;
  setRenderQuality: (quality: UIState["renderQuality"]) => void;

  // Gaming UI actions
  togglePauseMenu: () => void;
  toggleInventory: () => void;
  toggleCharacterSheet: () => void;
  toggleMap: () => void;
  toggleQuestLog: () => void;

  // Message actions
  addToastMessage: (message: Omit<UIState["toastMessages"][0], "id">) => void;
  removeToastMessage: (id: string) => void;
  setBannerMessage: (message: UIState["bannerMessage"]) => void;
  clearBannerMessage: () => void;

  // Layout actions
  setLayoutMode: (mode: UIState["layoutMode"]) => void;
  setPanelLayout: (layout: UIState["panelLayout"]) => void;
  setToolbarPosition: (position: UIState["toolbarPosition"]) => void;

  // Reset actions
  resetUI: () => void;
  resetLayout: () => void;
  resetTheme: () => void;
}
