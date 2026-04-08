import prisma from '../config/db.js';

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

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error creating post", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.forumPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      take: 50
    });

    // Mask non-anonymous user data if isAnonymous is true
    const sanitizedPosts = posts.map(post => {
      if (post.isAnonymous) {
        const { user, ...rest } = post;
        return rest;
      }
      return post;
    });

    res.json(sanitizedPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching posts", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    // In this simplified Prisma schema, we just increment likes
    const updatedPost = await prisma.forumPost.update({
      where: { id: postId },
      data: {
        likes: { increment: 1 }
      }
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error liking post", error: error.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
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
