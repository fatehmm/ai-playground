import { ImageResponse } from 'next/og';

import { OG_IMAGE_SIZE, renderOgImage } from './_lib/og-image-shared';

export const runtime = 'edge';

export const alt = 'AI Playground Studio preview';
export const size = OG_IMAGE_SIZE;

export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(renderOgImage(), OG_IMAGE_SIZE);
}
