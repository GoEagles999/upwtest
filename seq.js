const { Sequelize } = require('sequelize');
const { Blog, Comment, Post } = require('./models');
async function asd() {
  try {
    const k = await Post.create({
      title: 'params.title',
      blogId: 1,
    });
    const d = await Blog.findAll();
    const a = await d[0].getPosts();
    console.log(a);
  } catch (error) {
    console.log(error);
  }
}
asd();
