import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import StudioLayout from '../layout';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return (
    <StudioLayout>
      <NextStudio config={config} />
    </StudioLayout>
  );
}