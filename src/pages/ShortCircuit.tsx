import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useState } from 'react';

interface CalculationResult {
  iKz: number;
  iUdar: number;
  iThermal: number;
}

export default function ShortCircuit() {
  const [voltage, setVoltage] = useState('');
  const [power, setPower] = useState('');
  const [resistance, setResistance] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    // Здесь будет логика расчета токов КЗ
    const iKz = parseFloat(power) / (Math.sqrt(3) * parseFloat(voltage));
    const iUdar = iKz * 1.8; // Ударный коэффициент примерно 1.8
    const iThermal = iKz * Math.sqrt(1); // Время КЗ примем за 1 секунду

    setResult({
      iKz,
      iUdar,
      iThermal,
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Расчет токов короткого замыкания
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Напряжение (кВ)"
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Мощность КЗ (МВА)"
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Сопротивление системы (Ом)"
              type="number"
              value={resistance}
              onChange={(e) => setResistance(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              disabled={!voltage || !power || !resistance}
            >
              Рассчитать
            </Button>
          </Grid>
        </Grid>

        {result && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Результаты расчета:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Ток КЗ: {result.iKz.toFixed(2)} кА
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Ударный ток КЗ: {result.iUdar.toFixed(2)} кА
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Тепловой импульс: {result.iThermal.toFixed(2)} кА²·с
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}
