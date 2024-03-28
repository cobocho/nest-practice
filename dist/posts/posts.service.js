"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const posts_entity_1 = require("./entity/posts.entity");
let PostsService = class PostsService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async getAllPosts() {
        return this.postRepository.find();
    }
    async getPostById(id) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException();
        }
        return post;
    }
    async createPost(author, title, content) {
        const post = {
            author,
            title,
            content,
            likeCount: 0,
            commentCount: 0,
        };
        this.postRepository.insert(post);
        const newPost = await this.postRepository.save(post);
        return newPost;
    }
    async updatePost(id, author, title, content) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException();
        }
        if (author) {
            post.author = author;
        }
        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }
        const newPost = await this.postRepository.save(post);
        return newPost;
    }
    async deletePost(id) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });
        this.postRepository.delete(post);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(posts_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map