/*
 * Crea una función que sea capaz de detectar si existe un viernes 13 en el mes y el año indicados.
 * - La función recibirá el mes y el año y retornará verdadero o falso.
 */

const isFriday13 = ({ month, year }: { month?: number, year?: number }): boolean => {
  const fridayNumber: number = 5;
  if (month === undefined && year === undefined) return new Date().getDay() === fridayNumber
  if (year === undefined) return new Date(new Date().getFullYear(), (month as number) - 1, 13).getDay() === fridayNumber
  if (month === undefined) return new Date((year as number), new Date().getMonth(), 13).getDay() === fridayNumber
  return new Date(year, month - 1, 13).getDay() === fridayNumber
}

console.log(isFriday13({ month: 3, year: 2020 }));
console.log(isFriday13({ month: 1, year: 2023 }));
console.log(isFriday13({ month: 2, year: 2023 }));
console.log(isFriday13({ month: 2 }));
console.log(isFriday13({ year: 2023 }));
console.log(isFriday13({}));
