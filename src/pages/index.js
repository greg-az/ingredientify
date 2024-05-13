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
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>Ingredient Science Blog</Link>
        <div className={styles.navLinks}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Explore the Science Behind Everyday Ingredients</h1>
        <p className={styles.heroTagline}>Dive deep into the benefits and science of natural products.</p>
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </header>
      <main className={styles.mainContent}>
        <ul className={styles.postList}>
          {filteredPosts.map(({ slug, title }) => (
            <li key={slug}>
              <Link href={`/${slug}`} className={styles.postLink}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <footer className={styles.footer}>
        <div>© 2024 Ingredient Science Blog. All rights reserved.</div>
        <div>Follow us on [Social Media Links]</div>
      </footer>
    </div>
  );
}
