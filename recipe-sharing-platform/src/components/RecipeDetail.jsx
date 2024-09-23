
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import data from '../data.json';

export default function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const recipeData = data.find((recipe) => recipe.id === parseInt(id));
        setRecipe(recipeData);
    }, [id]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-8 ">
            <h1 className="text-4xl font-bold my-8">{recipe.title}</h1>
            <img src={recipe.image} alt={recipe.title} className="w-full h-80 object-cover rounded-lg mb-4 shadow-md" />
            <p className="text-gray-400 mb-4">{recipe.summary}</p>
            <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside">
                {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="mb-2">{instruction}</li>
                ))}
            </ol>
        </div>
    );
}
