import { item } from "./types"

export const fridge: item[] = [
    {name: "Strawberries", expireDate: new Date(2025, 9, 16), isEaten: false},
    {name: "Milk", expireDate: new Date(2025, 9, 14), isEaten: false},
    {name: "Eggs", expireDate: new Date(2025, 9, 20), isEaten: false},
    {name: "Pasta Sauce", expireDate: new Date(2026, 2, 10), isEaten: false}
]

export const freezer: item[] = [
    {name: "Chicken Nuggets", expireDate: new Date(2026, 9, 17), isEaten: false},
    {name: "Ice Cream", expireDate: new Date(2025, 12, 20), isEaten: false},
    {name: "Tater Tot", expireDate: new Date(2025, 2, 10), isEaten: false}
]

export const pantry: item[] = [
    {name: "Bread", expireDate: new Date(2025, 10, 20), isEaten: false},
    {name: "Cupcake", expireDate: new Date(2025, 11, 10), isEaten: false},
    {name: "Crackers", expireDate: new Date(2026, 1, 1), isEaten: false},
    {name: "Cereal", expireDate: new Date(2025, 12, 12), isEaten: false}
]

export const groceries = {
    fridge: fridge,
    freezer: freezer,
    pantry: pantry
}
