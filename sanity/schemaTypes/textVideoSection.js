// sanity/schemaTypes/textVideoSection.js
export default {
    name: 'textVideoSection',
    title: 'Video Section',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'text',
        title: 'Text',
        type: 'text',
      },
      {
        name: 'video',
        title: 'Video',
        type: 'file',
        options: {
          accept: 'video/*'
        }
      },
      {
        name: 'product',
        title: 'Product',
        type: 'reference',
        to: [{ type: 'product' }],
      },
    ],
  };