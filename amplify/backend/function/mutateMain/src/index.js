const { Sequelize } = require('sequelize');
const { Blog, Comment, Post } = require('./models/');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const d = await new Promise(async (res, rej) => {
    const params = JSON.parse(event.arguments.params);
    if (params.op == 'createBlog') {
      try {
        const d = await Blog.create({ name: params.name });
        res(d);
      } catch (error) {
        console.log(error);
      }
    }
    if (params.op == 'createPost') {
      try {
        const d = await Post.create({
          title: params.title,
          BlogId: params.blogId,
        });
        res(d);
      } catch (error) {
        console.log(error);
      }
    }
    if (params.op == 'createComment') {
      try {
        const d = await Comment.create({
          PostId: params.postId,
          content: params.content,
        });
        res(d);
      } catch (error) {
        console.log(error);
      }
    }
    if (params.op == 'deleteBlog') {
      try {
        const d = await Blog.findOne({
          where: {
            id: params.id,
          },
        });
        d.destroy();
        res(d);
      } catch (error) {
        console.log(error);
      }
    }
    if (params.op == 'updateBlog') {
      try {
        const d = await Blog.update(
          {
            name: params.name,
          },
          {
            where: {
              id: params.id,
            },
          }
        );
        d.destroy();
        res(d);
      } catch (error) {
        console.log(error);
      }
    }
  });
  return JSON.stringify(d);
};
