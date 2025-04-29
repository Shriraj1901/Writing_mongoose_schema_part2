const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const BlogPost = require('./schema');

const app = express();
const port = 3010;

app.use(express.json())
app.use(express.static('static'));

mongoose.connect('mongodb+srv://nitinlegit34:nitin123@cluster0.mlxg5ua.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));



app.post('/blog', async (req, res) => {
  try {
      const newPost = new BlogPost(req.body);
      await newPost.save();
      res.status(201).send(newPost);
  } catch (error) {
      res.status(400).send(error);
  }
});

app.get('/blogs', async (req, res) => {
  try {
      const blogs = await BlogPost.find();
      res.status(200).send(blogs);
  } catch (error) {
      res.status(500).send(error);
  }
});

app.post('/blog/:id/comment', async (req, res) => {
  try {
      const blog = await BlogPost.findById(req.params.id);
      if (!blog) return res.status(404).send({ error: 'Blog not found' });

      blog.comments.push(req.body);
      await blog.save();
      res.status(200).send(blog);
  } catch (error) {
      res.status(400).send(error);
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
