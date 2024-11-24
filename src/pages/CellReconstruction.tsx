import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper,
  TextField,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCellReconstructionStore } from '../store/cellReconstructionStore';

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

  const renderSection = (section: { id: string; name: string; isSelected: boolean; subsections?: any[]; isExpanded?: boolean }) => {
    const hasSubsections = section.subsections && section.subsections.length > 0;

    return (
      <Box key={section.id} sx={{ mb: 2 }}>
        <Paper 
          sx={{ 
            p: 2,
            bgcolor: hasSubsections ? 'grey.100' : 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={section.isSelected}
              onChange={() => toggleProjectSection(section.id)}
            />
            <Typography 
              sx={{ 
                flex: 1,
                cursor: hasSubsections ? 'pointer' : 'default'
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
              >
                {section.isExpanded ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            )}
          </Box>

          {hasSubsections && section.isExpanded && (
            <Box sx={{ ml: 4, mt: 1 }}>
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
                    }
                  }}
                >
                  <Checkbox
                    checked={subsection.isSelected}
                    onChange={() => toggleProjectSection(subsection.id)}
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
  };

  return (
    <Box sx={{ mt: 2 }}>
      {projectSections.sections.map(renderSection)}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" color="primary">
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};

export default function CellReconstruction() {
  const { 
    activeModule, 
    projectSection,
    initialDataSection,
    setActiveModule, 
    setProjectSection,
    setInitialDataSection
  } = useCellReconstructionStore();

  const handleBack = () => {
    if (initialDataSection) {
      setInitialDataSection(null);
    } else if (projectSection) {
      setProjectSection(null);
    } else {
      setActiveModule('main');
    }
  };

  if (activeModule === 'project') {
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