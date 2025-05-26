function generateDataBlob(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided for blob generation');
  }
  const jsonData = JSON.stringify(data);
  const base64Encoded = Buffer.from(jsonData).toString('base64');
  return base64Encoded;
}

module.exports = { generateDataBlob };
