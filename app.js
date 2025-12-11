/**
 * Aplicação Principal - Sistema de Recomendação de Preços de Casas
 */

// Elementos do DOM
const priceForm = document.getElementById('priceForm');
const resultSection = document.getElementById('resultSection');
const predictedPriceElement = document.getElementById('predictedPrice');
const resultDetailsElement = document.getElementById('resultDetails');

/**
 * Manipulador do evento de envio do formulário
 */
priceForm.addEventListener('submit', function(e) {
    e.preventDefault();
    calculatePrice();
});

/**
 * Calcula o preço recomendado com base nas características inseridas
 */
function calculatePrice() {
    try {
        // Coletar dados do formulário
        const features = {
            squareFootage: parseFloat(document.getElementById('squareFootage').value),
            bedrooms: parseFloat(document.getElementById('bedrooms').value),
            bathrooms: parseFloat(document.getElementById('bathrooms').value),
            yearBuilt: parseFloat(document.getElementById('yearBuilt').value),
            lotSize: parseFloat(document.getElementById('lotSize').value),
            garageSize: parseFloat(document.getElementById('garageSize').value),
            neighborhoodQuality: parseFloat(document.getElementById('neighborhoodQuality').value)
        };

        // Validar dados
        if (!validateFeatures(features)) {
            showError('Por favor, preencha todos os campos com valores válidos.');
            return;
        }

        // Fazer predição
        const prediction = housePriceModel.predict(features);

        // Exibir resultado
        displayResult(prediction);

        // Rolar para o resultado
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        showError('Erro ao calcular o preço: ' + error.message);
        console.error('Erro detalhado:', error);
    }
}

/**
 * Valida as características inseridas
 */
function validateFeatures(features) {
    const squareFootageValid = features.squareFootage > 0 && features.squareFootage < 50000;
    const bedroomsValid = features.bedrooms >= 0 && features.bedrooms <= 20;
    const bathroomsValid = features.bathrooms >= 0 && features.bathrooms <= 20;
    const yearBuiltValid = features.yearBuilt >= 1900 && features.yearBuilt <= 2100;
    const lotSizeValid = features.lotSize > 0 && features.lotSize < 1000;
    const garageSizeValid = features.garageSize >= 0 && features.garageSize <= 10;
    const neighborhoodQualityValid = features.neighborhoodQuality >= 1 && features.neighborhoodQuality <= 10;

    return squareFootageValid && bedroomsValid && bathroomsValid && yearBuiltValid && 
           lotSizeValid && garageSizeValid && neighborhoodQualityValid;
}

/**
 * Exibe o resultado da predição
 */
function displayResult(prediction) {
    // Mostrar seção de resultado
    resultSection.classList.remove('hidden');

    // Formatar e exibir preço
    const formattedPrice = housePriceModel.formatPrice(prediction.price);
    predictedPriceElement.textContent = formattedPrice;

    // Construir detalhes
    let detailsHTML = '';
    for (let i = 0; i < prediction.featureLabels.length; i++) {
        const label = prediction.featureLabels[i];
        const value = prediction.features[i];
        const unit = prediction.featureUnits[i];

        detailsHTML += `<li><strong>${label}:</strong> ${formatNumber(value)} ${unit}</li>`;
    }

    resultDetailsElement.innerHTML = detailsHTML;

    // Log para debug
    console.log('Predição realizada:', prediction);
    console.log('Relatório:', housePriceModel.generateReport(prediction));
}

/**
 * Formata um número para exibição
 */
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return num.toFixed(2);
}

/**
 * Reseta o formulário
 */
function resetForm() {
    priceForm.reset();
    resultSection.classList.add('hidden');
    document.getElementById('squareFootage').focus();
}

/**
 * Exibe mensagem de erro
 */
function showError(message) {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = 'error-alert';
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(alertDiv);

    // Remover após 5 segundos
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 5000);
}

/**
 * Adicionar animações CSS para alertas
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicação iniciada com sucesso!');
    console.log('Modelo carregado:', housePriceModel);
    console.log('Importância das features:', housePriceModel.getFeatureImportance());

    // Focar no primeiro campo
    document.getElementById('squareFootage').focus();

    // Adicionar validação em tempo real
    addRealTimeValidation();
});

/**
 * Adiciona validação em tempo real aos campos
 */
function addRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-group input');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const value = parseFloat(this.value);

            if (this.value && isNaN(value)) {
                this.style.borderColor = '#e74c3c';
                this.style.backgroundColor = '#ffebee';
            } else if (this.value) {
                this.style.borderColor = '#27ae60';
                this.style.backgroundColor = '#f1f8f4';
            } else {
                this.style.borderColor = '#bdc3c7';
                this.style.backgroundColor = '#ffffff';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
            this.style.backgroundColor = '#f8fbff';
        });
    });
}

/**
 * Função para exportar relatório (opcional)
 */
function exportReport() {
    try {
        const squareFootage = parseFloat(document.getElementById('squareFootage').value);
        const bedrooms = parseFloat(document.getElementById('bedrooms').value);
        const bathrooms = parseFloat(document.getElementById('bathrooms').value);
        const yearBuilt = parseFloat(document.getElementById('yearBuilt').value);
        const lotSize = parseFloat(document.getElementById('lotSize').value);
        const garageSize = parseFloat(document.getElementById('garageSize').value);
        const neighborhoodQuality = parseFloat(document.getElementById('neighborhoodQuality').value);

        const features = {
            squareFootage,
            bedrooms,
            bathrooms,
            yearBuilt,
            lotSize,
            garageSize,
            neighborhoodQuality
        };

        const prediction = housePriceModel.predict(features);
        const report = housePriceModel.generateReport(prediction);

        // Criar blob e download
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_preco_casa_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        showError('Erro ao exportar relatório: ' + error.message);
    }
}
