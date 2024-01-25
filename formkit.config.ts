import { de } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import { createAutoAnimatePlugin } from '@formkit/addons'
import { createFloatingLabelsPlugin } from '@formkit/addons'
import '@formkit/addons/css/floatingLabels'

const faUrl = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs'
const config: DefaultConfigOptions = {
  locales: { de },
  locale: 'de',
  plugins: [
    createAutoAnimatePlugin({
      duration: 500,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
    }),
    createFloatingLabelsPlugin({
      useAsDefault: true, // defaults to false
    }),
  ],
  iconLoaderUrl: (iconName) => iconName.includes('fab') ? `${faUrl}/brands/${iconName.replace('fab-', '')}.svg` : `${faUrl}/solid/${iconName}.svg`,
  config: {
    classes: generateClasses({
      global: {
        form: '[&>.formkit-outer]:last:mb-0',
        fieldset: 'max-w-2xl border border-neutral-400 rounded-lg px-2 pb-1',
        help: 'text-xs text-neutral-500 leading-tight',
        inner: 'bg-neutral-100 formkit-disabled:bg-neutral-200 formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none [&>label:first-child>svg]:focus-within:fill-primary-500',
        input: 'appearance-none bg-transparent focus:outline-none focus:ring-0 focus:shadow-none font-medium rounded-lg autofill:shadow-autofill focus:autofill:shadow-autofill autofill:ring-1 ring-blue-200 hover:bg-neutral-50',
        label: 'text-neutral-500 font-medium text-sm leading-tight block',
        legend: 'text-neutral-500 font-medium text-sm',
        loaderIcon: 'inline-flex items-center w-4 text-neutral-600 animate-spin',
        message: 'text-red-500 mb-1 text-xs',
        messages: 'list-none p-0 mt-1 mb-0',
        outer: 'formkit-disabled:opacity-50',
        prefixIcon: 'w-10 ml-1 -mr-4 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto [&>svg]:fill-neutral-400 z-40',
        suffixIcon: 'w-10 pr-2 -ml-3 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto [&>svg]:fill-neutral-400 z-40 hover:cursor-pointer hover:[&>svg]:fill-neutral-800 ',
      },
      'family:box': {
        decorator: 'block relative h-5 w-5 mr-2 rounded-lg bg-white bg-gradient-to-b from-transparent to-neutral-200 ring-1 ring-neutral-200 peer-checked:ring-primary-500 text-transparent peer-checked:text-primary-500',
        decoratorIcon: 'flex p-[3px] w-full h-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
        help: 'mb-2 mt-1.5',
        input: 'absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none peer',
        label: '$reset text-sm text-neutral-700 mt-1 select-none',
        wrapper: 'flex items-center mb-1',
      },
      'family:button': {
        input: '$reset inline-flex items-center justify-center disabled:bg-primary-500 bg-primary-500 hover:bg-primary-600 text-white text-base font-medium py-4 px-5 rounded-lg focus-visible:outline-1 focus-visible:outline-primary-600 focus-visible:outline-offset-1 formkit-disabled:bg-neutral-400 formkit-loading:before:w-4 formkit-loading:before:h-4 formkit-loading:before:mr-2 formkit-loading:before:border formkit-loading:before:border-2 formkit-loading:before:border-r-transparent formkit-loading:before:rounded-3xl formkit-loading:before:border-white formkit-loading:before:animate-spin w-full disabled:opacity-50 h-14 leading-tight',
        wrapper: 'mb-1',
        prefixIcon: '$reset block w-3 -ml-2 mr-2 stretch shrink-0 [&>svg]:fill-white',
        suffixIcon: '$reset block w-3 ml-2 stretch shrink-0 [&>svg]:fill-white',
      },
      'family:dropdown': {
        dropdownWrapper: 'my-2 w-full drop-shadow-lg rounded-lg [&::-webkit-scrollbar]:hidden',
        emptyMessageInner: 'flex items-center justify-center text-sm p-2 text-center w-full text-neutral-500 [&>span]:mr-3 [&>span]:ml-0',
        inner: 'max-w-2xl relative flex ring-1 ring-neutral-200 focus-within:ring-primary-500 focus-within:ring-1 rounded-lg mb-1 formkit-disabled:focus-within:ring-neutral-200 formkit-disabled:focus-within:ring-1 [&>span:first-child]:focus-within:text-primary-500',
        input: 'w-full px-4 py-3',
        listbox: 'bg-white drop-shadow-lg rounded-lg overflow-hidden',
        listboxButton: 'flex w-12 self-stretch justify-center mx-auto',
        listitem: 'pl-7 relative hover:bg-neutral-300 data-[is-active="true"]:bg-neutral-300 data-[is-active="true"]:aria-selected:bg-primary-600 aria-selected:bg-primary-600 aria-selected:text-white',
        loaderIcon: 'ml-auto',
        loadMoreInner: 'flex items-center justify-center text-sm p-2 text-center w-full text-primary-500 formkit-loading:text-neutral-500 cursor-pointer [&>span]:mr-3 [&>span]:ml-0',
        option: 'p-2.5',
        optionLoading: 'text-neutral-500',
        placeholder: 'p-2.5 text-neutral-400',
        selector: 'flex w-full justify-between items-center [&u]',
        selectedIcon: 'block absolute top-1/2 left-2 w-3 -translate-y-1/2',
        selectIcon: 'flex box-content w-4 px-2 self-stretch grow-0 shrink-0',
      },
      'family:text': {
        inner: 'flex items-center max-w-2xl ring-1 ring-neutral-200 focus-within:ring-primary-500 focus-within:ring-1 [&>label:first-child]:focus-within:text-primary-500 rounded-lg mb-1',
        input: 'w-full px-4 py-3 border-none text-base text-neutral-700 placeholder-neutral-400',
      },
      'datetime-local': {
        input: 'h-14',
      },
      
      // Specific styles apply only to a given input type
      color: {
        inner: 'flex max-w-[5.5em] w-full formkit-prefix-icon:max-w-[7.5em] formkit-suffix-icon:formkit-prefix-icon:max-w-[10em]',
        input: '$reset appearance-none w-full cursor-pointer border-none rounded-lg p-0 m-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none',
        suffixIcon: 'min-w-[2.5em] pr-0 pl-0 m-auto'
      },
      file: {
        fileItem: 'flex items-center text-neutral-800 mb-1 last:mb-0',
        fileItemIcon: 'w-4 mr-2 shrink-0',
        fileList: 'shrink peer pl-4 py-3 formkit-multiple:data-[has-multiple="true"]:mb-6 min-w-0',
        fileName: 'text-ellipsis leading-tight truncate overflow-hidden translate-y-2',
        fileRemove: 'relative z-[2] ml-auto text-[0px] hover:text-red-500 pl-2 peer-data-[has-multiple=true]:text-sm peer-data-[has-multiple=true]:text-primary-500 peer-data-[has-multiple=true]:ml-3 peer-data-[has-multiple=true]:mb-2 formkit-multiple:bottom-[0.15em] formkit-multiple:pl-0 formkit-multiple:ml-0 formkit-multiple:left-[1em] formkit-multiple:formkit-prefix-icon:left-[3.75em] flex items-center [&:hover_svg]:fill-red-500',
        fileRemoveIcon: 'text-lg w-10 pr-2 -ml-3 flex self-stretch grow-0 shrink-0 [&_svg]:w-full [&_svg]:max-w-[1em] [&_svg]:max-h-[1em] [&_svg]:m-auto [&_svg]:fill-neutral-400 z-40',
        inner: 'relative max-w-2xl cursor-pointer formkit-multiple:[&>button]:absolute h-14',
        input: 'cursor-pointer text-transparent absolute top-0 right-0 left-0 bottom-0 opacity-0 z-[2]',
        noFiles: 'flex w-full items-center px-4 py-3 text-neutral-400 line-clamp-1 truncate translate-y-2',
        noFilesIcon: 'w-4 mr-2'
      },
      radio: {
        decorator: 'rounded-full',
        decoratorIcon: 'w-5 p-[5px]'
      },
      range: {
        inner: '$reset flex items-center max-w-2xl',
        input: '$reset w-full mb-1 h-2 p-0 rounded-full accent-primary-600',
        prefixIcon: '$reset w-4 mr-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
        suffixIcon: '$reset w-4 ml-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto'
      },
      select: {
        inner: 'flex relative max-w-2xl items-center rounded-lg mb-1 ring-1 ring-neutral-200 focus-within:ring-primary-500 focus-within:ring-1 [&>span:first-child]:focus-within:text-primary-500',
        input: 'w-full pl-3 pr-8 py-3 border-none text-base text-neutral-700 placeholder-neutral-400 formkit-multiple:p-0 data-[placeholder="true"]:text-neutral-400 formkit-multiple:data-[placeholder="true"]:text-inherit',
        selectIcon: 'flex p-[3px] shrink-0 w-5 mr-2 -ml-[1.5em] h-full pointer-events-none',
        option: 'formkit-multiple:p-3 formkit-multiple:text-sm text-neutral-700'
      },
      textarea: {
        inner: 'flex max-w-2xl rounded-lg mb-1 ring-1 ring-neutral-200 focus-within:ring-primary-500 [&>label:first-child]:focus-within:text-primary-500',
        input: 'block w-full h-32 px-4 py-3 border-none text-base text-neutral-700 placeholder-neutral-400 focus:shadow-outline',
      },
      
      // PRO input styles
      autocomplete: {
        closeIcon: 'block grow-0 shrink-0 w-3 mr-3.5',
        inner: '[&>div>[data-value]]:absolute [&>div>[data-value]]:mb-0',
        option: 'grow text-ellipsis',
        selection: 'static flex left-0 top-0 right-0 bottom-0 mt-0 mb-2 rounded-lg bg-neutral-100',
      },
      rating: {
        inner: 'relative flex items-center w-[8em] formkit-disabled:bg-transparent',
        itemsWrapper: 'w-full',
        onItems: 'text-yellow-400',
        onItemWrapper: '[&>*]:w-full [&>svg]:h-auto [&>svg]:max-w-none [&>svg]:max-h-none',
        offItems: 'text-neutral-500',
        offItemWrapper: '[&>*]:w-full [&>svg]:h-auto [&>svg]:max-w-none [&>svg]:max-h-none'
      },
      repeater: {
        content: 'grow p-3 flex flex-col align-center',
        controlLabel: 'absolute opacity-0 pointer-events-none',
        controls: 'flex flex-col items-center justify-center bg-neutral-100 p-3',
        downControl: 'hover:text-primary-500 disabled:hover:text-inherit disabled:opacity-25',
        fieldset: 'py-4 px-5',
        help: 'mb-2 mt-1.5',
        item: 'flex w-full mb-1 rounded-lg border border-neutral-200',
        moveDownIcon: 'block w-3 my-1',
        moveUpIcon: 'block w-3 my-1',
        removeControl: 'hover:text-primary-500 disabled:hover:text-inherit disabled:opacity-25',
        removeIcon: 'block w-5 my-1',
        upControl: 'hover:text-primary-500 disabled:hover:text-inherit disabled:opacity-25'
      },
      taglist: {
        input: 'px-1 py-1 w-[0%] grow',
        removeSelection: 'w-2.5 mx-1 self-center text-black leading-none',
        tag: 'flex items-center my-1 p-1 bg-neutral-200 text-xs rounded-full',
        tagWrapper: 'mr-1 focus:outline-none focus:text-white [&>div]:focus:bg-primary-500 [&>div>button]:focus:text-white',
        tagLabel: 'pl-2 pr-1',
        tags: 'flex items-center flex-wrap w-full py-1.5 px-2',
      },
      toggle: {
        altLabel: 'block w-full mb-1 font-bold text-sm',
        inner: '$reset inline-block mr-2',
        input: 'peer absolute opacity-0 pointer-events-none',
        innerLabel: 'text-[10px] font-bold absolute left-full top-1/2 -translate-x-full -translate-y-1/2 px-1',
        thumb: 'relative left-0 aspect-square rounded-full transition-all w-5 bg-neutral-100',
        track: 'p-0.5 min-w-[3em] relative rounded-full transition-all bg-neutral-400 peer-checked:bg-primary-500 peer-checked:[&>div:last-child]:left-full peer-checked:[&>div:last-child]:-translate-x-full peer-checked:[&>div:first-child:not(:last-child)]:left-0 peer-checked:[&>div:first-child:not(:last-child)]:translate-x-0',
        valueLabel: 'font-bold text-sm',
        wrapper: 'flex flex-wrap items-center mb-1'
      },
      checkbox: {
        wrapper: '[&>span]:mt-0 hover:cursor-pointer [&[data-checked=true]:hover>.formkit-inner>.formkit-decorator]:!bg-primary-600 [&:hover>.formkit-inner>.formkit-decorator]:!bg-neutral-50',
        inner: 'bg-transparent',
        decorator: '!rounded !bg-neutral-100 peer-checked:!bg-primary-500 from-transparent !to-transparent [&>.formkit-decorator-icon]:p-0.5 [&>.formkit-decorator-icon]:opacity-0 [&>.formkit-decorator-icon]:justify-center peer-checked:[&>.formkit-decorator-icon]:opacity-100 [&>.formkit-decorator-icon>svg]:fill-white',
      }
    })
  }
}

export default config
