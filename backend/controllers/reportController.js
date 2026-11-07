exports.scheduleReport = async (req, res, next) => {
  try {
    const { reportName, frequency, recipients, format } = req.body;
    res.json({
      success: true,
      message: `Report schedule for "${reportName}" created successfully.`,
      schedule: {
        frequency,
        recipients,
        format,
        nextRun: new Date(Date.now() + 86400000 * 7).toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};
