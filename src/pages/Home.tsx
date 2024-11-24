import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Расчет токов короткого замыкания',
    description: 'Расчет токов КЗ для выбора и проверки оборудования подстанции',
    path: '/short-circuit',
  },
  {
    title: 'Выбор оборудования',
    description: 'Помощь в выборе выключателей, разъединителей и трансформаторов',
    path: '/equipment',
  },
  {
    title: 'Расчет заземления',
    description: 'Расчет заземляющих устройств подстанции',
    path: '/grounding',
  },
  {
    title: 'Релейная защита',
    description: 'Выбор уставок и проверка чувствительности релейной защиты',
    path: '/relay',
  },
  {
    title: 'Молниезащита',
    description: 'Расчет и проектирование молниезащиты подстанции',
    path: '/lightning',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Добро пожаловать в приложение для расчетов электрических подстанций
      </Typography>
      <Typography variant="body1" paragraph>
        Это приложение поможет вам с различными расчетами при проектировании
        электрических подстанций. Выберите нужный раздел для начала работы.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography>{feature.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(feature.path)}
                >
                  Перейти
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
