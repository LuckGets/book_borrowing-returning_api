const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const ROLE = {
  user: 'user',
  admin: 'admin',
};

const users = [
  {
    name: 'jackie',
    email: 'jackie@mail.com',
    password: 'qwerty',
    phone: '0112223456',
    role: ROLE.user,
  },
  {
    name: 'john',
    email: 'john@mail.com',
    password: 'qwerty',
    phone: '0112224567',
    role: ROLE.user,
  },
  {
    name: 'josh',
    email: 'josh@mail.com',
    password: 'qwerty',
    phone: '0112274567',
    role: ROLE.user,
  },
  {
    name: 'bobbie',
    email: 'bobbie@mail.com',
    password: 'qwerty',
    phone: '0752224567',
    role: ROLE.user,
  },
  {
    name: 'admin001',
    email: 'admin001@mail.com',
    password: 'qwerty',
    phone: '0236597885',
    role: ROLE.admin,
  },
];

const books = [
  {
    name: 'First Book',
    author: 'John Doe',
    description: 'The book which is the first one',
  },
  {
    name: 'Second Book',
    author: 'Jane Doe',
    description: 'The book which is the second one',
  },
  {
    name: 'Third Book',
    author: 'Jack Doe',
    description: 'The book which is the third one',
  },
  {
    name: 'Fourth Book',
    author: 'Jonny Doe',
    description: 'The book which is the fourth one',
  },
  {
    name: 'Fifth Book',
    author: 'Bobby Doe',
    description: 'The book which is the fifth one',
  },
];

const categories = [
  {
    name: 'Action',
  },
  {
    name: 'Sci-fi',
  },
  {
    name: 'Horror',
  },
  {
    name: 'Thriller',
  },
];

const bookCategories = [
  {
    bookId: 1,
    categoryId: 1,
  },
  {
    bookId: 1,
    categoryId: 2,
  },
  {
    bookId: 1,
    categoryId: 3,
  },
  {
    bookId: 2,
    categoryId: 2,
  },
  {
    bookId: 2,
    categoryId: 4,
  },
  {
    bookId: 3,
    categoryId: 1,
  },
  {
    bookId: 3,
    categoryId: 2,
  },
  {
    bookId: 3,
    categoryId: 4,
  },
  {
    bookId: 4,
    categoryId: 1,
  },
  {
    bookId: 5,
    categoryId: 1,
  },
  {
    bookId: 5,
    categoryId: 2,
  },
  {
    bookId: 5,
    categoryId: 3,
  },
  {
    bookId: 5,
    categoryId: 4,
  },
];

const borrows = [
  {
    userId: 1,
    bookId: 1,
    returnDate: new Date(2024, 7, 11),
  },
  {
    userId: 2,
    bookId: 1,
    returnDate: new Date(2024, 7, 13),
  },
  {
    userId: 3,
    bookId: 1,
    returnDate: new Date(2024, 7, 15),
  },
  {
    userId: 4,
    bookId: 2,
    returnDate: new Date(2024, 7, 10),
  },
  {
    userId: 2,
    bookId: 2,
    returnDate: new Date(2024, 7, 21),
  },
  {
    userId: 1,
    bookId: 4,
    returnDate: new Date(2024, 8, 12),
  },
  {
    userId: 3,
    bookId: 4,
    returnDate: new Date(2024, 8, 19),
  },
  {
    userId: 2,
    bookId: 5,
    returnDate: new Date(2024, 8, 20),
  },
];

async function seeding() {
  const password = await bcrypt.hash('qwerty', Number(process.env.BCRYPT_SALT));
  users.forEach((el) => (el.password = password));

  await prisma.user.createMany({ data: users });
  await prisma.book.createMany({ data: books });
  await prisma.category.createMany({ data: categories });
  await prisma.bookCategory.createMany({
    data: bookCategories,
  });
  await prisma.borrow.createMany({ data: borrows });
  console.log('Seeding successful');
}

module.exports = { seeding };
