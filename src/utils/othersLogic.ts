export type HistoryItem = { date: string; count: number };

export type OthersItem = {
  name: string;
  imageUri: string | null;
  totalCount: number;
  history: HistoryItem[];
};

const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, ' ').toLowerCase();

export const addOtherLogic = (prev: OthersItem[], item: any): OthersItem[] => {
  const name = normalizeName(item.name);

  let found = false;

  const updated = prev.map(p => {
    if (normalizeName(p.name) === name) {
      found = true;

      let history = p.history.map(h =>
        h.date === item.date
          ? { ...h, count: h.count + item.count }
          : h
      );

      if (!history.find(h => h.date === item.date)) {
        history.push({ date: item.date, count: item.count });
      }

      return {
        ...p,
        history,
        totalCount: history.reduce((s, h) => s + h.count, 0),
      };
    }
    return p;
  });

  if (!found) {
    updated.push({
      name: item.name,
      imageUri: item.imageUri,
      totalCount: item.count,
      history: [{ date: item.date, count: item.count }],
    });
  }

  return updated;
};

export const deleteOtherLogic = (prev: OthersItem[], name: string) =>
  prev.filter(p => normalizeName(p.name) !== normalizeName(name));