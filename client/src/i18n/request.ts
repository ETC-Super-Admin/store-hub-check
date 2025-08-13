// request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;

    // Ensure that a valid locale is used
    const validLocale = locale && routing.locales.includes(locale as 'en' | 'th' | 'cn')
      ? locale
      : routing.defaultLocale;
  

    return {
        locale: validLocale,
        messages: (await import(`../../messages/${validLocale}.json`)).default
    };
});