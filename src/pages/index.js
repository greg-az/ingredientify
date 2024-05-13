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
      <header className={styles.header}>
        <div className={styles.logo}>Ingredient Science Blog</div>
        <p className={styles.tagline}>Explore the science behind everyday ingredients.</p>
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </header>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
      <main className={styles.mainContent}>
        <ul className={styles.postList}>
          {filteredPosts.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/${slug}`} className={styles.link}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <footer className={styles.footer}>
        © 2024 Ingredient Science Blog. All rights reserved.
        <div>Follow us on [Social Media Links]</div>
      </footer>
    </div>
  );
}
