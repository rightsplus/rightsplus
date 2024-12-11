import { startInColumn, spanColumns } from '../template'
import type { CanvasRect, Column, Content, ContentCanvas, ContentColumns, ContentStack, ContentText, TDocumentDefinitions } from 'pdfmake/interfaces'
// import { measurements, getFooter, getAddress, getSvgDimensionsRatio } from '../utils'
import { markdownToPdfMake, validateSVG, type QuoteSettings } from "../utils.js"
import type { ClaimsForm, RowClaimExtended } from '~/types'

const measurements = {
  "mm": 2.835,
  "margin": 56.70,
  "margin_x2": 35.04,
  "margin_x3": 21.66,
  "margin_x4": 13.39,
  "margin_x5": 8.27,
  "margin_x6": 5.11,
  "columnWidth": 29.16,
  "columnGap": 12,
  "firstColumn": 357.96,
  "secondColumn": 111.49
}

const getField = ({ w, h, canvasOptions, fieldOptions, content, }: { w: number, h: number, canvasOptions?: CanvasRect, fieldOptions?: Content, content?: Content[] }) => {
  const canvas: CanvasRect = {
    type: 'rect',
    x: 0,
    y: 0,
    w,
    h,
    r: 5,
    color: '#f8f8f8'
  };
  if (canvasOptions) {
    Object.assign(canvas, canvasOptions)
  }
  const field: Content = {
    canvas: [{ ...canvas }],
  }
  if (fieldOptions) {
    Object.assign(field, fieldOptions)
  }
  const stack: Content[] = [field]
  if (content?.length) {
    for (const block of content) {
      const isContent = typeof block !== 'string' && typeof block !== 'number' && !Array.isArray(block)
      const relativeBlock = Object.assign(block, {
        relativePosition: {
          x: canvas.x + 10 + (isContent ? block.relativePosition?.x || 0 : 0),
          y: -canvas.h + (isContent ? block.relativePosition?.y || 0 : 0),
        }
      })
      stack.push(relativeBlock)
    }
  }
  return stack
}


export default async (passenger: ClaimsForm['client']['passengers'][number], claim: Pick<ClaimsForm, 'id' | 'flight'>, i18n: ReturnType<typeof useI18n>) => {
  const { t, locale } = i18n

  async function letterHeadSide() {
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
          'RightsPlus GbR',
          'Sandeldamm 24a',
          '63450 Hanau',
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

  const rect = {
    w: spanColumns(4.5),
    h: 40
  }

  const { firstName, lastName, address } = passenger
  const name = [firstName, lastName].join(" ")
  const { street, postalCode, city } = address

  const dateOfSignature = passenger.signature?.svg ? {
    content: [{
      text: getLocalizedDate(new Date(), locale.value),
      relativePosition: {
        y: 8
      }
    }]
  } : {}
  const signature = passenger.signature?.svg ? {
    svg: validateSVG(passenger.signature?.svg),
    fit: [rect.w, rect.h],
    width: 'auto',
    relativePosition: {
      x: -10,
      y: -5
    }
  } : {
    text: '×',
    fontSize: 20,
    relativePosition: {
      y: 2
    }
  }

  const flightNumber = claim.flight?.flight.iata
  const flightDate = claim.flight?.departure.scheduledTime
  const departure = claim.flight?.departure.iata
  const arrival = claim.flight?.arrival.iata

  async function content() {
    const leftColumn = [
      {
        text: t('assignmentAgreement'),
        style: 'title',
        margin: [0, 0, 0, measurements.margin_x2],
      },
      '\n',
      markdownToPdfMake(t('assignmentLetter.main', {
        addressBlock: ['<br />', '<br />', `**${name}**`, `**${street}**`, `**${[postalCode, city].join(" ")}**`, '<br />', '<br />'].join("\n"),
        flight: ['<br />', [`**${flightNumber}**`, t("on"), `**${new Date(flightDate as string).toLocaleDateString()}**`].join(' ')].join('\n'),
        airports: ['<br />', [t("from"), `**${departure}**`, t("to"), `**${arrival}**`].join(' '), '<br />', '<br />'].join('\n'),
        rightsPlus: `**RightsPlus GbR**`
      })),
      '\n',
      t('assignmentLetter.compensation'),
      '\n',
      t('assignmentLetter.claimant'),
      '\n',
      t("assignmentLetter.declaration", {
        rightsPlus: "RightsPlus GbR",
        partner: "Joachim Bawa",
      }),
      {
        columns: [
          // Left rectangle with "Ort, Datum"
          {
            stack: [
              getField({
                ...rect, ...dateOfSignature,
                fieldOptions: {
                  margin: [0, 0, 0, 5],
                },
              }),
              {
                text: 'Ort, Datum',
              },
            ],
            width: '*', // Column takes 40% of the total width
          },
          // Right rectangle with "Unterschrift"
          {
            stack: [

              getField({
                ...rect,
                fieldOptions: {
                  margin: [0, 0, 0, 5],
                },
                content: [signature]
              }),
              {
                text: 'Unterschrift',
              },
            ],
            width: '*', // Column takes 50% of the total width
          },
        ],
        columnGap: 10, // Gap between the two rectangles
        margin: [0, 20], // Margin from the top
      },
    ]
    return [
      {
        margin: [0, 0, 0, measurements.margin],
        columnGap: measurements.columnGap,
        columns: [
          {
            width: spanColumns(9),
            stack: leftColumn,
            fontSize: 12,
          },
          {
            width: '*',
            stack: await letterHeadSide(),
          },
        ],
      },
    ]
  }


  const info = {
    title: t('yourConfiguration'),
    author: 'Raumvonwert',
    subject: 'summary',
    keywords: '',
  }
  // const footerHeight = store.model !== 'comfort' ? measurements.margin * 2 : 95
  return {
    content: [
      await content()
    ] as TDocumentDefinitions['content'],
    // footer: getFooter({ blocks: await summaryFooterBlocks(), i18n }),
    info
  } satisfies TDocumentDefinitions
}
