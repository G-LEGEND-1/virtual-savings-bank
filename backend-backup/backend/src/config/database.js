// This is a demo database config
// In production, you would use a real PostgreSQL connection

module.exports = {
  query: async (text, params) => {
    console.log('Database query:', text, params);
    // Demo responses
    if (text.includes('INSERT INTO messages')) {
      return {
        rows: [{
          id: Date.now(),
          user_id: params[0],
          subject: params[1],
          content: params[2],
          is_read: params[3],
          message_type: params[4],
          custom_date: params[5],
          custom_time: params[6],
          custom_year: params[7],
          created_at: new Date()
        }]
      };
    }
    return { rows: [] };
  }
};
