import { create } from 'zustand'

export interface BookProject {
  id: string
  name: string
  format: string // A5, B5, etc.
  pageCount: number
  wordCount: number
  binding: string
  coverPaper: string
  innerPaper: string
  coverProcess: string[]
  createdAt: string
  updatedAt: string
}

export interface GoodsProject {
  id: string
  name: string
  category: string
  process: string[]
  createdAt: string
  updatedAt: string
}

export interface SimpleProject {
  id: string
  name: string
  type: 'book' | 'goods'
  status: string
  createdAt: string
}

interface ProjectStore {
  bookProjects: BookProject[]
  goodsProjects: GoodsProject[]
  projects: SimpleProject[]
  activeProject: BookProject | GoodsProject | null
  addBookProject: (project: BookProject) => void
  updateBookProject: (id: string, data: Partial<BookProject>) => void
  deleteBookProject: (id: string) => void
  setActiveProject: (project: BookProject | GoodsProject | null) => void
  addProject: (project: Omit<SimpleProject, 'id'>) => void
  updateProject: (id: string, data: Partial<SimpleProject>) => void
  deleteProject: (id: string) => void
}

let nextId = 1

export const useProjectStore = create<ProjectStore>((set) => ({
  bookProjects: [],
  goodsProjects: [],
  projects: [],
  activeProject: null,
  addBookProject: (project) =>
    set((state) => ({ bookProjects: [...state.bookProjects, project] })),
  updateBookProject: (id, data) =>
    set((state) => ({
      bookProjects: state.bookProjects.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    })),
  deleteBookProject: (id) =>
    set((state) => ({
      bookProjects: state.bookProjects.filter((p) => p.id !== id),
    })),
  setActiveProject: (project) => set({ activeProject: project }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, { ...project, id: String(nextId++) }],
    })),
  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}))