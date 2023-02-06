import { de } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import { createAutoAnimatePlugin } from '@formkit/addons'

const config: DefaultConfigOptions = {
  locales: { de },
  locale: 'de',
  plugins: [
    createAutoAnimatePlugin({
      duration: 500,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
    })
  ],
  config: {
    classes: generateClasses({
      global: {
        label: 'text-sm text-gray-500 !font-normal',
        input: 'bg-neutral-100 placeholder-neutral-500 p-3 w-full rounded-lg text-base mb-3',
        inner: 'shadow-none',
        help: 'text-sm text-gray-500 leading-none mb-3 last:mb-0',
        message: 'text-sm text-alert-500 leading-none mb-3 last:mb-0',
      },
      submit: {
        input: '!bg-primary-500 hover:!bg-primary-600 text-white'
      },
      button: {
        input: '!bg-primary-500 hover:!bg-primary-600 disabled:!bg-neutral-300 text-white'
      }
    })
  }
}

export default config
