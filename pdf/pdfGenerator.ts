import puppeteer from 'puppeteer';

export async function generatePDF(url: string): Promise<Buffer> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('url', url)
    await page.goto(url, { waitUntil: 'load' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    console.log('pdf', pdf)
    await browser.close();
    return pdf
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}