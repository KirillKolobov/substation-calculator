import { create } from 'zustand';

export type Module = 'main' | 'project' | 'work';
export type ProjectSection = 'initial-data' | null;
export type InitialDataSection = 'object-info' | 'project-sections' | null;

interface ObjectInfo {
  objectName: string;
  cellNumber: string;
  dispatchName: string;
  purpose: string;
}

interface ProjectSection {
  id: string;
  name: string;
  isSelected: boolean;
  subsections?: ProjectSection[];
  isExpanded?: boolean;
}

interface ProjectSections {
  sections: ProjectSection[];
}

interface CellReconstructionState {
  activeModule: Module;
  projectSection: ProjectSection | null;
  initialDataSection: InitialDataSection;
  objectInfo: ObjectInfo;
  projectSections: ProjectSections;
  setActiveModule: (module: Module) => void;
  setProjectSection: (section: ProjectSection | null) => void;
  setInitialDataSection: (section: InitialDataSection) => void;
  setObjectInfo: (data: ObjectInfo) => void;
  setProjectSections: (data: ProjectSections) => void;
  toggleProjectSection: (id: string) => void;
  toggleSubsection: (parentId: string, subsectionId: string) => void;
  toggleSectionExpanded: (id: string) => void;
}

export const useCellReconstructionStore = create<CellReconstructionState>((set) => ({
  activeModule: 'main',
  projectSection: null,
  initialDataSection: null,
  objectInfo: {
    objectName: '',
    cellNumber: '',
    dispatchName: '',
    purpose: ''
  },
  projectSections: {
    sections: [
      { id: 'pz', name: 'Пояснительная записка', isSelected: false },
      { id: 'arch', name: 'Объемно-планировочные и архитектурные решения', isSelected: false },
      { id: 'constr', name: 'Конструктивные решения', isSelected: false },
      {
        id: 'engineering',
        name: 'Сведения об инженерном оборудовании, о сетях и системах инженерно-технического обеспечения',
        isSelected: false,
        isExpanded: false,
        subsections: [
          { id: 'power', name: '1.1 Система электроснабжения', isSelected: false },
          { id: 'relay', name: '1.2 Релейная защита и автоматика', isSelected: false },
          { id: 'tech-info', name: '1.3 Решения по системе сбора и передачи технологической информации', isSelected: false },
          { id: 'aiis', name: '1.4 Модернизация автоматизированной информационно-измерительной системы коммерческого учета электроэнергии', isSelected: false },
          { id: 'metrology', name: '1.5 Метрологическое обеспечение', isSelected: false },
          { id: 'emc', name: '1.6 Решения по электромагнитной совместимости устройств РЗА, АИИС КУЭ, связи', isSelected: false }
        ]
      },
      { id: 'pos', name: 'Проект организации строительства', isSelected: false },
      { id: 'demolition', name: 'Проект организации работ по сносу или демонтажу объектов капитального строительства', isSelected: false },
      { id: 'environment', name: 'Мероприятия по охране окружающей среды', isSelected: false },
      { id: 'fire', name: 'Мероприятия по обеспечению пожарной безопасности', isSelected: false },
      { id: 'safety', name: 'Требования к обеспечению безопасной эксплуатации объектов капитального строительства', isSelected: false }
    ]
  },
  setActiveModule: (module) => set({ activeModule: module }),
  setProjectSection: (section) => set({ projectSection: section }),
  setInitialDataSection: (section) => set({ initialDataSection: section }),
  setObjectInfo: (data) => set({ objectInfo: data }),
  setProjectSections: (data) => set({ projectSections: data }),
  toggleProjectSection: (id) => set((state) => ({
    projectSections: {
      sections: state.projectSections.sections.map(section => {
        if (section.id === id) {
          return { ...section, isSelected: !section.isSelected };
        }
        if (section.subsections) {
          return {
            ...section,
            subsections: section.subsections.map(sub =>
              sub.id === id ? { ...sub, isSelected: !sub.isSelected } : sub
            )
          };
        }
        return section;
      })
    }
  })),
  toggleSubsection: (parentId, subsectionId) => set((state) => ({
    projectSections: {
      sections: state.projectSections.sections.map(section =>
        section.id === parentId && section.subsections
          ? {
              ...section,
              subsections: section.subsections.map(sub =>
                sub.id === subsectionId ? { ...sub, isSelected: !sub.isSelected } : sub
              )
            }
          : section
      )
    }
  })),
  toggleSectionExpanded: (id) => set((state) => ({
    projectSections: {
      sections: state.projectSections.sections.map(section =>
        section.id === id && section.subsections
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    }
  }))
}));
