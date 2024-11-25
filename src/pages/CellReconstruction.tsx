import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  AlertTitle,
  LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { useCellReconstructionStore } from '../store/cellReconstructionStore';
import { Editor } from '@tinymce/tinymce-react';
import { generateChapterContent } from '../services/ollamaService';

interface Section {
  id: string;
  name: string;
  isSelected: boolean;
  subsections?: any[];
  isExpanded?: boolean;
}

const ObjectInfoForm = () => {
  const { objectInfo, setObjectInfo } = useCellReconstructionStore();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Сохранено:', objectInfo);
  };

  const handleChange = (field: keyof typeof objectInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setObjectInfo({
      ...objectInfo,
      [field]: event.target.value
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Наименование объекта"
            variant="outlined"
            value={objectInfo.objectName}
            onChange={handleChange('objectName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Номер ячейки"
            variant="outlined"
            value={objectInfo.cellNumber}
            onChange={handleChange('cellNumber')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Диспетчерское наименование"
            variant="outlined"
            value={objectInfo.dispatchName}
            onChange={handleChange('dispatchName')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Назначение ячейки"
            variant="outlined"
            multiline
            rows={2}
            value={objectInfo.purpose}
            onChange={handleChange('purpose')}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">
              Сохранить
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const ProjectSectionsForm = () => {
  const { projectSections, toggleProjectSection, toggleSectionExpanded } = useCellReconstructionStore();

  const renderSection = React.useCallback((section: Section) => {
    const hasSubsections = section.subsections && section.subsections.length > 0;

    return (
      <Box key={section.id} sx={{ mb: 2 }}>
        <Paper 
          sx={{ 
            p: 2,
            bgcolor: hasSubsections ? 'grey.100' : 'background.paper',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={section.isSelected}
              onChange={() => toggleProjectSection(section.id)}
              color="primary"
            />
            <Typography 
              sx={{ 
                flex: 1,
                cursor: hasSubsections ? 'pointer' : 'default',
                '&:hover': hasSubsections ? {
                  color: 'primary.main'
                } : {}
              }}
              onClick={() => {
                if (hasSubsections) {
                  toggleSectionExpanded(section.id);
                }
              }}
            >
              {section.name}
            </Typography>
            {hasSubsections && (
              <IconButton
                size="small"
                onClick={() => toggleSectionExpanded(section.id)}
                sx={{
                  transition: 'transform 0.2s ease',
                  transform: section.isExpanded ? 'rotate(180deg)' : 'none'
                }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            )}
          </Box>

          {hasSubsections && section.isExpanded && (
            <Box 
              sx={{ 
                ml: 4, 
                mt: 1,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out'
              }}
            >
              {section.subsections.map((subsection) => (
                <Box 
                  key={subsection.id}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      borderBottom: 'none'
                    },
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Checkbox
                    checked={subsection.isSelected}
                    onChange={() => toggleProjectSection(subsection.id)}
                    color="primary"
                  />
                  <Typography>
                    {subsection.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    );
  }, [toggleProjectSection, toggleSectionExpanded]);

  return (
    <Box sx={{ mt: 2 }}>
      {projectSections.sections.map(renderSection)}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          sx={{
            minWidth: 120
          }}
        >
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};

const ChapterEditor = ({ section, chapter, onClose }) => {
  const { updateChapterContent } = useCellReconstructionStore();
  const [content, setContent] = useState(chapter.content);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const editorRef = useRef(null);

  const handleSave = () => {
    updateChapterContent(section.id, chapter.id, content);
  };

  const handleAutoGenerate = async () => {
    try {
      setError('');
      setIsGenerating(true);
      setShowGenerateConfirm(false);

      const context = `Раздел: ${section.name}. ${section.description || ''}`;
      const generatedContent = await generateChapterContent(chapter.name, context);
      
      setContent(generatedContent);
      handleSave();
    } catch (error) {
      console.error('Error generating content:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Произошла неизвестная ошибка при генерации контента');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckServerStatus = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('http://localhost:11434/api/health');
      if (response.ok) {
        setError('✅ Сервер Ollama запущен и работает нормально!\n\nТеперь можно использовать автозаполнение.');
      } else {
        throw new Error('Сервер отвечает с ошибкой');
      }
    } catch (error) {
      setError(
        '❌ Сервер Ollama не запущен\n\n' +
        'Для запуска:\n' +
        '1. Откройте PowerShell\n' +
        '2. Выполните команду: ollama serve\n' +
        '3. Оставьте окно PowerShell открытым'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content]);

  return (
    <>
      <Dialog 
        open={true} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {chapter.name}
            </Typography>
            <Box>
              <Button
                onClick={handleCheckServerStatus}
                disabled={isGenerating}
                sx={{ mr: 1 }}
              >
                Проверить статус сервера
              </Button>
              <Button
                onClick={() => setShowGenerateConfirm(true)}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} /> : null}
                sx={{ mr: 1 }}
              >
                {isGenerating ? 'Генерация...' : 'Автозаполнение'}
              </Button>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          {error && (
            <Alert 
              severity={error.includes('✅') ? "success" : "error"} 
              sx={{ mb: 2 }} 
              onClose={() => setError('')}
            >
              <AlertTitle>{error.includes('✅') ? "Статус сервера" : "Ошибка"}</AlertTitle>
              {error.split('\n').map((line, i) => (
                <Typography key={i} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {line}
                </Typography>
              ))}
              {!error.includes('✅') && (
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href="https://ollama.ai/download" 
                    target="_blank"
                    sx={{ mr: 1 }}
                  >
                    Скачать Ollama
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setError('')}
                  >
                    Закрыть
                  </Button>
                </Box>
              )}
            </Alert>
          )}
          {isGenerating && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Генерация текста</AlertTitle>
              <Typography variant="body2">
                Идет генерация текста. Это может занять 1-2 минуты.
                Пожалуйста, подождите...
              </Typography>
              <LinearProgress sx={{ mt: 1 }} />
            </Alert>
          )}
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: '100%',
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'pagebreak'
              ],
              toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | pagebreak | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 14px; line-height: 1.5; margin: 1rem; } p { margin: 0 0 1em 0; } table { border-collapse: collapse; } table td, table th { border: 1px solid #ccc; padding: 0.4rem; } .pagebreak { page-break-before: always; }',
              browser_spellcheck: true,
              language: 'ru',
              language_url: '/langs/ru.js',
              resize: false,
              statusbar: true,
              branding: false,
              promotion: false
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showGenerateConfirm}
        onClose={() => setShowGenerateConfirm(false)}
      >
        <DialogTitle>
          Подтверждение генерации
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Внимание</AlertTitle>
            <Typography variant="body2">
              Генерация текста может занять 1-2 минуты и создать дополнительную нагрузку на процессор.
              Рекомендуется:
            </Typography>
            <ul>
              <li>Закрыть неиспользуемые программы</li>
              <li>Не запускать несколько генераций одновременно</li>
              <li>При необходимости сохранить другие документы</li>
            </ul>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenerateConfirm(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleAutoGenerate}
            variant="contained"
            color="primary"
          >
            Начать генерацию
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ChaptersList = ({ section }) => {
  const { activeChapter, setActiveChapter, deleteChapter } = useCellReconstructionStore();
  const [openChapter, setOpenChapter] = React.useState(null);
  const [chapterToDelete, setChapterToDelete] = React.useState(null);

  const handleChapterOpen = (chapter) => {
    setOpenChapter(chapter);
  };

  const handleChapterClose = () => {
    setOpenChapter(null);
  };

  const handleDeleteClick = (e, chapter) => {
    e.stopPropagation();
    setChapterToDelete(chapter);
  };

  const handleDeleteConfirm = () => {
    if (chapterToDelete) {
      deleteChapter(section.id, chapterToDelete.id);
      setChapterToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setChapterToDelete(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {section.textContent?.chapters.map((chapter) => (
          <Grid item xs={12} md={6} lg={4} key={chapter.id}>
            <Paper 
              sx={{ 
                p: 3,
                cursor: 'pointer',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: activeChapter === chapter.id ? 'primary.light' : 'background.paper',
                color: activeChapter === chapter.id ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: activeChapter === chapter.id ? 'primary.main' : 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
              onClick={() => {
                setActiveChapter(chapter.id);
                handleChapterOpen(chapter);
              }}
              elevation={activeChapter === chapter.id ? 4 : 1}
            >
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteClick(e, chapter)}
                  sx={{
                    color: activeChapter === chapter.id ? 'inherit' : 'error.main',
                    '&:hover': {
                      bgcolor: 'error.main',
                      color: 'error.contrastText',
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  pr: 4, // Отступ справа для кнопки удаления
                  minHeight: '64px' // Минимальная высота для выравнивания карточек
                }}
              >
                {chapter.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1,
                  color: activeChapter === chapter.id ? 'inherit' : 'text.secondary',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  flex: 1
                }}
              >
                {chapter.content || 'Нажмите, чтобы добавить содержимое...'}
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  mt: 2,
                  pt: 2,
                  borderTop: 1,
                  borderColor: 'divider'
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChapterOpen(chapter);
                  }}
                  sx={{
                    color: activeChapter === chapter.id ? 'inherit' : 'primary.main',
                    borderColor: activeChapter === chapter.id ? 'inherit' : 'primary.main',
                  }}
                >
                  Открыть редактор
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Модальное окно редактора */}
      {openChapter && (
        <ChapterEditor
          section={section}
          chapter={openChapter}
          onClose={handleChapterClose}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={Boolean(chapterToDelete)}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography>
            Вы действительно хотите удалить главу "{chapterToDelete?.name}"?
            Это действие нельзя будет отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ProjectSectionsView = () => {
  const { getSelectedSections, activeProjectSection, setActiveProjectSection } = useCellReconstructionStore();
  const selectedSections = getSelectedSections();

  if (selectedSections.length === 0) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Нет выбранных разделов. Пожалуйста, выберите разделы в модуле "Разрабатываемые разделы".
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {selectedSections.map((section) => (
          <Grid item xs={12} md={6} key={section.id}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                bgcolor: activeProjectSection === section.id ? 'primary.light' : 'background.paper',
                color: activeProjectSection === section.id ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: activeProjectSection === section.id ? 'primary.main' : 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
              onClick={() => setActiveProjectSection(section.id)}
              elevation={activeProjectSection === section.id ? 4 : 1}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: activeProjectSection === section.id ? 'inherit' : 'text.primary'
                }}
              >
                {section.name}
              </Typography>
              <Typography 
                sx={{
                  color: activeProjectSection === section.id ? 'inherit' : 'text.secondary'
                }}
              >
                Нажмите для перехода к разделу
              </Typography>
              {activeProjectSection === section.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.contrastText'
                  }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const SectionModules = () => {
  const { activeSectionModule, setActiveSectionModule } = useCellReconstructionStore();

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              position: 'relative',
              bgcolor: activeSectionModule === 'text' ? 'primary.light' : 'background.paper',
              color: activeSectionModule === 'text' ? 'primary.contrastText' : 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeSectionModule === 'text' ? 'primary.main' : 'action.hover',
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[4]
              }
            }}
            onClick={() => setActiveSectionModule('text')}
            elevation={activeSectionModule === 'text' ? 4 : 1}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                color: activeSectionModule === 'text' ? 'inherit' : 'text.primary'
              }}
            >
              Текстовая часть
            </Typography>
            <Typography 
              sx={{
                color: activeSectionModule === 'text' ? 'inherit' : 'text.secondary'
              }}
            >
              Основное содержание раздела
            </Typography>
            {activeSectionModule === 'text' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.contrastText'
                }}
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              position: 'relative',
              bgcolor: activeSectionModule === 'attachments' ? 'primary.light' : 'background.paper',
              color: activeSectionModule === 'attachments' ? 'primary.contrastText' : 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeSectionModule === 'attachments' ? 'primary.main' : 'action.hover',
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[4]
              }
            }}
            onClick={() => setActiveSectionModule('attachments')}
            elevation={activeSectionModule === 'attachments' ? 4 : 1}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                color: activeSectionModule === 'attachments' ? 'inherit' : 'text.primary'
              }}
            >
              Приложения
            </Typography>
            <Typography 
              sx={{
                color: activeSectionModule === 'attachments' ? 'inherit' : 'text.secondary'
              }}
            >
              Дополнительные материалы и документы
            </Typography>
            {activeSectionModule === 'attachments' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.contrastText'
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function CellReconstruction() {
  const { 
    activeModule, 
    projectSection,
    initialDataSection,
    projectDataSection,
    activeProjectSection,
    activeSectionModule,
    setActiveModule, 
    setProjectSection,
    setInitialDataSection,
    setProjectDataSection,
    setActiveProjectSection,
    setActiveSectionModule,
    getSelectedSections
  } = useCellReconstructionStore();

  const handleBack = () => {
    if (activeSectionModule) {
      setActiveSectionModule(null);
    } else if (activeProjectSection) {
      setActiveProjectSection(null);
    } else if (projectDataSection) {
      setProjectDataSection(null);
    } else if (initialDataSection) {
      setInitialDataSection(null);
    } else if (projectSection) {
      setProjectSection(null);
    } else {
      setActiveModule('main');
    }
  };

  if (activeModule === 'project') {
    if (projectSection === 'project') {
      if (projectDataSection === 'sections') {
        if (activeProjectSection) {
          const currentSection = getSelectedSections().find(s => s.id === activeProjectSection);
          
          if (activeSectionModule === 'text') {
            return (
              <Container maxWidth="lg">
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4">
                    {currentSection?.name} - Текстовая часть
                  </Typography>
                </Box>
                <ChaptersList section={currentSection} />
              </Container>
            );
          }

          if (activeSectionModule === 'attachments') {
            return (
              <Container maxWidth="lg">
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4">
                    {currentSection?.name} - Приложения
                  </Typography>
                </Box>
                {/* TODO: Добавить компонент для приложений */}
              </Container>
            );
          }

          return (
            <Container maxWidth="lg">
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">
                  {currentSection?.name}
                </Typography>
              </Box>
              <SectionModules />
            </Container>
          );
        }

        return (
          <Container maxWidth="lg">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                Разделы проекта
              </Typography>
            </Box>
            <ProjectSectionsView />
          </Container>
        );
      }

      if (projectDataSection === 'general') {
        return (
          <Container maxWidth="lg">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                Общие данные
              </Typography>
            </Box>
            {/* TODO: Добавить форму общих данных */}
          </Container>
        );
      }

      return (
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">
              Проект
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => setProjectDataSection('general')}
              >
                <Typography variant="h5" gutterBottom>
                  Общие данные
                </Typography>
                <Typography color="text.secondary">
                  Основная информация о проекте
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => setProjectDataSection('sections')}
              >
                <Typography variant="h5" gutterBottom>
                  Разделы проекта
                </Typography>
                <Typography color="text.secondary">
                  Управление разделами проектной документации
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      );
    }

    if (projectSection === 'initial-data') {
      if (initialDataSection === 'object-info') {
        return (
          <Container maxWidth="lg">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                Информация об объекте проектирования
              </Typography>
            </Box>
            <ObjectInfoForm />
          </Container>
        );
      }

      if (initialDataSection === 'project-sections') {
        return (
          <Container maxWidth="lg">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4">
                Разрабатываемые разделы
              </Typography>
            </Box>
            <ProjectSectionsForm />
          </Container>
        );
      }

      return (
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">
              Исходные данные
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => setInitialDataSection('object-info')}
              >
                <Typography variant="h5" gutterBottom>
                  Информация об объекте проектирования
                </Typography>
                <Typography color="text.secondary">
                  Основные сведения об объекте реконструкции
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => setInitialDataSection('project-sections')}
              >
                <Typography variant="h5" gutterBottom>
                  Разрабатываемые разделы
                </Typography>
                <Typography color="text.secondary">
                  Выбор разделов проектной документации
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      );
    }

    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Проектная документация
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => setProjectSection('initial-data')}
            >
              <Typography variant="h5" gutterBottom>
                Исходные данные
              </Typography>
              <Typography color="text.secondary">
                Основная информация об объекте реконструкции
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => setProjectSection('project')}
            >
              <Typography variant="h5" gutterBottom>
                Проект
              </Typography>
              <Typography color="text.secondary">
                Разработка проектной документации
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Реконструкция ячеек
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
            onClick={() => setActiveModule('project')}
          >
            <Typography variant="h5" gutterBottom>
              Проектная документация
            </Typography>
            <Typography color="text.secondary">
              Документация, определяющая архитектурные, функционально-технологические и инженерно-технические решения
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
            onClick={() => setActiveModule('work')}
          >
            <Typography variant="h5" gutterBottom>
              Рабочая документация
            </Typography>
            <Typography color="text.secondary">
              Документация, необходимая для выполнения строительно-монтажных работ
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}