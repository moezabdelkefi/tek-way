import { Layout } from '../components';
import '../styles/globals.css';
import { StateContext } from '../context/StateContext';
import { Urbanist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { client } from '@/sanity/lib/client';

const font = Urbanist({ subsets: ['latin'] });

function MyApp({ Component, pageProps, topBannerData }) {
  return (
    <div className={font.className}>

      <StateContext>
        <Layout topBannerData={topBannerData}>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </div>
  );
}

MyApp.getInitialProps = async () => {
  const topBannerQuery = '*[_type == "topBanner"][0]';
  const topBannerData = await client.fetch(topBannerQuery);
  return {
    topBannerData,
  };
};

export default MyApp;