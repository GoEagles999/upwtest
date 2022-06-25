import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { queryMain } from '../src/graphql/queries';
import { mutateMain } from '../src/graphql/mutations';
import awsconfig from '../src/aws-exports';
Amplify.configure({
  ...awsconfig,
});
import * as subscriptions from '../src/graphql/subscriptions';
import { useEffect, useState } from 'react';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [name, setName] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [selected, setSelected] = useState(1);
  const [posts, setPosts] = useState([]);
  const [currBlog, setCurrBlog] = useState([]);
  const [postName, setPostName] = useState('');
  useEffect(() => {
    const getData = async (_) => {
      const d = await API.graphql(
        graphqlOperation(queryMain, {
          params: JSON.stringify({ op: 'listBlogs' }),
        })
      );
      setBlogs(JSON.parse(d.data.queryMain));
    };
    getData();
  }, []);
  const view = async (blogid) => {
    setComments([]);
    setSelectedPostId('');
    let d = await API.graphql(
      graphqlOperation(queryMain, {
        params: JSON.stringify({ id: blogid, op: 'getBlog' }),
      })
    );
    d = JSON.parse(d.data.queryMain);
    console.log(d);
    setPosts(d.p);
    setCurrBlog(d.d.name);
  };
  const update = async (blogid) => {
    const newName = prompt('Enter new name');
    const d = await API.graphql(
      graphqlOperation(mutateMain, {
        params: JSON.stringify({ name: newName, id: blogid, op: 'updateBlog' }),
      })
    );
  };
  const del = async (blogid) => {
    const d = await API.graphql(
      graphqlOperation(mutateMain, {
        params: JSON.stringify({ id: blogid, op: 'deleteBlog' }),
      })
    );
  };
  const getComments = async (postid) => {
    setSelectedPostId(postid);
    const d = await API.graphql(
      graphqlOperation(queryMain, {
        params: JSON.stringify({ id: postid, op: 'getComments' }),
      })
    );
    d = JSON.parse(d.data.queryMain);
    setComments(d.c);
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
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={(e) => update(blog.id)}
              >
                Update
              </div>
              <div
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={(e) => view(blog.id)}
              >
                View posts
              </div>
              <div
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={(e) => del(blog.id)}
              >
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
              graphqlOperation(mutateMain, {
                params: JSON.stringify({ name, op: 'createBlog' }),
              })
            )
          }
        >
          Create blog
        </button>
        <div>
          <select onChange={(e) => setSelected(e.target.value)}>
            {blogs.length > 0 &&
              blogs.map((blog) => (
                <option key={blog.id} value={blog.id}>
                  {blog.name}
                </option>
              ))}
          </select>
          <input
            value={postName}
            placeholder='post name'
            onChange={(e) => setPostName(e.target.value)}
          />
          <button
            style={{ padding: '30px' }}
            onClick={async (e) => {
              console.log(selected);
              const d = await API.graphql(
                graphqlOperation(mutateMain, {
                  params: JSON.stringify({
                    title: postName,
                    blogId: new Number(selected),
                    op: 'createPost',
                  }),
                })
              );
              console.log(d);
            }}
          >
            Create post
          </button>
          <div>
            <div>Viewing posts for {currBlog}</div>
            {posts.length > 0 &&
              posts.map((p, i) => (
                <div
                  onClick={(e) => getComments(p.id)}
                  key={i}
                  style={{ background: 'lightgrey', marginBottom: '10px' }}
                >
                  <div>Click here to view comments</div>
                  <div>
                    Post title:{' '}
                    <span style={{ fontWeight: 'bold' }}>{p.title}</span> at{' '}
                    {p.createdAt}
                  </div>
                </div>
              ))}
            <div>
              {comments.length > 0 &&
                comments.map((c, i) => (
                  <div
                    key={i}
                    style={{ background: 'lightblue', marginBottom: '10px' }}
                  >
                    {c.content}
                  </div>
                ))}
            </div>
            {selectedPostId && (
              <div>
                Add comment:
                <input
                  value={commentContent}
                  placeholder='comment content'
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <button
                  style={{ padding: '30px' }}
                  onClick={async (e) =>
                    await API.graphql(
                      graphqlOperation(mutateMain, {
                        params: JSON.stringify({
                          content: commentContent,
                          postId: selectedPostId,
                          op: 'createComment',
                        }),
                      })
                    )
                  }
                >
                  Create comment
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
