import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';

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
    document.title = "Ingredientify - Explore the Science Behind Everyday Ingredients";
  }, []);

  return (
    <>
      <Head>
        <title>Ingredientify - Home</title>
        <meta name="description" content="Explore detailed, scientifically-backed information about everyday ingredients on Ingredientify." />
        <meta property="og:title" content="Ingredientify - Home" />
        <meta property="og:description" content="Explore the science behind the ingredients you use every day." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/path-to-your-image.jpg" />
        <meta property="og:url" content="https://www.ingredientify.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={styles.container}>
        <header className={`${styles.header} ${styles.sticky}`}>
          <Link href="/" legacyBehavior>
            <a className={styles.logo}>Ingredientify</a>
          </Link>
          <nav className={styles.navLinks}>
            <Link href="/about" legacyBehavior><a>About</a></Link>
            <Link href="/categories" legacyBehavior><a>Categories</a></Link>
            <Link href="/contact" legacyBehavior><a>Contact</a></Link>
          </nav>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </header>
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
          <Carousel interval={3000} pause={false}>
            {posts.map(post => (
              <Carousel.Item key={post.slug}>
                <img
                  className="d-block w-100"
                  src={`thumbnails/${post.slug}.jpg`}
                  alt={post.title}
                />
                <Carousel.Caption>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
          <div>© 2024 Ingredientify. All rights reserved.</div>
          <div className={styles.socialMedia}>
            Follow us on <a href="#">Facebook</a>, <a href="#">Twitter</a>, and <a href="#">Instagram</a>
          </div>
        </footer>
      </div>
    </>
  );
}
