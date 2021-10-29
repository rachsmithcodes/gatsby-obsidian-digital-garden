import React from 'react';
import { graphql, Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/Layout';

export default function note({ data }) {
  const { mdx } = data;
  console.log(mdx.body);
  return (
    <Layout>
      <article>
        <h1 className="text-5xl">{mdx.frontmatter.title}</h1>
        <MDXRenderer>{mdx.body}</MDXRenderer>
        <Link to="/">Back Home</Link>
      </article>
    </Layout>
  );
}

export const query = graphql`
  query ($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      body
    }
  }
`;
