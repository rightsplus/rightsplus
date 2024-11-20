import type { ContentTable, TDocumentDefinitions } from 'pdfmake/interfaces'
import { getFooterHeight, measurements } from './utils'
import { theme } from '#tailwind-config'
const { colors } = theme

const { mm } = measurements

export const styles = {
  model: {
    fontSize: 24,
  },
  valueBig: {
    fontSize: 24,
    characterSpacing: 0.1,
    // fontFeatures: ["ss01", "tnum"],
    bold: true,
  },
  valueRegular: {
    fontSize: 14,
    characterSpacing: 0.1,
    // fontFeatures: ["ss01", "tnum"],
    bold: true,
  },
  header: {
    fontSize: 16,
  },
  subHeader: {
    bold: true,
    margin: [0, 0, 0, 5],
  },
  tinyHeader: {
    bold: true,
    fontSize: 10,
    margin: [0, measurements.margin_x4, 0, measurements.margin_x3],
  },
  smallHeader: {
    bold: true,
    fontSize: 12,
    margin: [0, measurements.margin_x4, 0, measurements.margin_x3],
  },
  small: {
    fontSize: 7,
    color: colors.gray['500'],
  },
  tableHeader: {
    fontSize: 7,
    // bold: true,
    characterSpacing: 0.5,
  },
} satisfies TDocumentDefinitions['styles']

export function spanColumns(columns: number) {
  return columns * measurements.columnWidth + (columns - 1) * measurements.columnGap
}
export function startInColumn(columns: number) {
  return (
    measurements.margin +
    (columns - 1) * measurements.columnWidth +
    (columns - 1) * measurements.columnGap
  )
}
export function marks(show: boolean = false) {
  return show ? {
    canvas: [
      {
        type: 'line',
        x1: 0,
        y1: 105 * mm,
        x2: 6.2 * mm,
        y2: 105 * mm,
        lineWidth: 1,
        lineColor: (colors.border),
      },
      {
        type: 'line',
        x1: 0,
        y1: 210 * mm,
        x2: 6.2 * mm,
        y2: 210 * mm,
        lineWidth: 1,
        lineColor: (colors.border),
      },
      {
        type: 'line',
        x1: 0,
        y1: 148.5 * mm,
        x2: 10 * mm,
        y2: 148.5 * mm,
        lineWidth: 1,
        lineColor: (colors.border),
      },
    ],
    absolutePosition: { x: 0, y: 0 },
  } : {}
}

/**
 * Supports only *text* for bold
 */
export function parseMarkdown(input: string): (string | { text: string; bold: boolean })[] {
  const regex = /(\*.*?\*)/g;
  const matches = input.split(regex);

  const formattedArray = matches.map(match => {
    if (match.startsWith('*') && match.endsWith('*')) {
      const boldText = match.slice(1, -1);
      return { text: boldText, bold: true };
    } else {
      return match;
    }
  });

  return formattedArray;
}


export const frame = async (content: any[]) => {
  return [
    {
      layout: 'roundedCornerFrame',
      margin: [0, 0, 0, measurements.margin_x3],
      table: {
        dontBreakRows: true,
        widths: ['*'],
        body: [[content]],
      },
    }
  ]
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = [].slice.call(new Uint8Array(buffer))
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return window.btoa(binary)
}
export const getSVG = (url: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = new URL(location.href).origin
      const path = `${base}/${url}`
      const response = await fetch(path)
      const text  = await response.text()
      resolve(text)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  });
};
export const getImage = (url: string): Promise<{ base64: string, width: number, height: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = new URL(location.href).origin
      const path = `${base}/${url}`
      const response = await fetch(path)
      const buffer = await response.arrayBuffer()
      const img = new Image();
      img.src = path;
      img.onload = () => resolve({
        base64: `data:image/${url.split('.').pop()};base64,${arrayBufferToBase64(buffer)}`,
        width: img.width,
        height: img.height,
      });
      img.onerror = reject
    } catch (e) {
      console.error(e)
      reject(e)
    }
  });
};

