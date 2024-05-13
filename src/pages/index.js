// src/pages/index.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';

export async function getStaticProps() {
  const directory = path.join(process.cwd(), 'src/posts');
  const filenames = fs.readdirSync(directory);
  const posts = filenames.map(filename => {
    const filePath = path.join(directory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContents);
    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      date: data.date
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
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>Ingredient Science Blog</div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <ul className={styles.postList}>
        {filteredPosts.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/${slug}`} className={styles.link}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        © 2024 Ingredient Science Blog. All rights reserved.
      </div>
    </div>
  );
}
