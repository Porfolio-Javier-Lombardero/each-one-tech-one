import { DateFilterType } from "@/lib/types/d.news.types";


// Obtiene el inicio del día actual (00:00:00)
export const todayStart = (): string => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

// Obtiene el final del día actual (23:59:59)
export const todayEnd = (): string => {
  const date = new Date();
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

// Obtiene el inicio de ayer (00:00:00)
export const yesterdayStart = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

// Obtiene el final de ayer (23:59:59)
export const yesterdayEnd = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

// Obtiene la fecha de hace 9 días (00:00:00) - para older
export const lastWeekStart = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 9);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

// Obtiene la fecha de hace 2 días al final del día (23:59:59) - antes de ayer
export const lastWeekEnd = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 2);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

// Retorna el rango de fechas según el filtro {after, before}
export interface DateRange {
  after: string;
  before?: string;
}

export const getDateRangeByFilter = (filter: DateFilterType): DateRange => {
  switch (filter) {
    case 'yesterday':
      return {
        after: yesterdayStart(),
        before: yesterdayEnd()
      };
    case 'lastWeek':
      return {
        after: lastWeekStart(),
        before: lastWeekEnd()
      };
    case 'today':
    default:
      return {
        after: todayStart()
        // No before - hasta ahora
      };
  }
};