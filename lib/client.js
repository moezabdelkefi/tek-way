// lib/client.js
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: '96m80dn3',
  dataset: 'production',
  apiVersion: '2022-03-10',
  useCdn: true,
  token: 'sktV1MDVHVjIThP4XZZdqp6dS8nauA9o2yET2eEnJzOKO988Wfmh9qZ871Sv7JwNgupbHpMpMC8XhUNSn1UpjZNmkwQeo0xwoqfZFI4xC252gGPV2WyBXxv1XYUMdDZN9HfFsfbz3E4tQs1QVnZ7cfeXoOajcqAVlU9g3fwVXiTDv55gWnHE',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);