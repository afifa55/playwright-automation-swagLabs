export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  priceText: string;
  imageSrc: RegExp;
}

export const products: Product[] = [
  {
    id: 4,
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: 29.99,
    priceText: '$29.99',
    imageSrc: /sauce-backpack/,
  },
  {
    id: 0,
    name: 'Sauce Labs Bike Light',
    description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: 9.99,
    priceText: '$9.99',
    imageSrc: /bike-light/,
  },
  {
    id: 1,
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: 15.99,
    priceText: '$15.99',
    imageSrc: /bolt-shirt/,
  },
  {
    id: 5,
    name: 'Sauce Labs Fleece Jacket',
    description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    price: 49.99,
    priceText: '$49.99',
    imageSrc: /sauce-pullover/,
  },
  {
    id: 2,
    name: 'Sauce Labs Onesie',
    description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: 7.99,
    priceText: '$7.99',
    imageSrc: /red-onesie/,
  },
  {
    id: 3,
    name: 'Test.allTheThings() T-Shirt (Red)',
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    price: 15.99,
    priceText: '$15.99',
    imageSrc: /red-tatt/,
  },
];

const [backpack, bikeLight, boltShirt, fleeceJacket, onesie, redShirt] = products;
export const productByKey = { backpack, bikeLight, boltShirt, fleeceJacket, onesie, redShirt };

export const sortOptions = {
  nameAsc: { value: 'az', label: 'Name (A to Z)' },
  nameDesc: { value: 'za', label: 'Name (Z to A)' },
  priceAsc: { value: 'lohi', label: 'Price (low to high)' },
  priceDesc: { value: 'hilo', label: 'Price (high to low)' },
} as const;

export type SortOption = (typeof sortOptions)[keyof typeof sortOptions];

export const messages = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  notLoggedIn: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  orderThanks: 'Thank you for your order!',
  orderDispatched: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;

export const titles = {
  list: 'Products',
  cart: 'Your Cart',
  checkoutInfo: 'Checkout: Your Information',
  checkoutOverview: 'Checkout: Overview',
  checkoutComplete: 'Checkout: Complete!',
} as const;

export const urls = {
  login: /\/$/,
  list: /\/inventory\.html$/,
  cart: /\/cart\.html$/,
  checkoutInfo: /\/checkout-step-one\.html$/,
  checkoutOverview: /\/checkout-step-two\.html$/,
  checkoutComplete: /\/checkout-complete\.html$/,
  productDetail: (id: number) => new RegExp(`/inventory-item\\.html\\?id=${id}$`),
  about: /saucelabs\.com/,
} as const;

export const authFile = '.auth/user.json';

export const parsePrice = (text: string): number => parseFloat(text.replace(/[^0-9.]/g, ''));
export const sumPrices = (items: Product[]): number => items.reduce((sum, p) => sum + p.price, 0);
export const formatMoney = (value: number): string => `$${value.toFixed(2)}`;
