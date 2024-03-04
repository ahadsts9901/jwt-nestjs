import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestWithUser } from 'src/middlewares/auth.middleware';

@Injectable()
export class ProfileService {

    async profile(req: RequestWithUser, res: Response) {
        return res.send({
            ...req.currentUser
        })
    }

}
