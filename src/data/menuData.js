export const PIZZAS = [
  { id: 1, name: 'Margherita Classica', emoji: '🍕', cat: 'classic', price: 11.99, desc: 'San Marzano tomato, fior di latte mozzarella, fresh basil & extra virgin olive oil.', popular: true, veg: true },
  { id: 2, name: 'Diavola', emoji: '🌶️', cat: 'classic', price: 14.99, desc: 'Spicy Italian salami, chilli flakes, mozzarella & tomato base. Fiery kick.', popular: false, veg: false },
  { id: 3, name: 'Quattro Formaggi', emoji: '🧀', cat: 'specialty', price: 15.99, desc: 'Four Italian cheeses: mozzarella, gorgonzola, taleggio & parmigiano reggiano.', popular: true, veg: true },
  { id: 4, name: 'Prosciutto e Funghi', emoji: '🍄', cat: 'classic', price: 15.49, desc: 'Parma ham, portobello mushrooms, mozzarella & truffle oil drizzle.', popular: false, veg: false },
  { id: 5, name: 'Burrata Truffle', emoji: '🌿', cat: 'specialty', price: 18.99, desc: 'Fresh burrata, black truffle, wild rocket, cherry tomatoes & aged balsamic.', popular: true, veg: true },
  { id: 6, name: 'BBQ Chicken Inferno', emoji: '🔥', cat: 'specialty', price: 16.49, desc: 'Slow-cooked BBQ chicken, red onion, jalapeños, coriander & smoky BBQ base.', popular: false, veg: false },
  { id: 7, name: 'Spinaci & Ricotta', emoji: '🥬', cat: 'veggie', price: 13.49, desc: 'Creamy ricotta, wilted spinach, garlic, pine nuts & lemon zest on olive oil base.', popular: false, veg: true },
  { id: 8, name: 'Roasted Veggie Medley', emoji: '🫑', cat: 'veggie', price: 14.49, desc: 'Roasted peppers, courgette, aubergine, red onion, olives & pesto drizzle.', popular: false, veg: true },
  { id: 9, name: 'Nduja & Honey', emoji: '🍯', cat: 'specialty', price: 17.49, desc: 'Spreadable Calabrian nduja, stracciatella, chilli honey & rosemary on white base.', popular: true, veg: false },
];

export const SIZES = [
  { label: 'Personal', size: '7"', price: 0 },
  { label: 'Medium', size: '10"', price: 3 },
  { label: 'Large', size: '12"', price: 5 },
  { label: 'XL', size: '14"', price: 7 },
];

export const CRUSTS = [
  { label: 'Classic Thin', price: 0 },
  { label: 'Sourdough', price: 1.5 },
  { label: 'Stuffed Crust', price: 2.5 },
  { label: 'Gluten Free', price: 2 },
];

export const EXTRA_TOPPINGS = [
  'Extra Cheese', 'Pepperoni', 'Mushrooms', 'Olives',
  'Jalapeños', 'Red Onion', 'Rocket', 'Truffle Oil',
  'Anchovies', 'Sun-dried Tomato',
];

export const TRACK_STEPS = [
  { icon: '📋', name: 'Order Received', desc: 'Your order is confirmed & sent to kitchen.' },
  { icon: '👨‍🍳', name: 'Preparing', desc: 'Chef is hand-stretching your dough.' },
  { icon: '🔥', name: 'In the Oven', desc: 'Wood-fired at 450°C for perfection.' },
  { icon: '📦', name: 'Ready for Pickup', desc: 'Boxed hot & ready to dispatch.' },
  { icon: '🛵', name: 'Out for Delivery', desc: 'Your rider is on the way!' },
  { icon: '🏠', name: 'Delivered!', desc: 'Enjoy your pizza. Buon appetito!' },
];

export const CATEGORIES = ['all', 'classic', 'specialty', 'veggie'];

