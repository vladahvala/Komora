import { addConservationLogic, deleteConservationLogic } from '../conservationLogic';

describe('Conservation Logic', () => {
  const baseItem = {
    name: 'Apple',
    category: 'Fruits',
    imageUri: null,
    history: {
      '2024': {
        jarCounts: {
          jar2_3l: 1,
          jar4_2l: 1,
          jar7_15l: 1,
          jar2_1l: 1,
          jar1_05l: 1,
        },
        period: 1,
      },
    },
  };

  it('adds new conservation', () => {
    const result = addConservationLogic([], baseItem as any);

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Apple');
  });

  it('merges existing conservation by name', () => {
    const initial = [baseItem];

    const updatedItem = {
      ...baseItem,
      history: {
        '2024': {
          jarCounts: {
            jar2_3l: 1,
            jar4_2l: 1,
            jar7_15l: 0,
            jar2_1l: 0,
            jar1_05l: 0,
          },
          period: 1,
        },
      },
    };

    const result = addConservationLogic(initial, updatedItem as any);

    expect(result.length).toBe(1);
    expect(result[0].history['2024'].jarCounts.jar2_3l).toBe(2);
  });

  it('deletes conservation', () => {
    const initial = [baseItem];

    const result = deleteConservationLogic(initial, 'Apple');

    expect(result.length).toBe(0);
  });
});