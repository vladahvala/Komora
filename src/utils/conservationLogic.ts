import { ConservationItem, JarCounts } from '../context/ConservationContext';

export const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, ' ').toLowerCase();

export const addConservationLogic = (
  conservations: ConservationItem[],
  item: ConservationItem
): ConservationItem[] => {
  const normalizedName = normalizeName(item.name);

  const existingIndex = conservations.findIndex(
    c => normalizeName(c.name) === normalizedName
  );

  if (existingIndex !== -1) {
    const existingItem = conservations[existingIndex];
    const newHistory = { ...existingItem.history };

    Object.entries(item.history).forEach(([year, newHistoryItem]) => {
      const newJarCounts = newHistoryItem.jarCounts;

      if (newHistory[year]) {
        newHistory[year] = {
          jarCounts: {
            jar2_3l: newHistory[year].jarCounts.jar2_3l + newJarCounts.jar2_3l,
            jar4_2l: newHistory[year].jarCounts.jar4_2l + newJarCounts.jar4_2l,
            jar7_15l: newHistory[year].jarCounts.jar7_15l + newJarCounts.jar7_15l,
            jar2_1l: newHistory[year].jarCounts.jar2_1l + newJarCounts.jar2_1l,
            jar1_05l: newHistory[year].jarCounts.jar1_05l + newJarCounts.jar1_05l,
          },
          period: newHistory[year].period ?? newHistoryItem.period,
        };
      } else {
        newHistory[year] = newHistoryItem;
      }
    });

    return conservations.map((c, i) =>
      i === existingIndex ? { ...c, history: newHistory } : c
    );
  }

  return [...conservations, item];
};

export const deleteConservationLogic = (
  conservations: ConservationItem[],
  name: string
) => {
  return conservations.filter(c => c.name !== name);
};