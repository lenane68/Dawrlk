import { Service } from "../models/Service";

export const seedServices = async () => {
  const seed = [
    { name: "Haircut", category: "Beauty" },
    { name: "Makeup", category: "Beauty" },
    { name: "Straightening", category: "Beauty" }
  ];

  for (const item of seed) {
    await Service.updateOne(
      { name: item.name },
      { $setOnInsert: item },
      { upsert: true }
    );
  }
};
