/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

const path = require('path');
const slugify = require('slugify');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // Tag Pages
  const tagTemplate = path.resolve('src/templates/tag.js');
  const tagsResult = await graphql(`
    {
      tagsGroup: allMdx(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  if (tagsResult.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const tags = tagsResult.data.tagsGroup.group;
  tags.forEach((tag) => {
    createPage({
      path: `/tag/${tag.fieldValue}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });

  // Notes pages
  const noteTemplate = require.resolve(`./src/templates/note.js`);

  const notesResult = await graphql(`
    {
      allMdx {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  if (notesResult.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  notesResult.data.allMdx.nodes.forEach((node) => {
    createPage({
      path: `/${node.slug}`,
      component: noteTemplate,
      context: {
        slug: node.slug,
      },
    });
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const fileNameSplit = node.fileAbsolutePath.split('/');
    const fileName = fileNameSplit[fileNameSplit.length - 1];
    const slug = slugify(fileName, {
      lower: true,
    });

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    createNodeField({
      name: 'title',
      node,
      value: node.frontmatter.title,
    });

    createNodeField({
      name: 'excerpt',
      node,
      value: node.frontmatter.excerpt,
    });

    createNodeField({
      name: 'slug',
      node,
      value: slug,
    });

    createNodeField({
      name: 'added',
      node,
      value: node.frontmatter.added || '',
    });

    createNodeField({
      name: 'updated',
      node,
      value: node.frontmatter.updated || '',
    });

    createNodeField({
      name: 'tags',
      node,
      value: node.frontmatter.tags || [],
    });
  }
};
