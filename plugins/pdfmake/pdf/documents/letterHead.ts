import { spanColumns } from '../template'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { validateSVG, measurements } from "../utils"
import type { RowClaimExtended } from '~/types'


async function letterHeadSide({ claim, i18n }: { claim: RowClaimExtended, i18n: ReturnType<typeof useI18n> }) {
  const { locale, t } = i18n
  return [
    {
      columns: [
        {
          svg: validateSVG(await (await fetch('/rights-plus-logo-full.svg')).text()),
          fit: [120, 25],
          width: 'auto'
        },
      ],
      margin: [0, 0, 0, measurements.margin_x3],
    },
    {
      stack: [
        {
          text: t('date'),
          style: 'small',
        },
        getLocalizedDate(new Date(), locale.value),
      ],
      margin: [0, 0, 0, measurements.margin_x5],
    },
    {
      stack: [
        {
          text: t('claimId'),
          style: 'small',
        },
        formatClaimId(claim.id || '-------'),
      ],
      margin: [0, 0, 0, measurements.margin_x5],
    },
    {
      stack: [
        'RightsPlus',
        'Zülpicher Platz 18',
        '50674 Köln',
      ],
      margin: [0, 0, 0, measurements.margin_x5],
    },
    {
      stack: [
        'info@rightsplus.de',
      ],
      margin: [0, 0, 0, measurements.margin_x5],
    },
  ]
}

export default async ({
  claim,
  i18n,
  content,
  info
}: {
  claim: RowClaimExtended,
  i18n: ReturnType<typeof useI18n>,
  content: (props: {
    claim: RowClaimExtended,
    i18n: ReturnType<typeof useI18n>,
  }) => any[],
  info: {
    title: string,
    author?: string,
    subtitle?: string,
    category?: string,
    subject?: string,
    keywords?: string,
  }
}) => {
  const main = [
    {
      stack: [
        {
          text: info.title,
          style: 'title',
        },
        info.subtitle ? {
          text: info.subtitle,
          style: 'subtitle',
        } : undefined,
      ].filter(e => !!e),
      margin: [0, 0, 0, measurements.margin_x2],
    },
    {
      stack: content({ claim, i18n }),
      fontSize: 10
    }
  ]


  return {
    info,
    content: [[
      {
        margin: [0, 0, 0, measurements.margin],
        columnGap: measurements.columnGap,
        columns: [
          {
            width: spanColumns(9),
            stack: main,
            fontSize: 12,
          },
          {
            width: '*',
            stack: await letterHeadSide({ claim, i18n }),
          },
        ],
      },
    ]] as TDocumentDefinitions['content'],
  } satisfies TDocumentDefinitions
}
