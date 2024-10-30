const ledgerConfig = require("../../../model-config/ledger-config");
const { parseSelectFields, parseLimitAndOffset, parseFilterQueries } = require("../../../utils/request");
const { rollBack, commit, transaction } = require("../../../utils/transaction");

class LedgerService {
  async getAllLedgers(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get all ledgers service started...");
      let selectArray = parseSelectFields(query, ledgerConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(ledgerConfig.fieldMapping);
      }

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, ledgerConfig.filters),
      };

      const { count, rows } = await ledgerConfig.model.findAndCountAll(arg);
      await commit(t);
      Logger.info("get all ledgers service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async getLedgerById(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get ledger by id service called...");
      let selectArray = parseSelectFields(query, ledgerConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(ledgerConfig.fieldMapping);
      }

      const arg = {
        attributes: selectArray,
        ...parseFilterQueries(query , ledgerConfig.filters),
        transaction: t,
      };

      const response = await ledgerConfig.model.findOne(arg);

      await commit(t);
      Logger.info("get ledger by id service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }
}

module.exports = LedgerService;