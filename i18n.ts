import { notFound } from 'next/navigation';

const locales = ['en', 'hi', 'kn'];

export default async function getI18nConfig({ locale }: { locale?: string | undefined }) {
  const active = locale || 'en';
  if (!locales.includes(active as any)) notFound();

  return {
    messages: (await import(`./messages/${active}.json`)).default,
  };
}
