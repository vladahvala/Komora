import { addOtherLogic, deleteOtherLogic } from '../othersLogic';

describe('Others Logic', () => {
  const item = {
    name: 'Apple',
    imageUri: null,
    count: 2,
    date: '2026-01-01',
  };

  it('adds new item', () => {
    const result = addOtherLogic([], item);

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Apple');
    expect(result[0].totalCount).toBe(2);
  });

  it('updates existing item same date', () => {
    const initial = addOtherLogic([], item);

    const updated = addOtherLogic(initial, {
      ...item,
      count: 3,
    });

    expect(updated[0].totalCount).toBe(5);
  });

  it('deletes item', () => {
    const initial = addOtherLogic([], item);

    const result = deleteOtherLogic(initial, 'Apple');

    expect(result.length).toBe(0);
  });
});