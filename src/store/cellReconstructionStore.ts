import { create } from 'zustand';

export type Module = 'main' | 'project' | 'work';
export type ProjectSection = 'initial-data' | 'project' | null;
export type InitialDataSection = 'object-info' | 'project-sections' | null;
export type ProjectDataSection = 'general' | 'sections' | null;
export type SectionModule = 'text' | 'attachments' | null;

interface Chapter {
  id: string;
  name: string;
  content: string;
}

interface TextContent {
  chapters: Chapter[];
}

interface ObjectInfo {
  objectName: string;
  cellNumber: string;
  dispatchName: string;
  purpose: string;
}

interface Section {
  id: string;
  name: string;
  isSelected: boolean;
  subsections?: Section[];
  isExpanded?: boolean;
  textContent?: TextContent;
}

interface ProjectSections {
  sections: Section[];
}

interface CellReconstructionState {
  activeModule: Module;
  projectSection: ProjectSection;
  initialDataSection: InitialDataSection;
  projectDataSection: ProjectDataSection;
  activeProjectSection: string | null;
  activeSectionModule: SectionModule;
  activeChapter: string | null;
  objectInfo: ObjectInfo;
  projectSections: ProjectSections;
  setActiveModule: (module: Module) => void;
  setProjectSection: (section: ProjectSection) => void;
  setInitialDataSection: (section: InitialDataSection) => void;
  setProjectDataSection: (section: ProjectDataSection) => void;
  setActiveProjectSection: (sectionId: string | null) => void;
  setActiveSectionModule: (module: SectionModule) => void;
  setActiveChapter: (chapterId: string | null) => void;
  setObjectInfo: (data: ObjectInfo) => void;
  setProjectSections: (data: ProjectSections) => void;
  toggleProjectSection: (id: string) => void;
  toggleSubsection: (parentId: string, subsectionId: string) => void;
  toggleSectionExpanded: (id: string) => void;
  getSelectedSections: () => Section[];
  updateChapterContent: (sectionId: string, chapterId: string, content: string) => void;
  deleteChapter: (sectionId: string, chapterId: string) => void;
}

const getDefaultChapters = (sectionId: string): Chapter[] => {
  // Определяем главы в зависимости от типа раздела
  switch (sectionId) {
    case 'pz': // Пояснительная записка
      return [
        { id: 'pz-1', name: 'а) Реквизиты документов, на основании которых принято решение о разработке проектной документации', content: '' },
        { id: 'pz-2', name: 'б) Исходные данные и условия для подготовки проектной документации на объект капитального строительства', content: '' },
        { id: 'pz-3', name: 'в) Сведения о функциональном назначении объекта капитального строительства', content: '' },
        { id: 'pz-4', name: 'г) Сведения о потребности объекта капитального строительства в топливе, газе, воде и электрической энергии', content: '' },
        { id: 'pz-5', name: 'д) Данные о проектной мощности объекта капитального строительства', content: '' },
        { id: 'pz-6', name: 'е) Сведения о сырьевой базе, потребности производства в воде, топливно-энергетических ресурсах', content: '' },
        { id: 'pz-7', name: 'ж) Сведения о комплексном использовании сырья, вторичных энергоресурсов, отходов производства', content: '' },
        { id: 'pz-8', name: 'з) Сведения об использовании возобновляемых источников энергии и вторичных энергетических ресурсов', content: '' },
        { id: 'pz-9', name: 'и) Сведения о земельных участках, изымаемых для государственных или муниципальных нужд', content: '' },
        { id: 'pz-10', name: 'к) Сведения о категории земель, на которых располагается объект капитального строительства', content: '' },
        { id: 'pz-11', name: 'л) Сведения о размере средств, требующихся для возмещения убытков правообладателям земельных участков', content: '' },
        { id: 'pz-12', name: 'м) Сведения об использованных в проекте изобретениях, результатах проведенных патентных исследований', content: '' },
        { id: 'pz-13', name: 'н) Технико-экономические показатели проектируемых объектов капитального строительства', content: '' },
        { id: 'pz-14', name: 'о) Сведения о наличии разработанных и согласованных специальных технических условий', content: '' },
        { id: 'pz-15', name: 'п) Данные о проектной мощности объекта капитального строительства', content: '' },
        { id: 'pz-16', name: 'р) Сведения о компьютерных программах, которые использовались при выполнении расчетов', content: '' },
        { id: 'pz-17', name: 'с) Обоснование возможности осуществления строительства по этапам строительства с выделением этих этапов', content: '' },
        { id: 'pz-18', name: 'т) Сведения о предполагаемых затратах, связанных со сносом зданий и сооружений', content: '' },
        { id: 'pz-19', name: 'у) Заверение проектной организации', content: '' }
      ];
    case 'power': // Система электроснабжения
      return [
        { id: 'power-1', name: 'а) Характеристика источников электроснабжения', content: '' },
        { id: 'power-2', name: 'б) Обоснование принятой схемы электроснабжения', content: '' },
        { id: 'power-3', name: 'в) Сведения о количестве электроприемников, их установленной и расчетной мощности', content: '' },
        { id: 'power-4', name: 'г) Требования к надежности электроснабжения и качеству электроэнергии', content: '' },
        { id: 'power-5', name: 'д) Описание решений по обеспечению электроэнергией электроприемников', content: '' },
        { id: 'power-6', name: 'е) Описание проектных решений по компенсации реактивной мощности', content: '' },
        { id: 'power-7', name: 'ж) Перечень мероприятий по экономии электроэнергии', content: '' },
        { id: 'power-8', name: 'з) Сведения о мощности сетевых и трансформаторных объектов', content: '' },
        { id: 'power-9', name: 'и) Решения по организации масляного и ремонтного хозяйства', content: '' },
        { id: 'power-10', name: 'к) Перечень мероприятий по заземлению и молниезащите', content: '' },
        { id: 'power-11', name: 'л) Сведения о типе, классе проводов и осветительной арматуры', content: '' },
        { id: 'power-12', name: 'м) Описание системы рабочего и аварийного освещения', content: '' },
        { id: 'power-13', name: 'н) Описание дополнительных и резервных источников электроэнергии', content: '' },
        { id: 'power-14', name: 'о) Перечень мероприятий по резервированию электроэнергии', content: '' }
      ];
    case 'relay': // Релейная защита и автоматика
      return [
        { id: 'relay-1', name: 'а) Принципы построения релейной защиты и автоматики', content: '' },
        { id: 'relay-2', name: 'б) Основные технические решения по релейной защите', content: '' },
        { id: 'relay-3', name: 'в) Основные технические решения по автоматизации управления', content: '' },
        { id: 'relay-4', name: 'г) Основные технические решения по противоаварийной автоматике', content: '' },
        { id: 'relay-5', name: 'д) Основные технические решения по регистрации аварийных событий', content: '' },
        { id: 'relay-6', name: 'е) Перечень мероприятий по обеспечению надежности системы РЗА', content: '' }
      ];
    // Добавьте другие разделы по аналогии
    default:
      return [
        { id: `${sectionId}-1`, name: 'а) Общие положения', content: '' },
        { id: `${sectionId}-2`, name: 'б) Описание основных решений', content: '' },
        { id: `${sectionId}-3`, name: 'в) Технические характеристики', content: '' }
      ];
  }
};

