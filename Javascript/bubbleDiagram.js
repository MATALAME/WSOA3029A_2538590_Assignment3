fetch('https://cors-anywhere.herokuapp.com/https://www.fruityvice.com/api/fruit/all')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 
        const fruitList = document.getElementById('fruit-list');
        data.forEach(fruit => {
            const listItem = document.createElement('li');
            listItem.textContent = `${fruit.name} (${fruit.family}) - Calories: ${fruit.nutritions.calories}, Carbs: ${fruit.nutritions.carbohydrates}g, Protein: ${fruit.nutritions.protein}g, Fat: ${fruit.nutritions.fat}g, Sugar: ${fruit.nutritions.sugar}g`;
            fruitList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching fruits:', error);
    });
