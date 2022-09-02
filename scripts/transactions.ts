type TransactionsParams = {
  pgData: Record<string, unknown>[];
  mongoData: Record<string, unknown>[];
};

export function transactions({ pgData, mongoData }: TransactionsParams) {
  console.info('- Comparing data...');
  const result = [];

  for (const { id } of pgData) {
    const currentMongoData = mongoData.find(curr => curr._id === id);

    if (!currentMongoData) {
      result.push(id);
    }
  }

  console.info('- Finished comparing data.');
  return result;
}
