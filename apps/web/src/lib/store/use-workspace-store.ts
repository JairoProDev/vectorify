import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  stack?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface WorkspaceState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Workspace
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;

  // Project
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;

  // UI State
  sidebarOpen: boolean;
  copilotOpen: boolean;
  activeSidebarView: 'explorer' | 'search' | 'git' | 'market' | 'settings' | null;
  toggleSidebar: () => void;
  toggleCopilot: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  setActiveSidebarView: (view: 'explorer' | 'search' | 'git' | 'market' | 'settings' | null) => void;

  // Agent Interaction
  pendingAgentMessage: string | null;
  setPendingAgentMessage: (message: string | null) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set) => ({
        // User
        user: null,
        setUser: (user) => set({ user }),

        // Workspace
        currentWorkspace: null,
        workspaces: [],
        setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
        setWorkspaces: (workspaces) => set({ workspaces }),

        // Project
        currentProject: null,
        projects: [],
        setCurrentProject: (project) => set({ currentProject: project }),
        setProjects: (projects) => set({ projects }),

        // UI State
        sidebarOpen: true,
        copilotOpen: true,
        activeSidebarView: 'explorer',
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setCopilotOpen: (open) => set({ copilotOpen: open }),
        setActiveSidebarView: (view) => set({ activeSidebarView: view, sidebarOpen: !!view }),

        // Agent Interaction
        pendingAgentMessage: null,
        setPendingAgentMessage: (message) => set({ pendingAgentMessage: message }),

        // Notifications
        notifications: [],
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: `notif-${Date.now()}`,
                timestamp: Date.now(),
              },
            ],
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'vectorify-workspace-storage',
        partialize: (state: WorkspaceState) => ({
          user: state.user,
          currentWorkspace: state.currentWorkspace,
          currentProject: state.currentProject,
          sidebarOpen: state.sidebarOpen,
          copilotOpen: state.copilotOpen,
          activeSidebarView: state.activeSidebarView,
        }),
      }
    ),
    { name: 'WorkspaceStore' }
  )
);
