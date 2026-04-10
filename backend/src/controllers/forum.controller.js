import prisma from '../config/db.js';
import { emitEvent } from '../socket.js';

export const createPost = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    // Basic profanity filter
    const profanityList = ['badword1', 'badword2']; // Example
    const hasProfanity = profanityList.some(word => content.toLowerCase().includes(word));
    
    if (hasProfanity) {
      return res.status(400).json({ message: "Post contains inappropriate content." });
    }

    const post = await prisma.forumPost.create({
      data: {
        content,
        userId,
        isAnonymous
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Broadcast new post
    emitEvent('post:new', post);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error creating post", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await prisma.forumPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        likes: {
          where: { userId }
        }
      },
      take: 50
    });

    // Map posts to include isLiked state and mask anonymous data
    const sanitizedPosts = posts.map(post => {
      const isLiked = post.likes.length > 0;
      
      if (post.isAnonymous) {
        const { user, likes, ...rest } = post;
        return { ...rest, isLiked };
      }
      
      const { likes, ...rest } = post;
      return { ...rest, isLiked };
    });

    res.json(sanitizedPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching posts", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId }
      }
    });

    let updatedPost;
    if (existingLike) {
      // Unlike
      updatedPost = await prisma.$transaction([
        prisma.postLike.delete({
          where: { id: existingLike.id }
        }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }
        })
      ]);
    } else {
      // Like
      updatedPost = await prisma.$transaction([
        prisma.postLike.create({
          data: { postId, userId }
        }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } }
        })
      ]);
    }

    const finalPost = updatedPost[1];

    // Broadcast like update
    emitEvent('post:like', { 
        postId, 
        likes: finalPost.likesCount 
    });

    res.json({ 
        postId, 
        likes: finalPost.likesCount, 
        isLiked: !existingLike 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error toggling like", error: error.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedPost = await prisma.forumPost.update({
      where: { id: postId },
      data: {
        reports: { increment: 1 }
      }
    });

    res.json({ message: "Post reported successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error reporting post", error: error.message });
  }
};
