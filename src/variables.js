export const FactorTypes = [{
  text: "خرید",
  value: 'buy',
}, {
  text: "برگشت از خرید",
  value: 'backFromBuy',
}, {
  text: "فروش",
  value: 'sale',
}, {
  text: "برگشت از فروش",
  value: 'backFromSale',
}, {
  text: "حواله کالای مصرفی",
  value: 'cw',
}]

export const VisitorLevels = [{
  text: "مدیر فروش",
  value: 0
}, {
  text: "سرپرست فروش",
  value: 1
}, {
  text: "سوپروایزر",
  value: 2
}, {
  text: "ویزیتور",
  value: 3
}]

export const PathLevels = [{
  text: "استان",
  value: 0
}, {
  text: "شهر",
  value: 1
}, {
  text: "منطقه",
  value: 2
}, {
  text: "محله",
  value: 3
}, {
  text: "خیابان",
  value: 4
}]

export function getText(variable, value) {
  return variable.find((o) => o.value == value).text;
}