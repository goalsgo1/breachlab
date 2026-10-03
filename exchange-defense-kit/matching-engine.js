// Minimal price-time priority matching engine
class MatchingEngine {
  constructor() {
    this.buyBook = [];  // bids: price desc, then time asc
    this.sellBook = []; // asks: price asc, then time asc
    this.fills = [];
  }

  addOrder(side, price, qty) {
    const order = { id: crypto.randomUUID(), side, price, qty, time: Date.now() };
    if (side === 'buy') {
      this.buyBook.push(order);
      this.buyBook.sort((a, b) => b.price - a.price || a.time - b.time);
    } else {
      this.sellBook.push(order);
      this.sellBook.sort((a, b) => a.price - b.price || a.time - b.time);
    }
    this.match();
    return order;
  }

  match() {
    while (this.buyBook.length && this.sellBook.length && this.buyBook[0].price >= this.sellBook[0].price) {
      const buy = this.buyBook[0], sell = this.sellBook[0];
      const qty = Math.min(buy.qty, sell.qty);
      buy.qty -= qty; sell.qty -= qty;
      this.fills.push({ price: sell.price, qty, buyId: buy.id, sellId: sell.id, time: Date.now() });
      if (buy.qty <= 0) this.buyBook.shift();
      if (sell.qty <= 0) this.sellBook.shift();
    }
  }
}

module.exports = { MatchingEngine };