export async function roundImage(url: string, radius: number, stroke = 4) {
  try {
    const image = await getImage(url)
    const d = radius * 2
    const viewBoxSize = 100
  
    const imageWidth =
      (image.width <= image.height && image.height >= viewBoxSize) ||
        image.width === image.height
        ? viewBoxSize
        : (image.height / image.width) * viewBoxSize
    const imageHeight = image.height / (image.width / imageWidth)
  
    return {
      svg: `<svg viewBox="${stroke / -2} ${stroke / -2} ${viewBoxSize + stroke} ${viewBoxSize + stroke}" width="${d}" height="${d}">
          <defs>
            <clipPath id="circle">
              <circle fill="none" cx="50" cy="50" r="50" />
            </clipPath>
          </defs>
          <image width="${imageWidth}" height="${imageHeight}" clip-path="url(#circle)" xlink:href="${image.base64}">
          </image>
          <circle fill="none" cx="50" cy="50" r="50" stroke="${(colors.border)}" stroke-width="${stroke}" />
        </svg>`,
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}
export async function rectImage(url: string, width: number, height: number, stroke = 1) {
  try {
    const image = await getImage(url)
    const imageWidth =
      (image.width / image.height * height < width)
        ? width
        : image.width / image.height * height
    const imageHeight =
      (image.height / image.width * width < height)
        ? height
        : image.height / image.width * width
  
    const strokeRect = stroke ? `<rect fill="none" width="${width}" height="${height}" stroke="${(colors.border)}" stroke-width="${stroke}" />` : ''
    const radius = 0
  
    const svg = `<svg viewBox="${stroke / -2} ${stroke / -2} ${width + stroke} ${height + stroke}" width="${width}" height="${height}">
      <defs>
        <clipPath id="rect">
          <rect width="${width}" height="${height}" rx="${radius}" />
        </clipPath>
      </defs>
      <image width="${imageWidth}" height="${imageHeight}" clip-path="url(#rect)" xlink:href="${image.base64.trim()}">
      </image>
      ${strokeRect}
    </svg>`
    return {
      svg,
      width
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}
export function layoutLines(padding: number) {
  const tableLineWidth = 0.5
  return {
    hLineWidth: (i: number, node: ContentTable) => {
      if (i === 0 || i === node.table.body.length) return 0
      // return (i === node.table.headerRows) ? 1 : 1;
      return tableLineWidth
    },
    vLineWidth: () => 0,
    hLineColor: (i: number) => (i === 1 ? colors.border : colors.border),
    paddingTop: () => padding,
    paddingBottom: () => padding,
    paddingLeft: (i: number) => {
      switch (i) {
        case 0:
          return 0
        default:
          return padding
      }
    },
    paddingRight: (i: number, node: ContentTable) => {
      switch (i) {
        case 0:
          return 0
        case (node.table.widths?.length || 0) - 1:
          return 0
        default:
          return padding
      }
    },
  }
}
export function layoutAlternating(padding: [number, number]) {
  return {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    hLineColor: () => 'transparent',
    paddingTop: () => padding[1],
    paddingRight: () => padding[0],
    paddingBottom: () => padding[1],
    paddingLeft: () => padding[0],
    fillColor: (i: number) => i % 2 ? 'white' : (colors.gray['100']),
  }
}
export function layoutRoundedCorderFrame(padding: number) {
  const tableLineWidth = 0.5
  return {
    hLineWidth: (i: number, node: ContentTable) => {
      if (i === 0 || i === node.table.body.length) return tableLineWidth
      return 0
    },
    vLineWidth: (i: number, node: ContentTable) => {
      if (i === 0 || i === node.table.body.length) return tableLineWidth
      return 0
    },
    hLineColor: () => (colors.gray['100']),
    vLineColor: () => (colors.gray['100']),
    paddingTop: () => padding,
    paddingRight: () => padding,
    paddingBottom: () => padding,
    paddingLeft: () => padding,
    // fillColor: () => 'white',
  }
}
export function date(locale: string, format: 'long' | 'short' = 'long', date = new Date()) {
  const size = {
    long: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    short: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  } as const
  return date.toLocaleDateString(
    locale,
    size[format]
  )
}
export function getTextWidth(text: string, font: string) {
  const canvas = document.createElement('canvas')
  // const canvas =
  //   getTextWidth.canvas ||
  //   (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  if (!context) return 0
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}
export function getButton(text: string, link: string, margins: number[]) {
  // @todo needs more adjustments
  return {
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            // the spaces adds more width
            w: getTextWidth(' ' + text + ' ', `normal 7pt Inter`),
            h: 15,
            r: 20,
            color: (colors.orange["DEFAULT"]),
          },
        ],
      },
      {
        margin: [6, 2.25 - 15, 0, 0],
        text,
        link,
        style: {
          color: 'white',
          bold: true,
          fontSize: 8,
        }
      },
    ],
    margin: [(margins?.[0] || 0) - 1, margins?.[1] || 0, margins?.[2] || 0, margins?.[3] || 0],
  }
}