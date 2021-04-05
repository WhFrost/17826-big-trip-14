export const createTripCost = (events) => {
  let tripCost = 0;
  let offersCost = 0;
  events.forEach((event) => {
    tripCost += event.cost;
    return tripCost;
  });

  events.forEach((event) => {
    const {offers} = event;
    if (offers.length !== 0) {
      offers.forEach((offer) => {
        offersCost += offer.cost;
        return offersCost;
      });
    }
  });

  const totalCost = tripCost + offersCost;
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span></p>`;
};
