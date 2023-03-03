const log = require("../../../core/utils");

module.exports = class TotalService {
  /**
   * Calculates totals for quotes or projects
   * including fudge factor.
   * TODO(IMPORTANT) Fudge Factor
   */
  static async getTimeEntryTotal(timeEntry) {
    let worker = await timeEntry.getWorker();
    return (timeEntry.seconds / 60 / 60) * worker.rate;
  }

  static async getTaskTotal(task) {
    let total = 0;

    let timeEntries = await task.getTimeEntries();
    for (let timeEntry of timeEntries) {
      total += await this.getTimeEntryTotal(timeEntry);
    }

    return total;
  }

  static async getQuoteTotal(quote) {
    let total = 0;

    let tasks = await quote.getTasks();
    for (let task of tasks) {
      total += await this.getTaskTotal(task);
    }

    let staticCosts = await quote.getStaticCosts();
    for (let staticCost of staticCosts) {
      total += staticCost.cost;
    }

    return total;
  }

  static async getProjectTotal(project) {
    let total = 0;

    let quotes = await project.getQuotes();
    for (let quote of quotes) {
      total += await this.getQuoteTotal(quote);
    }

    return total;
  }
};
