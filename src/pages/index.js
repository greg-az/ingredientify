import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import styles from './page.module.css';
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
      thumbnail: data.thumbnail || '/default-thumbnail.jpg', // Ensure you have a default image
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Ingredientify - Home</title>
        <meta name="description" content="Explore detailed, scientifically-backed information about everyday ingredients on Ingredientify." />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" passHref><div className={styles.logo}>Ingredientify</div></Link>
          <nav className={styles.navLinks}>
            <Link href="/about" passHref><div>About</div></Link>
            <Link href="/categories" passHref><div>Categories</div></Link>
            <Link href="/contact" passHref><div>Contact</div></Link>
          </nav>
        </header>
        <main className={styles.grid}>
          {posts.map(({ slug, title, excerpt, thumbnail }) => (
            <Link href={`/${slug}`} passHref>
              <div className={styles.postPreview}>
                <img src={thumbnail} alt={title} className={styles.postImage} />
                <div className={styles.postContent}>
                  <h2 className={styles.postTitle}>{title}</h2>
                  <p className={styles.postExcerpt}>{excerpt}</p>
                  <span className={styles.readMore}>Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </main>
        <footer className={styles.footer}>
          <p>© 2024 Ingredientify. All rights reserved.</p>
          <div className={styles.socialMedia}>
            Follow us on Facebook, Twitter, and Instagram
          </div>
        </footer>
      </div>
    </>
  );
}