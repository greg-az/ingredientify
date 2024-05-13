import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

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
      date: data.date,
      excerpt: data.excerpt || '',
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

  useEffect(() => {
    document.title = "Ingredient Science Blog - Explore the Science Behind Everyday Ingredients";
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>Ingredient Science Blog</a>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/about" legacyBehavior><a>About</a></Link>
          <Link href="/contact" legacyBehavior><a>Contact</a></Link>
        </nav>
      </header>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <main className={styles.mainContent}>
        {filteredPosts.map(({ slug, title, excerpt }) => (
          <article key={slug} className={styles.postPreview}>
            <Link href={`/${slug}`} legacyBehavior>
              <a className={styles.postLink}>
                <h2>{title}</h2>
                <p>{excerpt}</p>
                <span className={styles.readMore}>Read More →</span>
              </a>
            </Link>
          </article>
        ))}
      </main>
      <footer className={styles.footer}>
        <div>© 2024 Ingredient Science Blog. All rights reserved.</div>
        <div className={styles.socialMedia}>
          Follow us on <a href="#">Facebook</a>, <a href="#">Twitter</a>, and <a href="#">Instagram</a>
        </div>
      </footer>
    </div>
  );
}
