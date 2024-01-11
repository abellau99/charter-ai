const FEATURES = {
  free: Array(6).fill("Lorem ipsum dolor"),
  pro: Array(6).fill("Lorem ipsum dolor"),
};

interface IBillingTab {
  label: string;
  priceFree: number;
  pricePro: number;
  suffix: string;
}

interface IBilling {
  month: IBillingTab;
  year: IBillingTab;
}

const priceProMonth = 9;
const discount = 0.2;
const priceProAnnual = Math.round(
  priceProMonth * 12 - priceProMonth * 12 * discount
);

export const BILLINGS: IBilling = {
  month: {
    label: "Monthly",
    priceFree: 0,
    pricePro: priceProMonth,
    suffix: "/mo",
  },
  year: {
    label: "Annually",
    priceFree: 0,
    pricePro: priceProAnnual,
    suffix: "/yr",
  },
};

export default FEATURES;
