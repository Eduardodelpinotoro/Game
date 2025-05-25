document.addEventListener('DOMContentLoaded', function() {
    // Elementos da DOM
    const ingredientsContainer = document.getElementById('ingredients');
    const potContents = document.getElementById('pot-contents');
    const blenderContents = document.getElementById('blender-contents');
    const cookButton = document.getElementById('cook-button');
    const blendButton = document.getElementById('blend-button');
    const clearButton = document.getElementById('clear-button');
    const clearBlenderButton = document.getElementById('clear-blender-button');
    const fireAnimation = document.getElementById('fire');
    const blenderAnimation = document.getElementById('blender-animation');
    const recipeResult = document.getElementById('recipe-result');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const cookingMode = document.getElementById('cooking-mode');
    const blendingMode = document.getElementById('blending-mode');
    const fryingMode = document.getElementById('frying-mode');
    const microwaveMode = document.getElementById('microwave-mode');
    const createIngredientBtn = document.getElementById('create-ingredient-btn');
    const generateImageBtn = document.getElementById('generate-image-btn');
    const customIngredientsContainer = document.getElementById('custom-ingredients');
    const categoryContainer = document.getElementById('category-container');
    const prevButton = document.getElementById('prev-category');
    const nextButton = document.getElementById('next-category');
    const categoryTitle = document.getElementById('category-title');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const foodCritic = document.getElementById('food-critic');
    const criticMessage = document.getElementById('critic-message');
    const dishDisplay = document.getElementById('dish-display');
    const languageSelect = document.getElementById('language-select');
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');
    const toggleFridge = document.getElementById('toggle-fridge');
    const fridgeContent = document.getElementById('fridge-content');
    const fridgeToggleIcon = document.getElementById('fridge-toggle-icon');
    const toggleAI = document.getElementById('toggle-ai');
    const aiContent = document.getElementById('ai-content');
    const aiToggleIcon = document.getElementById('ai-toggle-icon');
    const toggleIngredient = document.getElementById('toggle-ingredient');
    const ingredientContent = document.getElementById('ingredient-content');
    const ingredientToggleIcon = document.getElementById('ingredient-toggle-icon');
    const quickCreateBtn = document.getElementById('quick-create-ingredient');

    // Dados
    let ingredientsInPot = [];
    let ingredientsInBlender = [];
    let ingredientsInFryingPan = [];
    let ingredientsInMicrowave = [];
    let conversationHistory = [];
    let currentMode = 'cooking'; // 'cooking', 'blending', 'frying' ou 'microwave'
    let customIngredients = [];
    let categories = []; // Array de categorias
    let currentCategoryIndex = 0; // Índice da categoria atual
    let preparedDishes = []; // Array de pratos preparados

    // Categorias iniciais
    const initialCategories = [
        {
            name: "Carnes e Proteínas",
            emoji: "🥩",
            ingredients: ['🥩', '🍗', '🐟', '🥚']
        },
        {
            name: "Vegetais",
            emoji: "🥕",
            ingredients: ['🥔', '🍅', '🥕', '🧅', '🥦', '🌽']
        },
        {
            name: "Acompanhamentos",
            emoji: "🍚",
            ingredients: ['🍚', '🧀', '🍄', '🌶️', '🧄', '🍆']
        },
        {
            name: "Frutas",
            emoji: "🍎",
            ingredients: ['🍎', '🍌', '🍓', '🍊']
        },
        {
            name: "Extras",
            emoji: "🧂",
            ingredients: ['🧂', '🧈', '🧉', '🍯', '🍶', '🫒']
        }
    ];

    // Setup inicial de categorias
    function setupCategories() {
        categories = [...initialCategories];
        updateCategoryDisplay();
    }

    // Atualizar exibição da categoria atual
    function updateCategoryDisplay() {
        const currentCategory = categories[currentCategoryIndex];
        const translatedCategoryName = translations[currentLanguage].categories[currentCategory.name] || currentCategory.name;
        
        categoryTitle.textContent = `${currentCategory.emoji} ${translatedCategoryName}`;
        
        // Limpar grid de ingredientes
        ingredientsContainer.innerHTML = '';
        
        // Adicionar ingredientes da categoria atual
        currentCategory.ingredients.forEach(emoji => {
            const ingredientEl = document.createElement('div');
            ingredientEl.className = 'ingredient';
            
            // Verificar se é um ingrediente com imagem
            const customIngredient = customIngredients.find(i => i.emoji === emoji);
            
            if (customIngredient && customIngredient.imageUrl) {
                ingredientEl.innerHTML = `
                    <div class="ingredient-image">
                        <img src="${customIngredient.imageUrl}" alt="${customIngredient.name}">
                    </div>
                    <div class="ingredient-emoji">${emoji}</div>
                    <div class="ingredient-name">${getIngredientName(emoji)}</div>
                `;
            } else {
                ingredientEl.innerHTML = `
                    <div class="ingredient-emoji">${emoji}</div>
                    <div class="ingredient-name">${getIngredientName(emoji)}</div>
                `;
            }
            
            // Adicionar o nome do ingrediente como título
            const ingredientName = getIngredientName(emoji);
            ingredientEl.title = ingredientName;
            
            ingredientEl.addEventListener('click', () => addToPot(emoji));
            ingredientsContainer.appendChild(ingredientEl);
        });
    }

    // Navegação entre categorias
    function nextCategory() {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        updateCategoryDisplay();
    }

    function prevCategory() {
        currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
        updateCategoryDisplay();
    }

    // Função para obter o nome do ingrediente com base no emoji
    function getIngredientName(emoji) {
        const t = translations[currentLanguage].ingredientNames;
        
        // Verificar se é um ingrediente personalizado
        const customIngredient = customIngredients.find(i => i.emoji === emoji);
        if (customIngredient) {
            return customIngredient.name;
        }
        
        return t[emoji] || 'Ingrediente';
    }
    
    // Adicionar ingrediente ao utensílio atual
    function addToPot(ingredient) {
        if (currentMode === 'cooking') {
            if (ingredientsInPot.length < 8) {
                ingredientsInPot.push(ingredient);
                updatePotContents();
            } else {
                addMessage(translations[currentLanguage].panFullMessage, 'ai');
            }
        } else if (currentMode === 'blending') {
            if (ingredientsInBlender.length < 5) {
                ingredientsInBlender.push(ingredient);
                updateBlenderContents();
            } else {
                addMessage(translations[currentLanguage].blenderFullMessage, 'ai');
            }
        } else if (currentMode === 'frying') {
            if (ingredientsInFryingPan.length < 6) {
                ingredientsInFryingPan.push(ingredient);
                updateFryingPanContents();
            } else {
                addMessage(translations[currentLanguage].fryingPanFullMessage, 'ai');
            }
        } else if (currentMode === 'microwave') {
            if (ingredientsInMicrowave.length < 4) {
                ingredientsInMicrowave.push(ingredient);
                updateMicrowaveContents();
            } else {
                addMessage(translations[currentLanguage].microwaveFullMessage, 'ai');
            }
        }
    }

    // Atualizar conteúdo da panela
    function updatePotContents() {
        potContents.innerHTML = '';
        ingredientsInPot.forEach(ingredient => {
            const ingredientEl = document.createElement('span');
            ingredientEl.textContent = ingredient;
            ingredientEl.style.fontSize = '16px';
            potContents.appendChild(ingredientEl);
        });
    }

    // Atualizar conteúdo do liquidificador
    function updateBlenderContents() {
        blenderContents.innerHTML = '';
        ingredientsInBlender.forEach(ingredient => {
            const ingredientEl = document.createElement('span');
            ingredientEl.textContent = ingredient;
            ingredientEl.style.fontSize = '16px';
            blenderContents.appendChild(ingredientEl);
        });
    }

    // Atualizar conteúdo da frigideira
    function updateFryingPanContents() {
        const fryingPanContents = document.getElementById('frying-pan-contents');
        fryingPanContents.innerHTML = '';
        ingredientsInFryingPan.forEach(ingredient => {
            const ingredientEl = document.createElement('span');
            ingredientEl.textContent = ingredient;
            ingredientEl.style.fontSize = '16px';
            fryingPanContents.appendChild(ingredientEl);
        });
    }

    // Atualizar conteúdo do microondas
    function updateMicrowaveContents() {
        const microwaveContents = document.getElementById('microwave-contents');
        microwaveContents.innerHTML = '';
        ingredientsInMicrowave.forEach(ingredient => {
            const ingredientEl = document.createElement('span');
            ingredientEl.textContent = ingredient;
            ingredientEl.style.fontSize = '16px';
            microwaveContents.appendChild(ingredientEl);
        });
    }

    // Limpar panela
    function clearPot() {
        ingredientsInPot = [];
        potContents.innerHTML = '';
        fireAnimation.classList.remove('active');
        recipeResult.innerHTML = `<p>${translations[currentLanguage].addIngredientsPrompt}</p>`;
        document.getElementById('dish-plate').style.display = 'none';
        foodCritic.style.display = 'none';
    }

    // Limpar liquidificador
    function clearBlender() {
        ingredientsInBlender = [];
        blenderContents.innerHTML = '';
        blenderAnimation.classList.remove('active');
        recipeResult.innerHTML = `<p>${translations[currentLanguage].addIngredientsPrompt}</p>`;
        document.getElementById('dish-plate').style.display = 'none';
        foodCritic.style.display = 'none';
    }

    // Limpar frigideira
    function clearFryingPan() {
        ingredientsInFryingPan = [];
        document.getElementById('frying-pan-contents').innerHTML = '';
        document.getElementById('frying-animation').classList.remove('active');
        recipeResult.innerHTML = `<p>${translations[currentLanguage].addIngredientsPrompt}</p>`;
        document.getElementById('dish-plate').style.display = 'none';
        foodCritic.style.display = 'none';
    }

    // Limpar microondas
    function clearMicrowave() {
        ingredientsInMicrowave = [];
        document.getElementById('microwave-contents').innerHTML = '';
        document.getElementById('microwave-animation').classList.remove('active');
        recipeResult.innerHTML = `<p>${translations[currentLanguage].addIngredientsPrompt}</p>`;
        document.getElementById('dish-plate').style.display = 'none';
        foodCritic.style.display = 'none';
    }

    // Cozinhar
    async function cook() {
        if (ingredientsInPot.length === 0) {
            addMessage(translations[currentLanguage].addIngredientsBeforeCooking, 'ai');
            return;
        }

        // Efeito de cozinhar
        fireAnimation.classList.add('active');
        potContents.classList.add('cooking-animation');

        // Desativar botões durante o cozimento
        cookButton.disabled = true;
        clearButton.disabled = true;

        // Perguntar à IA o que está sendo cozinhado
        addMessage('Cozinhando: ' + ingredientsInPot.join(' '), 'user');

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um chef culinário criativo. Com base nos ingredientes (emojis) fornecidos pelo usuário, crie um nome de prato culinário criativo e uma breve descrição do sabor. Seja divertido e imaginativo. Responda com um JSON no formato: {\"nome\": \"Nome do Prato\", \"descricao\": \"Descrição do sabor e textura\", \"emoji\": \"Um emoji que represente o prato final\"}."
                    },
                    {
                        role: "user",
                        content: `Veja quais ingredientes o usuário colocou na panela e crie um prato: ${ingredientsInPot.join(' ')}`
                    }
                ],
                json: true
            });

            const result = JSON.parse(completion.content);
            
            // Gerar imagem do prato
            let dishImage = null;
            try {
                const imageResult = await websim.imageGen({
                    prompt: `Uma foto profissional de comida de um prato chamado ${result.nome}, contendo os seguintes ingredientes: ${ingredientsInPot.map(emoji => getIngredientName(emoji)).join(', ')}. Estilo realista, fundo branco, iluminação profissional.`,
                    aspect_ratio: "1:1"
                });
                dishImage = imageResult.url;
            } catch (error) {
                console.error('Erro ao gerar imagem do prato:', error);
            }

            // Avaliar o prato com o crítico culinário
            const criticCompletion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um crítico culinário famoso e exigente. Avalie este prato com base nos ingredientes e dê uma breve crítica. Seja específico, mencione sabores e texturas. Alterne entre críticas positivas e negativas para diferentes combinações. Responda com um JSON no formato: {\"avaliacao\": \"texto da avaliação\", \"nota\": número entre 1 e 10, \"humor\": \"feliz\", \"triste\" ou \"neutro\"}."
                    },
                    {
                        role: "user",
                        content: `Avalie este prato: ${result.nome}, feito com ${ingredientsInPot.join(' ')}`
                    }
                ],
                json: true
            });

            const criticResult = JSON.parse(criticCompletion.content);

            // Mostrar resultado após um tempo
            setTimeout(() => {
                fireAnimation.classList.remove('active');
                potContents.classList.remove('cooking-animation');

                // Mostrar o prato com a comida
                document.getElementById('dish-plate').style.display = 'block';
                
                // Mostrar o crítico
                showCritic(criticResult.humor, criticResult.avaliacao, criticResult.nota);

                // Construir o HTML para o resultado da receita
                let dishHTML = `
                    <div class="dish-name">${result.nome}</div>
                    <p>${result.descricao}</p>
                    <div class="dish-result">
                `;

                if (dishImage) {
                    dishHTML += `
                        <div class="plate">
                            <img src="${dishImage}" alt="${result.nome}" class="dish-image">
                        </div>
                    `;
                } else {
                    dishHTML += `
                        <div class="plate">
                            <span class="food-emoji">${result.emoji || '🍲'}</span>
                        </div>
                    `;
                }

                dishHTML += `
                        <p>Ingredientes: ${ingredientsInPot.join(' ')}</p>
                    </div>
                `;

                recipeResult.innerHTML = dishHTML;

                // Adicionar o prato à coleção
                addDishToCollection(result.nome, dishImage || result.emoji, 'cozido', ingredientsInPot);

                // Adicionar resposta do chef
                addMessage(`Você criou: ${result.nome}! ${result.descricao}`, 'ai');

                // Reativar botões
                cookButton.disabled = false;
                clearButton.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Erro ao criar receita:', error);
            addMessage('Ops! Algo deu errado ao cozinhar. Tente novamente.', 'ai');
            fireAnimation.classList.remove('active');
            potContents.classList.remove('cooking-animation');
            cookButton.disabled = false;
            clearButton.disabled = false;
        }
    }

    // Bater no liquidificador
    async function blend() {
        if (ingredientsInBlender.length === 0) {
            addMessage(translations[currentLanguage].addFruitsBeforeBlending, 'ai');
            return;
        }

        // Verificar se há pelo menos uma fruta
        const fruitEmojis = ['🍎', '🍌', '🍓', '🍊', '🍋', '🍉', '🥭', '🍇', '🍍', '🥝', '🍒', '🍑', '🍐', '🥥'];
        const hasFruit = ingredientsInBlender.some(ingredient => fruitEmojis.includes(ingredient));

        if (!hasFruit) {
            addMessage(translations[currentLanguage].needFruitForJuice, 'ai');
            return;
        }

        // Efeito de bater
        blenderAnimation.classList.add('active');
        blenderContents.classList.add('blending-animation');

        // Desativar botões durante o processamento
        blendButton.disabled = true;
        clearBlenderButton.disabled = true;

        // Perguntar à IA o que está sendo batido
        addMessage('Batendo: ' + ingredientsInBlender.join(' '), 'user');

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um especialista em sucos e smoothies. Com base nos ingredientes (emojis) fornecidos pelo usuário, crie um nome criativo para o suco/smoothie e uma breve descrição do sabor. Seja divertido e imaginativo. Responda com um JSON no formato: {\"nome\": \"Nome do Suco\", \"descricao\": \"Descrição do sabor e textura\", \"cor\": \"uma cor CSS válida que represente a cor do suco\"}."
                    },
                    {
                        role: "user",
                        content: `Veja quais ingredientes o usuário colocou no liquidificador e crie um suco ou smoothie: ${ingredientsInBlender.join(' ')}`
                    }
                ],
                json: true
            });

            const result = JSON.parse(completion.content);
            
            // Gerar imagem do suco
            let juiceImage = null;
            try {
                const imageResult = await websim.imageGen({
                    prompt: `Uma foto profissional de um copo de suco ou smoothie chamado ${result.nome}, cor ${result.cor}, contendo os seguintes ingredientes: ${ingredientsInBlender.map(emoji => getIngredientName(emoji)).join(', ')}. Estilo realista, fundo branco, iluminação profissional.`,
                    aspect_ratio: "1:1"
                });
                juiceImage = imageResult.url;
            } catch (error) {
                console.error('Erro ao gerar imagem do suco:', error);
            }

            // Avaliar o suco com o crítico
            const criticCompletion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um crítico de bebidas famoso e exigente. Avalie este suco/smoothie com base nos ingredientes e dê uma breve crítica. Seja específico, mencione sabores e texturas. Alterne entre críticas positivas e negativas para diferentes combinações. Responda com um JSON no formato: {\"avaliacao\": \"texto da avaliação\", \"nota\": número entre 1 e 10, \"humor\": \"feliz\", \"triste\" ou \"neutro\"}."
                    },
                    {
                        role: "user",
                        content: `Avalie este suco/smoothie: ${result.nome}, feito com ${ingredientsInBlender.join(' ')}`
                    }
                ],
                json: true
            });

            const criticResult = JSON.parse(criticCompletion.content);

            // Mostrar resultado após um tempo
            setTimeout(() => {
                blenderAnimation.classList.remove('active');
                blenderContents.classList.remove('blending-animation');

                // Mostrar o prato com o suco
                document.getElementById('dish-plate').style.display = 'block';
                
                // Mostrar o crítico
                showCritic(criticResult.humor, criticResult.avaliacao, criticResult.nota);

                // Construir o HTML para o resultado do suco
                let juiceHTML = `
                    <div class="dish-name">${result.nome}</div>
                    <p>${result.descricao}</p>
                    <div class="dish-result">
                `;

                if (juiceImage) {
                    juiceHTML += `
                        <div class="plate">
                            <img src="${juiceImage}" alt="${result.nome}" class="dish-image">
                        </div>
                    `;
                } else {
                    juiceHTML += `
                        <div class="plate">
                            <div class="juice-glass" style="background-color: ${result.cor || '#ff9f43'}">
                                <div class="straw"></div>
                            </div>
                        </div>
                    `;
                }

                juiceHTML += `
                        <p>Ingredientes: ${ingredientsInBlender.join(' ')}</p>
                    </div>
                `;

                recipeResult.innerHTML = juiceHTML;
                
                // Adicionar o suco à coleção
                addDishToCollection(result.nome, juiceImage || 'juice', 'suco', ingredientsInBlender, result.cor);

                // Adicionar resposta do chef
                addMessage(`Você criou: ${result.nome}! ${result.descricao}`, 'ai');

                // Reativar botões
                blendButton.disabled = false;
                clearBlenderButton.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Erro ao criar suco:', error);
            addMessage('Ops! Algo deu errado ao fazer o suco. Tente novamente.', 'ai');
            blenderAnimation.classList.remove('active');
            blenderContents.classList.remove('blending-animation');
            blendButton.disabled = false;
            clearBlenderButton.disabled = false;
        }
    }

    // Fritar na frigideira
    async function fry() {
        if (ingredientsInFryingPan.length === 0) {
            addMessage(translations[currentLanguage].addIngredientsBeforeCooking, 'ai');
            return;
        }

        // Efeito de fritar
        const fryingAnimation = document.getElementById('frying-animation');
        fryingAnimation.classList.add('active');
        const fryingPanContents = document.getElementById('frying-pan-contents');
        fryingPanContents.classList.add('frying-animation');

        // Desativar botões durante o processo
        document.getElementById('fry-button').disabled = true;
        document.getElementById('clear-frying-pan-button').disabled = true;

        // Perguntar à IA o que está sendo fritado
        addMessage('Fritando: ' + ingredientsInFryingPan.join(' '), 'user');

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um chef especializado em frituras. Com base nos ingredientes (emojis) fornecidos pelo usuário, crie um nome de prato frito criativo e uma breve descrição do sabor. Seja divertido e imaginativo. Responda com um JSON no formato: {\"nome\": \"Nome do Prato\", \"descricao\": \"Descrição do sabor e textura\", \"emoji\": \"Um emoji que represente o prato final\"}."
                    },
                    {
                        role: "user",
                        content: `Veja quais ingredientes o usuário colocou na frigideira e crie um prato frito: ${ingredientsInFryingPan.join(' ')}`
                    }
                ],
                json: true
            });

            const result = JSON.parse(completion.content);
            
            // Gerar imagem do prato
            let dishImage = null;
            try {
                const imageResult = await websim.imageGen({
                    prompt: `Uma foto profissional de comida de um prato chamado ${result.nome}, contendo os seguintes ingredientes: ${ingredientsInFryingPan.map(emoji => getIngredientName(emoji)).join(', ')}. Estilo realista, fundo branco, iluminação profissional.`,
                    aspect_ratio: "1:1"
                });
                dishImage = imageResult.url;
            } catch (error) {
                console.error('Erro ao gerar imagem do prato:', error);
            }

            // Avaliar o prato com o crítico culinário
            const criticCompletion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um crítico culinário famoso e exigente. Avalie este prato com base nos ingredientes e dê uma breve crítica. Seja específico, mencione sabores e texturas. Alterne entre críticas positivas e negativas para diferentes combinações. Responda com um JSON no formato: {\"avaliacao\": \"texto da avaliação\", \"nota\": número entre 1 e 10, \"humor\": \"feliz\", \"triste\" ou \"neutro\"}."
                    },
                    {
                        role: "user",
                        content: `Avalie este prato frito: ${result.nome}, feito com ${ingredientsInFryingPan.join(' ')}`
                    }
                ],
                json: true
            });

            const criticResult = JSON.parse(criticCompletion.content);

            // Mostrar resultado após um tempo
            setTimeout(() => {
                fryingAnimation.classList.remove('active');
                fryingPanContents.classList.remove('frying-animation');

                // Mostrar o prato com a comida
                document.getElementById('dish-plate').style.display = 'block';

                // Mostrar o crítico
                showCritic(criticResult.humor, criticResult.avaliacao, criticResult.nota);

                // Construir o HTML para o resultado da receita
                let dishHTML = `
                    <div class="dish-name">${result.nome}</div>
                    <p>${result.descricao}</p>
                    <div class="dish-result">
                `;

                if (dishImage) {
                    dishHTML += `
                        <div class="plate">
                            <img src="${dishImage}" alt="${result.nome}" class="dish-image">
                        </div>
                    `;
                } else {
                    dishHTML += `
                        <div class="plate">
                            <span class="food-emoji">${result.emoji || '🍲'}</span>
                        </div>
                    `;
                }

                dishHTML += `
                        <p>Ingredientes: ${ingredientsInFryingPan.join(' ')}</p>
                    </div>
                `;

                recipeResult.innerHTML = dishHTML;

                // Adicionar o prato à coleção
                addDishToCollection(result.nome, dishImage || result.emoji, 'frito', ingredientsInFryingPan);

                // Adicionar resposta do chef
                addMessage(`Você fritou: ${result.nome}! ${result.descricao}`, 'ai');

                // Reativar botões
                document.getElementById('fry-button').disabled = false;
                document.getElementById('clear-frying-pan-button').disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Erro ao criar prato frito:', error);
            addMessage('Ops! Algo deu errado ao fritar. Tente novamente.', 'ai');
            document.getElementById('frying-animation').classList.remove('active');
            document.getElementById('frying-pan-contents').classList.remove('frying-animation');
            document.getElementById('fry-button').disabled = false;
            document.getElementById('clear-frying-pan-button').disabled = false;
        }
    }

    // Aquecer no microondas
    async function heat() {
        if (ingredientsInMicrowave.length === 0) {
            addMessage(translations[currentLanguage].addIngredientsBeforeCooking, 'ai');
            return;
        }

        // Efeito de aquecimento
        const microwaveAnimation = document.getElementById('microwave-animation');
        microwaveAnimation.classList.add('active');
        const microwaveContents = document.getElementById('microwave-contents');
        microwaveContents.classList.add('microwave-animation');

        // Desativar botões durante o processo
        document.getElementById('heat-button').disabled = true;
        document.getElementById('clear-microwave-button').disabled = true;

        // Perguntar à IA o que está sendo aquecido
        addMessage('Aquecendo: ' + ingredientsInMicrowave.join(' '), 'user');

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um chef especializado em refeições rápidas de microondas. Com base nos ingredientes (emojis) fornecidos pelo usuário, crie um nome de prato criativo e uma breve descrição do sabor. Seja divertido e imaginativo. Responda com um JSON no formato: {\"nome\": \"Nome do Prato\", \"descricao\": \"Descrição do sabor e textura\", \"emoji\": \"Um emoji que represente o prato final\"}."
                    },
                    {
                        role: "user",
                        content: `Veja quais ingredientes o usuário colocou no microondas e crie um prato aquecido: ${ingredientsInMicrowave.join(' ')}`
                    }
                ],
                json: true
            });

            const result = JSON.parse(completion.content);
            
            // Gerar imagem do prato
            let dishImage = null;
            try {
                const imageResult = await websim.imageGen({
                    prompt: `Uma foto profissional de comida de um prato de microondas chamado ${result.nome}, contendo os seguintes ingredientes: ${ingredientsInMicrowave.map(emoji => getIngredientName(emoji)).join(', ')}. Estilo realista, fundo branco, iluminação profissional.`,
                    aspect_ratio: "1:1"
                });
                dishImage = imageResult.url;
            } catch (error) {
                console.error('Erro ao gerar imagem do prato:', error);
            }

            // Avaliar o prato com o crítico culinário
            const criticCompletion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um crítico culinário famoso e exigente. Avalie este prato de microondas com base nos ingredientes e dê uma breve crítica. Seja específico, mencione sabores e texturas. Alterne entre críticas positivas e negativas para diferentes combinações. Responda com um JSON no formato: {\"avaliacao\": \"texto da avaliação\", \"nota\": número entre 1 e 10, \"humor\": \"feliz\", \"triste\" ou \"neutro\"}."
                    },
                    {
                        role: "user",
                        content: `Avalie este prato de microondas: ${result.nome}, feito com ${ingredientsInMicrowave.join(' ')}`
                    }
                ],
                json: true
            });

            const criticResult = JSON.parse(criticCompletion.content);

            // Mostrar resultado após um tempo
            setTimeout(() => {
                microwaveAnimation.classList.remove('active');
                microwaveContents.classList.remove('microwave-animation');

                // Mostrar o prato com a comida
                document.getElementById('dish-plate').style.display = 'block';

                // Mostrar o crítico
                showCritic(criticResult.humor, criticResult.avaliacao, criticResult.nota);

                // Construir o HTML para o resultado da receita
                let dishHTML = `
                    <div class="dish-name">${result.nome}</div>
                    <p>${result.descricao}</p>
                    <div class="dish-result">
                `;

                if (dishImage) {
                    dishHTML += `
                        <div class="plate">
                            <img src="${dishImage}" alt="${result.nome}" class="dish-image">
                        </div>
                    `;
                } else {
                    dishHTML += `
                        <div class="plate">
                            <span class="food-emoji">${result.emoji || '🍲'}</span>
                        </div>
                    `;
                }

                dishHTML += `
                        <p>Ingredientes: ${ingredientsInMicrowave.join(' ')}</p>
                    </div>
                `;

                recipeResult.innerHTML = dishHTML;

                // Adicionar o prato à coleção
                addDishToCollection(result.nome, dishImage || result.emoji, 'microondas', ingredientsInMicrowave);

                // Adicionar resposta do chef
                addMessage(`Você aqueceu: ${result.nome}! ${result.descricao}`, 'ai');

                // Reativar botões
                document.getElementById('heat-button').disabled = false;
                document.getElementById('clear-microwave-button').disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Erro ao criar prato no microondas:', error);
            addMessage('Ops! Algo deu errado ao aquecer. Tente novamente.', 'ai');
            document.getElementById('microwave-animation').classList.remove('active');
            document.getElementById('microwave-contents').classList.remove('microwave-animation');
            document.getElementById('heat-button').disabled = false;
            document.getElementById('clear-microwave-button').disabled = false;
        }
    }

    // Funções para os modos de cozimento
    function switchToCookingMode() {
        currentMode = 'cooking';
        cookingMode.style.display = 'block';
        blendingMode.style.display = 'none';
        fryingMode.style.display = 'none';
        microwaveMode.style.display = 'none';
    }

    function switchToBlendingMode() {
        currentMode = 'blending';
        cookingMode.style.display = 'none';
        blendingMode.style.display = 'block';
        fryingMode.style.display = 'none';
        microwaveMode.style.display = 'none';
    }
    
    function switchToFryingMode() {
        currentMode = 'frying';
        cookingMode.style.display = 'none';
        blendingMode.style.display = 'none';
        fryingMode.style.display = 'block';
        microwaveMode.style.display = 'none';
    }
    
    function switchToMicrowaveMode() {
        currentMode = 'microwave';
        cookingMode.style.display = 'none';
        blendingMode.style.display = 'none';
        fryingMode.style.display = 'none';
        microwaveMode.style.display = 'block';
    }

    // Função para mostrar o crítico culinário
    function showCritic(humor, avaliacao, nota) {
        foodCritic.style.display = 'flex';
        let criticFace;
        let critcClass;

        if (humor === 'feliz') {
            criticFace = '😋';
            critcClass = 'happy';
        } else if (humor === 'triste') {
            criticFace = '😖';
            critcClass = 'sad';
        } else {
            criticFace = '😐';
            critcClass = 'neutral';
        }

        document.getElementById('critic-face').textContent = criticFace;
        criticMessage.textContent = `"${avaliacao}"`;
        document.getElementById('critic-rating').textContent = `Nota: ${nota}/10`;
        
        document.getElementById('critic-face').className = '';
        document.getElementById('critic-face').classList.add('critic-face', critcClass);
    }

    // Função para adicionar prato à coleção
    function addDishToCollection(name, image, type, ingredients, color) {
        const dish = {
            name: name,
            image: image,
            type: type,
            ingredients: [...ingredients],
            color: color,
            date: new Date().toISOString()
        };

        preparedDishes.push(dish);
        updateDishDisplay();
    }

    // Função para atualizar o display de pratos
    function updateDishDisplay() {
        if (preparedDishes.length === 0) {
            dishDisplay.innerHTML = `<p>${translations[currentLanguage].noDishes}</p>`;
            return;
        }

        // Organizar por tipo
        const categories = {
            'cozido': [],
            'frito': [],
            'microondas': [],
            'suco': []
        };

        preparedDishes.forEach(dish => {
            if (categories[dish.type]) {
                categories[dish.type].push(dish);
            }
        });

        let html = '';

        // Criar seções para cada tipo de prato
        for (const [type, dishes] of Object.entries(categories)) {
            if (dishes.length === 0) continue;

            const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
            
            html += `<div class="dish-category">
                <h3>${translations[currentLanguage].categories[type] || typeTitle}</h3>
                <div class="dishes-grid">`;
            
            dishes.slice(-5).forEach(dish => {
                if (dish.type === 'suco' && typeof dish.image === 'string' && dish.image === 'juice') {
                    // Para sucos sem imagem
                    html += `
                        <div class="dish-card">
                            <div class="dish-card-img">
                                <div class="juice-glass" style="background-color: ${dish.color || '#ff9f43'}">
                                    <div class="straw"></div>
                                </div>
                            </div>
                            <div class="dish-card-name">${dish.name}</div>
                        </div>
                    `;
                } else if (typeof dish.image === 'string' && dish.image.startsWith('http')) {
                    // Para pratos com imagem gerada
                    html += `
                        <div class="dish-card">
                            <div class="dish-card-img">
                                <img src="${dish.image}" alt="${dish.name}">
                            </div>
                            <div class="dish-card-name">${dish.name}</div>
                        </div>
                    `;
                } else {
                    // Para pratos com emoji
                    html += `
                        <div class="dish-card">
                            <div class="dish-card-img">
                                <span class="food-emoji">${dish.image}</span>
                            </div>
                            <div class="dish-card-name">${dish.name}</div>
                        </div>
                    `;
                }
            });
            
            html += `</div></div>`;
        }

        dishDisplay.innerHTML = html;
    }

    // Language translations
    const translations = {
        'pt': {
            appTitle: 'Chef Mágico AI',
            darkMode: 'Modo Escuro',
            lightMode: 'Modo Claro',
            panMode: 'Panela',
            fryingPanMode: 'Frigideira',
            microwaveMode: 'Microondas',
            blenderMode: 'Liquidificador',
            refrigerator: 'Geladeira',
            buyIngredients: 'Comprar Novos Ingredientes',
            cook: 'Cozinhar',
            clearPan: 'Limpar Panela',
            fry: 'Fritar',
            clearFryingPan: 'Limpar Frigideira',
            heat: 'Aquecer',
            clearMicrowave: 'Limpar Microondas',
            blend: 'Bater',
            clearBlender: 'Limpar Liquidificador',
            assistant: 'Assistente de Cozinha',
            inputPlaceholder: 'Peça sugestões ou ingredientes...',
            send: 'Enviar',
            createIngredients: 'Criar Ingredientes',
            ingredientNamePlaceholder: 'Nome do ingrediente...',
            ingredientDescPlaceholder: 'Descreva o ingrediente (sabor, textura, como usar)...',
            createEmoji: 'Criar Emoji',
            generateImage: 'Gerar Imagem',
            yourRecipe: 'Sua Receita',
            addIngredientsPrompt: 'Adicione ingredientes à panela e cozinhe para ver o resultado!',
            myDishes: 'Meus Pratos',
            noDishes: 'Você ainda não preparou nenhum prato.',
            welcomeMessage: 'Olá! Sou seu assistente de cozinha. Adicione ingredientes da geladeira à panela, frigideira, microondas ou liquidificador, peça novos ingredientes ou dicas culinárias!',
            panFullMessage: 'A panela está cheia! Cozinhe ou limpe antes de adicionar mais.',
            blenderFullMessage: 'O liquidificador está cheio! Bata ou limpe antes de adicionar mais.',
            fryingPanFullMessage: 'A frigideira está cheia! Frite ou limpe antes de adicionar mais.',
            microwaveFullMessage: 'O microondas está cheio! Aqueça ou limpe antes de adicionar mais.',
            addIngredientsBeforeCooking: 'Adicione ingredientes à panela antes de cozinhar!',
            addFruitsBeforeBlending: 'Adicione frutas ao liquidificador antes de bater!',
            needFruitForJuice: 'Você precisa adicionar pelo menos uma fruta para fazer um suco!',
            categories: {
                'Carnes e Proteínas': 'Carnes e Proteínas',
                'Vegetais': 'Vegetais',
                'Acompanhamentos': 'Acompanhamentos',
                'Frutas': 'Frutas',
                'Extras': 'Extras'
            },
            ingredientNames: {
                '🥩': 'Carne', '🍗': 'Frango', '🐟': 'Peixe', '🥔': 'Batata',
                '🍅': 'Tomate', '🥕': 'Cenoura', '🧅': 'Cebola', '🥦': 'Brócolis',
                '🌽': 'Milho', '🍚': 'Arroz', '🧀': 'Queijo', '🥚': 'Ovo',
                '🍄': 'Cogumelo', '🌶️': 'Pimenta', '🧄': 'Alho', '🍆': 'Berinjela',
                '🍎': 'Maçã', '🍌': 'Banana', '🍓': 'Morango', '🍊': 'Laranja',
                '🧂': 'Sal', '🧈': 'Manteiga', '🧉': 'Ervas', '🍯': 'Mel', 
                '🍶': 'Molho', '🫒': 'Azeitonas'
            }
        },
        'en': {
            appTitle: 'Magic Chef AI',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            panMode: 'Pot',
            fryingPanMode: 'Frying Pan',
            microwaveMode: 'Microwave',
            blenderMode: 'Blender',
            refrigerator: 'Refrigerator',
            buyIngredients: 'Buy New Ingredients',
            cook: 'Cook',
            clearPan: 'Clean Pot',
            fry: 'Fry',
            clearFryingPan: 'Clean Frying Pan',
            heat: 'Heat',
            clearMicrowave: 'Clean Microwave',
            blend: 'Blend',
            clearBlender: 'Clean Blender',
            assistant: 'Kitchen Assistant',
            inputPlaceholder: 'Ask for suggestions or ingredients...',
            send: 'Send',
            createIngredients: 'Create Ingredients',
            ingredientNamePlaceholder: 'Ingredient name...',
            ingredientDescPlaceholder: 'Describe the ingredient (flavor, texture, how to use)...',
            createEmoji: 'Create Emoji',
            generateImage: 'Generate Image',
            yourRecipe: 'Your Recipe',
            addIngredientsPrompt: 'Add ingredients to the pot and cook to see the result!',
            myDishes: 'My Dishes',
            noDishes: 'You haven\'t prepared any dishes yet.',
            welcomeMessage: 'Hello! I\'m your kitchen assistant. Add ingredients from the refrigerator to the pot, frying pan, microwave or blender, ask for new ingredients or cooking tips!',
            panFullMessage: 'The pot is full! Cook or clean before adding more.',
            blenderFullMessage: 'The blender is full! Blend or clean before adding more.',
            fryingPanFullMessage: 'The frying pan is full! Fry or clean before adding more.',
            microwaveFullMessage: 'The microwave is full! Heat or clean before adding more.',
            addIngredientsBeforeCooking: 'Add ingredients to the pot before cooking!',
            addFruitsBeforeBlending: 'Add fruits to the blender before blending!',
            needFruitForJuice: 'You need to add at least one fruit to make juice!',
            categories: {
                'Carnes e Proteínas': 'Meat & Proteins',
                'Vegetais': 'Vegetables',
                'Acompanhamentos': 'Side Dishes',
                'Frutas': 'Fruits',
                'Extras': 'Extras'
            },
            ingredientNames: {
                '🥩': 'Beef', '🍗': 'Chicken', '🐟': 'Fish', '🥔': 'Potato',
                '🍅': 'Tomato', '🥕': 'Carrot', '🧅': 'Onion', '🥦': 'Broccoli',
                '🌽': 'Corn', '🍚': 'Rice', '🧀': 'Cheese', '🥚': 'Egg',
                '🍄': 'Mushroom', '🌶️': 'Pepper', '🧄': 'Garlic', '🍆': 'Eggplant',
                '🍎': 'Apple', '🍌': 'Banana', '🍓': 'Strawberry', '🍊': 'Orange',
                '🧂': 'Salt', '🧈': 'Butter', '🧉': 'Herbs', '🍯': 'Honey', 
                '🍶': 'Sauce', '🫒': 'Olives'
            }
        },
        'es': {
            appTitle: 'Chef Mágico AI',
            darkMode: 'Modo Oscuro',
            lightMode: 'Modo Claro',
            panMode: 'Olla',
            fryingPanMode: 'Sartén',
            microwaveMode: 'Microondas',
            blenderMode: 'Licuadora',
            refrigerator: 'Refrigerador',
            buyIngredients: 'Comprar Nuevos Ingredientes',
            cook: 'Cocinar',
            clearPan: 'Limpiar Olla',
            fry: 'Freír',
            clearFryingPan: 'Limpiar Sartén',
            heat: 'Calentar',
            clearMicrowave: 'Limpiar Microondas',
            blend: 'Mezclar',
            clearBlender: 'Limpiar Licuadora',
            assistant: 'Asistente de Cocina',
            inputPlaceholder: 'Pide sugerencias o ingredientes...',
            send: 'Enviar',
            createIngredients: 'Crear Ingredientes',
            ingredientNamePlaceholder: 'Nombre del ingrediente...',
            ingredientDescPlaceholder: 'Describe el ingrediente (sabor, textura, cómo usarlo)...',
            createEmoji: 'Crear Emoji',
            generateImage: 'Generar Imagen',
            yourRecipe: 'Tu Receta',
            addIngredientsPrompt: '¡Agrega ingredientes a la olla y cocina para ver el resultado!',
            myDishes: 'Mis Platos',
            noDishes: 'Aún no has preparado ningún plato.',
            welcomeMessage: '¡Hola! Soy tu asistente de cocina. ¡Agrega ingredientes del refrigerador a la olla, sartén, microondas o licuadora, pide nuevos ingredientes o consejos culinarios!',
            panFullMessage: '¡La olla está llena! Cocina o limpia antes de agregar más.',
            blenderFullMessage: '¡La licuadora está llena! Mezcla o limpia antes de agregar más.',
            fryingPanFullMessage: '¡La sartén está llena! Fríe o limpia antes de agregar más.',
            microwaveFullMessage: '¡El microondas está lleno! Calienta o limpia antes de agregar más.',
            addIngredientsBeforeCooking: '¡Agrega ingredientes a la olla antes de cocinar!',
            addFruitsBeforeBlending: '¡Agrega frutas a la licuadora antes de mezclar!',
            needFruitForJuice: '¡Necesitas agregar al menos una fruta para hacer jugo!',
            categories: {
                'Carnes e Proteínas': 'Carnes y Proteínas',
                'Vegetais': 'Vegetales',
                'Acompanhamentos': 'Acompañamientos',
                'Frutas': 'Frutas',
                'Extras': 'Extras'
            },
            ingredientNames: {
                '🥩': 'Carne', '🍗': 'Pollo', '🐟': 'Pescado', '🥔': 'Papa',
                '🍅': 'Tomate', '🥕': 'Zanahoria', '🧅': 'Cebolla', '🥦': 'Brócoli',
                '🌽': 'Maíz', '🍚': 'Arroz', '🧀': 'Queso', '🥚': 'Huevo',
                '🍄': 'Champiñón', '🌶️': 'Chile', '🧄': 'Ajo', '🍆': 'Berenjena',
                '🍎': 'Manzana', '🍌': 'Plátano', '🍓': 'Fresa', '🍊': 'Naranja',
                '🧂': 'Sal', '🧈': 'Mantequilla', '🧉': 'Hierbas', '🍯': 'Miel', 
                '🍶': 'Salsa', '🫒': 'Aceitunas'
            }
        },
        'fr': {
            appTitle: 'Chef Magique AI',
            darkMode: 'Mode Sombre',
            lightMode: 'Mode Clair',
            panMode: 'Casserole',
            fryingPanMode: 'Poêle',
            microwaveMode: 'Micro-ondes',
            blenderMode: 'Mixeur',
            refrigerator: 'Réfrigérateur',
            buyIngredients: 'Acheter de Nouveaux Ingrédients',
            cook: 'Cuisiner',
            clearPan: 'Nettoyer la Casserole',
            fry: 'Frire',
            clearFryingPan: 'Nettoyer la Poêle',
            heat: 'Chauffer',
            clearMicrowave: 'Nettoyer le Micro-ondes',
            blend: 'Mixer',
            clearBlender: 'Nettoyer le Mixeur',
            assistant: 'Assistant de Cuisine',
            inputPlaceholder: 'Demandez des suggestions ou des ingrédients...',
            send: 'Envoyer',
            createIngredients: 'Créer des Ingrédients',
            ingredientNamePlaceholder: 'Nom de l\'ingrédient...',
            ingredientDescPlaceholder: 'Décrivez l\'ingrédient (saveur, texture, comment l\'utiliser)...',
            createEmoji: 'Créer un Emoji',
            generateImage: 'Générer une Image',
            yourRecipe: 'Votre Recette',
            addIngredientsPrompt: 'Ajoutez des ingrédients à la casserole et cuisinez pour voir le résultat!',
            myDishes: 'Mes Plats',
            noDishes: 'Vous n\'avez pas encore préparé de plats.',
            welcomeMessage: 'Bonjour! Je suis votre assistant de cuisine. Ajoutez des ingrédients du réfrigérateur à la casserole, poêle, micro-ondes ou mixeur, demandez de nouveaux ingrédients ou des conseils culinaires!',
            panFullMessage: 'La casserole est pleine! Cuisinez ou nettoyez avant d\'en ajouter davantage.',
            blenderFullMessage: 'Le mixeur est plein! Mixez ou nettoyez avant d\'en ajouter davantage.',
            fryingPanFullMessage: 'La poêle est pleine! Faites frire ou nettoyez avant d\'en ajouter davantage.',
            microwaveFullMessage: 'Le micro-ondes est plein! Chauffez ou nettoyez avant d\'en ajouter davantage.',
            addIngredientsBeforeCooking: 'Ajoutez des ingrédients à la casserole avant de cuisiner!',
            addFruitsBeforeBlending: 'Ajoutez des fruits au mixeur avant de mixer!',
            needFruitForJuice: 'Vous devez ajouter au moins un fruit pour faire du jus!',
            categories: {
                'Carnes e Proteínas': 'Viandes & Protéines',
                'Vegetais': 'Légumes',
                'Acompanhamentos': 'Accompagnements',
                'Frutas': 'Fruits',
                'Extras': 'Extras'
            },
            ingredientNames: {
                '🥩': 'Bœuf', '🍗': 'Poulet', '🐟': 'Poisson', '🥔': 'Pomme de terre',
                '🍅': 'Tomate', '🥕': 'Carotte', '🧅': 'Oignon', '🥦': 'Brocoli',
                '🌽': 'Maïs', '🍚': 'Riz', '🧀': 'Fromage', '🥚': 'Œuf',
                '🍄': 'Champignon', '🌶️': 'Piment', '🧄': 'Ail', '🍆': 'Aubergine',
                '🍎': 'Pomme', '🍌': 'Banane', '🍓': 'Fraise', '🍊': 'Orange',
                '🧂': 'Sel', '🧈': 'Beurre', '🧉': 'Herbes', '🍯': 'Miel', 
                '🍶': 'Sauce', '🫒': 'Olives'
            }
        }
    };
    
    // Current language
    let currentLanguage = 'pt';
    
    // Function to update UI text based on language
    function updateLanguageUI() {
        const t = translations[currentLanguage];
        
        // Update document title
        document.title = t.appTitle;
        
        // Update header
        document.querySelector('h1').textContent = t.appTitle;
        
        // Update mode switch buttons
        document.getElementById('switch-cooking').textContent = t.panMode;
        document.getElementById('switch-frying').textContent = t.fryingPanMode;
        document.getElementById('switch-microwave').textContent = t.microwaveMode;
        document.getElementById('switch-blending').textContent = t.blenderMode;
        
        // Update refrigerator
        document.querySelector('.refrigerator h2').textContent = t.refrigerator;
        document.getElementById('buy-ingredients-btn').textContent = t.buyIngredients;
        
        // Update buttons
        document.getElementById('cook-button').textContent = t.cook;
        document.getElementById('clear-button').textContent = t.clearPan;
        document.getElementById('fry-button').textContent = t.fry;
        document.getElementById('clear-frying-pan-button').textContent = t.clearFryingPan;
        document.getElementById('heat-button').textContent = t.heat;
        document.getElementById('clear-microwave-button').textContent = t.clearMicrowave;
        document.getElementById('blend-button').textContent = t.blend;
        document.getElementById('clear-blender-button').textContent = t.clearBlender;
        
        // Update assistant
        document.querySelector('.ai-helper h2').textContent = t.assistant;
        document.getElementById('user-input').placeholder = t.inputPlaceholder;
        document.getElementById('send-button').textContent = t.send;
        
        // Update create ingredients
        document.querySelector('.create-ingredient-section h2').textContent = t.createIngredients;
        document.getElementById('ingredient-name').placeholder = t.ingredientNamePlaceholder;
        document.getElementById('ingredient-description').placeholder = t.ingredientDescPlaceholder;
        document.getElementById('create-ingredient-btn').textContent = t.createEmoji;
        document.getElementById('generate-image-btn').textContent = t.generateImage;
        
        // Update result area
        document.querySelector('.result-area h2').textContent = t.yourRecipe;
        if (recipeResult.innerHTML.includes('Adicione ingredientes')) {
            recipeResult.innerHTML = `<p>${t.addIngredientsPrompt}</p>`;
        }
        
        // Update dishes collection
        document.querySelector('.dishes-collection h2').textContent = t.myDishes;
        if (dishDisplay.innerHTML.includes('Você ainda não preparou')) {
            dishDisplay.innerHTML = `<p>${t.noDishes}</p>`;
        }
        
        // Update theme text
        document.getElementById('theme-text').textContent = 
            document.body.classList.contains('dark-mode') ? t.lightMode : t.darkMode;
        
        // Update category display
        updateCategoryDisplay();
    }

    // Add language change event listener
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        localStorage.setItem('language', currentLanguage);
        updateLanguageUI();
        
        // Update welcome message if it's the first message
        if (chatMessages.children.length > 0 && 
            chatMessages.children[0].classList.contains('ai-message') && 
            chatMessages.children[0].textContent.includes('sou seu assistente')) {
            chatMessages.children[0].textContent = translations[currentLanguage].welcomeMessage;
        }
    });
    
    // Check preferred language in localStorage
    function checkPreferredLanguage() {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            currentLanguage = savedLanguage;
            languageSelect.value = currentLanguage;
        }
        updateLanguageUI();
    }
    
    // Função para alternar o tema
    function toggleTheme() {
        const body = document.body;
        const t = translations[currentLanguage];
        
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            themeIcon.textContent = '🌙';
            document.getElementById('theme-text').textContent = t.darkMode;
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
            document.getElementById('theme-text').textContent = t.lightMode;
            localStorage.setItem('theme', 'dark');
        }
    }

    // Verificar tema preferido no localStorage
    function checkPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
            document.getElementById('theme-text').textContent = translations[currentLanguage].lightMode;
        }
    }

    // Função para criar um ingrediente personalizado
    async function createCustomIngredient() {
        const name = document.getElementById('ingredient-name').value.trim();
        const description = document.getElementById('ingredient-description').value.trim();
        
        if (!name) {
            addMessage(translations[currentLanguage].needIngredientName || 'Digite um nome para o ingrediente', 'ai');
            return;
        }
        
        try {
            // Pedir à IA para criar um emoji para o ingrediente
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um especialista em alimentos. Com base no nome e descrição de um ingrediente, escolha o emoji mais adequado para representá-lo. Se não houver um emoji perfeito, escolha o mais próximo. Responda apenas com o emoji, sem texto adicional."
                    },
                    {
                        role: "user",
                        content: `Crie um emoji para este ingrediente: Nome: ${name}, Descrição: ${description}`
                    }
                ]
            });
            
            const emoji = completion.content.trim();
            
            // Adicionar à lista de ingredientes personalizados
            const customIngredient = {
                name: name,
                description: description,
                emoji: emoji
            };
            
            customIngredients.push(customIngredient);
            
            // Adicionar à categoria apropriada ou criar nova
            let added = false;
            for (const category of categories) {
                if (category.ingredients.length < 8) {
                    category.ingredients.push(emoji);
                    added = true;
                    break;
                }
            }
            
            if (!added) {
                // Criar nova categoria
                const newCategory = {
                    name: `${name} e Similares`,
                    emoji: emoji,
                    ingredients: [emoji]
                };
                categories.push(newCategory);
            }
            
            // Atualizar exibição de ingredientes
            updateCategoryDisplay();
            
            // Mostrar o ingrediente na seção de ingredientes personalizados
            displayCustomIngredient(customIngredient);
            
            // Limpar formulário
            document.getElementById('ingredient-name').value = '';
            document.getElementById('ingredient-description').value = '';
            
            addMessage(`✨ Criei o ingrediente "${name}" para você! Use o emoji ${emoji} para representá-lo.`, 'ai');
            
        } catch (error) {
            console.error('Erro ao criar ingrediente:', error);
            addMessage('Desculpe, houve um erro ao criar o ingrediente. Tente novamente.', 'ai');
        }
    }
    
    // Função para gerar imagem para um ingrediente
    async function generateIngredientImage() {
        const name = document.getElementById('ingredient-name').value.trim();
        const description = document.getElementById('ingredient-description').value.trim();
        
        if (!name) {
            addMessage(translations[currentLanguage].needIngredientName || 'Digite um nome para o ingrediente', 'ai');
            return;
        }
        
        try {
            // Primeiro, obter o emoji se ainda não tivermos um ingrediente com esse nome
            let ingredientEmoji;
            let existingIngredient = customIngredients.find(i => i.name.toLowerCase() === name.toLowerCase());
            
            if (!existingIngredient) {
                const emojiCompletion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "Você é um especialista em alimentos. Com base no nome e descrição de um ingrediente, escolha o emoji mais adequado para representá-lo. Se não houver um emoji perfeito, escolha o mais próximo. Responda apenas com o emoji, sem texto adicional."
                        },
                        {
                            role: "user",
                            content: `Crie um emoji para este ingrediente: Nome: ${name}, Descrição: ${description}`
                        }
                    ]
                });
                
                ingredientEmoji = emojiCompletion.content.trim();
            } else {
                ingredientEmoji = existingIngredient.emoji;
            }
            
            // Gerar a imagem
            addMessage(`Gerando imagem para "${name}"...`, 'ai');
            
            const imageResult = await websim.imageGen({
                prompt: `Uma foto de alta qualidade de ${name}, ${description || 'um ingrediente culinário'}. Fundo branco, iluminação profissional, estilo fotografia de alimentos.`,
                aspect_ratio: "1:1"
            });
            
            const imageUrl = imageResult.url;
            
            // Adicionar ou atualizar o ingrediente personalizado
            if (existingIngredient) {
                existingIngredient.imageUrl = imageUrl;
            } else {
                const newIngredient = {
                    name: name,
                    description: description,
                    emoji: ingredientEmoji,
                    imageUrl: imageUrl
                };
                
                customIngredients.push(newIngredient);
                
                // Adicionar à categoria apropriada ou criar nova
                let added = false;
                for (const category of categories) {
                    if (category.ingredients.length < 8) {
                        category.ingredients.push(ingredientEmoji);
                        added = true;
                        break;
                    }
                }
                
                if (!added) {
                    // Criar nova categoria
                    const newCategoryName = "Novos Ingredientes";
                    const existingCategory = categories.find(c => c.name === newCategoryName);
                    
                    if (existingCategory) {
                        existingCategory.ingredients.push(ingredientEmoji);
                    } else {
                        categories.push({
                            name: newCategoryName,
                            emoji: "✨",
                            ingredients: [ingredientEmoji]
                        });
                    }
                }
            }
            
            // Atualizar exibição de ingredientes
            updateCategoryDisplay();
            
            // Mostrar o ingrediente na seção de ingredientes personalizados
            displayCustomIngredient(existingIngredient || customIngredients[customIngredients.length - 1]);
            
            // Limpar formulário
            document.getElementById('ingredient-name').value = '';
            document.getElementById('ingredient-description').value = '';
            
            addMessage(`✨ Criei uma imagem para "${name}"! Você pode encontrá-lo na geladeira.`, 'ai');
            
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            addMessage('Desculpe, houve um erro ao gerar a imagem. Tente novamente.', 'ai');
        }
    }
    
    // Função para exibir ingrediente personalizado
    function displayCustomIngredient(ingredient) {
        const customIngredientsContainer = document.getElementById('custom-ingredients');
        
        // Verificar se já existe um card para este ingrediente
        const existingCard = Array.from(customIngredientsContainer.children).find(
            card => card.dataset.emoji === ingredient.emoji
        );
        
        if (existingCard) {
            // Atualizar o card existente
            if (ingredient.imageUrl) {
                const imgElement = existingCard.querySelector('img') || document.createElement('img');
                imgElement.src = ingredient.imageUrl;
                imgElement.alt = ingredient.name;
                
                const imageContainer = existingCard.querySelector('.custom-ingredient-image');
                if (!imageContainer.contains(imgElement)) {
                    imageContainer.innerHTML = '';
                    imageContainer.appendChild(imgElement);
                }
            }
            
            existingCard.querySelector('.custom-ingredient-name').textContent = ingredient.name;
            return;
        }
        
        // Criar novo card
        const cardElement = document.createElement('div');
        cardElement.className = 'custom-ingredient';
        cardElement.dataset.emoji = ingredient.emoji;
        
        let cardContent = `
            <div class="custom-ingredient-card">
                <div class="custom-ingredient-image">
        `;
        
        if (ingredient.imageUrl) {
            cardContent += `<img src="${ingredient.imageUrl}" alt="${ingredient.name}">`;
        } else {
            cardContent += `<span class="ingredient-emoji">${ingredient.emoji}</span>`;
        }
        
        cardContent += `
                </div>
                <div class="custom-ingredient-name">${ingredient.name}</div>
                <button class="use-ingredient-btn">Usar</button>
            </div>
        `;
        
        cardElement.innerHTML = cardContent;
        
        // Adicionar evento para usar o ingrediente
        cardElement.querySelector('.use-ingredient-btn').addEventListener('click', () => {
            addToPot(ingredient.emoji);
        });
        
        customIngredientsContainer.appendChild(cardElement);
    }
    
    // Função para comprar novos ingredientes
    async function buyNewIngredients() {
        addMessage(translations[currentLanguage].buyingNewIngredients || 'Comprando novos ingredientes...', 'ai');
        
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente culinário criativo. Sugira 3-5 novos ingredientes interessantes para o usuário. Para cada ingrediente, forneça um nome, uma breve descrição e um emoji apropriado. Responda com um JSON no formato: [{\"nome\": \"Nome do Ingrediente\", \"descricao\": \"Breve descrição\", \"emoji\": \"Emoji\"}]"
                    },
                    {
                        role: "user",
                        content: "Sugira alguns ingredientes novos e interessantes para minha cozinha."
                    }
                ],
                json: true
            });
            
            const newIngredients = JSON.parse(completion.content);
            
            // Processar cada ingrediente
            for (const ingredient of newIngredients) {
                // Verificar se já temos este ingrediente
                const existingIngredient = customIngredients.find(i => 
                    i.name.toLowerCase() === ingredient.nome.toLowerCase() || 
                    i.emoji === ingredient.emoji
                );
                
                if (existingIngredient) continue;
                
                // Gerar imagem para o ingrediente
                let imageUrl = null;
                try {
                    const imageResult = await websim.imageGen({
                        prompt: `Uma foto de alta qualidade de ${ingredient.nome}, ${ingredient.descricao}. Fundo branco, iluminação profissional, estilo fotografia de alimentos.`,
                        aspect_ratio: "1:1"
                    });
                    imageUrl = imageResult.url;
                } catch (error) {
                    console.error('Erro ao gerar imagem:', error);
                }
                
                // Adicionar à lista de ingredientes personalizados
                const customIngredient = {
                    name: ingredient.nome,
                    description: ingredient.descricao,
                    emoji: ingredient.emoji,
                    imageUrl: imageUrl
                };
                
                customIngredients.push(customIngredient);
                
                // Adicionar à categoria apropriada ou criar nova
                let added = false;
                for (const category of categories) {
                    if (category.ingredients.length < 8) {
                        category.ingredients.push(ingredient.emoji);
                        added = true;
                        break;
                    }
                }
                
                if (!added) {
                    // Criar nova categoria
                    const newCategoryName = "Novos Ingredientes";
                    const existingCategory = categories.find(c => c.name === newCategoryName);
                    
                    if (existingCategory) {
                        existingCategory.ingredients.push(ingredient.emoji);
                    } else {
                        categories.push({
                            name: newCategoryName,
                            emoji: "✨",
                            ingredients: [ingredient.emoji]
                        });
                    }
                }
                
                // Mostrar o ingrediente na seção de ingredientes personalizados
                displayCustomIngredient(customIngredient);
            }
            
            // Atualizar exibição da geladeira
            updateCategoryDisplay();
            
            addMessage(`✨ Comprei ${newIngredients.length} novos ingredientes para você! Confira na geladeira.`, 'ai');
            
        } catch (error) {
            console.error('Erro ao comprar ingredientes:', error);
            addMessage('Desculpe, houve um erro ao comprar ingredientes. Tente novamente.', 'ai');
        }
    }

    // Função para alternar a música de fundo
    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicIcon.textContent = '🔊';
            musicText.textContent = 'Música: On';
            localStorage.setItem('music', 'on');
        } else {
            backgroundMusic.pause();
            musicIcon.textContent = '🔇';
            musicText.textContent = 'Música: Off';
            localStorage.setItem('music', 'off');
        }
    }

    // Verificar preferência de música no localStorage
    function checkMusicPreference() {
        const savedMusicPref = localStorage.getItem('music');
        if (savedMusicPref === 'on') {
            backgroundMusic.play();
            musicIcon.textContent = '🔊';
            musicText.textContent = 'Música: On';
        }
    }
    
    // Modificar a função init para incluir a preferência de música
    function init() {
        setupCategories();
        switchToCookingMode();
        checkPreferredTheme();
        checkPreferredLanguage();
        checkMusicPreference();
        
        // Verificar se há preferências salvas para os paineis
        const fridgeClosed = localStorage.getItem('fridgeClosed') === 'true';
        const aiClosed = localStorage.getItem('aiClosed') === 'true';
        const ingredientClosed = localStorage.getItem('ingredientClosed') === 'true';
        
        if (fridgeClosed) {
            fridgeContent.classList.add('closed');
            fridgeToggleIcon.textContent = '🔼';
        }
        
        if (aiClosed) {
            aiContent.classList.add('closed');
            aiToggleIcon.textContent = '🔼';
        }
        
        if (ingredientClosed) {
            ingredientContent.classList.add('closed');
            ingredientToggleIcon.textContent = '🔼';
        }
        
        addMessage(translations[currentLanguage].welcomeMessage, 'ai');
    }
    
    // Salvar estado dos paineis no localStorage quando alterados
    toggleFridge.addEventListener('click', () => {
        localStorage.setItem('fridgeClosed', fridgeContent.classList.contains('closed'));
    });
    
    toggleAI.addEventListener('click', () => {
        localStorage.setItem('aiClosed', aiContent.classList.contains('closed'));
    });
    
    toggleIngredient.addEventListener('click', () => {
        localStorage.setItem('ingredientClosed', ingredientContent.classList.contains('closed'));
    });
    
    // Substituir addMessage call com init()
    init();
    
    // Adicionar mensagem ao chat
    function addMessage(message, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}-message`;
        messageEl.textContent = message;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Adicionar à história da conversa
        if (sender === 'user') {
            conversationHistory.push({
                role: "user",
                content: message
            });
        } else {
            conversationHistory.push({
                role: "assistant",
                content: message
            });
        }

        // Manter apenas as últimas 10 mensagens
        conversationHistory = conversationHistory.slice(-10);
    }

    async function processUserInput() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        userInput.value = '';

        // Verificar comandos especiais
        if (message.toLowerCase().includes('comprar') || message.toLowerCase().includes('novos ingredientes')) {
            buyNewIngredients();
            return;
        }

        // Verificar se o usuário está solicitando alimentos mais realistas
        if (message.toLowerCase().includes('realista') || message.toLowerCase().includes('design melhor') || 
            message.toLowerCase().includes('mais detalhado') || message.toLowerCase().includes('melhor qualidade')) {
            improveLastDish();
            return;
        }

        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente culinário criativo. Ajude o usuário com receitas, sugestões de ingredientes e dicas culinárias. Se o usuário pedir novos ingredientes, forneça emojis de ingredientes. Mantenha as respostas breves e úteis."
                    },
                    ...conversationHistory
                ]
            });

            const response = completion.content;
            addMessage(response, 'ai');

            // Se a resposta contiver emojis, extraí-los e adicioná-los à geladeira
            const emojiRegex = /[\p{Emoji_Presentation}|\p{Emoji}\uFE0F]/gu;
            const emojis = response.match(emojiRegex);

            if (emojis && emojis.length > 0) {
                const uniqueEmojis = [...new Set(emojis)]; // Remover duplicatas
                const foodEmojis = uniqueEmojis.filter(emoji => 
                    !emoji.match(/[\u{1F600}-\u{1F64F}]/u) &&  // Excluir emojis de rosto
                    !emoji.match(/[\u{1F300}-\u{1F5FF}]/u) &&  // Excluir símbolos e pictogramas
                    !emoji.match(/[\u{1F680}-\u{1F6FF}]/u) &&  // Excluir símbolos de transporte
                    !emoji.includes('✨') && !emoji.includes('👍') &&
                    !emoji.includes('👌') && !emoji.includes('👏') &&
                    !emoji.includes('🔍') && !emoji.includes('📝')
                );
                
                if (foodEmojis.length > 0) {
                    // Para cada emoji, verifica se precisa adicionar à geladeira
                    for (const emoji of foodEmojis) {
                        let isAlreadyInFridge = false;
                        
                        // Verificar se o emoji já existe em alguma categoria
                        for (const category of categories) {
                            if (category.ingredients.includes(emoji)) {
                                isAlreadyInFridge = true;
                                break;
                            }
                        }
                        
                        if (!isAlreadyInFridge) {
                            // Adicionar a uma categoria existente ou criar nova
                            let categoryAdded = false;
                            
                            // Tentar adicionar a uma categoria que tenha espaço
                            for (const category of categories) {
                                if (category.ingredients.length < 8) {
                                    category.ingredients.push(emoji);
                                    categoryAdded = true;
                                    break;
                                }
                            }
                            
                            // Se não encontrou espaço, criar nova categoria
                            if (!categoryAdded) {
                                const newCategoryName = "Novos Ingredientes";
                                const existingCategory = categories.find(c => c.name === newCategoryName);
                                
                                if (existingCategory) {
                                    existingCategory.ingredients.push(emoji);
                                } else {
                                    categories.push({
                                        name: newCategoryName,
                                        emoji: "✨",
                                        ingredients: [emoji]
                                    });
                                }
                            }
                        }
                    }
                    
                    // Atualizar a exibição da geladeira
                    updateCategoryDisplay();
                    
                    // Notificar o usuário
                    if (foodEmojis.length > 0) {
                        addMessage(`Adicionei ${foodEmojis.length} novos ingredientes à sua geladeira! 🎉`, 'ai');
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            addMessage('Desculpe, não consegui processar sua mensagem. Tente novamente.', 'ai');
        }
    }

    // Função para melhorar a apresentação visual do último prato
    async function improveLastDish() {
        if (preparedDishes.length === 0) {
            addMessage('Você ainda não preparou nenhum prato para melhorar.', 'ai');
            return;
        }
        
        const lastDish = preparedDishes[preparedDishes.length - 1];
        addMessage(`Melhorando o visual do prato "${lastDish.name}"...`, 'ai');
        
        try {
            // Gerar uma imagem mais realista para o prato
            const imageResult = await websim.imageGen({
                prompt: `Uma foto ultra-realista de alta resolução estilo fotografia culinária profissional do prato "${lastDish.name}", contendo ${lastDish.ingredients.map(emoji => getIngredientName(emoji)).join(', ')}. Iluminação cinematográfica, fundo desfocado, apresentação gourmet em prato elegante.`,
                aspect_ratio: "1:1"
            });
            
            // Atualizar a imagem do prato
            lastDish.image = imageResult.url;
            
            // Atualizar exibição
            updateDishDisplay();
            
            // Se o prato estiver sendo exibido no resultado, atualizá-lo também
            if (recipeResult.innerHTML.includes(lastDish.name)) {
                const plateImage = document.querySelector('.dish-image');
                if (plateImage) {
                    plateImage.src = imageResult.url;
                } else {
                    // Se não houver imagem, substituir o emoji pela imagem
                    const plateDiv = document.querySelector('.plate');
                    if (plateDiv) {
                        plateDiv.innerHTML = `<img src="${imageResult.url}" alt="${lastDish.name}" class="dish-image">`;
                    }
                }
            }
            
            // Obter uma descrição mais detalhada do prato
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um crítico gastronômico profissional. Descreva este prato de forma detalhada e refinada, como se estivesse em um guia michelin. Foque na aparência, texturas, aromas e composição visual. Use linguagem sofisticada. Seja breve (3-4 frases)."
                    },
                    {
                        role: "user",
                        content: `Descreva em detalhes o visual deste prato: ${lastDish.name}, feito com os ingredientes ${lastDish.ingredients.join(' ')}`
                    }
                ]
            });
            
            const description = completion.content;
            addMessage(`✨ Pronto! O visual do prato "${lastDish.name}" foi aprimorado!\n\n${description}`, 'ai');
            
        } catch (error) {
            console.error('Erro ao melhorar o prato:', error);
            addMessage('Desculpe, houve um erro ao melhorar o visual do seu prato. Tente novamente.', 'ai');
        }
    }

    // Função para alternar a visibilidade da geladeira
    function toggleFridgeVisibility() {
        fridgeContent.classList.toggle('closed');
        fridgeToggleIcon.textContent = fridgeContent.classList.contains('closed') ? '🔼' : '🔽';
    }
    
    // Função para alternar a visibilidade do assistente de cozinha
    function toggleAIVisibility() {
        aiContent.classList.toggle('closed');
        aiToggleIcon.textContent = aiContent.classList.contains('closed') ? '🔼' : '🔽';
    }
    
    // Função para alternar a visibilidade da seção de criar ingredientes
    function toggleIngredientVisibility() {
        ingredientContent.classList.toggle('closed');
        ingredientToggleIcon.textContent = ingredientContent.classList.contains('closed') ? '🔼' : '🔽';
    }
    
    // Função para mostrar a seção de criar ingredientes
    function showCreateIngredientSection() {
        if (ingredientContent.classList.contains('closed')) {
            toggleIngredientVisibility();
        }
        // Rolagem suave até a seção de criar ingredientes
        document.querySelector('.create-ingredient-section').scrollIntoView({ behavior: 'smooth' });
        // Focar no campo de nome do ingrediente
        document.getElementById('ingredient-name').focus();
    }
    
    // Event Listeners
    cookButton.addEventListener('click', cook);
    blendButton.addEventListener('click', blend);
    clearButton.addEventListener('click', clearPot);
    clearBlenderButton.addEventListener('click', clearBlender);
    document.getElementById('fry-button').addEventListener('click', fry);
    document.getElementById('clear-frying-pan-button').addEventListener('click', clearFryingPan);
    document.getElementById('heat-button').addEventListener('click', heat);
    document.getElementById('clear-microwave-button').addEventListener('click', clearMicrowave);
    document.getElementById('switch-cooking').addEventListener('click', switchToCookingMode);
    document.getElementById('switch-blending').addEventListener('click', switchToBlendingMode);
    document.getElementById('switch-frying').addEventListener('click', switchToFryingMode);
    document.getElementById('switch-microwave').addEventListener('click', switchToMicrowaveMode);
    sendButton.addEventListener('click', processUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processUserInput();
        }
    });
    createIngredientBtn.addEventListener('click', createCustomIngredient);
    generateImageBtn.addEventListener('click', generateIngredientImage);
    document.getElementById('buy-ingredients-btn').addEventListener('click', buyNewIngredients);
    prevButton.addEventListener('click', prevCategory);
    nextButton.addEventListener('click', nextCategory);
    themeToggle.addEventListener('click', toggleTheme);
    musicToggle.addEventListener('click', toggleMusic);
    toggleFridge.addEventListener('click', toggleFridgeVisibility);
    toggleAI.addEventListener('click', toggleAIVisibility);
    toggleIngredient.addEventListener('click', toggleIngredientVisibility);
    quickCreateBtn.addEventListener('click', showCreateIngredientSection);
});
