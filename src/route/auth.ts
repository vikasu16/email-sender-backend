import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const userRoute = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>()

userRoute.post('/config', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
  
    try{
      const user = await prisma.user.findUnique({
          where: {
              email: body.email
          }
      });

      if(!user)
      {
          try {
              const user = await prisma.user.create({
              data: {
                  email: body.email,
                  name: body.name
              }
              });
              return c.json({ message: "configuration complete", userid : user.id });
          } 
          catch(e) {
              c.status(403);
              return c.json({ error: "error while configuration" });
          }
      }    
      return c.json({ message: "configuration complete", userid : user.id });
    }
    catch(e)
    {
        return c.json({ error: "error while configuration" });
    }
  })
  
export default userRoute;