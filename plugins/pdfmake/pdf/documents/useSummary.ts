import { startInColumn, spanColumns, date } from '../template'
import type { Column, Content, ContentColumns, ContentStack, TDocumentDefinitions } from 'pdfmake/interfaces'
import { measurements, getFooter, getAddress, getSvgDimensionsRatio } from '../utils'

const canvasWidth = 600
export default () => {
  const i18n = useI18n()
  const { t, n, locale } = i18n

  function headerHeight() {
    return 300
    // return state.partner.images.logo && state.partner.images.klapster
    //   ? 345
    //   : state.partner.images.klapster
    //     ? 315
    //     : 275
  }
  function annotation(letter?: string, size?: string, marginTop?: number) {
    if (store.model === 'comfort' || !letter) return {}
    const d = size === 'small' ? 12 : 14
    return {
      margin: [0, marginTop ?? (size === 'valueBig' ? 10 : size === 'valueSmall' ? 2 : 1), 0, 0],
      columnGap: 0,
      columns: [
        {
          width: d,
          svg: `<svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="lightgray" /></svg>`,
          fit: [d, d],
        },
        {
          width: d,
          text: letter,
          fontSize: size === 'small' ? 8 : 10,
          bold: true,
          margin: [d * -2, size === 'small' ? 1 : 0.5, 0, 0],
          alignment: 'center',
        },
      ],
    }
  }
  function keyValue(key: string, value?: string, size = 'valueRegular', active = true, letter?: string) {
    if (!active) return []
    return [
      {
        columns: [
          {
            width: 'auto',
            text: value,
            style: size,
          },
          annotation(letter, size),
        ]
      },
      {
        text: key,
        margin: [0, measurements.margin_x6, 0, measurements.margin_x4],
      },
    ]
  }

  function checkbox(text: string): ContentColumns {
    return {
      margin: [0, 0, 0, measurements.margin_x3],
      columnGap: 10,
      columns: [
        {
          width: 14,
          margin: [0, 1, 0, 0],
          stack: [
            {
              svg: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="7" fill="#ffff00"/><path d="M3 7L6 10L11 5" stroke="white" stroke-width="2"/></svg>`,
              fit: [14, 14],
            },
          ],
        },
        {
          width: '*',
          text,
          fontSize: 12,
        },
      ],
    }
  }
  function checkboxArray() {
    const array: Content[] = [
      {
        text: t('accessories'),
        style: 'smallHeader',
      },
    ]
    if (store.accessories.handrail) {
      array.push({
        stack: [
          checkbox(t('handrailModule', store.handrailModule)),
        ],
      })
    }
    if (store.accessories.ceilingAngle) {
      array.push({
        stack: [checkbox(t('accessory.ceilingAngle'))],
      })
    }
    if (store.accessories.spacer) {
      array.push({
        stack: [
          checkbox(
            t('accessory.spacer', {
              model: n(
                (getSpacerModel(store.distanceToWall) || 0) / 10, 'cm'
              ),
            })
          ),
          {
            text: t('dimensions.distanceToWall') + ': ' + n(store.distanceToWall / 10, 'cm'),
            margin: [0, measurements.margin_x4 * -1, 0, measurements.margin_x3],
          }
        ],
      })
    }
    if (store.accessories.antiSlip) {
      array.push({
        stack: [checkbox(t('antiSlip'))],
      })
    }
    if (store.accessories.childSafetyLock) {
      array.push({
        stack: [checkbox(t('accessory.childSafetyLock', {
          spacer: store.distanceToWall ? n(
            (getSpacerModel(store.distanceToWall) || 0) / 10,
            'cm'
          ) : undefined
        }))],
      })
    }
    if (array.length === 1) return [] // only header
    return array
  }
  function manufacturerInfo() {
    if (store.model !== 'comfort') return []
    return [
      {
        text: `${t('manufacturingInformation')}: `,
        bold: true,
        margin: [0, 0, 0, measurements.margin_x6],
      },
      formatManufacturingInformation(store.manufacturingInformation).join(' · '),
    ]
  }
  function packaging() {
    return []
    return t('weightNotice', {
      // number: state.shipping.items,
      type: t(
        state.shipping.type,
        n(state.shipping.items)
      ),
      totalWeight: n(state.shipping.totalWeight, 'kg'),
    }, state.shipping.items)
      .split('<br>')
  }
  function technicalDrawingNotice() {
    return t('summary.techincalDrawing.notice')
  }
  function ma(text: string, letter: string) {
    return {
      columnGap: 5,
      columns: [
        { text, width: 'auto' },
        annotation(letter, 'small', -2),
      ],
      margin: [0, 0, 0, -1],
    }
  }
  function additionalMeasurements() {
    return [
      ma(`${t('dimensions.totalHeightClosed')}: ${n(round(store.totalHeight.closed / 10), 'cm')}`, 'D'),
      ma(`${t('dimensions.overhang')}: ${n(round(store.overhang || 0 / 10), 'cm')}`, 'E'),
      ma(`${t('dimensions.outerStringerLength')}: ${n(round(store.outerStringerLength || 0 / 10), 'cm')}`, 'F')
    ]
  }
  async function header() {
    const images = {
      logo: false,
      klapster: validateSVG(await (await fetch('/img/logos/klapster.svg')).text())
    }
    const logos = []
    const klapster = images.klapster
      ? {
        svg: images.klapster,
        fit: [160, 40],
        margin: [
          0,
          images.logo ? measurements.margin_x3 : 0,
          0,
          measurements.margin_x5,
        ],
      }
      : ''

    if (images.logo && images.klapster) {
      logos.push(
        {
          svg: images.logo,
          fit: [80, 20],
          margin: [0, 0, 0, measurements.margin_x5],
          absolutePosition: { x: measurements.margin, y: measurements.margin },
        },
        klapster
      )
    } else if (images.logo) {
      logos.push(
        {
          svg: images.logo,
          fit: [160, 30],
          margin: [0, 0, 0, measurements.margin_x4],
          absolutePosition: { x: measurements.margin, y: measurements.margin },
        },
        { text: '', fit: [0, 0], margin: [0, 0, 0, measurements.margin_x3] }
      )
    } else if (images.klapster) {
      logos.push(klapster)
    }

    const leftColumn = [
      [...logos],
      {
        text: t(`models.${store.model}.label`),
        style: 'model',
        margin: [0, 0, 0, measurements.margin_x2],
      },
      [
        ...keyValue(
          t('step', { n: '', count: store.steps }),
          n(store.steps),
          'valueBig'
        ),
      ],
      [
        ...keyValue(
          t('rise'),
          n(round(store.rise / 10), 'cm'),
          'valueBig',
          true, // !store.customization,
          'A'
        ),
      ],
      [
        ...keyValue(
          t('rise'),
          t('customization'),
          'valueBig',
          false, // store.customization,
        ),
      ],
    ]
    const rightColumn = [
      { text: date(locale.value), alignment: 'right' },
      // store.model === 'comfort' && state.partner.b2b && !state.partner.quote
      //   ? {
      //     width: 200,
      //     text: t('sendDocument'),
      //     lineHeight: 1,
      //     absolutePosition: {
      //       x: startInColumn(9),
      //       y: headerHeight() - 4 * 15 - measurements.margin_x2,
      //     },
      //   }
      //   : {},
    ]
    return [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: canvasWidth,
            h: headerHeight(),
            lineWidth: 0,
            color: 'black',
            fillOpacity: 0.04,
          },
        ],
        absolutePosition: { x: 0, y: 0 },
      },
      {
        margin: [0, 0, 0, measurements.margin],
        columnGap: measurements.columnGap,
        columns: [
          {
            width: spanColumns(8),
            stack: leftColumn,
          },
          {
            width: '*',
            stack: rightColumn,
          },
        ],
      },
    ]
  }
  async function mainMajor() {
    const leftColumn = [
      store.model === 'comfort' && [
        ...keyValue(
          t('mountingSide'),
          t(`hinged.${store.mountingSide}`),
          'valueRegular',
          store.model === 'comfort'
        ),
      ],
      [mainMinor()],
    ].filter(Boolean)

    const rightColumn = [await getSurfaceMaterials(store, i18n, true), [...getAccessories(store, i18n, true)]]
    return {
      margin: [0, 0, 0, measurements.margin_x2],
      columnGap: measurements.columnGap,
      columns: [
        {
          width: spanColumns(8),
          stack: leftColumn.filter((e) => e && e.length > 0),
        },
        {
          width: '*',
          stack: rightColumn,
        },
      ],
    }
  }
  function mainMinor() {
    const leftColumn = [
      {
        columns: [
          {
            width: spanColumns(4),
            stack: [
              ...keyValue(
                t('dimensions.floorHeight'),
                n(round(store.floorHeight / 10), 'cm'),
                undefined,
                undefined,
                'C'
              ),
            ],
          },
          {
            width: spanColumns(4),
            stack: [
              ...keyValue(
                t('dimensions.ceilingThickness'),
                n(round(store.ceilingThickness / 10), 'cm')
              ),
            ],
          },
        ],
      },
      {
        text: t('headroomNotice', {
          value: n(round(store.headroom / 10), 'cm'),
        }),
        margin: [0, 0, 0, measurements.margin_x3],
      },
      {
        margin: [0, 0, 0, measurements.margin_x4],
        columns: [
          {
            width: spanColumns(4),
            stack: [
              ...keyValue(
                t('dimensions.mountingSpace'),
                n(round(store.mountingSpace / 10), 'cm')
              ),
            ],
          },
          {
            width: spanColumns(4),
            stack: [
              ...keyValue(
                t('dimensions.slopeAngle'),
                n(round(store.stairAngle), 'deg'),
                undefined,
                undefined,
                'β'
              ),
            ],
          },
        ],
      },
      {
        margin: [0, 0, 0, measurements.margin_x4],
        columns: [
          {
            width: spanColumns(4),
            stack: [
              ...keyValue(
                t('dimensions.ceilingOpeningMinimal'),
                `${n(round(store.ceilingOpeningWidth / 10))} × ${n(round(store.ceilingOpeningLength.minimal / 10), 'cm')}`
              ),
            ],
          },
          {
            width: spanColumns(4),
            stack: [
              ...keyValue(
                t('dimensions.stairWidth'),
                n(round(store.stepWidth / 10), 'cm')
              ),
            ],
          },
        ],
      },
      store.stepWidth !== config.width[store.model].default ? {
        text: t('customWidth.summary.notice', {
          width: n(round(store.stepWidth / 10), 'cm'),
          difference: n(round(Math.abs(store.stepWidth - config.width[store.model].default) / 10), 'cm'),
          standard: n(round(config.width[store.model].default / 10), 'cm'),
          treadWidth: n(round(treadWidth(config.width[store.model].default) / 10), 'cm'),
        }),
        margin: [0, 0, 0, measurements.margin_x3],
      } : {},
      {
        columns: [
          store.nosingShortening > 0
            ? {
              width: spanColumns(4),
              stack: [
                ...keyValue(
                  t('dimensions.nosingShortening'),
                  n(round(store.nosingShortening / 10), 'cm')
                ),
              ],
            }
            : {},
          {},
        ],
      },
    ]
    return {
      margin: [
        0,
        0,
        0,
        measurements.margin,
      ],
      stack: leftColumn,
    }
  }

  async function summaryFooterBlocks() {
    const comfort = store.model === 'comfort'
    const { details } = await settings(store, i18n)
    const span = 12 / 3
    const logoSVG = details?.from?.logo
    const logoWidth = logoSVG ? Math.min(2, getSvgDimensionsRatio(logoSVG)) : 0

    const logo: Column | null = logoSVG
      ? {
        width: spanColumns(logoWidth),
        svg: logoSVG,
        fit: [spanColumns(logoWidth), measurements.margin_x2 - 5],
        margin: [0, 2, 0, 0]
      }
      : null
    const address = {
      width: spanColumns(span - logoWidth),
      stack: getAddress(details, i18n).from as (string | { text: string, bold: boolean })[],
    }

    if (typeof address.stack[0] === 'string') {
      address.stack[0] = {
        text: address.stack[0],
        bold: true,
      }
    }

    return [
      {
        width: spanColumns(4),
        columns: [logo, address]
      },
      {
        width: spanColumns(8),
        stack: comfort ? manufacturerInfo() : [additionalMeasurements(), technicalDrawingNotice()],
      },
    ].filter(Boolean)
  }


  return async () => {
    const content = [
      await header(),
      await mainMajor()
    ] as TDocumentDefinitions['content']
    const info = {
      title: t('yourConfiguration'),
      author: 'Raumvonwert',
      subject: 'summary',
      keywords: '',
    }
    // const footerHeight = store.model !== 'comfort' ? measurements.margin * 2 : 95
    return {
      content,
      footer: getFooter({ blocks: await summaryFooterBlocks(), i18n }),
      info
    }
  }
}
