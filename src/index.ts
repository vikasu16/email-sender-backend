import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import userRoute from './route/auth'
import statisticRoute from './route/statistic'
import templateRoute from './route/template'
import { cors } from 'hono/cors'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>()

app.use('/*', cors());
app.route('/api/v1/auth', userRoute);
app.route('/api/v1/template', templateRoute);
app.route('/api/v1/statistic', statisticRoute);

export default app
