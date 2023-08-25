const ReportRepository = require('../repositories/reports.repository');

class ReportService {
  constructor() {
    this.reportRepository = new ReportRepository();
  }
}

module.exports = ReportService;
