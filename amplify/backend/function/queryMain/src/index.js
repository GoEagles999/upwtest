const { Sequelize } = require('sequelize');
const { Blog, Comment, Post } = require('./models/');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const d = await new Promise(async (res, rej) => {
    const params = JSON.parse(event.arguments.params);
    if (params.op == 'listBlogs') {
      try {
        const d = await Blog.findAll();
        res(d);
      } catch (error) {
        console.log(error);
      }
    }
    if (params.op == 'getBlog') {
      try {
        const d = await Blog.findOne({ where: { id: params.id } });
        const p = await d.getPosts();
        res({d, p});
      } catch (error) {
        console.log(error);
      }
    }
    if (params.op == 'getComments') {
      try {
        const d = await Post.findOne({ where: { id: params.id } });
        const c = await d.getComments();
        res({d, c});
      } catch (error) {
        console.log(error);
      }
    }
  });
  return JSON.stringify(d)
};
