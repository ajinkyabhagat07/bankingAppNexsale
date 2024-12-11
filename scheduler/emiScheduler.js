const cron = require("node-cron");
const moment = require("moment-timezone"); 
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const emiConfig = require("../app/model-config/emi-config");
const loanConfig = require("../app/model-config/loan-config");
const Logger = require("../app/utils/logger");
const { transaction, commit, rollBack } = require("../app/utils/transaction");
const { Op } = require("sequelize");
const userConfig = require("../app/model-config/user-config");
const sendEmail = require("../app/utils/email");

const runScheduler = async () => {
  Logger.info("Scheduler started for EMI reminders and overdue status checks.");

  const t = await transaction();

  try {
    const timezone = "Asia/Kolkata"; 
    const today = moment.tz(timezone).startOf("day");
    const tomorrow = moment(today).add(1, "day").toDate();
    const overdueCheckDate = moment(today).subtract(1, "day").endOf("day");

    const dueTomorrowEmis = await emiConfig.model.findAll({
      where: {
        dueDate: tomorrow,
        status: { [Op.in]: ["Pending", "Overdue"] },
      },
      transaction: t,
    });

    for (const emi of dueTomorrowEmis) {
      const userLoan = await loanConfig.model.findByPk(emi.loanId, { transaction: t });
      const user = await userConfig.model.findByPk(userLoan.customerId, { transaction: t });
      const userEmail = user?.email;

      if (userEmail) {
        await sendEmail(
          userEmail,
          "EMI DUE DATE REMINDER",
          `Dear Customer,\n\nThis is a friendly reminder that your EMI for Loan Account ${
            emi.accountNumber
          } is due tomorrow (${moment(emi.dueDate).tz(timezone).format("YYYY-MM-DD")}). Please ensure timely payment to avoid penalties.\n\nThank you!`
        );
        Logger.info(`Reminder email sent for EMI ID: ${emi.id}`);
      } else {
        Logger.warn(`Email not found for EMI ID: ${emi.id}`);
      }
    }

    const overdueEmis = await emiConfig.model.findAll({
      where: {
        dueDate: { [Op.lte]: overdueCheckDate.toDate() },
        status: "Pending",
      },
      transaction: t,
    });

    for (const emi of overdueEmis) {
      emi.status = "Overdue";
      await emi.save({ transaction: t });
      Logger.info(`EMI ID ${emi.id} marked as overdue.`);
    }

    await commit(t);
    Logger.info("Scheduler completed successfully.");
  } catch (error) {
    await rollBack(t);
    Logger.error("Error occurred in scheduler:", error);
  }
};

// Schedule the task to run at 12:00 AM daily in the specified timezone
cron.schedule("0 0 * * *",() => {
    runScheduler();
  },
  {
    timezone: "Asia/Kolkata", 
  }
);

//runScheduler();