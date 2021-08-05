const add = (accumulator, a) => accumulator + a;

const getOffersSumPrice = (offers) => (
  offers.map(offer => offer.price).reduce(add, 0)
);

export const tripCost = (tripPoints) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">
    ${tripPoints.map(point => point.basePrice + getOffersSumPrice(point.offers)).reduce(add, 0)}
    </span>
  </p>`
);
