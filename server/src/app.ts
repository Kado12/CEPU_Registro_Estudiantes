import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import processesRoutes from './routes/processesRoutes'
import { errorHandler } from './middlewares/errorMiddleware'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...')
})
app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/processes', processesRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  })
})

app.use(errorHandler)

export default app