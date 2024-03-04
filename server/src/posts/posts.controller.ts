import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from 'src/dto//posts/update-post.dto';
import { Request } from 'express';
import { RequestWithUser } from 'src/middlewares/auth.middleware';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsServices: PostsService) { }

    @Get()
    findAll() {
        return this.postsServices.findAll()
    }

    @Post()
    create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
        return this.postsServices.create(createPostDto, req)
    }

    @Delete(':postId')
    deleteOne(@Param('postId') postId: string, @Req() req: RequestWithUser) {
        return this.postsServices.deleteOne(postId, req)
    }

    @Put(':postId')
    updateOne(
        @Param('postId') postId: string,
        @Body() updatedPostDto: UpdatePostDto,
        @Req() req: RequestWithUser
    ) {
        return this.postsServices.updateOne(postId, updatedPostDto, req)
    }

}