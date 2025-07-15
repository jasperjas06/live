import {
  _id,
  _price,
  _times,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
  _productNames,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export const _nvtUsers = [...Array(24)].map((_, index) => ({
  id: `NVT-CUST-${1000 + index}`,
  name: `Customer ${index + 1}`,
  customerId: `CUST-${index + 1}`,
  phoneNumber: `98765432${(10 + index).toString().slice(-2)}`,
  introducer: `Introducer ${index % 5 + 1}`,
  totalPayment: 16000 + index * 1000,
  initialPayment: 1000 + index * 100,
  emi: 1000,
  conversion: index % 2 === 0 ? 'yes' : 'no',
  mod: index % 3 === 0,
  status: index % 4 === 0 ? 'banned' : 'active',
  // avatarUrl: `/assets/images/avatar/avatar-${(index % 10) + 1}.webp`,
}));

export const _projects = [...Array(24)].map((_, index) => ({
  id: `PROJ-${1000 + index}`,
  volumeName: `Volume ${index + 1}`,
  projectName: `Project ${index + 1}`,
  description: `This is a sample project description for Project ${index + 1}`,
  stockName: `STOCK-${String.fromCharCode(65 + (index % 26))}`,
  duration: `${6 + (index % 12)} months`,
  emiAmount: 1000 + (index * 100),
  marketer: `Marketer ${index % 5 + 1}`,
  schema: index % 2 === 0 ? 'Fixed Projects' : 'Variable Projects',
  returns: 1 + (index % 5),
  intrinsic: `Intrinsic value ${index % 10}`,
  totalTrivestimate: 50000 + (index * 2000),
  totalReturnAmount: 60000 + (index * 2500),
  mod: index % 3 === 0,
  status: index % 4 === 0 ? 'inactive' : 'active',
  createdAt: new Date(Date.now() - index * 86400000).toISOString(), // Decrease by 1 day for each
}));
export const _lfcProjects = [...Array(10)].map((_, index) => ({
  customerName: `Customer ${index + 1}`,
  customerId: `CUST-${1000 + index}`,
  pl: `PL-${index + 1}`,
  introductionName: `Introducer ${index % 3 + 1}`,
  totalPayments: {
    ent: 10000 + index * 500,
    fustral: 8000 + index * 400,
    payout: 5000 + index * 300,
  },
  landDetails: {
    sayFe: `SayFe-${index + 1}`,
    sayTask: `SayTask-${index + 1}`,
    plotNo: `Plot-${index + 10}`,
  },
  needHos: index % 2 === 0,
  registration: index % 2 === 0 ? 'open' : 'closed',
  conversion: index % 3 === 0,
  conversionCustomerId: index % 3 === 0 ? `CUST-${2000 + index}` : '',
}));

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? 'active' : 'banned',
  role:
    [
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ][index] || 'UI Designer',
}));

export const _customers = [...Array(10)].map((_, index) => ({
  customerId: `CUST-${1000 + index}`,
  name: `Customer ${index + 1}`,
  email: `customer${index + 1}@example.com`,
  phone: `98765432${(10 + index) % 100}`,
  address: `Address ${index + 1}`,
  city: `City ${index % 5 + 1}`,
  state: `State ${index % 3 + 1}`,
  pincode: `6000${index + 10}`,
  marketerName: `Marketer ${index % 4 + 1}`,
  paymentTerms: index % 2 === 0 ? 'Monthly' : 'Quarterly',
  emiAmount: 1000 + index * 250,
  duration: `${6 + index % 6} months`,
}));

export const _mods = [...Array(12)].map((_, index) => ({
  id: `MOD-${100 + index}`,
  name: `MOD ${index + 1}`,
  headBy: `Leader ${index % 3 + 1}`,
  head: `Head ${index + 1}`,
  phoneNumber: `98765432${(10 + index) % 100}`,
  address: `Address Block ${index + 1}`,
  status: index % 2 === 0 ? 'active' : 'inactive',
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && 'sale') || ([4, 8, 12].includes(setIndex) && 'new') || '',
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/flags/ic-flag-de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

export const _traffic = [
  {
    value: 'facebook',
    label: 'Facebook',
    total: 19500,
  },
  {
    value: 'google',
    label: 'Google',
    total: 91200,
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    total: 69800,
  },
  {
    value: 'twitter',
    label: 'Twitter',
    total: 84900,
  },
];

export const _tasks = Array.from({ length: 5 }, (_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: 'answered to your comment on the Minimal',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'friend-interactive',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'You have new message',
    description: '5 unread messages',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(5),
    isUnRead: false,
  },
];
