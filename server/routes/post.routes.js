const router=require('express').Router();
const postController=require('../controllers/post.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', postController.readPost);
router.post("/", requireAuth, postController.createPost);
router.put("/:id", requireAuth, postController.updatePost);
router.delete("/:id", requireAuth, postController.deletePost);
router.patch('/like-post/:id', requireAuth, postController.likePost);
router.patch("/unlike-post/:id", requireAuth, postController.unlikePost);

//comments
router.patch('/comment-post/:id', requireAuth, postController.commentPost);
router.patch("/edit-comment-post/:id", requireAuth, postController.editCommentPost);
/* router.delete("/delete-comment-post/:id", requireAuth, postController.deleteCommentPost); */

module.exports=router;

