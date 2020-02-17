const ExcelJS = require('exceljs');
const open = require('open');
const fs = require('fs');
const path = require('path');

const { printHeader, logger, Notify } = require('../helpers');


const ISSUE_COLUMNS = [{
    header: 'Issue',
    key: 'issue',
    width: 10
  },
  {
    header: 'Author',
    key: 'author',
    width: 32
  },
  {
    header: 'Time',
    key: 'time',
    width: 10
  },
  {
    header: 'Date',
    key: 'date'
  }
];

const LOGS_COLUMNS = [{
    header: 'Date',
    key: 'date'
  },
  {
    header: 'Issue',
    key: 'issue',
    width: 10
  },
  {
    header: 'Author',
    key: 'author',
    width: 32
  },
  {
    header: 'Time',
    key: 'time',
    width: 10
  },
];

const drawSuccessBox = () => {
  printHeader();
  Notify.success("🤘 Your report has been created 🤘 ");
};

const drawErrorCreating = err => {
  printHeader();
  logger.error(err);
  Notify.error("👺 Error creating your report 👺 ");
}

const createFileFromWb = async (wb, fileName, type = 'xlsx') => {
  const fileDirPath = path.join(__basedir, '/tmp/exports');
  if (!fs.existsSync(fileDirPath)) {
    fs.mkdirSync(fileDirPath, {
      recursive: true
    });
  }

  const fullPathFile = path.join(fileDirPath, `${fileName}.${type}`)

  await wb.xlsx.writeFile(fullPathFile);
  logger.info(`File created at: ${fullPathFile}`);
  return fullPathFile;
};

const exportLogs = async (logs, type = 'xlsx') => {

  try {
    const workbook = new ExcelJS.Workbook();
    let sheet = workbook.addWorksheet('Logs');
    sheet.columns = LOGS_COLUMNS;

    Object.keys(logs).forEach(day => {

      logs[day].forEach(wl => {

        const row = {
          issue: wl.issueName,
          author: wl.author.name,
          time: wl.time.getHours(),
          date: day,
        }
        sheet.addRow(row);

      });
      sheet.lastRow.border = {
        bottom: {
          style: 'medium'
        }
      };
    });
    const fileDirPath = await createFileFromWb(workbook, `logsReport-${new Date().getTime()}`);
    drawSuccessBox();
    await open(path.dirname(fileDirPath));

  } catch (e) {
    drawErrorCreating(e);
  }

};

const exportIssues = async (issues, type = 'xlsx') => {
  try {
    const workbook = new ExcelJS.Workbook();
    let sheet = workbook.addWorksheet('Issues');
    sheet.columns = ISSUE_COLUMNS;

    issues.forEach(issue => {
      issue.worklogs.forEach(wl => {
        const row = {
          issue: issue.name,
          author: wl.author.name,
          time: wl.time.getHours(),
          date: wl.created,
        };
        sheet.addRow(row);
      });
      sheet.lastRow.border = {
        bottom: {
          style: 'medium'
        }
      };
    });

    const fileDirPath = await createFileFromWb(workbook, `issueReport-${new Date().getTime()}`);
    drawSuccessBox();
    await open(path.dirname(fileDirPath));
  } catch (e) {
    drawErrorCreating(e);
  }
};


module.exports = {
  exportIssues,
  exportLogs,
}
