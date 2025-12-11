/**
 * Modelo de Regressão Linear para Predição de Preços de Casas
 * Baseado no modelo treinado com scikit-learn
 */

class HousePriceModel {
    constructor() {
        // Coeficientes do modelo treinado (LinearRegression)
        // Ordem: [Square_Footage, Num_Bedrooms, Num_Bathrooms, Year_Built, Lot_Size, Garage_Size, Neighborhood_Quality]
        this.coefficients = [
            2.50671725e+05,  // Square_Footage
            1.45124232e+04,  // Num_Bedrooms
            6.75987020e+03,  // Num_Bathrooms
            2.04466480e+04,  // Year_Built
            1.93541522e+04,  // Lot_Size
            4.20157777e+03,  // Garage_Size
            2.32630793e+02   // Neighborhood_Quality
        ];

        // Intercepto do modelo
        this.intercept = 618861.0186467685;

        // Nomes das features para referência
        this.featureNames = [
            'Square_Footage',
            'Num_Bedrooms',
            'Num_Bathrooms',
            'Year_Built',
            'Lot_Size',
            'Garage_Size',
            'Neighborhood_Quality'
        ];

        // Rótulos amigáveis para exibição
        this.featureLabels = [
            'Metragem Quadrada',
            'Número de Quartos',
            'Número de Banheiros',
            'Ano de Construção',
            'Tamanho do Lote',
            'Tamanho da Garagem',
            'Qualidade do Bairro'
        ];

        // Unidades de medida
        this.featureUnits = [
            'm²',
            'quartos',
            'banheiros',
            'ano',
            'acres',
            'vagas',
            '/10'
        ];
    }

    /**
     * Realiza a predição do preço da casa
     * @param {Object} features - Objeto com as características da casa
     * @returns {Object} Objeto com a predição e detalhes
     */
    predict(features) {
        // Extrair valores na ordem correta
        const values = [
            features.squareFootage,
            features.bedrooms,
            features.bathrooms,
            features.yearBuilt,
            features.lotSize,
            features.garageSize,
            features.neighborhoodQuality
        ];

        // Validar entrada
        if (!this.validateInput(values)) {
            throw new Error('Entrada inválida. Todos os campos devem ser números positivos.');
        }

        // Calcular predição: y = intercept + sum(coef * x)
        let prediction = this.intercept;
        for (let i = 0; i < values.length; i++) {
            prediction += this.coefficients[i] * values[i];
        }

        // Garantir que o preço seja positivo
        prediction = Math.max(0, prediction);

        return {
            price: prediction,
            features: values,
            featureNames: this.featureNames,
            featureLabels: this.featureLabels,
            featureUnits: this.featureUnits
        };
    }

    /**
     * Valida se os valores de entrada são válidos
     * @param {Array} values - Array com os valores
     * @returns {boolean} True se válido, false caso contrário
     */
    validateInput(values) {
        return values.every(val => {
            return typeof val === 'number' && !isNaN(val) && val >= 0;
        });
    }

    /**
     * Formata o preço para moeda
     * @param {number} price - Preço em valor numérico
     * @returns {string} Preço formatado como moeda
     */
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Obtém informações sobre a importância relativa de cada feature
     * @returns {Array} Array com informações sobre a importância das features
     */
    getFeatureImportance() {
        return this.coefficients.map((coef, index) => ({
            name: this.featureLabels[index],
            coefficient: coef,
            importance: Math.abs(coef)
        })).sort((a, b) => b.importance - a.importance);
    }

    /**
     * Gera um relatório textual da predição
     * @param {Object} prediction - Objeto de predição retornado por predict()
     * @returns {string} Relatório formatado
     */
    generateReport(prediction) {
        let report = 'RELATÓRIO DE PREDIÇÃO DE PREÇO\n';
        report += '=' .repeat(40) + '\n\n';
        report += `Preço Recomendado: ${this.formatPrice(prediction.price)}\n\n`;
        report += 'Características Analisadas:\n';
        report += '-'.repeat(40) + '\n';

        for (let i = 0; i < prediction.featureLabels.length; i++) {
            const label = prediction.featureLabels[i];
            const value = prediction.features[i];
            const unit = prediction.featureUnits[i];
            const coef = this.coefficients[i];
            const contribution = coef * value;

            report += `${label}: ${value} ${unit}\n`;
            report += `  └─ Contribuição: ${this.formatPrice(contribution)}\n`;
        }

        report += '\n' + '-'.repeat(40) + '\n';
        report += `Intercepto (base): ${this.formatPrice(this.intercept)}\n`;

        return report;
    }
}

// Criar instância global do modelo
const housePriceModel = new HousePriceModel();
