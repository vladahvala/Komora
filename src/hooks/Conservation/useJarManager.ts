import { useEffect, useState } from 'react';

/**
 * Custom hook for managing jar counts and related data for a conservation item.
 * Handles selected year, jar counts per year, drafts, total counts, expiration,
 * and provides helper functions to update counts and switch years.
 */

export type JarCounts = {
  jar2_3l: number;
  jar4_2l: number;
  jar7_15l: number;
  jar2_1l: number;
  jar1_05l: number;
};

const emptyJarCounts: JarCounts = {
  jar2_3l: 0,
  jar4_2l: 0,
  jar7_15l: 0,
  jar2_1l: 0,
  jar1_05l: 0,
};

export const useJarManager = (currentItem: any) => {
  const [selectedYear, setSelectedYear] = useState<string>('2021');
  const [jarCounts, setJarCounts] = useState<JarCounts>(emptyJarCounts);
  const [drafts, setDrafts] = useState<Record<string, JarCounts>>({});
  const [period, setPeriod] = useState<number>(0);

  // when currentItem appears
  useEffect(() => {
    if (!currentItem) return;

    const years = Object.keys(currentItem.history);
    const firstYear = years[0] ?? '2021';

    setSelectedYear(firstYear);

    const counts =
      currentItem.history[firstYear]?.jarCounts ?? emptyJarCounts;

    setJarCounts(counts);
    setPeriod(currentItem.history[firstYear]?.period ?? 0);
  }, [currentItem]);

  // year change
  useEffect(() => {
    if (!currentItem) return;

    const counts =
      currentItem.history[selectedYear]?.jarCounts ?? emptyJarCounts;

    setJarCounts(counts);
    setPeriod(currentItem.history[selectedYear]?.period ?? 0);
  }, [selectedYear, currentItem]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);

    if (drafts[year]) {
      setJarCounts(drafts[year]);
      setPeriod(currentItem?.history[year]?.period ?? 0);
    } else if (currentItem?.history[year]) {
      setJarCounts(currentItem.history[year].jarCounts);
      setPeriod(currentItem.history[year].period);
    } else {
      setJarCounts(emptyJarCounts);
      setPeriod(0);
    }
  };

  const updateJarCount = (key: keyof JarCounts, newCount: number) => {
    setJarCounts(prev => {
      const updated = { ...prev, [key]: newCount };

      setDrafts(d => ({
        ...d,
        [selectedYear]: updated,
      }));

      return updated;
    });
  };

  const totalJarsCurrentYear = Object.values(jarCounts).reduce(
    (sum, v) => sum + v,
    0
  );

  const totalJarsAllYears = currentItem
    ? Object.entries(currentItem.history).reduce((sum, [year, yearData]: any) => {
        const dataToCount =
          drafts[year] ?? yearData.jarCounts ?? emptyJarCounts;

        const yearSum = Object.values(dataToCount).reduce(
          (s, val) => s + val,
          0
        );

        return sum + yearSum;
      }, 0)
    : 0;

  const selectedHistory = currentItem?.history[selectedYear];

  const expirationYear = selectedHistory
    ? Number(selectedYear) + selectedHistory.period
    : null;

  const isExpired = expirationYear
    ? new Date().getFullYear() > expirationYear
    : false;

  return {
    // Selected Year
    selectedYear,
  
    // Jar Counts for the Selected Year 
    jarCounts,
    setJarCounts,
    updateJarCount,
  
    // Year Management
    handleYearChange,
  
    // Totals 
    totalJarsCurrentYear,
    totalJarsAllYears,
  
    // Expiration Info 
    expirationYear,
    isExpired,
  
    // Drafts (unsaved changes per year) 
    drafts,
    setDrafts,
  };
};
