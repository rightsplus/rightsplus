<template>
  <ETailwind>
    <EHtml>
      <EHead>
        <EFont
          font-family="Inter"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTcviYwYZ8UA3.woff2',
            format: 'woff2',
          }"
          font-weight="normal"
          font-style="normal"
        />
        <EFont
          font-family="Inter"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
            format: 'woff2',
          }"
          font-weight="bold"
          font-style="normal"
        />
      </EHead>
      <EBody
        class="text-sm sm:text-base text-gray-500 bg-neutral-200 flex flex-col gap-5 p-3 sm:p-5"
      >
        <slot />
      </EBody>
    </EHtml>
  </ETailwind>
</template>
