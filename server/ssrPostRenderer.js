const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
const { marked } = require('marked');

// HTML wrapper
const renderHTML = (title, body, metadata = {}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${metadata.helmet?.title?.toString() || ''}
      ${metadata.helmet?.meta?.toString() || ''}
    </head>
    <body>
      <div id="root">${body}</div>
    </body>
  </html>
`;

// React Component without JSX
const PostPage = ({ post }) => {
  const htmlContent = marked(post.content || '');
  Helmet.renderStatic(); // Needed to init
  return React.createElement(
    'div',
    { style: { padding: '20px' } },
    React.createElement(Helmet, null,
      React.createElement('title', null, `${post.title} | AI Blog`),
      React.createElement('meta', { name: 'description', content: post.content.slice(0, 150) }),
      React.createElement('meta', { property: 'og:title', content: post.title }),
      React.createElement('meta', { property: 'og:description', content: post.content.slice(0, 150) })
    ),
    React.createElement('h1', null, post.title),
    React.createElement('p', null, `Author: ${post.author?.name || 'Unknown'}`),
    React.createElement('p', null, `Tags: ${post.tags?.join(', ') || 'None'}`),
    React.createElement('p', null, `Date: ${new Date(post.createdAt).toLocaleString()}`),
    React.createElement('hr'),
    React.createElement('div', {
      dangerouslySetInnerHTML: { __html: htmlContent }
    })
  );
};

const renderPostToHTML = (post) => {
  const postComponent = React.createElement(PostPage, { post });
  const body = ReactDOMServer.renderToString(postComponent);
  const helmet = Helmet.renderStatic();
  return renderHTML(post.title, body, { helmet });
};

module.exports = renderPostToHTML;
