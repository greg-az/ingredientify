// src/pages/[slug].js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm'; // Import the plugin
import Head from 'next/head';

const YouTubeEmbed = ({ videoId }) => (
  <iframe
    width="560"
    height="315"
    src={`https://www.youtube.com/embed/${videoId}`}
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
);

const markdownToHtml = async (markdown) => {
  const result = await remark()
    .use(html)
    .use(gfm) // Use the plugin
    .process(markdown);
  return result.toString();
};

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
  const contentHtml = await markdownToHtml(content);

  return {
    props: {
      frontMatter,
      content: contentHtml,
      slug,
    },
  };
}

export default function PostPage({ frontMatter, content }) {
  const router = useRouter();

  const handlePageClick = (e) => {
    // Check if the click target has the class 'no-redirect'
    if (!e.target.closest('.no-redirect')) {
      if (frontMatter.affiliate_link) {
        window.location.href = frontMatter.affiliate_link;
      }
    }
  };

  const createMarkup = (htmlContent) => {
    // You might need a library like 'DOMPurify' for security here
    return {
      __html: htmlContent.replace(/<h1>/g, '<h1 class="h1">')
        .replace(/<h2>/g, '<h2 class="h2">')
        .replace(/<p>/g, '<p class="p">')
        .replace(/<strong>/g, '<strong class="strong">')
        .replace(/<em>/g, '<em class="em">')
        .replace(/<table>/g, '<table class="table">')
        .replace(/<th>/g, '<th class="th">')
        .replace(/<td>/g, '<td class="td">')
    };
  };

  return (
    <>
      <Head>
        <title>{frontMatter.title} - Ingredientify</title>
        <meta name="description" content={frontMatter.excerpt || 'Read more about this fascinating post.'} />
      </Head>
      <div className={styles.postContainer} onClick={handlePageClick}>
      <Link href="/" className={`${styles.backToHome} no-redirect`}>← Back to Home</Link>
        <h1 className={styles.postTitle}>{frontMatter.title}</h1>
        <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: content }} />
        {frontMatter.affiliate_link && (
          <a href={frontMatter.affiliate_link} target="_blank" className={`${styles.affiliateLink} no-redirect`}>
            Buy on Amazon
          </a>
        )}
      </div>
    </>
  );
};