import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { UpdatePostDto } from 'src/dto/posts/update-post.dto';
import { RequestWithUser } from 'src/middlewares/auth.middleware';
import { postModel } from 'src/schema';

@Injectable()
export class PostsService {

    async findAll() {
        const resp = await postModel.find().sort({ _id: -1 }).exec()
        return resp
    }

    async create(createPostDto: CreatePostDto, req: RequestWithUser) {

        const { _id, firstName, lastName } = req.currentUser

        const { title, text } = createPostDto

        if (!title || !text || title.trim() === "" || text.trim() === "") {
            throw new BadRequestException('title or text missing')
        }

        const res = await postModel.create({
            title: title,
            text: text,
            author_id: _id,
            author: {
                firstName, lastName
            }
        })

        return {
            message: "post created"
        }

    }

    async deleteOne(postId: string, req: RequestWithUser) {

        if (!postId || postId.trim() === "") {
            throw new BadRequestException('postId not provided')
        }

        if (!isValidObjectId(postId)) {
            throw new BadRequestException('invalid postId')
        }

        const resp = await postModel.findById(postId).select("author_id")

        if (!resp) {
            throw new NotFoundException('post not found')
        }


        if (`${resp.author_id}` !== req.currentUser._id) {
            throw new UnauthorizedException('you are not authorized to delete this post')
        }

        const delResponse = await postModel.findByIdAndDelete(postId)

        if (!delResponse) {
            throw new NotFoundException('post not found')
        }

        return {
            message: "post deleted"
        }

    }

    async updateOne(postId: string, updatedPostDto: UpdatePostDto, req: RequestWithUser) {

        const { title, text } = updatedPostDto

        if (!title || !text || title.trim() === "" || text.trim() === "") {
            throw new BadRequestException('title or text missing')
        }

        if (!postId || postId.trim() === "") {
            throw new BadRequestException('postId not provided')
        }

        if (!isValidObjectId(postId)) {
            throw new BadRequestException('invalid postId')
        }

        const resp = await postModel.findById(postId).select("author_id")

        if (!resp) {
            throw new NotFoundException('post not found')
        }

        if (req.currentUser._id !== `${resp.author_id}`) {
            throw new UnauthorizedException('you are not authorized to edit this post')
        }

        const updateResp = await postModel.findByIdAndUpdate({
            _id: postId
        },
            {
                $set: {
                    title: title,
                    text: text
                }
            }, { new: true, runValidators: true })

        if (!updateResp) {
            throw new NotFoundException('post not found')
        }

        return {
            message: "post updated"
        }

    }

}