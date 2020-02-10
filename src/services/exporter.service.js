const ExcelJS = require('exceljs');
const open = require('open');
const fs = require('fs');
const path = require('path');


const exportIssues = async (issues, type = 'xlsx') => {
  const workbook = new ExcelJS.Workbook();
  let sheet = workbook.addWorksheet('Issues');
  sheet.columns = [
    { header: 'Issue', key: 'issue', width: 10 },
    { header: 'Author', key: 'author', width: 32 },
    { header: 'Time.', key: 'time', width: 10 }
  ];

  issues.forEach(issue => {
    issue.worklogs.forEach(wl => {
      const row = {
        issue: issue.name,
        author: wl.author.name,
        time: wl.time.getHours()
      };
      sheet.addRow(row);
    });
  });

  const fileDirPath = path.join(__basedir, '/tmp/exports');
  if (!fs.existsSync(fileDirPath)){
    fs.mkdirSync(fileDirPath, { recursive: true });
  }

  fs.mkdirSync(fileDirPath, { recursive: true });
  const fileName = path.join(fileDirPath, `issueReport-${new Date().getTime()}.xlsx`)

  await workbook.xlsx.writeFile(fileName);
  console.log('Your report has been created');
  await open(fileDirPath);
};


module.exports = {
  exportIssues,
}