export const useCellReconstructionStore = create<CellReconstructionState>((set, get) => ({
  activeModule: 'main',
  projectSection: null,
  initialDataSection: null,
  projectDataSection: null,
  activeProjectSection: null,
  activeSectionModule: null,
  activeChapter: null,
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
          { id: 'power', name: 'Система электроснабжения', isSelected: false },
          { id: 'relay', name: 'Релейная защита и автоматика', isSelected: false },
          { id: 'tech-info', name: 'Решения по системе сбора и передачи технологической информации', isSelected: false },
          { id: 'aiis', name: 'Модернизация автоматизированной информационно-измерительной системы коммерческого учета электроэнергии', isSelected: false },
          { id: 'metrology', name: 'Метрологическое обеспечение', isSelected: false },
          { id: 'emc', name: 'Решения по электромагнитной совместимости устройств РЗА, АИИС КУЭ, связи', isSelected: false }
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
  setProjectDataSection: (section) => set({ projectDataSection: section }),
  setActiveProjectSection: (sectionId) => set({ 
    activeProjectSection: sectionId,
    activeSectionModule: null // Сбрасываем активный модуль при смене раздела
  }),
  setActiveSectionModule: (module) => set({ activeSectionModule: module }),
  setActiveChapter: (chapterId) => set({ activeChapter: chapterId }),
  setObjectInfo: (data) => set({ objectInfo: data }),
  setProjectSections: (data) => set({ projectSections: data }),
  toggleProjectSection: (id) => set((state) => ({
    projectSections: {
      sections: state.projectSections.sections.map(section => {
        if (section.id === id) {
          return { 
            ...section, 
            isSelected: !section.isSelected,
            textContent: !section.isSelected ? { chapters: getDefaultChapters(section.id) } : section.textContent 
          };
        }
        if (section.subsections) {
          return {
            ...section,
            subsections: section.subsections.map(sub =>
              sub.id === id ? { 
                ...sub, 
                isSelected: !sub.isSelected,
                textContent: !sub.isSelected ? { chapters: getDefaultChapters(sub.id) } : sub.textContent 
              } : sub
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
  })),
  getSelectedSections: () => {
    const state = get();
    const selectedSections: Section[] = [];
    
    state.projectSections.sections.forEach(section => {
      if (section.subsections) {
        // Для разделов с подразделами добавляем только выбранные подразделы
        section.subsections.forEach(subsection => {
          if (subsection.isSelected) {
            selectedSections.push(subsection);
          }
        });
      } else if (section.isSelected) {
        // Для обычных разделов добавляем сам раздел, если он выбран
        selectedSections.push(section);
      }
    });
    
    return selectedSections;
  },
  updateChapterContent: (sectionId, chapterId, content) => set((state) => ({
    projectSections: {
      sections: state.projectSections.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            textContent: {
              chapters: section.textContent?.chapters.map(chapter =>
                chapter.id === chapterId ? { ...chapter, content } : chapter
              ) || []
            }
          };
        }
        if (section.subsections) {
          return {
            ...section,
            subsections: section.subsections.map(sub =>
              sub.id === sectionId ? {
                ...sub,
                textContent: {
                  chapters: sub.textContent?.chapters.map(chapter =>
                    chapter.id === chapterId ? { ...chapter, content } : chapter
                  ) || []
                }
              } : sub
            )
          };
        }
        return section;
      })
    }
  })),
  deleteChapter: (sectionId, chapterId) => set((state) => ({
    projectSections: {
      sections: state.projectSections.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            textContent: {
              chapters: section.textContent?.chapters.filter(chapter => 
                chapter.id !== chapterId
              ) || []
            }
          };
        }
        if (section.subsections) {
          return {
            ...section,
            subsections: section.subsections.map(sub =>
              sub.id === sectionId ? {
                ...sub,
                textContent: {
                  chapters: sub.textContent?.chapters.filter(chapter => 
                    chapter.id !== chapterId
                  ) || []
                }
              } : sub
            )
          };
        }
        return section;
      })
    },
    activeChapter: state.activeChapter === chapterId ? null : state.activeChapter
  }))
}));
