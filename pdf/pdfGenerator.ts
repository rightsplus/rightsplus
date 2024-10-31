import puppeteer from 'puppeteer';

export async function generatePDF(url: string): Promise<Buffer> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('url', url)
    // Wait until network is idle and content is loaded
    await page.goto(url, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000 
    });

    // Wait for any content to be rendered
    await page.waitForSelector('body', { timeout: 5000 });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    console.log('pdf', pdf)
    await browser.close();
    return pdf
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}