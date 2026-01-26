import { DateFilterType } from "@/lib/types/d.news.types";


// Obtiene el momento actual (ahora)
export const todayEnd = (): string => {
  return new Date().toISOString();
};

// Obtiene 26 horas antes del momento actual
export const todayStart = (): string => {
  const date = new Date();
  const hours = date.getUTCHours();
  date.setUTCHours(hours - 26);
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

// Obtiene el inicio de hace 7 días (00:00:00) - para rangos extendidos
export const sevenDaysAgoStart = (): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 7);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

// Retorna el rango de fechas según el filtro {after, before}
export interface DateRange {
  after: string;
  before: string; // Ya no es opcional
}

export const getDateRangeByFilter = (
  filter: DateFilterType,
  topic?: number | string
): DateRange => {
  // Excepción para Smartphones: extender rango a 7 días
  const isSmartphoneSearch = typeof topic === 'string' && (
    topic.toLowerCase().includes('smartphone') ||
    topic.toLowerCase().includes('iphone') ||
    topic.toLowerCase().includes('android')
  );

  switch (filter) {
    case "all":
      return {
        after: lastWeekStart(),
        before: todayEnd()
      };
    case 'yesterday':
      // Si es Smartphones, usar rango de 7 días
      if (isSmartphoneSearch) {
        return {
          after: sevenDaysAgoStart(),
          before: todayEnd()
        };
      }
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
      // Si es Smartphones, usar rango de 7 días
      if (isSmartphoneSearch) {
        return {
          after: sevenDaysAgoStart(),
          before: todayEnd()
        };
      }
      return {
        after: todayStart(),
        before: todayEnd()
      };
  }
};