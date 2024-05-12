// src/pages/[slug].js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import styles from './page.module.css';
import Link from 'next/link';

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/posts'));
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));
  console.log("Paths:", paths);  // Log to see the generated paths
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const filePath = path.join(process.cwd(), 'src/posts', `${slug}.md`);
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontMatter,
      content,
      slug,
    },
  };
}

export default function PostPage({ frontMatter, content }) {
  return (
    <div className={styles.container}>
      <Link href="/">Back to Home
      </Link>
      <h1>{frontMatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}