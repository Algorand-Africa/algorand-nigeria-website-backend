import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as puppeteer from 'puppeteer';
export class PDFService {
  private readonly logger = new Logger(PDFService.name);

  async generatePdfTable(
    title: string,
    headers: string[],
    data: object[],
    fileName: string,
  ): Promise<{
    path: string;
    status: 'successful' | 'failed';
    content: Buffer;
  }> {
    try {
      const path = `./${fileName}.pdf`;
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_BIN || null,
      });
      const page = await browser.newPage();
      const content = this.generateHtmlTable(title, headers, data);
      await page.setContent(content);
      const buffer = await page.pdf({ path, format: 'A4' });

      await browser.close();

      return { path, status: 'successful', content: buffer };
    } catch (error) {
      this.logger.error('Error writing to PDF', error);
      return { path: '', status: 'failed', content: Buffer.alloc(0) };
    }
  }

  async generateCourseCertificatePdf(
    data: {
      receiverName: string;
      courseTitle: string;
      date: string;
    },
    fileName: string,
  ): Promise<{
    path: string;
    status: 'successful' | 'failed';
    content: Buffer;
  }> {
    try {
      const path = `./${fileName}.pdf`;
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_BIN || null,
      });
      const page = await browser.newPage();
      const content = this.generateCourseCertificate(data);
      await page.setContent(content);
      const buffer = await page.pdf({
        path,
        width: '842px',
        height: '595px',
        pageRanges: '1',
        printBackground: true,
      });

      await browser.close();

      return { path, status: 'successful', content: buffer };
    } catch (error) {
      this.logger.error('Error writing to PDF', error);
      return { path: '', status: 'failed', content: Buffer.alloc(0) };
    }
  }

  async generateCourseCertificateImage(
    data: {
      receiverName: string;
      courseTitle: string;
      date: string;
    },
    fileName: string,
  ): Promise<{
    path: string;
    status: 'successful' | 'failed';
    content: Buffer;
  }> {
    try {
      const path = `./${fileName}.jpg`;
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_BIN || null,
      });
      const page = await browser.newPage();
      const content = this.generateCourseCertificate(data);
      await page.setContent(content);
      await page.screenshot({
        path,
        type: 'jpeg',
        quality: 100,
        clip: { x: 0, y: 0, width: 842, height: 595 },
      });

      await browser.close();

      return { path, status: 'successful', content: readFileSync(path) };
    } catch (error) {
      this.logger.error('Error writing to PDF', error);
      return { path: '', status: 'failed', content: Buffer.alloc(0) };
    }
  }

  async generatePathwayCertificatePdf(
    data: {
      receiverName: string;
      pathwayTitle: string;
      date: string;
      noOfCourses?: number;
      noOfProjects?: number;
      noOfQuizzes?: number;
      noOfChallenges?: number;
    },
    fileName: string,
  ): Promise<{
    path: string;
    status: 'successful' | 'failed';
    content: Buffer;
  }> {
    try {
      const path = `./${fileName}.pdf`;
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_BIN || null,
      });
      const page = await browser.newPage();
      const content = this.generatePathwayCertificate(data);
      await page.setContent(content);
      const buffer = await page.pdf({
        path,
        width: '842px',
        height: '595px',
        pageRanges: '1',
        printBackground: true,
      });

      await browser.close();

      return { path, status: 'successful', content: buffer };
    } catch (error) {
      this.logger.error('Error writing to PDF', error);
      return { path: '', status: 'failed', content: Buffer.alloc(0) };
    }
  }

  async generatePathwayCertificateImage(
    data: {
      receiverName: string;
      pathwayTitle: string;
      date: string;
      noOfCourses?: number;
      noOfProjects?: number;
      noOfQuizzes?: number;
      noOfChallenges?: number;
    },
    fileName: string,
  ): Promise<{
    path: string;
    status: 'successful' | 'failed';
    content: Buffer;
  }> {
    try {
      const path = `./${fileName}.jpg`;
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_BIN || null,
      });
      const page = await browser.newPage();
      const content = this.generatePathwayCertificate(data);
      await page.setContent(content);
      await page.screenshot({
        path,
        type: 'jpeg',
        quality: 100,
        clip: { x: 0, y: 0, width: 842, height: 595 },
      });

      await browser.close();

      return { path, status: 'successful', content: readFileSync(path) };
    } catch (error) {
      this.logger.error('Error writing to PDF', error);
      return { path: '', status: 'failed', content: Buffer.alloc(0) };
    }
  }

  private generateHtmlTable = (
    title: string,
    headers: string[],
    data: object[],
  ) => {
    let table = '<table border="1"><thead><tr>';
    headers.forEach((header) => {
      table += `<th>${header}</th>`;
    });
    table += '</tr></thead><tbody>';
    data.forEach((row) => {
      table += '<tr>';
      headers.forEach((header) => {
        table += `<td>${row[header]}</td>`;
      });
      table += '</tr>';
    });
    table += '</tbody></table>';
    return `
      <!DOCTYPE html>
      <html>
        <meta charset="UTF-8" />
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px 12px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${table}
        </body>
      </html>
    `;
  };

  private generateCourseCertificate = (data: {
    receiverName: string;
    courseTitle: string;
    date: string;
  }) => {
    return `
      <!DOCTYPE html>
      <html>
        <meta charset="UTF-8" />
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter&family=Noto+Sans&display=swap"
          />
          <style>
            body {
              font-family: Inter;
              margin: 0;
              padding: 0;
            }
            img {
              width: 842px;
              height: 595px;
              margin: 0;
            }
            .container {
              position: absolute;
              top: 366.81px;
              left: 0;
              padding-left: 41.86px;
              z-index: 5;
              color: white;
            }

            .container h1 {
              margin: 0;
              margin-bottom: 12px;
              font-size: 50.672px;
              font-weight: 700;
              text-transform: capitalize;
            }

            .container p {
              font-size: 24px;
              font-weight: 400;
              width: 437px;
            }

            .container strong {
              font-weight: 700;
            }
          </style>
        </head>
        <body>
            <img 
              src="https://res.cloudinary.com/dzl7hb2xw/image/upload/v1723229645/course-image/BlockTremp_Certificates_obgfv8.png" 
              alt="Certificate"
            />
            <div class="container">
              <h1>${data.receiverName}</h1>
              <p>
                For successfully completing the <strong>${data.courseTitle}</strong> course&nbsp;
                on <strong>${data.date}</strong>
              </p>
            </div>
        </body>
      </html>
    `;
  };

  private generatePathwayCertificate = (data: {
    receiverName: string;
    pathwayTitle: string;
    date: string;
    noOfCourses?: number;
    noOfProjects?: number;
    noOfQuizzes?: number;
    noOfChallenges?: number;
  }) => {
    const {
      noOfCourses = 0,
      noOfProjects = 0,
      noOfQuizzes = 0,
      noOfChallenges = 0,
    } = data;
    return `
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <meta charset="UTF-8">
              <link
                  rel="stylesheet"
                  href="https://fonts.googleapis.com/css2?family=Inter&family=Noto+Sans&display=swap" />
              <style>
                  body {
                    font-family: Inter;
                    margin: 0;
                    padding: 0;
                  }
                  img {
                    width: 842px;
                    height: 595px;
                    margin: 0;
                  }
                  .container {
                      position: absolute;
                      top: 0px;
                      left: 0px;
                      z-index: 2;
                      width: 842px;
                      height: 595px;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      color: #FFF;
                  }
                  .name-of-user {
                      text-align: center;
                      margin-top: 200px;
                      font-size: 52px;
                      font-weight: 700;
                      height: 63px;
                  }
                  .cert-info {
                      margin-top: 42px;
                      max-width: 664px;
                      text-align: center;
                      font-size: 22px;
                      font-weight: 700;
                  }
                  .on-the {
                      font-weight: 500;
                  }
                  .comprising {
                      margin-top: 8px;
                      color: #D9F0FF;
                      text-align: center;
                      font-size: 18px;
                      font-weight: 400;
                  }
              </style>
          </head>
          <body>
              <img
                  src="https://res.cloudinary.com/dzl7hb2xw/image/upload/v1728303547/course-image/Certificate_of_completion_-_landscape_-_VAS_App_ac0vue.png"
                  alt="Certificate" />
              <div class="container">
                  <div class="name-of-user">${data.receiverName}</div>
                  <div class="cert-info">${
                    data.pathwayTitle
                  } <span class="on-the">on the</span> ${data.date}</div>
                  <div class="comprising">${this.generatePathwayModulesCountText(
                    { noOfChallenges, noOfCourses, noOfProjects, noOfQuizzes },
                  )}</div>
              </div>
          </body>
      </html>
    `;
  };

  private generatePathwayModulesCountText = (data: {
    noOfCourses: number;
    noOfProjects: number;
    noOfQuizzes: number;
    noOfChallenges: number;
  }) => {
    const existing: {
      type: 'course' | 'project' | 'quiz' | 'coding challenge';
      count: number;
    }[] = [];

    if (data.noOfCourses > 0) {
      existing.push({ type: 'course', count: data.noOfCourses });
    }

    if (data.noOfProjects > 0) {
      existing.push({ type: 'project', count: data.noOfProjects });
    }

    if (data.noOfQuizzes > 0) {
      existing.push({ type: 'quiz', count: data.noOfQuizzes });
    }

    if (data.noOfChallenges > 0) {
      existing.push({ type: 'coding challenge', count: data.noOfChallenges });
    }

    let text = 'comprising of ';

    for (let i = 0; i < existing.length; i++) {
      if (i === existing.length - 1 && existing.length > 1) {
        text += ` & ${existing[i].count} ${existing[i].type}${
          existing[i].count > 1
            ? existing[i].type === 'quiz'
              ? 'zes'
              : 's'
            : ''
        }.`;
      } else {
        text += `${i !== 0 ? ',' : ''} ${existing[i].count} ${
          existing[i].type
        }${
          existing[i].count > 1
            ? existing[i].type === 'quiz'
              ? 'zes'
              : 's'
            : ''
        }`;
      }
    }

    return text;
  };
}
