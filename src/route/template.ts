import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

const templateRoute = new Hono<{
    Bindings: {
		DATABASE_URL: string
	}
}>();

const errorMessage = "error occured while connecting with data";

templateRoute.post('/add', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try{
        const templateValue = await prisma.template.create({
            data:{
                userid : body.userid,
                subject : body.subject,
                content : body.content
            }
        })
        return c.json({ message : "added template", templateId : templateValue.id });
    }
    catch(e)
    {
        return c.json({error : errorMessage})
    }
});

templateRoute.get("/:id", async (c) => {
    const userid = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentdate = new Date();

    try{
        const data = await prisma.template.findMany({
            where : {
                userid : userid,
                createddate : {
                    gte : today.toISOString(),
                    lt : currentdate.toISOString()
                }
            }
        })
        const value = data.length;
        return c.json({totalValue : value});
    }
    catch(e)
    {
        c.json({error : errorMessage})
    }
});

templateRoute.post('/getbydate', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const requesteddate = new Date(body.requesteddate);
    requesteddate.setHours(0, 0, 0, 0);
    const nextdate = new Date(requesteddate); // Copy today's date
    nextdate.setDate(nextdate.getDate() + 1)
    try{
        const templates = await prisma.template.findMany({
            where:{
                userid : body.userid,
                createddate : {
                    gte : requesteddate.toISOString(),
                    lt : nextdate
                }
            }
        })
        return c.json({ templates : templates , date : nextdate });
    }
    catch(e)
    {
        return c.json({ error : errorMessage});
    }
})

export default templateRoute;