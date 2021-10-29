/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

const path = require('path');

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
      path: `/${node.frontmatter.slug}`,
      component: noteTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });
};
