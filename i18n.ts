import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'fr', 'xx']; // TODO in production remove xx 

// export default getRequestConfig(async ({locale}) => {
//   // Debug: log what locale we're receiving
//   console.log('i18n.ts - Received locale:', locale);
  
//   // Validate that the incoming `locale` parameter is valid
//   if (!locales.includes(locale as any)) {
//     console.log('i18n.ts - Invalid locale, calling notFound()');
//     notFound();
//   }

//   try {
//     const messages = (await import(`./messages/${locale}.json`)).default;
//     console.log('i18n.ts - Successfully loaded messages for:', locale);
//     return {
//       messages
//     };
//   } catch (error) {
//     console.error('i18n.ts - Error loading messages for locale:', locale, error);
//     notFound();
//   }
// });


// export default getRequestConfig(async ({ locale }) => {
//   const requestLocale = locale || locales[0];
//   const messages = (await import(`./messages/${requestLocale}.json`)).default;
//   console.debug('i18n.ts - Successfully loaded messages for:', requestLocale);
//   console.debug('i18n.ts - messages:', messages);
//   console.debug('i18n.ts - Received locale:', locale);
// //   return { messages };
// //   return { locale:requestLocale, messages };
//   return { locale:requestLocale , messages };


// });

export default getRequestConfig(async ({ requestLocale }) => {
    console.debug('i18n.ts - requestLocale:', requestLocale);
    const locale = await requestLocale || locales[0] //|| 'fr';
    const messages = (await import(`./messages/${locale}.json`)).default;
    console.debug('i18n.ts - messages:', messages);
    console.debug('i18n.ts - defined locale:', locale);
    return { locale, messages };
});