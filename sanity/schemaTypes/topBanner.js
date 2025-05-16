export default {
    name: 'topBanner',
    title: 'Top Banner discount section',
    type: 'document',
    fields: [
      {
        name: 'text',
        title: 'Banner Text',
        type: 'string',
      },
      {
        name: 'discount',
        title: 'Discount',
        type: 'string',
      },
      {
        name: 'isVisible',
        title: 'Is Visible',
        type: 'boolean',
        initialValue: true,
      },
    ],
  };