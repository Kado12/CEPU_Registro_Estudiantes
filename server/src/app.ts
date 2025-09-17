import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes'
import testRoutes from './routes/testRoutes'
import userRoutes from './routes/userRoutes'
import processesRoutes from './routes/processesRoutes'
import turnsRoutes from './routes/turnsRoutes'
import sedesRoutes from './routes/sedesRoutes'
import paymentPlansRoutes from './routes/paymentPlansRoutes'
import salonsRoutes from './routes/salonsRoutes'
import inscriptionStudentRoutes from './routes/inscriptionStudentRoutes'
import weeksRoutes from './routes/weeksRoutes'
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
app.use('/api/turns', turnsRoutes)
app.use('/api/sedes', sedesRoutes)
app.use('/api/payment-plans', paymentPlansRoutes)
app.use('/api/salons', salonsRoutes)
app.use('/api/students', inscriptionStudentRoutes)
app.use('/api/weeks', weeksRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  })
})

app.use(errorHandler)

export default app