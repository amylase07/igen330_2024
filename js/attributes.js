// const attributesData = {
//     genders: ['Men', 'Women', 'Girls', 'Boys', 'Unisex'],
//     subcategories: ['Topwear', 'Bottomwear', 'Innerwear', 'Dress', 'Loungewear and Nightwear'],
//     articleTypes: [
//         'Shirts', 'Jeans', 'Track Pants', 'Tshirts', 'Tops', 'Sweatshirts', 
//         'Waistcoat', 'Shorts', 'Innerwear Vests', 'Rain Jacket', 'Dresses', 
//         'Night suits', 'Skirts', 'Blazers', 'Shrug', 'Camisoles', 'Capris', 
//         'Tunics', 'Jackets', 'Lounge Pants', 'Sweaters', 'Tracksuits', 
//         'Swimwear', 'Nightdress', 'Leggings', 'Jumpsuit', 'Suspenders', 
//         'Stockings', 'Kurtas', 'Tights', 'Lounge Tshirts', 'Lounge Shorts', 
//         'Shapewear', 'Jeggings', 'Rompers', 'Belts', 'Kurtis', 
//         'Rain Trousers', 'Suits'
//     ],
//     baseColours: [
//         'Navy Blue', 'Blue', 'Black', 'Grey', 'Purple', 'White', 'Green', 
//         'Brown', 'Pink', 'Red', 'Off White', 'Coffee Brown', 'Yellow', 
//         'Charcoal', 'Beige', 'Maroon', 'Cream', 'Olive', 'Magenta', 
//         'Burgundy', 'Grey Melange', 'Orange', 'Lime Green', 'Teal', 
//         'Rust', 'Multi', 'Peach', 'Lavender', 'Mustard', 'Khaki', 
//         'Mauve', 'Skin', 'Turquoise Blue', 'Sea Green', 'Mushroom Brown', 
//         'NA', 'Tan', 'Gold', 'Nude', 'Silver', 'Fluorescent Green', 
//         'Taupe'
//     ],
//     seasons: ['Fall', 'Summer', 'Winter', 'Spring'],
//     usages: ['Casual', 'Formal', 'Sports', 'NA', 'Smart Casual', 'Party', 'Travel']
// };

// function generateRandomAttributes() {
//     return {
//         gender: attributesData.genders[Math.floor(Math.random() * attributesData.genders.length)],
//         subcategory: attributesData.subcategories[Math.floor(Math.random() * attributesData.subcategories.length)],
//         articleType: attributesData.articleTypes[Math.floor(Math.random() * attributesData.articleTypes.length)],
//         baseColour: attributesData.baseColours[Math.floor(Math.random() * attributesData.baseColours.length)],
//         season: attributesData.seasons[Math.floor(Math.random() * attributesData.seasons.length)],
//         usage: attributesData.usages[Math.floor(Math.random() * attributesData.usages.length)]
//     };
// }

const attributesData = {
    genders: ['Men', 'Women', 'Girls', 'Boys', 'Unisex'],
    subcategories: ['Topwear', 'Bottomwear', 'Innerwear', 'Dress', 'Loungewear and Nightwear'],
    articleTypes: [
        'Shirts', 'Jeans', 'Track Pants', 'Tshirts', 'Tops', 'Sweatshirts', 
        'Waistcoat', 'Shorts', 'Innerwear Vests', 'Rain Jacket', 'Dresses', 
        'Night suits', 'Skirts', 'Blazers', 'Shrug', 'Camisoles', 'Capris', 
        'Tunics', 'Jackets', 'Lounge Pants', 'Sweaters', 'Tracksuits', 
        'Swimwear', 'Nightdress', 'Leggings', 'Jumpsuit', 'Suspenders', 
        'Stockings', 'Kurtas', 'Tights', 'Lounge Tshirts', 'Lounge Shorts', 
        'Shapewear', 'Jeggings', 'Rompers', 'Belts', 'Kurtis', 
        'Rain Trousers', 'Suits'
    ],
    baseColours: [
        'Navy Blue', 'Blue', 'Black', 'Grey', 'Purple', 'White', 'Green', 
        'Brown', 'Pink', 'Red', 'Off White', 'Coffee Brown', 'Yellow', 
        'Charcoal', 'Beige', 'Maroon', 'Cream', 'Olive', 'Magenta', 
        'Burgundy', 'Grey Melange', 'Orange', 'Lime Green', 'Teal', 
        'Rust', 'Multi', 'Peach', 'Lavender', 'Mustard', 'Khaki', 
        'Mauve', 'Skin', 'Turquoise Blue', 'Sea Green', 'Mushroom Brown', 
        'NA', 'Tan', 'Gold', 'Nude', 'Silver', 'Fluorescent Green', 
        'Taupe'
    ],
    seasons: ['Fall', 'Summer', 'Winter', 'Spring'],
    usages: ['Casual', 'Formal', 'Sports', 'NA', 'Smart Casual', 'Party', 'Travel']
};

function generateRandomAttributes() {
    return {
        gender: attributesData.genders[Math.floor(Math.random() * attributesData.genders.length)],
        subcategory: attributesData.subcategories[Math.floor(Math.random() * attributesData.subcategories.length)],
        articleType: attributesData.articleTypes[Math.floor(Math.random() * attributesData.articleTypes.length)],
        baseColour: attributesData.baseColours[Math.floor(Math.random() * attributesData.baseColours.length)],
        season: attributesData.seasons[Math.floor(Math.random() * attributesData.seasons.length)],
        usage: attributesData.usages[Math.floor(Math.random() * attributesData.usages.length)]
    };
}