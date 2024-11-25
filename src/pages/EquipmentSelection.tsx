import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`equipment-tabpanel-${index}`}
      aria-labelledby={`equipment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Примерная база данных выключателей
const circuitBreakers = [
  {
    id: 1,
    type: 'ВВЭ-10',
    voltage: 10,
    current: 1600,
    breakingCurrent: 31.5,
    thermalCurrent: 31.5,
    dynamicCurrent: 80,
  },
  {
    id: 2,
    type: 'ВВУ-СЭЩ-10',
    voltage: 10,
    current: 2000,
    breakingCurrent: 40,
    thermalCurrent: 40,
    dynamicCurrent: 102,
  },
  {
    id: 3,
    type: 'ВВУ-СЭЩ-6',
    voltage: 6,
    current: 1600,
    breakingCurrent: 31.5,
    thermalCurrent: 31.5,
    dynamicCurrent: 80,
  },
];

export default function EquipmentSelection() {
  const [tabValue, setTabValue] = useState(0);
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [breakingCurrent, setBreakingCurrent] = useState('');
  const [suitableEquipment, setSuitableEquipment] = useState<typeof circuitBreakers>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = () => {
    // Поиск подходящих выключателей
    const suitable = circuitBreakers.filter(
      (cb) =>
        cb.voltage >= parseFloat(voltage) &&
        cb.current >= parseFloat(current) &&
        cb.breakingCurrent >= parseFloat(breakingCurrent)
    );
    setSuitableEquipment(suitable);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Выбор оборудования
      </Typography>
      
      <Paper sx={{ width: '100%', mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="equipment tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Выключатели" />
          <Tab label="Разъединители" />
          <Tab label="Трансформаторы тока" />
          <Tab label="Трансформаторы напряжения" />
          <Tab label="Ошиновка" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Выбор выключателей
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Номинальное напряжение (кВ)"
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Номинальный ток (А)"
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ток отключения (кА)"
                type="number"
                value={breakingCurrent}
                onChange={(e) => setBreakingCurrent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={!voltage || !current || !breakingCurrent}
              >
                Подобрать оборудование
              </Button>
            </Grid>
          </Grid>

          {suitableEquipment.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Тип выключателя</TableCell>
                    <TableCell align="right">Uном (кВ)</TableCell>
                    <TableCell align="right">Iном (А)</TableCell>
                    <TableCell align="right">Iотк (кА)</TableCell>
                    <TableCell align="right">Iтер (кА)</TableCell>
                    <TableCell align="right">iдин (кА)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suitableEquipment.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell component="th" scope="row">
                        {equipment.type}
                      </TableCell>
                      <TableCell align="right">{equipment.voltage}</TableCell>
                      <TableCell align="right">{equipment.current}</TableCell>
                      <TableCell align="right">{equipment.breakingCurrent}</TableCell>
                      <TableCell align="right">{equipment.thermalCurrent}</TableCell>
                      <TableCell align="right">{equipment.dynamicCurrent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {suitableEquipment.length === 0 && voltage && current && breakingCurrent && (
            <Typography color="error" sx={{ mt: 2 }}>
              Подходящего оборудования не найдено
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>
            Модуль выбора разъединителей находится в разработке
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography>
            Модуль выбора трансформаторов тока находится в разработке
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography>
            Модуль выбора трансформаторов напряжения находится в разработке
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography>
            Модуль выбора ошиновки находится в разработке
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
}
