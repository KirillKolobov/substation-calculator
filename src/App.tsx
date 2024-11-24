import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import ShortCircuit from './pages/ShortCircuit';
import EquipmentSelection from './pages/EquipmentSelection';
import Grounding from './pages/Grounding';
import RelayProtection from './pages/RelayProtection';
import LightningProtection from './pages/LightningProtection';
import CellReconstruction from './pages/CellReconstruction';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/short-circuit" element={<ShortCircuit />} />
            <Route path="/equipment" element={<EquipmentSelection />} />
            <Route path="/grounding" element={<Grounding />} />
            <Route path="/relay" element={<RelayProtection />} />
            <Route path="/lightning" element={<LightningProtection />} />
            <Route path="/reconstruction" element={<CellReconstruction />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
