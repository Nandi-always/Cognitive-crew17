import { notFound } from 'next/navigation';

const locales = ['en', 'hi', 'kn'];

export default async function getI18nConfig({ locale }) {
  const active = locale || 'en';
  if (!locales.includes(active)) notFound();

  return {
    messages: (await import(`./messages/${active}.json`)).default,
  };
}
