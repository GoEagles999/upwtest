import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import {
  getBlog,
  getComment,
  listBlogs,
  getPost,
} from '../src/graphql/queries';
import {
  createBlog,
  createPost,
  deleteBlog,
  createComment,
  updateBlog,
  updateComment,
} from '../src/graphql/mutations';
import awsconfig from '../src/aws-exports';
Amplify.configure({
  ...awsconfig,
});
import * as subscriptions from '../src/graphql/subscriptions';
import { useEffect, useState } from 'react';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [postName, setPostName] = useState('');
  useEffect(() => {
    const getData = async (_) => {
      const d = await API.graphql(graphqlOperation(listBlogs));
      setBlogs(d.data.listBlogs.items);
    };
    getData();
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateBlog)
    ).subscribe({
      next: ({ provider, value }) => {
        setName('');
        setNewBlog(value.data.onCreateBlog);
      },
      error: (error) => console.warn(JSON.stringify(error)),
    });
  }, []);
  useEffect(() => {
    console.log(newBlog);
    setBlogs([...blogs, newBlog]);
  }, [newBlog]);
  // Subscribe to creation of Todo
  const view = async (blogid) => {
    const d = await API.graphql(
      graphqlOperation(getPost, { input: { id: blogid } })
    );
    console.log(d);
  };
  const update = async (blogid) => {
    const d = await API.graphql(graphqlOperation(listBlogs));
    setBlogs(d.data.listBlogs.items);
  };
  const del = async (blogid) => {
    const d = await API.graphql(graphqlOperation(deleteBlog, {input:{id:blogid}}));
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div style={{}}>Blogs:</div>
        {blogs.length > 0 &&
          blogs.map((blog, i) => (
            <div key={i} style={{ display: 'flex' }}>
              <div style={{ marginBottom: '10px' }} key={i}>
                {blog.name}
              </div>
              <div
                style={{ marginLeft: '10px' }}
                onClick={(e) => update(blog.id)}
              >
                Update
              </div>
              <div
                style={{ marginLeft: '10px' }}
                onClick={(e) => view(blog.id)}
              >
                View posts
              </div>
              <div style={{ marginLeft: '10px' }} onClick={(e) => del(blog.id)}>
                Delete blog
              </div>
            </div>
          ))}
        <input
          value={name}
          placeholder='blog name'
          onChange={(e) => setName(e.target.value)}
        />
        <button
          style={{ padding: '30px' }}
          onClick={async (e) =>
            await API.graphql(
              graphqlOperation(createBlog, { input: { name: name } })
            )
          }
        >
          Create blog
        </button>
        <div>
          <select>
            {blogs.map(blog => (
              <option key={blog.id} value={blog.id}>{blog.name}</option>
            ))}
            </select>
          <input
            value={postName}
            placeholder='post name'
            onChange={(e) => setPostName(e.target.value)}
          />
          <button
            style={{ padding: '30px' }}
            onClick={async (e) =>
              await API.graphql(
                graphqlOperation(createPost, { input: { title: postName } })
              )
            }
          >
            Create post
          </button>
        </div>
      </main>
    </div>
  );
}
