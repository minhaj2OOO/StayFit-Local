export interface singularFoodInterface {
    // image: string,
    id: number,
    name: string,
    amount: number,
    unit: string,
    cal: number,
    fat: number,
    protein: number,
    carb: number,
}
export interface foodInterface {
    sumCal : number,
    sumFat : number,
    sumProtein : number,
    sumCarb : number,
    foods: Array<singularFoodInterface>,
}

export const emptyFood:foodInterface = {
    sumCal : 0,
    sumFat : 0,
    sumProtein : 0,
    sumCarb : 0,
    foods: [],
}
