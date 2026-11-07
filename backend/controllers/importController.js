const Papa = require('papaparse');
const db = require('../config/db');

exports.importCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const csvContent = req.file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvContent, { header: true, dynamicTyping: true, skipEmptyLines: true });
    res.json({
      success: true,
      message: `Parsed ${parsed.data.length} records successfully`,
      columns: parsed.meta.fields,
      preview: parsed.data.slice(0, 5),
      totalRows: parsed.data.length
    });
  } catch (err) {
    next(err);
  }
};

exports.runSQLQuery = async (req, res, next) => {
  let client;
  try {
    const { queryText } = req.body;
    if (!queryText || typeof queryText !== 'string') {
      return res.status(400).json({ success: false, message: 'Query text must be a non-empty string' });
    }

    const trimmed = queryText.trim();
    if (!/^\s*(SELECT|WITH)\s+/i.test(trimmed)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only read-only SELECT or WITH statements allowed' });
    }

    if (/;\s*\S+/i.test(trimmed)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Multiple statements are not permitted' });
    }

    const forbidden = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|GRANT|REVOKE|EXEC|EXECUTE|CREATE|REPLACE)\b/i;
    if (forbidden.test(trimmed)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Mutation keywords detected' });
    }

    client = await db.pool.connect();
    await client.query('SET TRANSACTION READ ONLY');
    await client.query('SET LOCAL statement_timeout = 5000');

    const startTime = Date.now();
    const result = await client.query(trimmed);
    const executionTimeMs = Date.now() - startTime;

    const columns = result.fields ? result.fields.map(f => f.name) : [];
    res.json({
      success: true,
      executionTimeMs,
      rowCount: result.rowCount,
      columns,
      sampleData: result.rows.slice(0, 50)
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
      code: err.code
    });
  } finally {
    if (client) client.release();
  }
};
