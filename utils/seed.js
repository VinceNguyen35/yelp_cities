const City = require("../models/city");
const Comment = require("../models/comment");

const city_seeds = [
    {
        cityName: 'London',
        countryName: 'United Kingdom',
        continent: 'Europe',
        population: 9541000,
        currencyUsed: 'British Pound',
        description: "I'm baby swag williamsburg intelligentsia, skateboard tbh yr craft beer. Gluten-free lyft irony flannel fashion axe hammock. Tattooed lyft jianbing, beard blog coloring book gentrify. Cloud bread jean shorts vice, knausgaard mumblecore edison bulb la croix quinoa. Swag subway tile locavore post-ironic organic forage.",
        image: 'https://travel.home.sndimg.com/content/dam/images/travel/fullset/2015/05/28/big-ben-london-england.jpg.rend.hgtvcom.1280.960.suffix/1491582155388.jpeg'
    },
    {
        cityName: 'Paris',
        countryName: 'France',
        continent: 'Europe',
        population: 11142000,
        currencyUsed: 'Euro',
        description: "I'm baby swag williamsburg intelligentsia, skateboard tbh yr craft beer. Gluten-free lyft irony flannel fashion axe hammock. Tattooed lyft jianbing, beard blog coloring book gentrify. Cloud bread jean shorts vice, knausgaard mumblecore edison bulb la croix quinoa. Swag subway tile locavore post-ironic organic forage.",
        image: 'https://media.istockphoto.com/photos/eiffel-tower-aerial-view-paris-picture-id1145422105?k=20&m=1145422105&s=612x612&w=0&h=IVTtz9ao9ywd5AltRNbr_K64LeuHeJ68J9ivjpztbEs='
    },
    {
        cityName: 'Rome',
        countryName: 'Italy',
        continent: 'Europe',
        population: 4298000,
        currencyUsed: 'Euro',
        description: "I'm baby swag williamsburg intelligentsia, skateboard tbh yr craft beer. Gluten-free lyft irony flannel fashion axe hammock. Tattooed lyft jianbing, beard blog coloring book gentrify. Cloud bread jean shorts vice, knausgaard mumblecore edison bulb la croix quinoa. Swag subway tile locavore post-ironic organic forage.",
        image: 'https://www.fodors.com/wp-content/uploads/2018/10/HERO_UltimateRome_Hero_shutterstock789412159.jpg'
    },
    {
        cityName: 'Los Angeles',
        countryName: 'United States of America',
        continent: 'North America',
        population: 6000000,
        currencyUsed: 'United States Dollar',
        description: "I'm baby swag williamsburg intelligentsia, skateboard tbh yr craft beer. Gluten-free lyft irony flannel fashion axe hammock. Tattooed lyft jianbing, beard blog coloring book gentrify. Cloud bread jean shorts vice, knausgaard mumblecore edison bulb la croix quinoa. Swag subway tile locavore post-ironic organic forage.",
        image: 'https://a.cdn-hotels.com/gdcs/production114/d1663/e075a04a-0070-4c35-a5bb-61460d2700ae.jpg'
    }
];

const seed = async () => {
    // Delete all the current cities and comments
    await City.deleteMany();
    console.log("Deleted All the Cities!");

    await Comment.deleteMany();
    console.log("Deleted All the Comments!");

    // Create 4 new cities
    // for(const city_seed of city_seeds) {
    //     let city = await City.create(city_seed);
    //     console.log("Created a new city:", city.cityName);

    //     // Create a new comment for each city
    //     await Comment.create({
    //         user: "John Doe",
    //         text: "I LOVED this city!",
    //         cityId: city._id
    //     });
    //     console.log("Created a new comment!");
    // }
};

module.exports = seed;