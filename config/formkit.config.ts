import { de } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

const config: DefaultConfigOptions = {
  locales: { de },
  locale: 'de',
  config: {
    classes: generateClasses({
      global: { // applies to all input types
        label: 'text-gray-500 font-regular',
      },
      text: { // only applies to text input type
        input: 'bg-neutral-100 placeholder-neutral-500',
        inner: '$reset shadow-none'
      },
      textarea: {
        input: ''
      }
    })
  }
}

export default config
