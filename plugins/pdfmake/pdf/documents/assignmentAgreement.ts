import { startInColumn, spanColumns, date } from '../template'
import type { Column, Content, ContentColumns, ContentStack, TDocumentDefinitions } from 'pdfmake/interfaces'
// import { measurements, getFooter, getAddress, getSvgDimensionsRatio } from '../utils'
import { markdownToPdfMake, validateSVG, type QuoteSettings } from "../utils.js"

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


export default async (i18n: ReturnType<typeof useI18n>) => {
  const { t, n, locale } = i18n


  async function letterHeadSide(settings?: QuoteSettings) {
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
          date(locale),
        ],
        margin: [0, 0, 0, measurements.margin_x5],
      },
      {
        stack: [
          {
            text: t('claimId'),
            style: 'small',
          },
          '#000000',
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

  const name = "Leon Vogler"
  const address = "Gailhöfe 6"
  const postalCode = "88699"
  const city = "Frickingen"
  const flightNumber = "LH404"
  const flightDate = "2024-10-14"
  const departure = "Lisbon"
  const arrival = "Cologne"

  async function content() {

    const leftColumn = [
      {
        text: t('assignmentAgreement'),
        style: 'title',
        margin: [0, 0, 0, measurements.margin_x2],
      },
      '\n',
      markdownToPdfMake(t('assignmentLetter.main', {
        addressBlock: ['<br />', '<br />', `**${name}**`, `**${address}**`, `**${[postalCode, city].join(" ")}**`, '<br />', '<br />'].join("\n"),
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
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: spanColumns(4.5),
                    h: 40, // Fixed height
                    r: 5, // Rounded corners
                    color: '#f8f8f8', // Light gray color
                  },
                ],
                width: spanColumns(4.5), // Ensures canvas spans full column
                height: 40, // Optional for clarity
                margin: [0, 0, 0, 5], // Margin between rectangle and text
              },
              {
                text: 'Ort, Datum',
              },
            ],
            width: '*', // Column takes 40% of the total width
          },
          // Right rectangle with "Unterschrift"
          {
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: spanColumns(4.5), // Make it dynamically fit the column width
                    h: 40, // Fixed height
                    r: 5, // Rounded corners
                    color: '#f8f8f8', // Light gray color
                  },
                  // {
                  //   type: 'line', // Draws the cross
                  //   x1: 5,
                  //   y1: 5,
                  //   x2: 35, // Dynamic based on canvas size
                  //   y2: 35,
                  //   lineWidth: 2,
                  //   color: '#000000',
                  // },
                  // {
                  //   type: 'line', // Draws the cross
                  //   x1: 35,
                  //   y1: 5,
                  //   x2: 5, // Dynamic based on canvas size
                  //   y2: 35,
                  //   lineWidth: 2,
                  //   color: '#000000',
                  // },
                ],
                width: spanColumns(4.5), // Ensures canvas spans full column
                height: 40, // Optional for clarity
                margin: [0, 0, 0, 5], // Margin between rectangle and text
              },
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
  }
}
