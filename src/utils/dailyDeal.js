import db from "./database.js";


function resolveImagePath(imageName) {
  if (!imageName) return null;

  if (imageName.toLowerCase().includes("png") && imageName.match(/^\d/)) {
    return `/uploads/${imageName}`;
  }

  const drinkNames = ["cola", "pepsi", "fanta", "sprite", "juice", "red_bull", "apple", "orange"];
  if (drinkNames.some(name => imageName.toLowerCase().includes(name))) {
    return `/kuvat/juomat/${imageName}`;
  }

  return `/kuvat/${imageName}`;
}


export async function getTodayDeal() {
  try {
    const today = new Date().toISOString().slice(0, 10); 

    const [existing] = await db.query(
      `SELECT * FROM daily_deals WHERE deal_date = ?`,
      [today]
    );

    if (existing.length > 0) {
      const deal = existing[0];

      const [pizzaRows] = await db.query(
        `SELECT id, name, base_price, image FROM menu_items WHERE id = ?`,
        [deal.pizza_id]
      );

      const [drinkRows] = await db.query(
        `SELECT d.id, d.name, d.image, ds.price
         FROM drinks d
         LEFT JOIN drink_sizes ds ON d.id = ds.drink_id
         WHERE d.id = ? AND ds.size = 'Small'`,
        [deal.drink_id]
      );

      return {
        date: today,
        pizza: {
          ...pizzaRows[0],
          image: resolveImagePath(pizzaRows[0].image)
        },
        drink: {
          ...drinkRows[0],
          image: resolveImagePath(drinkRows[0].image)
        },
        discount: deal.discount
      };
    }

    const [pizzas] = await db.query(
      `SELECT id, name, base_price, image 
       FROM menu_items ORDER BY RAND() LIMIT 1`
    );
    const pizza = pizzas[0];

    const [drinks] = await db.query(
      `SELECT d.id, d.name, d.image, ds.price
       FROM drinks d
       LEFT JOIN drink_sizes ds ON d.id = ds.drink_id
       WHERE ds.size = 'Small'
       ORDER BY RAND()
       LIMIT 1`
    );
    const drink = drinks[0];

    if (!pizza) throw new Error("No pizzas found in menu_items table!");
    if (!drink) throw new Error("No drinks with size 'Small' found!");

    const discount = 20;

    await db.query(
      `INSERT INTO daily_deals (deal_date, pizza_id, drink_id, discount)
       VALUES (?, ?, ?, ?)`,
      [today, pizza.id, drink.id, discount]
    );

    return {
      date: today,
      pizza: {
        ...pizza,
        image: resolveImagePath(pizza.image)
      },
      drink: {
        ...drink,
        image: resolveImagePath(drink.image)
      },
      discount
    };
  } catch (error) {
    console.error("DAILY DEAL ERROR:", error);
    return { error: "Daily deal failed" };
  }
}
