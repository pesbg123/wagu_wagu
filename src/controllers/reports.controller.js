const ReportService = require('../services/reports.service');

class ReportController {
  constructor() {
    this.reportService = new ReportService();
  }
}

module.exports = ReportController;
