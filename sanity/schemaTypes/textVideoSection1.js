export default {
    name: 'textVideoSection2',
    title: 'Video Section2',
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