import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../data.json";


export default function HomePage() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        setRecipes(data);
    }, []);

    return (
        <div className="container mx-auto p-4 hover:shadow-md text-center">
            <h1 className="text-3xl font-bold my-4 sm:mb-8 sm:text-5xl">Recipe Sharing App</h1>
            <Link to="/add-recipe" className="text-blue-500 hover:underline mb-8 block">Add New Recipe</Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-md p-4">
                        <img src={recipe.image} alt={recipe.title} className="w-full h-32 sm:h-52 object-cover rounded-lg" />
                        <h2 className="text-gray-900 text-xl sm:text-2xl font-semibold mt-2 hover:text-green-600">{recipe.title}</h2>
                        <p className="text-gray-600 sm:text-lg">{recipe.summary}</p>
                        <Link to={`/recipe/${recipe.id}`} className="text-blue-500 hover:underline mt-2 block">View Recipe</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}