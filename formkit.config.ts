import { de } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

const config: DefaultConfigOptions = {
  locales: { de },
  locale: 'de',
  config: {
    classes: generateClasses({
      global: {
        label: 'text-sm text-gray-500 !font-normal',
        input: 'bg-neutral-100 placeholder-neutral-500 p-3 w-full rounded-lg mb-3',
        inner: 'shadow-none',
        help: 'text-sm text-gray-500 leading-none',
      },
      submit: {
        input: 'bg-primary-500 hover:bg-primary-600 text-white'
      }
    })
  }
}

export default config
