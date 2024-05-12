// src/pages/index.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/posts'));
  const posts = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'src/posts', filename),
      'utf-8'
    );
    const { data: frontMatter, content } = matter(markdownWithMeta);

    return {
      slug: filename.replace('.md', ''),
      frontMatter,
      content,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Home({ posts }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post =>
    post.frontMatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Blog</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <ul>
        {filteredPosts.map(({ slug, frontMatter }) => (
          <li key={slug}>
            <Link href={`/${slug}`} className={styles.link}>
              {frontMatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
