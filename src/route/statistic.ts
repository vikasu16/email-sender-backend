import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const statisticRoute = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>()

const errorMessage = "error occured while connecting with data";

statisticRoute.get('/:id', async (c) => {
    const userid = await c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentdate = new Date();

    try{
        const data = await prisma.statistic.findMany({
            where : {
                userid : userid,
                createddate : {
                    gte : today.toISOString(),
                    lt : currentdate.toISOString()
                }
            }
        })
        const value = data.flatMap((e) => e.totalrecepits).reduce((acc, curr) => acc + curr, 0);
        return c.json({totalValue : value});
    }
    catch(e)
    {
        return c.json({ error : errorMessage})
    }
});

statisticRoute.post('/add', async (c)=>{
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try{
        const data = await prisma.statistic.create({
            data: {
                userid : body.userid,
                totalrecepits : body.totalrecepits
            }
        });
        return c.json({message: "data added", id : data.id})
    }
    catch(e)
    {
        return c.json({ error : errorMessage})
    }
});

export default statisticRoute;