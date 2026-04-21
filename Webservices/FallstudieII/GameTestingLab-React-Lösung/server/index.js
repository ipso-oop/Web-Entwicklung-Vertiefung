import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import ratingsRoutes from './routes/ratings.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Testing Lab API',
      version: '1.0.0',
      description: 'REST API for Game Testing Lab application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ratings', ratingsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Use PORT from environment variables
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));