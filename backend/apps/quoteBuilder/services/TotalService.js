RANGE = 0.25;

const getFudgeFactor = (fudge) => {
  // get random value between 1 - RANGE and 1 + RANGE
  if (fudge) return 1 - RANGE + Math.random() * 2 * RANGE;
  return 1;
};

module.exports = class TotalService {
  /**
   * Calculates totals for objects which can have a total
   * including fudge factor.
   *
   * Fudge factor is calculated using a base range.
   *
   * All terms in the calculation have a 50% chance of
   * being multiplied by the 1 +/- the base range.
   */
  static getFudgeBias(value, fudge) {
    // Apply fudge factor to value 50% of the time
    if (!fudge || Math.random < 0.5) return value;

    return value * getFudgeFactor(fudge);
  }

  static async getTimeEntryTotal(timeEntry, fudge = true) {
    // Apply fudge bias to minutes and rate
    let worker = await timeEntry.getWorker();
    return (
      (this.getFudgeBias(timeEntry.minutes, fudge) / 60) *
      this.getFudgeBias(worker.rate, fudge)
    );
  }

  static async getTaskTotal(task, fudge = true) {
    // Apply fudge bias to return value
    let total = 0;

    let timeEntries = await task.getTimeEntries();
    for (let timeEntry of timeEntries) {
      total += await this.getTimeEntryTotal(timeEntry, fudge);
    }

    return this.getFudgeBias(total, fudge);
  }

  static async getQuoteTotal(quote, fudge = true) {
    // Apply fudge bias to return value and static costs
    let total = 0;

    let tasks = await quote.getTasks();
    for (let task of tasks) {
      total += await this.getTaskTotal(task, fudge);
    }

    let staticCosts = await quote.getStaticCosts();
    for (let staticCost of staticCosts) {
      total += this.getFudgeBias(staticCost.cost, fudge);
    }

    return this.getFudgeBias(total, fudge);
  }

  static async getQuoteTotalDetail(quote) {
    /**
     * This is only required for quotes
     */
    let result = "Calculated using \n";

    // Find the total number of hours worked by each worker on all tasks
    let tasks = await quote.getTasks();
    let workers = {};
    for (let task of tasks) {
      let timeEntries = await task.getTimeEntries();
      for (let timeEntry of timeEntries) {
        let worker = await timeEntry.getWorker();
        if (worker.id in workers) {
          workers[worker.id].hours += timeEntry.minutes / 60;
        } else {
          workers[worker.id] = {
            title: worker.title,
            hours: timeEntry.minutes / 60,
          };
        }
      }
    }

    // Format a string showing how many hours each worker worked
    for (let workerId in workers) {
      result +=
        workers[workerId].title +
        ": " +
        workers[workerId].hours.toFixed(2) +
        " hours\n";
    }

    return result;
  }

  static async getProjectTotal(project, fudge = true) {
    // Apply fudge bias to return value
    let total = 0;

    let quotes = await project.getQuotes();
    for (let quote of quotes) {
      total += await this.getQuoteTotal(quote, fudge);
    }

    return this.getFudgeBias(total, fudge);
  }
};
