export default {
  name: 'product',
  title: 'Product Section',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        hotspot: true,
      }
    },
    { 
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    { 
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    { 
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    { 
      name: 'details',
      title: 'Details',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Abstrait', value: 'abstrait' },
          { title: 'Paysage', value: 'paysage' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Minimaliste', value: 'minimaliste' },
          { title: 'Vintage', value: 'vintage' },
          { title: 'Moderne', value: 'moderne' },
          { title: 'Décoration intérieure', value: 'decoration_interieure' },
          { title: 'Bureau', value: 'bureau' },
          { title: 'Salle de jeux', value: 'salle_de_jeux' },
          { title: 'Espace commercial', value: 'espace_commercial' },
          { title: 'Cadeau', value: 'cadeau' },
          { title: 'Nature', value: 'nature' },
          { title: 'Urbain', value: 'urbain' },
          { title: 'Animaux', value: 'animaux' },
          { title: 'Personnages', value: 'personnages' },
          { title: 'Motifs géométriques', value: 'motifs_geometriques' },
          { title: 'Inspirations culturelles', value: 'inspirations_culturelles' },
        ],
      },
    },
    {
      name: 'discount',
      title: 'Discount',
      type: 'number',
      description: 'Discount percentage for the product',
      validation: Rule => Rule.min(0).max(100)
    }
  ],
};